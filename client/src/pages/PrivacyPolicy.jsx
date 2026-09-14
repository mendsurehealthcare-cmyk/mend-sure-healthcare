import { useDocumentMeta } from '../lib/useDocumentMeta';
import PageHero from '../components/PageHero';
import { COMPANY } from '../lib/company';

// Content to be supplied later — this is the page shell so the route, nav,
// and footer link all exist ahead of the final legal copy.
export default function PrivacyPolicy() {
  useDocumentMeta({
    title: 'Privacy Policy — Mend Sure',
    description: "How Mend Sure collects, uses, and protects your personal and medical information.",
  });

  return (
    <div className="flex w-full flex-col">
      <PageHero
        gradient
        eyebrow="Your Privacy"
        eyebrowIcon="lock"
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your personal and medical information."
      />

      <section className="mx-auto w-full max-w-4xl px-space-md py-space-3xl sm:px-space-xl">
        <div className="rounded-xl bg-surface-container-low p-space-lg text-center sm:p-space-xl">
          <p className="text-body-md leading-relaxed text-on-surface-variant">
            Our full privacy policy is being finalised and will be published here shortly. In the
            meantime, if you have any questions about how your information is handled, please
            reach out to our care team.
          </p>
          <p className="mt-space-md text-body-md font-semibold text-primary">
            {COMPANY.email} &middot; {COMPANY.phones[0].label}
          </p>
        </div>
      </section>
    </div>
  );
}
