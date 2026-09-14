// Single source of truth for the company's registered details and contact
// points, so the footer, the contact page, and any future "call us" block
// can't drift apart.
export const COMPANY = {
  legalName: 'Mendsure Healthcare Services Private Limited',
  addressLines: ['Shaheen Bagh', 'Abul Fazal Enclave-II', 'New Delhi – 110025'],

  // `tel:` hrefs must carry no spaces or punctuation; the label is what people
  // read, the href is what the dialer gets. Every connection point — calls,
  // WhatsApp, and the landline display — routes through this single number.
  phones: [{ label: '+91 9990 857860', href: 'tel:+919990857860' }],

  email: 'hello@mendsurehealthcare.com',
  website: { label: 'www.mendsurehealthcare.com', href: 'https://www.mendsurehealthcare.com' },

  // wa.me accepts digits only — a '+', space, or dash in the path silently
  // breaks the deep link rather than erroring.
  whatsapp: { label: '+91 9990 857860', href: 'https://wa.me/919990857860' },

  social: [
    { name: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/919990857860' },
    {
      name: 'facebook',
      label: 'Facebook',
      href: 'https://www.facebook.com/profile.php?id=61591701211196',
    },
    { name: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/mendsure24/' },
  ],
};
