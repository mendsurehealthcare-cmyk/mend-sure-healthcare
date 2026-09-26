import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/*
  Starts every new page at the top.

  A client-side route change swaps the page content but leaves the window's
  scroll position where it was, so following a link from the footer opened
  the next page scrolled down near its bottom.

  Deliberately left alone:
    - Links to a #section (e.g. /cost#cost-oncology) — that page scrolls to
      the section itself.
    - Back/Forward (a POP navigation) — the browser returns you to where you
      were on that page, which is what people expect from Back.
    - Query-string-only changes (filters, search boxes that live in the URL)
      — keyed on pathname, so typing in a filter doesn't jump the page.
*/
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    if (hash || navigationType === 'POP') return;
    window.scrollTo(0, 0);
    // Only a new page should trigger this; `hash` and `navigationType` are
    // read as of that navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
