import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Review the Terms of Service for using DQCR. Understand your rights and responsibilities when using our dynamic QR code platform.",
  alternates: {
    canonical: "/terms-of-service",
  },
};

export default function TermsOfServicePage() {
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
        "name": "Terms of Service",
        "item": "https://dqcr.alphaprime.co.in/terms-of-service"
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
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using DQCR, you accept and agree to be bound by the terms and provisions of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
            <p className="mb-4">
              DQCR is a platform for generating, customizing, and managing dynamic QR codes. We reserve the right to modify or discontinue the service at any time without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. User Conduct</h2>
            <p className="mb-4">
              You agree not to use DQCR to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Create or distribute QR codes linking to malicious, illegal, or harmful content.</li>
              <li>Impersonate any person or entity.</li>
              <li>Interfere with or disrupt the service or servers connected to the service.</li>
            </ul>
            <p className="text-sm text-red-500 mt-2">
              Violation of these rules may result in immediate account termination.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Intellectual Property</h2>
            <p className="mb-4">
              All content provided by DQCR (excluding user-generated QR content) is the intellectual property of DQCR. You retain ownership over the destination URLs and content you provide for your dynamic QR codes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Limitation of Liability</h2>
            <p className="mb-4">
              DQCR shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Contact Information</h2>
            <p className="mb-4">
              For any questions regarding these Terms, please contact us at: <a href="mailto:alphaprime.co.in@gmail.com" className="text-primary hover:underline">alphaprime.co.in@gmail.com</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
