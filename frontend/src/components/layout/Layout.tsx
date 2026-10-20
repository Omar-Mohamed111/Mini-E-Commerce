import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnnouncementBar, Header } from "./Header";
import { Footer } from "./Footer";

export function Layout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    // Lazy pages may not be mounted yet, so retry briefly until the anchor exists.
    let tries = 0;
    const timer = setInterval(() => {
      const el = document.querySelector(hash);
      if (el || ++tries > 25) {
        clearInterval(timer);
        el?.scrollIntoView();
      }
    }, 80);
    return () => clearInterval(timer);
  }, [pathname, hash]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-gold focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <div key={`bar-${pathname}`} className="route-bar" aria-hidden />
      <AnnouncementBar />
      <Header />
      {/* Re-keyed per route so every navigation plays the enter transition. */}
      <main id="main" key={pathname} className="page-enter">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
