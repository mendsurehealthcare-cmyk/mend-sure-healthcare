import { useApi } from '../lib/useApi';
import CostGuideTable from './CostGuideTable';
import DoctorCard from './DoctorCard';
import HospitalCard from './HospitalCard';
import ScrollRow from './ScrollRow';
import FaqAccordion from './FaqAccordion';

/*
  The fuller, vaidam.com-style specialty page: an intro, one or more price
  tables, a doctors carousel, a hospitals carousel, a patient-education
  article, and an FAQ. Shared by every specialty whose content fits this one
  shape — currently Oncology, Neurosurgery, Orthopedics and Spine Surgery;
  Cardiac Surgery keeps its own component (CardiacSurgeryCostGuide.jsx)
  because its second table (the Turkey/Thailand comparison) bolds a specific
  column rather than always the last one, which CostGuideTable doesn't
  support and this component doesn't try to.

  Doctors and their hospitals are fetched live rather than hardcoded, so
  someone added to or removed from the doctor directory is reflected here
  automatically. Hospitals aren't tagged with a specialty of their own, so
  "hospitals for this specialty" is derived from which hospitals those
  doctors actually practise at, rather than a second list to keep in sync by
  hand.

  `doctorSpecialty` takes either one specialty string or an array of them —
  Spine Surgery needs both "Spine Surgery" and "Neuro and Spine Surgery",
  since the article itself says spine conditions are treated by both
  orthopaedic spine surgeons and neurosurgeons, and the doctor directory
  splits those into two specialty values. Fetching the full directory once
  and filtering client-side (rather than a separate request per specialty)
  keeps this a fixed number of hooks regardless of how many values are
  passed, which the rules of hooks require.

  `doctorSlugs` is the alternative for a specialty the doctors table's own
  `specialty` column can't identify. Bone Marrow Transplant is the case in
  point: every BMT doctor is filed under the broader "Oncology Care"
  specialty, with the sub-specialty living in a `department` column
  (server/db/doctors.json has it; the live database hasn't had
  doctors-schema.sql run yet, so the API doesn't return it) — so there is no
  specialty value to filter on. The three doctors are known by name from that
  source data instead, and named here by slug so this stays exact rather than
  pattern-matching on department text that isn't even in the API response.
*/
export default function TreatmentArticleGuide({
  title,
  intro,
  priceTables,
  doctorSpecialty,
  doctorSlugs,
  doctorsHeading,
  hospitalsHeading,
  articleSections,
  faqs,
  disclaimer,
}) {
  const doctorSpecialties = doctorSpecialty == null
    ? []
    : Array.isArray(doctorSpecialty)
      ? doctorSpecialty
      : [doctorSpecialty];

  const { data: allDoctors } = useApi('/doctors?pageSize=300');
  const doctors = allDoctors?.filter(
    (doctor) => doctorSpecialties.includes(doctor.specialty) || doctorSlugs?.includes(doctor.slug)
  );

  const { data: hospitals } = useApi('/hospitals');

  const relatedHospitals = (() => {
    if (!doctors || !hospitals) return [];
    const slugs = new Set(doctors.map((doctor) => doctor.hospitals?.slug).filter(Boolean));
    return hospitals.filter((hospital) => slugs.has(hospital.slug));
  })();

  return (
    <div className="space-y-space-3xl">
      <div className="max-w-3xl">
        <h2 className="mb-space-md text-headline-lg font-bold text-primary">{title}</h2>
        <p className="text-body-lg leading-relaxed text-on-surface-variant">{intro}</p>
      </div>

      <div className="space-y-space-2xl">
        {priceTables.map((table) => (
          <CostGuideTable key={table.title} {...table} />
        ))}
      </div>

      {doctors?.length > 0 && (
        <div>
          <h3 className="mb-space-lg text-headline-md font-bold text-primary">{doctorsHeading}</h3>
          <ScrollRow>
            {doctors.map((doctor) => (
              <div key={doctor.id} className="w-72 shrink-0">
                <DoctorCard doctor={doctor} />
              </div>
            ))}
          </ScrollRow>
        </div>
      )}

      {relatedHospitals.length > 0 && (
        <div>
          <h3 className="mb-space-lg text-headline-md font-bold text-primary">{hospitalsHeading}</h3>
          <ScrollRow>
            {relatedHospitals.map((hospital) => (
              <div key={hospital.id} className="w-80 shrink-0">
                <HospitalCard hospital={hospital} />
              </div>
            ))}
          </ScrollRow>
        </div>
      )}

      <div className="max-w-3xl space-y-space-xl">
        {articleSections.map((section) => (
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
        <FaqAccordion items={faqs} />

        {disclaimer && (
          <p className="mt-space-lg text-body-sm text-on-surface-variant">{disclaimer}</p>
        )}
      </div>
    </div>
  );
}
