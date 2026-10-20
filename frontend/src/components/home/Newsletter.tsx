import { useState, type FormEvent } from "react";
import { Button } from "../ui/Button";
import { Section } from "../ui/Section";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  // Front-end only: wire this to the backend/email provider later.
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email address.");
    setError("");
    setDone(true);
  };

  return (
    <Section>
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-4xl sm:text-5xl">Hear from the atelier</h2>
        <p className="mt-5 text-lg text-muted">New arrivals and care notes, a few times a year.</p>
        {done ? (
          <p role="status" className="mt-8 border-y border-line py-5">Thank you. We’ll be in touch soon.</p>
        ) : (
          <form onSubmit={submit} noValidate className="mt-10 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="nl-email" className="sr-only">Email address</label>
            <input
              id="nl-email" type="email" autoComplete="email" value={email} placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!error} aria-describedby={error ? "nl-error" : undefined}
              className="min-h-14 flex-1 text-base border border-line bg-transparent px-4 text-fg placeholder:text-muted focus:border-gold"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        )}
        {error && <p id="nl-error" role="alert" className="mt-3 text-sm text-gold-text">{error}</p>}
      </div>
    </Section>
  );
}
