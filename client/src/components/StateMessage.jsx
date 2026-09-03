// Shared "loading / error / empty" placeholder used by list & detail pages
// so we're not repeating the same three divs on every page.
export default function StateMessage({ children }) {
  return (
    <p className="mx-auto max-w-7xl px-space-md py-space-3xl text-center text-body-md text-on-surface-variant sm:px-space-xl">
      {children}
    </p>
  );
}
