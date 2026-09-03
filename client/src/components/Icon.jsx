// Renders a Material Symbols icon by name, e.g. <Icon name="search" />
// Pass `filled` for the solid variant (star ratings, verified marks).
// See https://fonts.google.com/icons for available names.
export default function Icon({ name, filled = false, className = '' }) {
  return (
    <span className={`material-symbols-outlined ${filled ? 'icon-filled' : ''} ${className}`}>
      {name}
    </span>
  );
}
