import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t border-outline-variant/20 bg-surface-container-low py-space-2xl">
      <div className="mx-auto mb-space-2xl grid max-w-7xl grid-cols-1 gap-space-xl px-space-md sm:px-space-xl md:grid-cols-4">
        <div>
          <div className="mb-space-md flex items-center gap-space-sm">
            <img src="/logo-icon.svg" alt="Mend Sure" className="h-7 w-7" />
            <span className="text-headline-sm font-bold text-primary">Mend Sure</span>
          </div>
          <p className="mb-space-md text-body-sm text-on-surface-variant">
            Helping patients get world-class treatment in India at a fraction of
            US and UK prices.
          </p>
        </div>

        <div>
          <h4 className="mb-space-md text-label-md font-bold text-on-surface">Quick Links</h4>
          <ul className="space-y-space-xs text-body-sm text-on-surface-variant">
            <li><Link to="/treatments" className="transition-colors hover:text-primary">Treatments</Link></li>
            <li><Link to="/hospitals" className="transition-colors hover:text-primary">Partner Hospitals</Link></li>
            <li><Link to="/doctors" className="transition-colors hover:text-primary">Our Doctors</Link></li>
            <li><Link to="/how-it-works" className="transition-colors hover:text-primary">How It Works</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-space-md text-label-md font-bold text-on-surface">Support &amp; Safety</h4>
          <ul className="space-y-space-xs text-body-sm text-on-surface-variant">
            <li><Link to="/about" className="transition-colors hover:text-primary">About Us</Link></li>
            <li><Link to="/testimonials" className="transition-colors hover:text-primary">Patient Stories</Link></li>
            <li><Link to="/contact" className="transition-colors hover:text-primary">Get a Free Quote</Link></li>
            <li><Link to="/reports" className="transition-colors hover:text-primary">My Medical Reports</Link></li>
            <li><Link to="/login" className="transition-colors hover:text-primary">Patient Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-space-md text-label-md font-bold text-on-surface">Medical Disclaimer</h4>
          <p className="text-body-sm leading-relaxed text-on-surface-variant">
            The content provided on Mend Sure is for informational purposes only
            and does not substitute for professional medical advice, diagnosis,
            or treatment. Always seek the advice of your physician.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-outline-variant/10 px-space-md pt-space-lg text-center text-body-sm text-on-surface-variant sm:px-space-xl">
        © {new Date().getFullYear()} Mend Sure. All rights reserved.
      </div>
    </footer>
  );
}
