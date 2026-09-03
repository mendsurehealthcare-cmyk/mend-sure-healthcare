// Brand marks for social links.
//
// These are hand-drawn SVGs rather than <Icon> glyphs because Material Symbols
// is a UI icon set and carries no third-party brand logos.
//
// Facebook and Instagram are stroked outlines at the same weight as the
// Material icons around them. WhatsApp is the one exception: its mark is only
// recognisable as a solid bubble with the handset knocked out, so it's drawn
// filled — the ring weight still matches, so the row reads as one set.
const ICONS = {
  whatsapp: {
    mode: 'fill',
    content: (
      <>
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.161.453-.89.833-1.228.877-.339.043-.68.16-2.023-.404-1.611-.676-2.646-2.32-2.727-2.428-.083-.108-.65-.866-.65-1.651 0-.785.405-1.173.548-1.328.143-.156.309-.196.413-.196.104 0 .21 0 .302.004.103.004.24-.039.375.284.143.34.489 1.201.533 1.288.043.087.072.188.02.34-.052.152-.08.244-.156.34-.076.096-.162.213-.23.292-.08.087-.165.184-.07.348.094.164.42.696.9 1.127.621.556 1.139.73 1.295.811.156.08.247.072.34-.035.093-.108.403-.47.511-.631.108-.16.216-.134.364-.08.148.055.937.443 1.098.523.161.08.269.12.309.188.04.067.04.388-.121.841z" />
        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.763.456 3.418 1.246 4.887L2 22l5.316-1.192C8.71 21.574 10.316 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.232c-1.5 0-2.934-.383-4.195-1.077l-.3-.166-3.08.69.704-2.946-.182-.294C4.303 15.226 3.844 13.666 3.844 12c0-4.502 3.663-8.165 8.167-8.165 4.505 0 8.167 3.663 8.167 8.165 0 4.502-3.662 8.165-8.167 8.165z" />
      </>
    ),
  },
  facebook: {
    mode: 'stroke',
    content: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  instagram: {
    mode: 'stroke',
    content: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5.5" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
      </>
    ),
  },
};

export default function SocialIcon({ name, className = '' }) {
  const icon = ICONS[name];
  if (!icon) return null;

  const strokeProps =
    icon.mode === 'stroke'
      ? { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
      : { fill: 'currentColor' };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className} {...strokeProps}>
      {icon.content}
    </svg>
  );
}
