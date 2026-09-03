import ConsultationForm from '../components/ConsultationForm';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';

const reassurances = [
  {
    icon: 'schedule',
    title: 'Reply within 24 hours',
    text: 'A care coordinator reviews your case and comes back with next steps.',
  },
  {
    icon: 'receipt_long',
    title: 'All-in, itemized pricing',
    text: 'Treatment, hospital stay, and coordination — quoted upfront with no hidden fees.',
  },
  {
    icon: 'lock',
    title: 'Confidential by default',
    text: 'Your medical details are shared only with the specialists reviewing your case.',
  },
  {
    icon: 'handshake',
    title: 'No obligation',
    text: "The opinion and quote are free. There's nothing to commit to until you're ready.",
  },
];

export default function Contact() {
  return (
    <div className="flex w-full flex-col">
      <PageHero
        gradient
        eyebrow="Free Expert Opinion"
        eyebrowIcon="support_agent"
        title="Get Your Free Quote"
        subtitle="Tell us a bit about what you're looking for and our care team will get back to you within 24 hours with a treatment plan and transparent pricing."
      />

      <section className="mx-auto w-full max-w-7xl px-space-md py-space-3xl sm:px-space-xl">
        <div className="grid grid-cols-1 gap-space-2xl lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="mb-space-lg text-headline-md font-bold text-primary">
              What happens after you submit
            </h2>
            <div className="space-y-space-md">
              {reassurances.map((item) => (
                <div key={item.title} className="flex items-start gap-space-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                    <Icon name={item.icon} className="!text-[20px]" />
                  </div>
                  <div>
                    <h3 className="text-label-md font-semibold text-on-surface">{item.title}</h3>
                    <p className="text-body-sm text-on-surface-variant">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-space-xl rounded-xl bg-surface-container-low p-space-lg">
              <h3 className="mb-space-xs text-label-md font-semibold text-on-surface">
                Prefer to talk first?
              </h3>
              <p className="mb-space-md text-body-sm text-on-surface-variant">
                Reach our care team directly — we're available around the clock.
              </p>
              <ul className="space-y-space-xs text-body-sm text-on-surface-variant">
                <li className="flex items-center gap-space-xs">
                  <Icon name="mail" className="!text-[18px] text-secondary" />
                  hello@mendsure.com
                </li>
                <li className="flex items-center gap-space-xs">
                  <Icon name="call" className="!text-[18px] text-secondary" />
                  +91 00000 00000
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ConsultationForm sourcePage="contact-page" />
          </div>
        </div>
      </section>
    </div>
  );
}
