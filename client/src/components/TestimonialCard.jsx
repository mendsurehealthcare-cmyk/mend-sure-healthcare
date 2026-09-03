import CardMedia from './CardMedia';
import Icon from './Icon';

export default function TestimonialCard({ testimonial }) {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm transition-all duration-300 hover:shadow-xl">
      <CardMedia
        image={testimonial.image_url}
        alt={testimonial.patient_name}
        label={testimonial.patient_name}
        icon="person"
        className="h-48 rounded-none"
      />

      <div className="flex flex-1 flex-col justify-between p-space-lg">
        <div>
          <div className="mb-space-xs flex items-center gap-space-3xs text-amber-500">
            {[0, 1, 2, 3, 4].map((star) => (
              <Icon key={star} name="star" filled className="!text-[18px]" />
            ))}
          </div>
          <p className="mb-space-md text-body-md text-on-surface italic">“{testimonial.quote}”</p>
        </div>

        <div>
          <h4 className="text-label-md font-bold text-primary">{testimonial.patient_name}</h4>
          <p className="text-body-sm text-on-surface-variant">
            {testimonial.treatment ? `${testimonial.treatment} · ` : ''}
            {testimonial.country}
          </p>
        </div>
      </div>
    </div>
  );
}
