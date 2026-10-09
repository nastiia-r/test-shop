import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container status-page">
      <p className="status-code">404</p>
      <h1>Page not found</h1>
      <p>The photo or page you are looking for does not exist or was removed.</p>
      <Link href="/" className="btn btn--primary btn--lg">
        Back to the feed
      </Link>
    </div>
  );
}
