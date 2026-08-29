"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="not-found page-shell page-shell--narrow">
      <p>Store connection</p>
      <h1>We couldn’t load this page.</h1>
      <button className="button button--primary" onClick={reset} type="button">Try again</button>
    </div>
  );
}
