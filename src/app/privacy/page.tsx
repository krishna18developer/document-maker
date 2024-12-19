export default function PrivacyPolicy() {
  return (
    <main className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose dark:prose-invert">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p>We collect information that you provide directly to us when using our certificate generation service.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to provide and improve our certificate generation service.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information.</p>
        </section>
      </div>
    </main>
  );
} 