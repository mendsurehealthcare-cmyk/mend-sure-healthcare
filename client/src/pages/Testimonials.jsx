import { useApi } from '../lib/useApi';
import Button from '../components/Button';
import PageHero from '../components/PageHero';
import TestimonialCard from '../components/TestimonialCard';
import StateMessage from '../components/StateMessage';

export default function Testimonials() {
  const { data: testimonials, loading, error } = useApi('/testimonials');

  return (
    <div className="flex w-full flex-col">
      <PageHero
        gradient
        eyebrow="Real Patient Success Stories"
        eyebrowIcon="favorite"
        title="Patient Stories"
        subtitle="Real experiences from patients we've helped travel, get treated, and recover."
        aside={
          <div className="flex items-center gap-space-md rounded-xl bg-surface-container/10 p-space-md backdrop-blur-md">
            <div className="flex flex-col">
              <span className="text-headline-md text-secondary-fixed">
                {testimonials?.length ?? '—'}
              </span>
              <span className="text-body-sm text-inverse-on-surface opacity-80">Stories Shared</span>
            </div>
            <div className="h-10 w-px bg-outline-variant/30" />
            <div className="flex flex-col">
              <span className="text-headline-md text-secondary-fixed">Up to 80%</span>
              <span className="text-body-sm text-inverse-on-surface opacity-80">Average Savings</span>
            </div>
          </div>
        }
      />

      <div className="mx-auto w-full max-w-7xl px-space-md py-space-3xl sm:px-space-xl">
        {loading && <StateMessage>Loading patient stories...</StateMessage>}
        {error && (
          <StateMessage>
            Couldn't load patient stories right now. Please try again shortly.
          </StateMessage>
        )}

        {testimonials?.length === 0 && <StateMessage>No patient stories yet.</StateMessage>}

        {testimonials?.length > 0 && (
          <div className="grid grid-cols-1 gap-space-xl md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        )}
      </div>

      <section className="mx-auto w-full max-w-7xl px-space-md pb-space-3xl sm:px-space-xl">
        <div className="rounded-2xl bg-primary p-space-lg text-center text-on-primary sm:p-space-3xl">
          <h2 className="mb-space-md text-headline-lg">Ready to write your own story?</h2>
          <p className="mx-auto mb-space-xl max-w-2xl text-body-lg text-primary-fixed-dim">
            Get a free, no-obligation treatment plan and quote from our care team.
          </p>
          <Button to="/contact" className="px-space-xl py-space-md">
            Get My Free Quote
          </Button>
        </div>
      </section>
    </div>
  );
}
