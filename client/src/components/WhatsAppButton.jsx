import { COMPANY } from '../lib/company';
import SocialIcon from './SocialIcon';

export default function WhatsAppButton() {
  return (
    <a
      href={COMPANY.whatsapp.href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`Chat with us on WhatsApp at ${COMPANY.whatsapp.label}`}
      className="fixed right-space-lg bottom-space-lg z-50 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-on-secondary shadow-lg transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed"
    >
      <SocialIcon name="whatsapp" className="h-7 w-7" />
    </a>
  );
}
