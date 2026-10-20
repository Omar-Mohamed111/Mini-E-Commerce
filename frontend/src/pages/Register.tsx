import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import { ApiError } from "../api/client";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      navigate("/verify-otp", {
        state: { email: email.trim() },
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.serverMessage ?? err.userMessage);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 disabled:opacity-60";

  return (
    <main className="mx-auto grid min-h-[75vh] w-full max-w-6xl items-center px-5 py-12 md:grid-cols-2 md:gap-16 md:px-8">
      <section className="mb-10 hidden md:block">
        <p className="mb-5 text-xs uppercase tracking-[0.35em] text-stone-500">
          Welcome to AURELLE
        </p>

        <h1 className="max-w-md text-5xl font-light leading-tight tracking-tight text-stone-900 lg:text-6xl">
          Discover your
          <br />
          own elegance.
        </h1>

        <p className="mt-6 max-w-sm text-sm leading-7 text-stone-600">
          Create your account to explore our collection and enjoy a more
          personal shopping experience.
        </p>

        <div className="mt-10 h-px w-24 bg-stone-900" />
      </section>

      <section className="mx-auto w-full max-w-md">
        <div className="mb-8">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-stone-500">
            Join AURELLE
          </p>

          <h2 className="text-3xl font-light tracking-tight text-stone-900">
            Create account
          </h2>

          <p className="mt-3 text-sm leading-6 text-stone-600">
            Enter your details to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm text-stone-700">
              Full name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              minLength={3}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your full name"
              className={inputClass}
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm text-stone-700"
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className={inputClass}
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm text-stone-700"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              className={inputClass}
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm text-stone-700"
            >
              Confirm password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Re-enter your password"
              className={inputClass}
              disabled={loading}
            />
          </div>

          {error && (
            <div
              role="alert"
              className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 px-5 py-3.5 text-sm tracking-wide text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-stone-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-stone-900 underline underline-offset-4 hover:text-stone-600"
          >
            Sign in
          </Link>
        </p>

        <p className="mt-5 text-center text-xs leading-5 text-stone-500">
          By creating an account, you agree to our store policies.
        </p>
      </section>
    </main>
  );
}
