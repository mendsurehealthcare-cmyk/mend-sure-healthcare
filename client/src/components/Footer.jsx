import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { COMPANY } from '../lib/company';
import Icon from './Icon';
import SocialIcon from './SocialIcon';

const linkClasses = 'transition-colors hover:text-primary';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full border-t border-outline-variant/20 bg-surface-container-low py-space-2xl">
      <div className="mx-auto mb-space-xl grid max-w-7xl grid-cols-1 gap-space-xl px-space-md sm:grid-cols-2 sm:px-space-xl lg:grid-cols-3">
        <div>
          {/* The footer sits on a light surface, so the full stacked lockup —
              navy wordmark and all — is legible here as-is. */}
          <img
            src="/logo-lockup.png"
            alt="Mend Sure Healthcare Services"
            width="720"
            height="572"
            className="mb-space-md h-auto w-40"
          />
          <p className="mb-space-md text-body-sm text-on-surface-variant">
            {t('footer.tagline')}
          </p>

          <div className="flex items-center gap-space-sm">
            {COMPANY.social.map((account) => (
              <a
                key={account.name}
                href={account.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={t('footer.socialLabel', { network: account.label })}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant transition-colors hover:bg-primary hover:text-on-primary"
              >
                <SocialIcon name={account.name} className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-space-md text-label-md font-bold text-on-surface">{t('footer.quickLinks')}</h4>
          <ul className="space-y-space-xs text-body-sm text-on-surface-variant">
            <li><Link to="/treatments" className={linkClasses}>{t('nav.treatments')}</Link></li>
            <li><Link to="/hospitals" className={linkClasses}>{t('footer.partnerHospitals')}</Link></li>
            <li><Link to="/doctors" className={linkClasses}>{t('footer.ourDoctors')}</Link></li>
            <li><Link to="/how-it-works" className={linkClasses}>{t('nav.howItWorks')}</Link></li>
          </ul>

          <h4 className="mt-space-lg mb-space-md text-label-md font-bold text-on-surface">
            {t('footer.support')}
          </h4>
          <ul className="space-y-space-xs text-body-sm text-on-surface-variant">
            <li><Link to="/about" className={linkClasses}>{t('footer.aboutUs')}</Link></li>
            <li><Link to="/testimonials" className={linkClasses}>{t('nav.patientStories')}</Link></li>
            <li><Link to="/contact" className={linkClasses}>{t('footer.freeQuote')}</Link></li>
            <li><Link to="/reports" className={linkClasses}>{t('nav.myReports')}</Link></li>
            <li><Link to="/login" className={linkClasses}>{t('footer.patientLogin')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-space-md text-label-md font-bold text-on-surface">{t('footer.contact')}</h4>

          {/* not-italic because browsers italicise <address> by default. */}
          <address className="space-y-space-md text-body-sm text-on-surface-variant not-italic">
            <div className="flex items-start gap-space-xs">
              <Icon name="location_on" className="mt-0.5 !text-[18px] shrink-0 text-secondary" />
              <span>
                <span className="block font-semibold text-on-surface">{COMPANY.legalName}</span>
                {COMPANY.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </div>

            <div className="flex items-start gap-space-xs">
              <Icon name="smartphone" className="mt-0.5 !text-[18px] shrink-0 text-secondary" />
              <span>
                {COMPANY.phones.map((phone) => (
                  <a key={phone.href} href={phone.href} className={`block ${linkClasses}`}>
                    {phone.label}
                  </a>
                ))}
              </span>
            </div>

            <div className="flex items-start gap-space-xs">
              <Icon name="call" className="mt-0.5 !text-[18px] shrink-0 text-secondary" />
              <a href={COMPANY.landline.href} className={linkClasses}>
                {COMPANY.landline.label}
              </a>
            </div>

            <div className="flex items-start gap-space-xs">
              <Icon name="mail" className="mt-0.5 !text-[18px] shrink-0 text-secondary" />
              <a href={`mailto:${COMPANY.email}`} className={`break-all ${linkClasses}`}>
                {COMPANY.email}
              </a>
            </div>

            <div className="flex items-start gap-space-xs">
              <Icon name="language" className="mt-0.5 !text-[18px] shrink-0 text-secondary" />
              <a
                href={COMPANY.website.href}
                target="_blank"
                rel="noreferrer noopener"
                className={`break-all ${linkClasses}`}
              >
                {COMPANY.website.label}
              </a>
            </div>
          </address>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-outline-variant/10 px-space-md pt-space-lg text-center text-body-sm text-on-surface-variant sm:px-space-xl">
        © {new Date().getFullYear()} {COMPANY.legalName}. {t('footer.rights')}
      </div>
    </footer>
  );
}
