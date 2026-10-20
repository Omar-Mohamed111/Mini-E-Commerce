import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { ApiError } from "../api/client";
import { getCurrentUser } from "../api/auth";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  type ProductInput,
} from "../api/products";
import { useProductList } from "../hooks/useProducts";
import { Button } from "../components/ui/Button";
import type { Product } from "../types";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
}

const emptyForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
};

export default function AdminProducts() {
  const navigate = useNavigate();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null,
  );

  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [image, setImage] = useState<File | null>(null);
  const [search, setSearch] = useState("");

  const { data, error, loading, reload } = useProductList({
    page: 1,
    limit: 100,
    sort: "price",
    search: search.trim(),
  });

  useEffect(() => {
    let active = true;

    async function checkAdminAccess() {
      try {
        const response = await getCurrentUser();

        if (!active) return;

        if (response.user.role !== "admin") {
          navigate("/", { replace: true });
          return;
        }

        setCheckingAuth(false);
      } catch {
        if (active) {
          navigate("/login", { replace: true });
        }
      }
    }

    void checkAdminAccess();

    return () => {
      active = false;
    };
  }, [navigate]);

  function resetForm() {
    setForm(emptyForm);
    setImage(null);
    setEditingProductId(null);
    setFormError("");
  }

  function handleAddProduct() {
    resetForm();
    setSuccessMessage("");
    setShowForm(true);
  }

  function handleEditProduct(product: Product) {
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      category: product.category,
    });

    setImage(null);
    setEditingProductId(product.id);
    setFormError("");
    setSuccessMessage("");
    setShowForm(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmitProduct(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formElement = e.currentTarget;

    setSaving(true);
    setFormError("");
    setSuccessMessage("");

    const input: ProductInput = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category.trim(),
      image,
    };

    try {
      if (editingProductId) {
        await updateProduct(editingProductId, input);
        setSuccessMessage("Product updated successfully.");
      } else {
        await createProduct(input);
        setSuccessMessage("Product created successfully.");
      }

      resetForm();
      formElement.reset();
      setShowForm(false);

      await reload();
    } catch (error) {
      setFormError(
        error instanceof ApiError
          ? error.userMessage
          : editingProductId
            ? "Could not update the product. Please try again."
            : "Could not create the product. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`,
    );

    if (!confirmed) return;

    setDeletingProductId(product.id);
    setFormError("");
    setSuccessMessage("");

    try {
      await deleteProduct(product.id);

      if (editingProductId === product.id) {
        resetForm();
        setShowForm(false);
      }

      setSuccessMessage("Product deleted successfully.");

      await reload();
    } catch (error) {
      setFormError(
        error instanceof ApiError
          ? error.userMessage
          : "Could not delete the product. Please try again.",
      );
    } finally {
      setDeletingProductId(null);
    }
  }

  if (checkingAuth) {
    return <div className="min-h-[60vh]" aria-busy="true" />;
  }

  return (
    <main className="mx-auto min-h-[60vh] max-w-7xl px-6 py-16 sm:py-24">
      <p className="text-sm uppercase tracking-[0.3em] text-muted">
        AURELLE / ADMIN
      </p>

      <div className="mt-4 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-4xl font-light sm:text-5xl">
            Product Management
          </h1>

          <p className="mt-3 text-base text-muted">
            Manage your store products from one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="gold" onClick={handleAddProduct}>
            Add product
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => void reload()}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh products"}
          </Button>
        </div>
      </div>

      {successMessage && (
        <p role="status" className="mt-6 text-sm text-green-700">
          {successMessage}
        </p>
      )}

      {formError && !showForm && (
        <p role="alert" className="mt-6 text-sm text-red-600">
          {formError}
        </p>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmitProduct}
          className="mt-8 grid gap-5 border border-line p-6 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <h2 className="text-2xl font-light">
              {editingProductId ? "Edit product" : "Add a new product"}
            </h2>

            <p className="mt-2 text-sm text-muted">
              {editingProductId
                ? "Update the product details below."
                : "Enter the details of the new product."}
            </p>
          </div>

          <div>
            <label htmlFor="product-name" className="mb-2 block text-sm">
              Product name
            </label>

            <input
              id="product-name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="min-h-12 w-full border border-line bg-transparent px-4"
            />
          </div>

          <div>
            <label htmlFor="product-category" className="mb-2 block text-sm">
              Category
            </label>

            <input
              id="product-category"
              type="text"
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Accessories"
              className="min-h-12 w-full border border-line bg-transparent px-4"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="product-description" className="mb-2 block text-sm">
              Description
            </label>

            <textarea
              id="product-description"
              required
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border border-line bg-transparent p-4"
            />
          </div>

          <div>
            <label htmlFor="product-price" className="mb-2 block text-sm">
              Price
            </label>

            <input
              id="product-price"
              type="number"
              required
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="min-h-12 w-full border border-line bg-transparent px-4"
            />
          </div>

          <div>
            <label htmlFor="product-stock" className="mb-2 block text-sm">
              Stock
            </label>

            <input
              id="product-stock"
              type="number"
              required
              min="0"
              step="1"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="min-h-12 w-full border border-line bg-transparent px-4"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="product-image" className="mb-2 block text-sm">
              Product image
            </label>

            <input
              id="product-image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-muted"
            />

            <p className="mt-2 text-xs text-muted">
              {editingProductId
                ? "Choose a new image only if you want to replace the current one."
                : "Adding an image is optional."}
            </p>
          </div>

          {formError && (
            <p role="alert" className="text-sm text-red-600 sm:col-span-2">
              {formError}
            </p>
          )}

          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <Button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editingProductId
                  ? "Save changes"
                  : "Create product"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="mt-8 max-w-xl">
        <label htmlFor="product-search" className="mb-2 block text-sm">
          Search products
        </label>

        <input
          id="product-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product name or category..."
          className="min-h-12 w-full border border-line bg-transparent px-4"
        />

        {search.trim() && (
          <p className="mt-2 text-sm text-muted">
            Searching for: {search.trim()}
          </p>
        )}
      </div>

      <section className="mt-12">
        {error ? (
          <div className="border border-line p-6">
            <p className="text-base">{error.userMessage}</p>

            <button
              type="button"
              onClick={() => void reload()}
              className="mt-4 border-b border-gold pb-1 text-sm"
            >
              Try again
            </button>
          </div>
        ) : loading && !data ? (
          <p className="py-12 text-center text-muted">Loading products...</p>
        ) : !data || data.products.length === 0 ? (
          <div className="border border-line px-6 py-16 text-center">
            <h2 className="text-2xl font-light">No products found</h2>

            <p className="mt-3 text-sm text-muted">
              Products will appear here when they are available.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted">
                {data.pagination.totalProducts} products in your store
              </p>
            </div>

            <div className="overflow-x-auto border border-line">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-line bg-surface">
                  <tr>
                    <th className="px-5 py-4 font-medium">Product</th>
                    <th className="px-5 py-4 font-medium">Category</th>
                    <th className="px-5 py-4 font-medium">Price</th>
                    <th className="px-5 py-4 font-medium">Stock</th>
                    <th className="px-5 py-4 font-medium">Product ID</th>
                    <th className="px-5 py-4 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {data.products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-line last:border-b-0"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-16 w-12 shrink-0 object-cover"
                            />
                          ) : (
                            <div
                              className="flex h-16 w-12 shrink-0 items-center justify-center bg-surface text-xs text-muted"
                              aria-label="No product image"
                            >
                              —
                            </div>
                          )}

                          <div>
                            <p className="font-medium">{product.name}</p>

                            <p className="mt-1 line-clamp-2 max-w-xs text-xs text-muted">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">{product.category}</td>

                      <td className="whitespace-nowrap px-5 py-4">
                        ${product.price.toFixed(2)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={
                            product.stock === 0
                              ? "text-red-600"
                              : product.stock <= 5
                                ? "text-amber-600"
                                : "text-fg"
                          }
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-mono text-xs text-muted">
                        {product.id}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleEditProduct(product)}
                            disabled={saving || deletingProductId !== null}
                            className="border-b border-gold pb-1 text-sm transition-colors hover:text-gold disabled:opacity-50"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => void handleDeleteProduct(product)}
                            disabled={deletingProductId !== null || saving}
                            className="border-b border-red-600 pb-1 text-sm text-red-600 transition-opacity hover:opacity-70 disabled:opacity-50"
                          >
                            {deletingProductId === product.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
