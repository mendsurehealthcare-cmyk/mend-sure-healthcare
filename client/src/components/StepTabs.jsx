import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

/*
  The stepped "pathway" explorer: a row of numbered tabs above a two-column
  panel (copy + checklist on the left, image on the right).

  Each step: { badge, badgeIcon, label, title, body, bullets[], image,
               imageAlt, imageCaption, action: { to, label } }
*/
export default function StepTabs({ steps }) {
  const [active, setActive] = useState(0);
  const step = steps[active];

  return (
    <div>
      <div className="mb-space-2xl grid grid-cols-2 gap-space-xs rounded-xl bg-surface-container-low p-space-xs md:grid-cols-3 lg:grid-cols-6">
        {steps.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setActive(index)}
            aria-current={index === active ? 'step' : undefined}
            className={`flex flex-col items-center rounded-lg p-space-md text-center transition-all ${
              index === active
                ? 'bg-surface text-on-surface shadow-sm'
                : 'text-on-surface-variant hover:bg-surface/50'
            }`}
          >
            <span className="mb-space-2xs text-label-sm font-bold text-secondary">
              STEP {String(index + 1).padStart(2, '0')}
            </span>
            <span className="w-full truncate text-label-md font-semibold">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-surface-container-low p-space-lg shadow-sm sm:p-space-2xl">
        <div className="grid grid-cols-1 items-center gap-space-2xl lg:grid-cols-2">
          <div>
            {step.badge && (
              <div className="mb-space-md inline-flex items-center gap-space-xs rounded-full bg-secondary-container px-space-sm py-space-2xs text-label-sm text-on-secondary-container">
                <Icon name={step.badgeIcon} className="!text-[16px]" />
                {step.badge}
              </div>
            )}
            <h3 className="mb-space-md text-headline-lg text-on-surface">
              {active + 1}. {step.title}
            </h3>
            <p className="mb-space-lg text-body-lg leading-relaxed text-on-surface-variant">{step.body}</p>

            <ul className="mb-space-lg space-y-space-sm text-body-md text-on-surface-variant">
              {step.bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-space-sm">
                  <Icon name="check_circle" className="shrink-0 text-secondary" />
                  {bullet}
                </li>
              ))}
            </ul>

            {step.action && (
              <Link
                to={step.action.to}
                className="inline-block rounded-lg bg-primary px-space-lg py-space-sm text-label-md text-on-primary transition-colors hover:bg-primary-container"
              >
                {step.action.label}
              </Link>
            )}
          </div>

          <div
            className="relative h-80 overflow-hidden rounded-xl bg-primary-container bg-cover bg-center shadow-md"
            style={step.image ? { backgroundImage: `url('${step.image}')` } : undefined}
            role="img"
            aria-label={step.imageAlt}
          >
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-primary/60 to-transparent p-space-lg">
              <span className="text-label-md font-medium text-on-primary">{step.imageCaption}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
