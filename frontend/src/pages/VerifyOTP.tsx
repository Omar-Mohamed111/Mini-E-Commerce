import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { verifyOTP } from "../api/auth";
import { ApiError } from "../api/client";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialEmail =
    (location.state as { email?: string } | null)?.email ?? "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      const result = await verifyOTP({
        email: email.trim(),
        otp,
      });

      setSuccess(result.message || "Email verified successfully.");

      window.setTimeout(() => {
        navigate("/login", {
          state: { email: email.trim() },
        });
      }, 1000);
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
    <main className="mx-auto flex min-h-[75vh] max-w-xl items-center px-5 py-12">
      <section className="w-full">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-stone-500">
          AURELLE · Email verification
        </p>

        <h1 className="text-3xl font-light tracking-tight text-stone-900">
          Verify your email
        </h1>

        <p className="mt-4 text-sm leading-7 text-stone-600">
          Enter the six-digit code sent to your email address. The code expires
          after five minutes.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm text-stone-700"
            >
              Email address
            </label>

            <input
              id="email"
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
            <label htmlFor="otp" className="mb-2 block text-sm text-stone-700">
              Verification code
            </label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              minLength={6}
              required
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="000000"
              className={`${inputClass} text-center text-xl tracking-[0.5em]`}
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

          {success && (
            <div
              role="status"
              className="border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 px-5 py-3.5 text-sm tracking-wide text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify email"}
          </button>
        </form>

        <p className="mt-7 text-sm text-stone-600">
          Already verified?{" "}
          <Link
            to="/login"
            className="text-stone-900 underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
