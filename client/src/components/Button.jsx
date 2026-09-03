import { Link } from 'react-router-dom';

const styles = {
  // Teal is reserved for primary patient actions (book, quote, submit).
  primary: 'bg-secondary text-on-secondary shadow-sm hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed',
  // Navy for structural/secondary actions.
  secondary: 'bg-primary text-on-primary hover:bg-primary-container',
  // Quiet action on a light surface.
  outline: 'bg-surface-container-highest text-on-surface hover:bg-surface-variant',
  // Quiet action sitting on a navy section.
  onDark: 'bg-primary-container text-on-primary-container hover:bg-surface hover:text-on-surface',
};

// Renders a <Link> when `to` is given, otherwise a real <button> (e.g. for
// form submits). Keeps every CTA on the site visually consistent.
export default function Button({ to, variant = 'primary', className = '', children, ...props }) {
  const classes = `inline-flex items-center justify-center gap-space-xs rounded-lg px-space-lg py-space-sm text-label-md transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
