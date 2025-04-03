
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const TermsOfService = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-8">Last Updated: {currentDate}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>By accessing Shateer Games, you agree to these Terms of Service. If you do not agree, do not use our website.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. User Conduct</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be <strong>13 years or older</strong> to use our services.</li>
              <li>Do not use our games for illegal or unauthorized purposes.</li>
              <li>Cheating, hacking, or exploiting bugs is prohibited.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Intellectual Property</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All content, including games, graphics, and code, is owned by <strong>Shateer Games</strong>.</li>
              <li>You may not copy, modify, or distribute our content without permission.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Payments & Refunds</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>If our games include paid content, purchases are final unless stated otherwise.</li>
              <li>Refunds are processed at our discretion.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
            <p>Shateer Games is not responsible for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Any <strong>data loss, game crashes, or account issues</strong>.</li>
              <li>Third-party services or external links on our site.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
            <p>We may update these Terms at any time. Continued use means you accept the changes.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Contact</h2>
            <p>For any concerns, email <a href="mailto:legal@shateergames.com" className="text-primary hover:underline">legal@shateergames.com</a>.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
