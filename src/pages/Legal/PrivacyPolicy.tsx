
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const PrivacyPolicy = () => {
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
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">Last Updated: {currentDate}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="mb-4">Welcome to Shateer Games. Your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your information when you use our website and services.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Data:</strong> When you sign up, contact us, or make a purchase, we may collect your name, email, and payment details.</li>
              <li><strong>Usage Data:</strong> We collect data about your interactions with our website, including IP addresses, device information, and browsing activity.</li>
              <li><strong>Cookies:</strong> We use cookies to improve your experience. You can disable them in your browser settings.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and improve our services.</li>
              <li>To communicate with you regarding updates, promotions, and support.</li>
              <li>To prevent fraud and ensure security.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p>We may use third-party services like Google Analytics and payment gateways, which have their own privacy policies.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You can request access, correction, or deletion of your data.</li>
              <li>You can opt out of marketing emails.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Security</h2>
            <p>We implement security measures to protect your data but cannot guarantee absolute security.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to this Policy</h2>
            <p>We may update this Privacy Policy from time to time. Check this page for updates.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>If you have questions, email us at <a href="mailto:support@shateergames.com" className="text-primary hover:underline">support@shateergames.com</a>.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
