import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { ApiError } from "../api/client";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const initialEmail =
    (location.state as { email?: string } | null)?.email ?? "";

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    setLoading(true);

    try {
      await loginUser({
        email: email.trim(),
        password,
      });

      navigate(from, { replace: true });
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
          Welcome back
        </p>

        <h1 className="max-w-md text-5xl font-light leading-tight tracking-tight text-stone-900 lg:text-6xl">
          Elegance,
          <br />
          every day.
        </h1>

        <p className="mt-6 max-w-sm text-sm leading-7 text-stone-600">
          Sign in to continue exploring the AURELLE collection.
        </p>

        <div className="mt-10 h-px w-24 bg-stone-900" />
      </section>

      <section className="mx-auto w-full max-w-md">
        <div className="mb-8">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-stone-500">
            AURELLE
          </p>

          <h2 className="text-3xl font-light tracking-tight text-stone-900">
            Sign in
          </h2>

          <p className="mt-3 text-sm leading-6 text-stone-600">
            Enter your account details below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              autoComplete="current-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
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
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-stone-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-stone-900 underline underline-offset-4 hover:text-stone-600"
          >
            Create account
          </Link>
        </p>

        <p className="mt-5 text-center text-xs leading-5 text-stone-500">
          Your account information is handled securely.
        </p>
      </section>
    </main>
  );
}
