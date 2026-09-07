import { useEffect } from 'react';

const DEFAULT_TITLE = 'Mend Sure — Affordable World-Class Treatment in India';

/*
  Sets the page title and meta description for a single route.

  This is a single-page app, so index.html carries one title for the whole
  site: every route otherwise shares the homepage's title and description in
  the browser tab, in bookmarks, and in a shared link's preview. This swaps
  them per page and restores the defaults on unmount.

  Note for search: Google renders JavaScript and will pick these up, but not
  every crawler or link-preview bot does. If organic search on inner pages
  matters commercially, pre-rendering or a server-rendered framework is the
  real fix — this gets the title right for everyone who actually visits.
*/
export function useDocumentMeta({ title, description }) {
  useEffect(() => {
    const previousTitle = document.title;
    if (title) document.title = title;

    let tag = document.querySelector('meta[name="description"]');
    const previousDescription = tag?.getAttribute('content') ?? null;

    if (description) {
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', description);
    }

    return () => {
      document.title = previousTitle || DEFAULT_TITLE;
      if (description && tag && previousDescription !== null) {
        tag.setAttribute('content', previousDescription);
      }
    };
  }, [title, description]);
}
