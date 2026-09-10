import { useApi } from '../lib/useApi';
import { formatINR, formatUSD } from '../lib/format';
import { CARDIAC_ARTICLE_SECTIONS, CARDIAC_FAQS, CARDIAC_INTRO } from '../data/cardiacSurgeryArticle';
import DoctorCard from './DoctorCard';
import HospitalCard from './HospitalCard';
import ScrollRow from './ScrollRow';
import FaqAccordion from './FaqAccordion';

// The specialty value cardiac doctors carry in the doctors table — distinct
// from the 'Cardiac Surgery' treatments-specialty this whole guide is shown
// under, because doctors and treatments were seeded from different source
// spreadsheets with their own category names.
const CARDIAC_DOCTOR_SPECIALTY = 'Cardiac Care';

/*
  Real, sourced cardiac procedure prices, kept as plain data rather than rows
  in the `treatments` table. That table models one USD price range per
  procedure, with no column for a second currency or for another country's
  price — both of which this content needs — so modelling it there would mean
  a schema change for what is reference content, not a bookable catalog
  entry with its own detail page.

  Rendered as a plain list/table rather than the site's usual TreatmentCard
  grid: seventeen procedures as cards would be seventeen large tiles a
  patient has to scan one at a time to compare two numbers, where a table
  puts all of them in view at once.
*/
const INDIA_COSTS = [
  { procedure: 'Heart bypass surgery', inr: 280000, usd: 5000 },
  { procedure: 'Valve repair or replacement', inr: 425000, usd: 9500 },
  { procedure: 'TAVI', inr: 2000000, usd: 36500 },
  { procedure: 'TMVI', inr: 2000000, usd: 36500 },
  { procedure: 'Angioplasty', inr: 250000, usd: 5250 },
  { procedure: 'Pacemaker', inr: 350000, usd: 6750 },
  { procedure: 'ICD implantation', inr: 700000, usd: 12000 },
  { procedure: 'EPS/RFA', inr: 300000, usd: 5500 },
  { procedure: 'Glenn procedure', inr: 350000, usd: 5750 },
  { procedure: 'Fontan procedure', inr: 400000, usd: 7000 },
  { procedure: 'ASD', inr: 250000, usd: 5000 },
  { procedure: 'VSD', inr: 250000, usd: 5000 },
  { procedure: 'Cardiac tumour removal surgery', inr: 700000, usd: 11500 },
  { procedure: 'Pericardiectomy', inr: 475000, usd: 9000 },
  { procedure: 'Pulmonary thromboendarterectomy', inr: 500000, usd: 9500 },
  { procedure: 'Coronary endarterectomy', inr: 650000, usd: 7250 },
  { procedure: 'Bentall surgery', inr: 1800000, usd: 32500 },
  { procedure: 'Heart transplant surgery', inr: 2250000, usd: 40000 },
];

// Only these five procedures have a published Turkey/Thailand figure to
// compare against — the rest of INDIA_COSTS has no equivalent source, so
// this stays a separate, shorter list rather than padding it with guesses.
const COUNTRY_COMPARISON = [
  { procedure: 'Heart bypass surgery', india: 5000, turkey: 28000, thailand: 22000 },
  { procedure: 'Valve repair or replacement', india: 9500, turkey: 24500, thailand: 20000 },
  { procedure: 'TAVI', india: 36500, turkey: 20000, thailand: 25000 },
  { procedure: 'Pacemaker', india: 6750, turkey: 22500, thailand: 8000 },
  { procedure: 'Angioplasty', india: 5250, turkey: 5000, thailand: 4500 },
];

function TableCard({ title, subtitle, children }) {
  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
      <div className="bg-primary px-space-lg py-space-md">
        <h3 className="text-headline-sm font-bold text-on-primary">{title}</h3>
      </div>
      {subtitle && (
        <p className="border-b border-outline-variant/20 px-space-lg py-space-md text-body-md leading-relaxed text-on-surface-variant">
          {subtitle}
        </p>
      )}
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export default function CardiacSurgeryCostGuide() {
  const { data: doctors } = useApi(
    `/doctors?specialty=${encodeURIComponent(CARDIAC_DOCTOR_SPECIALTY)}&pageSize=300`
  );
  const { data: hospitals } = useApi('/hospitals');

  // Hospitals aren't tagged with a specialty of their own, so "hospitals that
  // treat cardiac patients" is derived from which hospitals the cardiac
  // doctors above actually practise at, rather than a second, separately
  // maintained list that could drift out of sync with the doctor directory.
  const cardiacHospitals = (() => {
    if (!doctors || !hospitals) return [];
    const slugs = new Set(doctors.map((doctor) => doctor.hospitals?.slug).filter(Boolean));
    return hospitals.filter((hospital) => slugs.has(hospital.slug));
  })();

  return (
    <div className="space-y-space-3xl">
      <div className="max-w-3xl">
        <h2 className="mb-space-md text-headline-lg font-bold text-primary">
          Cardiac Surgery &amp; Heart Care
        </h2>
        <p className="text-body-lg leading-relaxed text-on-surface-variant">{CARDIAC_INTRO}</p>
      </div>

      <div className="space-y-space-2xl">
        <TableCard title="Average Cost of Various Heart Surgeries in India">
          <table className="w-full min-w-[560px] text-left text-body-md">
            <thead className="bg-surface-container-low text-label-sm tracking-wide text-on-surface-variant uppercase">
              <tr>
                <th className="px-space-lg py-space-sm">Procedure</th>
                <th className="px-space-lg py-space-sm">Cost in India (INR)</th>
                <th className="px-space-lg py-space-sm">Cost in India (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {INDIA_COSTS.map((row, index) => (
                <tr key={row.procedure} className={index % 2 === 1 ? 'bg-surface-container-low/40' : ''}>
                  <td className="px-space-lg py-space-md font-medium text-on-surface">{row.procedure}</td>
                  <td className="px-space-lg py-space-md text-on-surface-variant">{formatINR(row.inr)}</td>
                  <td className="px-space-lg py-space-md font-semibold text-primary">{formatUSD(row.usd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>

        {/* Not every procedure here is cheapest in India — angioplasty is
            priced lower in both Turkey and Thailand in this data — so the
            copy and styling stay neutral rather than framing every row as a
            saving, which the numbers themselves don't support. */}
        <TableCard
          title="Price Comparison with Other Countries"
          subtitle="India is widely regarded as a cost-effective destination for cardiac care, but the cost advantage varies by procedure. Here's how the same procedures are priced in India, Turkey, and Thailand."
        >
          <table className="w-full min-w-[480px] text-left text-body-md">
            <thead className="bg-surface-container-low text-label-sm tracking-wide text-on-surface-variant uppercase">
              <tr>
                <th className="px-space-lg py-space-sm">Procedure</th>
                <th className="px-space-lg py-space-sm">India (USD)</th>
                <th className="px-space-lg py-space-sm">Turkey (USD)</th>
                <th className="px-space-lg py-space-sm">Thailand (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {COUNTRY_COMPARISON.map((row, index) => (
                <tr key={row.procedure} className={index % 2 === 1 ? 'bg-surface-container-low/40' : ''}>
                  <td className="px-space-lg py-space-md font-medium text-on-surface">{row.procedure}</td>
                  <td className="px-space-lg py-space-md font-semibold text-primary">{formatUSD(row.india)}</td>
                  <td className="px-space-lg py-space-md text-on-surface-variant">{formatUSD(row.turkey)}</td>
                  <td className="px-space-lg py-space-md text-on-surface-variant">{formatUSD(row.thailand)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      </div>

      {doctors?.length > 0 && (
        <div>
          <h3 className="mb-space-lg text-headline-md font-bold text-primary">
            Meet Our Cardiac Specialists
          </h3>
          <ScrollRow>
            {doctors.map((doctor) => (
              <div key={doctor.id} className="w-72 shrink-0">
                <DoctorCard doctor={doctor} />
              </div>
            ))}
          </ScrollRow>
        </div>
      )}

      {cardiacHospitals.length > 0 && (
        <div>
          <h3 className="mb-space-lg text-headline-md font-bold text-primary">
            Hospitals for Cardiac Care
          </h3>
          <ScrollRow>
            {cardiacHospitals.map((hospital) => (
              <div key={hospital.id} className="w-80 shrink-0">
                <HospitalCard hospital={hospital} />
              </div>
            ))}
          </ScrollRow>
        </div>
      )}

      <div className="max-w-3xl space-y-space-xl">
        {CARDIAC_ARTICLE_SECTIONS.map((section) => (
          <div key={section.heading}>
            <h3 className="mb-space-sm text-headline-md font-bold text-primary">{section.heading}</h3>
            {section.body.map((paragraph, index) => (
              <p
                key={index}
                className="mb-space-sm text-body-md leading-relaxed text-on-surface-variant last:mb-0"
              >
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>

      <div className="max-w-3xl">
        <h3 className="mb-space-lg text-headline-md font-bold text-primary">
          Frequently Asked Questions
        </h3>
        <FaqAccordion items={CARDIAC_FAQS} />
      </div>
    </div>
  );
}
