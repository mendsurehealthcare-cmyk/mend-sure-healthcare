import Button from '../components/Button';
import Icon from '../components/Icon';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-space-md py-space-3xl text-center sm:px-space-xl">
      <div className="mx-auto mb-space-lg flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed text-primary">
        <Icon name="search_off" className="!text-[32px]" />
      </div>
      <h1 className="text-headline-lg font-bold text-primary">Page not found</h1>
      <p className="mt-space-sm text-body-lg text-on-surface-variant">
        The page you're looking for doesn't exist.
      </p>
      <div className="mt-space-xl flex flex-wrap justify-center gap-space-md">
        <Button to="/">Back to Home</Button>
        <Button to="/treatments" variant="outline">
          Browse Treatments
        </Button>
      </div>
    </div>
  );
}
