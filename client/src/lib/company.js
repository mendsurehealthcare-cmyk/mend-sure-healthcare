// Single source of truth for the company's registered details and contact
// points, so the footer, the contact page, and any future "call us" block
// can't drift apart.
export const COMPANY = {
  legalName: 'Mendsure Healthcare Services Private Limited',
  addressLines: ['E-244/R, Shaheen Bagh', 'Abul Fazal Enclave-II', 'New Delhi – 110025'],

  // `tel:` hrefs must carry no spaces or punctuation; the label is what people
  // read, the href is what the dialer gets.
  phones: [
    { label: '+91 96541 60475', href: 'tel:+919654160475' },
    { label: '+91 97181 01923', href: 'tel:+919718101923' },
  ],
  landline: { label: '+91 11 4541 5464', href: 'tel:+911145415464' },

  email: 'hello@mendsurehealthcare.com',
  website: { label: 'www.mendsurehealthcare.com', href: 'https://www.mendsurehealthcare.com' },

  // wa.me accepts digits only — a '+', space, or dash in the path silently
  // breaks the deep link rather than erroring.
  whatsapp: { label: '+91 97181 01923', href: 'https://wa.me/919718101923' },

  social: [
    { name: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/919718101923' },
    {
      name: 'facebook',
      label: 'Facebook',
      href: 'https://www.facebook.com/profile.php?id=61591701211196',
    },
    { name: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/mendsure24/' },
  ],
};
