import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how DQCR collects, uses, and protects your data. Read our comprehensive Privacy Policy.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://dqcr.alphaprime.co.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Privacy Policy",
        "item": "https://dqcr.alphaprime.co.in/privacy-policy"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              When you use DQCR to create dynamic QR codes, we may collect the following types of information:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, and profile picture (via Google OAuth).</li>
              <li><strong>QR Code Content:</strong> Data you input into QR codes (links, text, images, etc.).</li>
              <li><strong>Analytics Data:</strong> If you use our tracking features, we may log IP addresses, device types, and generalized location data of the users scanning your QR codes.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">
              We use the collected information to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Provide, maintain, and improve the DQCR service.</li>
              <li>Process your dynamic QR code redirects and log analytics.</li>
              <li>Communicate with you regarding service updates or account issues.</li>
              <li>Ensure the security and integrity of our platform.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Data Sharing</h2>
            <p className="mb-4">
              We do not sell your personal information. We may share information with trusted third-party service providers (like hosting platforms and database providers) solely for the purpose of operating the DQCR service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Security</h2>
            <p className="mb-4">
              We take reasonable measures to protect your personal information from unauthorized access or disclosure. However, no internet transmission is ever completely secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:alphaprime.co.in@gmail.com" className="text-primary hover:underline">alphaprime.co.in@gmail.com</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
