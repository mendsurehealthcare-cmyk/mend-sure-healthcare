import Button from '../components/Button';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';

const values = [
  {
    icon: 'receipt_long',
    title: 'Transparency',
    text: 'Every quote is itemized and all-in. No hidden hospital fees, no broker markups, no surprises at discharge.',
  },
  {
    icon: 'handshake',
    title: 'Honest Guidance',
    text: "Straight answers about your options — even when that means recommending a different treatment path, or none at all.",
  },
  {
    icon: 'supervised_user_circle',
    title: 'Continuity of Care',
    text: 'A dedicated coordinator with every patient, start to finish — from the first message to your recovery back home.',
  },
];

export default function About() {
  return (
    <div className="flex w-full flex-col">
      <PageHero
        gradient
        eyebrow="Who We Are"
        eyebrowIcon="diversity_1"
        title="About Mend Sure"
        subtitle="Quality healthcare shouldn't be out of reach just because of where you live."
      />

      <section className="mx-auto w-full max-w-4xl px-space-md py-space-3xl sm:px-space-xl">
        <div className="space-y-space-lg rounded-xl bg-surface-container-lowest p-space-lg shadow-sm sm:p-space-xl">
          <p className="text-body-lg leading-relaxed text-on-surface-variant">
            Mend Sure was started with a simple belief: quality healthcare shouldn't be out of reach
            just because of where you live. Every year, thousands of people in the US, UK, and
            elsewhere delay or skip surgeries they need because of the cost. We connect them with
            accredited hospitals and experienced doctors in India, where the same procedures cost a
            fraction of the price — without compromising on quality of care.
          </p>
          <p className="text-body-lg leading-relaxed text-on-surface-variant">
            From your first inquiry to your recovery back home, our team handles the coordination —
            treatment plans, transparent pricing, travel arrangements, and follow-up care — so you
            can focus on getting better.
          </p>
        </div>
      </section>

      <section className="bg-surface-container-low px-space-md py-space-3xl sm:px-space-xl">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="What We Stand For"
            title="Our Core Values"
            subtitle="The three commitments every patient can hold us to."
          />

          <div className="grid grid-cols-1 gap-space-lg md:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-space-md flex h-12 w-12 items-center justify-center rounded-lg bg-secondary-container text-on-secondary-container">
                  <Icon name={value.icon} className="!text-[24px]" />
                </div>
                <h3 className="mb-space-xs text-headline-sm font-bold text-primary">{value.title}</h3>
                <p className="text-body-sm text-on-surface-variant">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-space-md py-space-3xl sm:px-space-xl">
        <div className="rounded-2xl bg-primary p-space-lg text-center text-on-primary sm:p-space-3xl">
          <h2 className="mb-space-md text-headline-lg">Talk to our care team</h2>
          <p className="mx-auto mb-space-xl max-w-2xl text-body-lg text-primary-fixed-dim">
            Free guidance on your treatment options, with no obligation to book.
          </p>
          <div className="flex flex-wrap justify-center gap-space-md">
            <Button to="/contact" className="px-space-xl py-space-md">
              Get in Touch
            </Button>
            <Button to="/how-it-works" variant="onDark" className="px-space-xl py-space-md">
              See How It Works
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
