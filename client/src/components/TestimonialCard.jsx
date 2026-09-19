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
      <div className="relative">
        <CardMedia
          image={image_url}
          alt={patient_name}
          label={patient_name}
          icon="person"
          className="aspect-[2.35/1] rounded-none"
        />
        {verified && (
          <span className="absolute top-space-sm left-space-sm flex items-center gap-space-3xs rounded-full bg-surface-container-lowest/90 px-space-sm py-space-3xs text-label-sm font-semibold text-primary shadow-sm backdrop-blur-sm">
            <Icon name="verified" filled className="!text-[14px] text-secondary" />
            Verified Patient Story
          </span>
        )}
      </div>

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
      </div>
    </div>
  );
}
