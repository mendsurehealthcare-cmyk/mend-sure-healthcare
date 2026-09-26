import CardMedia from './CardMedia';
import Icon from './Icon';

// Real patient photographs with a named doctor and hospital build more
// trust than a star rating nobody actually gave, so this shows what's
// verifiable (who treated them, where) rather than a decorative 5-star row.
// Older rows with just a quote/country still render fine — every field
// beyond patient_name/quote is optional here.
export default function TestimonialCard({ testimonial }) {
  const { image_url, patient_name, age, gender, country, treatment, doctor_name, hospital_name, quote } =
    testimonial;

  const demographic = [age ? `${age} yrs` : null, gender, country].filter(Boolean).join(' · ');
  const verified = Boolean(doctor_name || hospital_name);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm transition-all duration-300 hover:shadow-xl">
      {/* These are real group photos of the patient with their doctors, in
          every shape from wide to tall selfies. The whole photo is shown
          (object-contain) rather than cropped to fill the frame — cropping cut
          people off at the edges — in a square frame, the best fit for that
          mix. A blurred copy of the same photo fills the leftover space
          instead of plain bars. */}
      {image_url ? (
        <div className="relative aspect-square overflow-hidden bg-surface-container">
          <img
            src={image_url}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-xl"
          />
          <img
            src={image_url}
            alt={patient_name}
            loading="lazy"
            decoding="async"
            className="relative h-full w-full object-contain"
          />
        </div>
      ) : (
        <CardMedia label={patient_name} icon="person" className="aspect-square rounded-none" />
      )}

      <div className="flex flex-1 flex-col gap-space-sm p-space-lg">
        <div>
          <h4 className="text-label-md font-bold text-on-surface">{patient_name}</h4>
          {demographic && <p className="text-body-sm text-on-surface-variant">{demographic}</p>}
        </div>

        {treatment && (
          <span className="w-fit rounded-full bg-primary-fixed px-space-sm py-space-3xs text-label-sm font-medium text-primary">
            {treatment}
          </span>
        )}

        {quote && <p className="text-body-sm text-on-surface-variant">{quote}</p>}

        {verified && (
          <div className="mt-auto flex items-start gap-space-xs border-t border-outline-variant/20 pt-space-sm text-body-sm text-on-surface-variant">
            <Icon name="local_hospital" className="mt-0.5 !text-[16px] shrink-0 text-secondary" />
            <span>
              {doctor_name && (
                <>
                  Treated by <span className="font-medium text-on-surface">{doctor_name}</span>
                </>
              )}
              {doctor_name && hospital_name && ' at '}
              {hospital_name && <span className="font-medium text-on-surface">{hospital_name}</span>}
            </span>
          </div>
        )}

        {verified && (
          <span className="flex w-fit items-center gap-space-3xs rounded-full bg-tertiary-fixed px-space-sm py-space-3xs text-label-sm font-semibold text-on-tertiary-fixed">
            <Icon name="verified" filled className="!text-[14px]" />
            Verified Patient Story
          </span>
        )}
      </div>
    </div>
  );
}
