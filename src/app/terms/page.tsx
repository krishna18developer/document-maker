export default function TermsOfService() {
  return (
    <main className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="prose dark:prose-invert">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>By accessing and using this certificate generation service, you accept and agree to be bound by these Terms of Service.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p>Permission is granted to temporarily use this service for personal or commercial certificate generation purposes.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
          <p>The service is provided "as is". Use at your own risk.</p>
        </section>
      </div>
    </main>
  );
} 