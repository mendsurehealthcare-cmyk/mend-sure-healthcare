import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// The site's one official origin. The bare domain redirects here, so search
// results should always point at this form.
const SITE = 'https://www.mendsurehealthcare.com';

/*
  Keeps <link rel="canonical"> (and og:url) pointing at the current page's
  official address. index.html only carries the homepage's, and this is a
  single-page app, so without this every route would claim to be the homepage.
  Query strings are left off: /doctors?department=Cardiology is the same page
  as /doctors as far as search is concerned.
*/
export default function CanonicalLink() {
  const { pathname } = useLocation();

  useEffect(() => {
    const url = `${SITE}${pathname === '/' ? '/' : pathname.replace(/\/+$/, '')}`;
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', url);
  }, [pathname]);

  return null;
}
