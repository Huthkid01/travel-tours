import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-8xl font-bold text-gold-500">404</h1>
      <h2 className="mt-4 font-display text-2xl font-bold text-navy-900 dark:text-white">
        Page Not Found
      </h2>
      <p className="mt-2 max-w-md text-navy-600 dark:text-navy-400">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button href="/" className="mt-8">
        Back to Home
      </Button>
    </div>
  );
}
