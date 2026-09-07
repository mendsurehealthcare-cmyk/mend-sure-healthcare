import { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { COMPANY } from '../lib/company';

/*
  Catches render-time errors anywhere below it.

  Without one of these, a single thrown error in any component unmounts the
  entire React tree and leaves the patient staring at a blank white page, with
  no navigation and no indication anything went wrong. On a site where people
  arrive worried and looking for a phone number, a dead end is the worst
  possible failure — so this keeps a way to reach the care team on screen no
  matter what broke.

  It has to be a class: there is still no hook equivalent of
  componentDidCatch.
*/
// withTranslation rather than useTranslation: error boundaries have to be
// class components (there is still no hook for componentDidCatch), so the t
// function arrives as a prop instead.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Goes to the browser console and to Vercel's client logs, so the stack is
    // recoverable even though the patient never sees it.
    console.error('Unhandled render error:', error, info?.componentStack);
  }

  render() {
    const { t } = this.props;
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center px-space-md py-space-3xl">
        <div className="w-full max-w-lg rounded-xl bg-surface-container-lowest p-space-xl text-center shadow-sm">
          <h1 className="mb-space-sm text-headline-md font-bold text-primary">
            {t('errors.pageTitle')}
          </h1>
          <p className="mb-space-lg text-body-md text-on-surface-variant">
            {t('errors.pageBody')}
          </p>

          <div className="flex flex-col items-center gap-space-sm sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full rounded-lg bg-secondary px-space-lg py-space-sm text-label-md text-on-secondary shadow-sm transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed sm:w-auto"
            >
              {t('errors.reload')}
            </button>
            {/* A plain <a>, not a router Link: the router is part of what may
                have just failed, so this forces a fresh document load. */}
            <a
              href="/"
              className="w-full rounded-lg bg-surface-container px-space-lg py-space-sm text-label-md text-on-surface transition-colors hover:bg-surface-container-high sm:w-auto"
            >
              {t('errors.goHome')}
            </a>
          </div>

          <p className="mt-space-lg text-body-sm text-on-surface-variant">
            {t('errors.callUs')}{' '}
            <a href={COMPANY.phones[0].href} className="font-semibold text-primary hover:underline">
              {COMPANY.phones[0].label}
            </a>{' '}
            &middot;{' '}
            <a href={`mailto:${COMPANY.email}`} className="font-semibold text-primary hover:underline">
              {COMPANY.email}
            </a>
          </p>
        </div>
      </div>
    );
  }
}

// Named rather than exported inline so React DevTools and Fast Refresh have
// something to call it.
const TranslatedErrorBoundary = withTranslation()(ErrorBoundary);

export default TranslatedErrorBoundary;
