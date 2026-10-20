import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Heart, Menu, ShoppingBag, X, UserRound, LogOut } from "lucide-react";

import { useCatalog } from "../../context/CatalogContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { getCurrentUser, logoutUser, type AuthUser } from "../../api/auth";
import { ThemeToggle } from "../ui/ThemeToggle";
import { container } from "../ui/Section";

export function AnnouncementBar() {
  return (
    <div className="bg-ink px-4 py-3 text-center text-sm tracking-wide text-ivory/85">
      Complimentary shipping on orders over $500
    </div>
  );
}

const badge =
  "absolute right-0.5 top-1 grid h-5 min-w-5 place-items-center bg-gold px-1 text-xs font-semibold text-ink";

export function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const { count } = useCart();
  const { ids } = useWishlist();
  const { categories } = useCatalog();

  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: "/shop", label: "Shop all" },
    ...categories.map((category) => ({
      to: `/category/${category.slug}`,
      label: category.label,
    })),
    { to: "/about", label: "Our story" },
  ];

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    let active = true;

    async function loadUser() {
      setAuthLoading(true);

      try {
        const response = await getCurrentUser();

        if (active) {
          setUser(response.user);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setAuthLoading(false);
        }
      }
    }

    void loadUser();

    return () => {
      active = false;
    };
  }, [location.pathname]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleLogout = async () => {
    setLogoutLoading(true);

    try {
      await logoutUser();
      setUser(null);
      navigate("/");
    } catch {
      setUser(null);
      navigate("/");
    } finally {
      setLogoutLoading(false);
    }
  };

  const navLink = ({ isActive }: { isActive: boolean }) =>
    `border-b py-2 text-base transition-colors duration-300 hover:text-gold-text ${
      isActive ? "border-gold text-gold-text" : "border-transparent"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div
        className={`${container} flex h-20 items-center justify-between gap-4`}
      >
        <div className="flex flex-1 xl:hidden">
          <button
            type="button"
            className="-ml-3 grid h-14 w-14 place-items-center"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X size={26} strokeWidth={1.5} />
            ) : (
              <Menu size={26} strokeWidth={1.5} />
            )}
          </button>
        </div>

        <Link
          to="/"
          className="font-display text-3xl tracking-[0.26em]"
          aria-label="AURELLE home"
        >
          AURELLE
        </Link>

        <nav
          aria-label="Primary"
          className="hidden flex-1 items-center justify-center gap-7 xl:flex"
        >
          <NavLink to="/shop" end className={navLink}>
            Shop
          </NavLink>

          {categories.map((category) => (
            <NavLink
              key={category.slug}
              to={`/category/${category.slug}`}
              className={navLink}
            >
              {category.label}
            </NavLink>
          ))}

          <NavLink to="/about" className={navLink}>
            Our story
          </NavLink>

          {!authLoading && isAdmin && (
            <NavLink to="/admin/products" className={navLink}>
              Admin Dashboard
            </NavLink>
          )}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-1 sm:gap-3 xl:flex-none">
          <ThemeToggle className="hidden sm:inline-flex" />

          {!authLoading &&
            (user ? (
              <div className="hidden items-center gap-3 lg:flex">
                <span className="max-w-28 truncate text-sm text-muted">
                  {user.name}
                </span>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="text-sm transition-colors hover:text-gold-text disabled:opacity-50"
                >
                  {logoutLoading ? "Signing out..." : "Logout"}
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-3 lg:flex">
                <Link
                  to="/login"
                  className="text-sm transition-colors hover:text-gold-text"
                >
                  Sign in
                </Link>

                <Link
                  to="/register"
                  className="border border-line px-3 py-2 text-sm transition-colors hover:border-gold"
                >
                  Create account
                </Link>
              </div>
            ))}

          <Link
            to="/wishlist"
            aria-label={`Wishlist, ${ids.length} items`}
            className="relative grid h-12 w-12 place-items-center"
          >
            <Heart size={24} strokeWidth={1.5} />
            {ids.length > 0 && <span className={badge}>{ids.length}</span>}
          </Link>

          <Link
            to="/cart"
            aria-label={`Cart, ${count} items`}
            className="relative -mr-3 grid h-12 w-12 place-items-center sm:mr-0"
          >
            <ShoppingBag size={24} strokeWidth={1.5} />
            {count > 0 && <span className={badge}>{count}</span>}
          </Link>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`grid transition-[grid-template-rows] duration-500 ease-out xl:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div
          className="max-h-[calc(100dvh-8rem)] overflow-y-auto"
          {...(open ? {} : { inert: "" })}
        >
          <nav
            aria-label="Mobile"
            className={`${container} flex flex-col border-t border-line pb-8 pt-2`}
          >
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="border-b border-line py-4 font-display text-3xl"
              >
                {link.label}
              </Link>
            ))}

            {!authLoading && isAdmin && (
              <Link
                to="/admin/products"
                className="border-b border-line py-4 font-display text-3xl text-gold-text"
              >
                Admin Dashboard
              </Link>
            )}

            <div className="mt-6 flex items-center justify-between">
              <span className="text-base text-muted">Theme</span>
              <ThemeToggle />
            </div>

            <div className="mt-6 border-t border-line pt-5">
              {authLoading ? (
                <p className="text-sm text-muted">Checking account...</p>
              ) : user ? (
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-sm">
                    <UserRound size={18} />
                    {user.name}
                  </p>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    className="flex items-center gap-2 text-sm hover:text-gold-text disabled:opacity-50"
                  >
                    <LogOut size={18} />
                    {logoutLoading ? "Signing out..." : "Logout"}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-start gap-4">
                  <Link to="/login" className="text-sm hover:text-gold-text">
                    Sign in
                  </Link>

                  <Link to="/register" className="text-sm hover:text-gold-text">
                    Create account
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
