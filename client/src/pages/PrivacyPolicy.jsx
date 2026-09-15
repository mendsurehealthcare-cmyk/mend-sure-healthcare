import { useEffect, useState } from 'react';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { COMPANY as SITE } from '../lib/company';

// ─────────────────────────────────────────────────────────────
//  PRIVACY POLICY — Medical Tourism (International Patients → India)
//
//  Contact details below are drawn from lib/company.js, the single source
//  of truth for the site's phone, email, and address. DPO and EFFECTIVE are
//  placeholders — replace with a real name/date, and have this text
//  reviewed by a qualified data-protection lawyer before final publish.
// ─────────────────────────────────────────────────────────────

const LEGAL_NAME = SITE.legalName;
const BRAND = 'Mend Sure';
const WEBSITE = SITE.website.label;
const EMAIL = SITE.email;
const PHONE = SITE.phones[0].label;
const PHONE_HREF = SITE.phones[0].href;
const ADDRESS = SITE.addressLines.join(', ');
const DPO = 'Data Protection Officer';
const EFFECTIVE = 'September 15, 2026';

const SECTIONS = [
  { id: 'intro', label: 'Introduction' },
  { id: 'who-we-are', label: 'Who we are' },
  { id: 'data-we-collect', label: 'Data we collect' },
  { id: 'how-we-use', label: 'How we use your data' },
  { id: 'legal-basis', label: 'Legal basis for processing' },
  { id: 'sharing', label: 'Who we share data with' },
  { id: 'transfers', label: 'International data transfers' },
  { id: 'retention', label: 'How long we keep data' },
  { id: 'security', label: 'How we protect your data' },
  { id: 'your-rights', label: 'Your rights' },
  { id: 'cookies', label: 'Cookies & tracking' },
  { id: 'children', label: "Children's data" },
  { id: 'changes', label: 'Changes to this policy' },
  { id: 'contact', label: 'Contact us' },
];

export default function PrivacyPolicy() {
  const [active, setActive] = useState('intro');

  useDocumentMeta({
    title: 'Privacy Policy — Mend Sure',
    description: 'How Mend Sure collects, uses, shares, and protects your personal and medical information.',
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="pp-root">
      <style>{css}</style>

      {/* Hero */}
      <header className="pp-hero">
        <div className="pp-hero-inner">
          <p className="pp-kicker">{BRAND}</p>
          <h1>Privacy Policy</h1>
          <p className="pp-lede">
            We coordinate medical treatment in India for patients travelling from around the
            world. Your health information is among the most sensitive data you can share — this
            page explains, in plain terms, what we collect, why, who sees it, and the control you
            keep over it.
          </p>
          <p className="pp-effective">Effective {EFFECTIVE}</p>
        </div>
      </header>

      <div className="pp-body">
        {/* Table of contents */}
        <nav className="pp-toc" aria-label="Table of contents">
          <p className="pp-toc-title">On this page</p>
          <ol>
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={active === s.id ? 'is-active' : undefined}
                  onClick={() => scrollTo(s.id)}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        {/* Content */}
        <div className="pp-content">
          <Section id="intro" title="Introduction">
            <p>
              This Privacy Policy describes how {LEGAL_NAME} (operating as {BRAND}, "we", "us",
              "our") collects, uses, shares, and safeguards personal and health-related
              information when you use our website {WEBSITE}, contact us, or receive our medical
              travel and treatment-coordination services.
            </p>
            <p>
              Because we serve patients globally, we aim to comply with India's Digital Personal
              Data Protection Act, 2023 (DPDP Act), the EU/UK General Data Protection Regulation
              (GDPR) where it applies to patients in those regions, and other applicable
              data-protection laws. Where laws conflict, we apply the standard most protective of
              you.
            </p>
            <p>
              By using our services or sharing your information with us, you acknowledge the
              practices described here. If you do not agree, please do not submit your
              information.
            </p>
          </Section>

          <Section id="who-we-are" title="Who we are">
            <p>
              {LEGAL_NAME} is a medical-travel facilitation company registered in India. We
              connect international patients with hospitals, clinics, and licensed medical
              practitioners in India, and assist with the coordination of their treatment journey.
              We are the data controller (or "Data Fiduciary" under the DPDP Act) responsible for
              the personal data described in this policy.
            </p>
            <dl className="pp-facts">
              <div>
                <dt>Registered entity</dt>
                <dd>{LEGAL_NAME}</dd>
              </div>
              <div>
                <dt>Registered address</dt>
                <dd>{ADDRESS}</dd>
              </div>
              <div>
                <dt>Data protection contact</dt>
                <dd>
                  {DPO} · {EMAIL}
                </dd>
              </div>
            </dl>
            <p className="pp-note">
              Note: We facilitate and coordinate care. The hospitals and doctors who actually
              diagnose and treat you are independent providers and are separately responsible, as
              controllers, for the clinical care they deliver.
            </p>
          </Section>

          <Section id="data-we-collect" title="Data we collect">
            <p>Depending on how you interact with us, we may collect:</p>

            <DataGroup
              heading="Contact & identity details"
              items={[
                'Full name, date of birth, and gender',
                'Nationality and preferred language',
                'Email address, phone number, and WhatsApp number',
                'Home address',
              ]}
            />
            <DataGroup
              heading="Health & medical information"
              sensitive
              items={[
                'Medical history, symptoms, and diagnoses you share with us',
                'Diagnostic reports, scans, lab results, and prescriptions',
                'Treatment notes and correspondence exchanged with our partner hospitals and doctors',
                'Any other health details you choose to provide to help us assess your case',
              ]}
            />
            <DataGroup
              heading="Travel & identity documents"
              sensitive
              items={[
                'Passport and visa application details',
                'Travel itinerary and accommodation preferences',
                'Next-of-kin or emergency contact details',
                'Details of any accompanying attendant travelling with you',
              ]}
            />
            <DataGroup
              heading="Financial information"
              sensitive
              items={[
                'Billing address and payment details',
                'Records of payments made for treatment and coordination services',
                'Insurance details, where applicable',
              ]}
            />
            <DataGroup
              heading="Technical & usage data"
              items={[
                'IP address, browser type, and device information',
                'Pages viewed, links clicked, and time spent on our website',
                'Cookies and similar technologies (see "Cookies & tracking" below)',
              ]}
            />
            <DataGroup
              heading="Communications"
              items={[
                'Messages, emails, and enquiry-form submissions',
                'Call and WhatsApp records when you contact our care team',
              ]}
            />

            <p>
              Health, passport, and financial data are treated as sensitive / special-category
              data and given the highest level of protection. We collect it only with your consent
              and only what is needed to assist your treatment.
            </p>
          </Section>

          <Section id="how-we-use" title="How we use your data">
            <p>We use your information to:</p>
            <ul className="pp-list">
              <li>Respond to your enquiry and prepare a treatment plan and cost estimate.</li>
              <li>
                Share your case with suitable hospitals and doctors in India to obtain medical
                opinions and quotations.
              </li>
              <li>
                Coordinate appointments, admission, visas, travel, accommodation, and translation
                support.
              </li>
              <li>Process payments and manage billing for the services you request.</li>
              <li>Provide follow-up support and respond to questions after treatment.</li>
              <li>
                Improve our website and services, and meet legal, tax, and regulatory obligations.
              </li>
            </ul>
            <Callout>
              We do not sell your personal or health data, and we do not use it for advertising to
              third parties.
            </Callout>
          </Section>

          <Section id="legal-basis" title="Legal basis for processing">
            <p>Where the GDPR or similar laws apply, we rely on:</p>
            <ul className="pp-list">
              <li>
                <strong>Consent</strong> — for processing your health, passport, and financial
                data, which you may withdraw at any time.
              </li>
              <li>
                <strong>Contract</strong> — to provide the coordination services you request.
              </li>
              <li>
                <strong>Legal obligation</strong> — to comply with tax, accounting, and regulatory
                duties.
              </li>
              <li>
                <strong>Legitimate interests</strong> — to operate, secure, and improve our
                services, balanced against your rights.
              </li>
            </ul>
            <p>
              Under the DPDP Act, we process your data on the basis of your consent or for
              legitimate uses permitted by law.
            </p>
          </Section>

          <Section id="sharing" title="Who we share data with">
            <p>
              To arrange your treatment, we necessarily share relevant information with the
              parties below. We share only what each party needs, and we require them to protect
              it.
            </p>
            <ul className="pp-list">
              <li>
                <strong>Treating hospitals, clinics, and doctors in India</strong> — your medical
                history and reports, so they can assess your case, quote, and treat you. This is
                essential to the service.
              </li>
              <li>
                <strong>Travel, visa, and accommodation providers</strong> — limited identity and
                travel details needed to arrange logistics.
              </li>
              <li>
                <strong>Payment processors and financial institutions</strong> — to process
                payments securely.
              </li>
              <li>
                <strong>Professional advisers and authorities</strong> — where required by law,
                court order, or to protect our legal rights.
              </li>
            </ul>
            <Callout>
              We do not share your data with advertisers or data brokers, and we never sell it.
            </Callout>
          </Section>

          <Section id="transfers" title="International data transfers">
            <p>
              Because you may be located outside India and your treatment takes place in India,
              your data will be transferred across borders — including from your home country to
              our systems and to providers in India. Where such transfers are subject to the GDPR
              or similar rules, we put appropriate safeguards in place (such as standard
              contractual clauses or equivalent protections) before transferring your data.
            </p>
          </Section>

          <Section id="retention" title="How long we keep data">
            <p>
              We keep your personal and medical data only as long as necessary for the purposes
              described here, and to meet legal, medical-record, tax, and insurance obligations.
              When it is no longer needed, we securely delete or anonymise it. Retention periods
              vary by data type and applicable law; you may ask us about the periods that apply to
              you.
            </p>
          </Section>

          <Section id="security" title="How we protect your data">
            <p>
              We apply administrative, technical, and physical safeguards appropriate to the
              sensitivity of your data — including access controls, encryption in transit, secure
              storage, and confidentiality obligations on our staff and partners. No system is
              perfectly secure, but we work to protect your information and to notify you and the
              relevant authorities of a serious breach where the law requires.
            </p>
          </Section>

          <Section id="your-rights" title="Your rights">
            <p>Subject to applicable law, you may have the right to:</p>
            <ul className="pp-list">
              <li>Access the personal data we hold about you and request a copy.</li>
              <li>Correct inaccurate or incomplete data.</li>
              <li>Request deletion of your data (subject to legal retention duties).</li>
              <li>Withdraw consent to processing at any time.</li>
              <li>Object to or restrict certain processing.</li>
              <li>Request data portability where applicable.</li>
              <li>Lodge a complaint with your local data-protection authority.</li>
            </ul>
            <p>
              To exercise any right, contact us at {EMAIL}. We may need to verify your identity
              and will respond within the timeframe required by law.
            </p>
          </Section>

          <Section id="cookies" title="Cookies & tracking">
            <p>
              Our website uses cookies and similar technologies to make the site work, remember
              your preferences, and understand how it is used. You can control cookies through
              your browser settings; disabling some may affect site functionality. Where required,
              we ask for your consent before setting non-essential cookies.
            </p>
          </Section>

          <Section id="children" title="Children's data">
            <p>
              Our services are directed at adults. Where we assist with treatment for a minor, we
              do so only on the instruction and with the verifiable consent of a parent or legal
              guardian, and we handle a child's data with heightened care as required by law.
            </p>
          </Section>

          <Section id="changes" title="Changes to this policy">
            <p>
              We may update this policy from time to time. We will post the revised version here
              with a new effective date, and, where changes are significant, take reasonable steps
              to notify you. Please review it periodically.
            </p>
          </Section>

          <Section id="contact" title="Contact us">
            <p>
              For any question about this policy or your data, or to exercise your rights,
              contact:
            </p>
            <dl className="pp-facts">
              <div>
                <dt>{LEGAL_NAME}</dt>
                <dd>{ADDRESS}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={PHONE_HREF}>{PHONE}</a>
                </dd>
              </div>
              <div>
                <dt>Data protection contact</dt>
                <dd>{DPO}</dd>
              </div>
            </dl>
          </Section>

          <div className="pp-foot">
            <p>
              © {new Date().getFullYear()} {LEGAL_NAME}. All rights reserved.
            </p>
            <p className="pp-disclaimer">
              This document is a template and does not constitute legal advice. Have it reviewed
              by a qualified data-protection lawyer before publishing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="pp-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Callout({ children }) {
  return <div className="pp-callout">{children}</div>;
}

function DataGroup({ heading, items, sensitive }) {
  return (
    <div className={`pp-datagroup${sensitive ? ' is-sensitive' : ''}`}>
      <h3>
        {heading}
        {sensitive && <span className="pp-tag">Sensitive</span>}
      </h3>
      <ul>
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

// Header is fixed at 88px (24px hotline strip + 64px nav — see Layout.jsx);
// scroll-margin-top and the sticky TOC's offset both account for it so
// jumping to a section, or scrolling past it, doesn't hide the heading
// underneath the nav.
const css = `
.pp-root{
  --ink:#12303a; --ink-soft:#3d5560; --line:#d9e4e7;
  --bg:#f6f9f9; --card:#ffffff; --teal:#0f7b7b; --teal-deep:#0a5a5a;
  --sensitive:#b8632a; --sensitive-bg:#fbf1e8;
  color:var(--ink); background:var(--bg);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  line-height:1.6; -webkit-font-smoothing:antialiased;
}

.pp-root{box-sizing:border-box;}
.pp-hero{
  background:linear-gradient(160deg,#0a4f52 0%,#0f7b7b 100%);
  color:#eafafa; padding:5rem 1.5rem 4rem;
}
.pp-hero-inner{max-width:820px; margin:0 auto;}
.pp-kicker{
  font-size:.82rem; letter-spacing:.14em; text-transform:uppercase;
  color:#9fe0e0; margin:0 0 1rem; font-weight:600;
}
.pp-hero h1{
  font-family: Georgia, "Times New Roman", serif;
  font-size:clamp(2.4rem,6vw,3.6rem); line-height:1.05; margin:0 0 1.25rem;
  font-weight:600; letter-spacing:-.01em;
}
.pp-lede{font-size:1.1rem; max-width:60ch; color:#d5f0f0; margin:0 0 1.5rem;}
.pp-effective{font-size:.9rem; color:#9fe0e0; margin:0;}
.pp-body{
  max-width:1080px; margin:0 auto; padding:3rem 1.5rem 4rem;
  display:grid; grid-template-columns:240px 1fr; gap:3rem; align-items:start;
}
@media(max-width:820px){
  .pp-body{grid-template-columns:1fr; gap:1.5rem;}
  .pp-toc{position:static !important; max-height:none !important;}
}
.pp-toc{position:sticky; top:calc(88px + 2rem); align-self:start; max-height:calc(100vh - 88px - 4rem); overflow:auto;}
.pp-toc-title{
  font-size:.78rem; letter-spacing:.1em; text-transform:uppercase;
  color:var(--ink-soft); font-weight:700; margin:0 0 .75rem;
}
.pp-toc ol{list-style:none; margin:0; padding:0;}
.pp-toc li{margin:0;}
.pp-toc button{
  display:block; width:100%; text-align:left; background:none; border:none;
  border-left:2px solid var(--line); padding:.4rem 0 .4rem .9rem; cursor:pointer;
  color:var(--ink-soft); font-size:.9rem; line-height:1.35;
  transition:color .15s, border-color .15s;
}
.pp-toc button:hover{color:var(--teal);}
.pp-toc button.is-active{color:var(--teal-deep); border-left-color:var(--teal); font-weight:600;}
.pp-toc button:focus-visible{outline:2px solid var(--teal); outline-offset:2px;}
.pp-content{max-width:70ch; min-width:0;}
.pp-section{
  padding:2rem 0; border-bottom:1px solid var(--line); scroll-margin-top:calc(88px + 1.5rem);
}
.pp-section:first-child{padding-top:0;}
.pp-section h2{
  font-family:Georgia, serif; font-size:1.65rem; font-weight:600;
  margin:0 0 1rem; color:var(--teal-deep); letter-spacing:-.01em;
}
.pp-section h3{font-size:1.02rem; margin:1.4rem 0 .5rem; color:var(--ink);}
.pp-section p{margin:0 0 1rem;}
.pp-section p:last-child{margin-bottom:0;}
.pp-section strong{color:var(--ink); font-weight:650;}
.pp-list{margin:0 0 1rem; padding-left:1.2rem;}
.pp-list li{margin:.35rem 0; padding-left:.2rem;}
.pp-callout{
  background:#e7f4f4; border-left:3px solid var(--teal);
  padding:1rem 1.2rem; border-radius:0 6px 6px 0; margin:1.25rem 0;
  color:var(--teal-deep); font-size:.97rem;
}
.pp-note{
  font-size:.9rem; color:var(--ink-soft); background:#eef4f5;
  padding:.85rem 1rem; border-radius:6px; margin-top:1rem;
}
.pp-facts{margin:1rem 0 0; display:grid; gap:.75rem;}
.pp-facts > div{
  display:grid; grid-template-columns:180px 1fr; gap:1rem;
  padding-bottom:.75rem; border-bottom:1px dashed var(--line);
}
.pp-facts dt{font-weight:650; color:var(--ink); margin:0;}
.pp-facts dd{margin:0; color:var(--ink-soft);}
.pp-facts dd a{color:var(--teal-deep); text-decoration:none;}
.pp-facts dd a:hover{text-decoration:underline;}
@media(max-width:520px){ .pp-facts > div{grid-template-columns:1fr; gap:.15rem;} }
.pp-datagroup{
  border:1px solid var(--line); border-radius:8px; padding:1rem 1.2rem;
  margin:1rem 0; background:var(--card);
}
.pp-datagroup.is-sensitive{
  border-color:#eecdb2; background:var(--sensitive-bg);
}
.pp-datagroup h3{
  margin:0 0 .5rem; display:flex; align-items:center; gap:.6rem; font-size:1rem;
}
.pp-tag{
  font-size:.68rem; letter-spacing:.06em; text-transform:uppercase;
  background:var(--sensitive); color:#fff; padding:.15rem .5rem;
  border-radius:20px; font-weight:700;
}
.pp-datagroup ul{margin:0; padding-left:1.2rem;}
.pp-datagroup li{margin:.25rem 0; color:var(--ink-soft); font-size:.95rem;}
.pp-foot{padding:2rem 0 0; color:var(--ink-soft); font-size:.88rem;}
.pp-foot p{margin:.25rem 0;}
.pp-disclaimer{font-style:italic; max-width:60ch;}
@media(prefers-reduced-motion:reduce){
  .pp-root *{scroll-behavior:auto !important; transition:none !important;}
}
`;
