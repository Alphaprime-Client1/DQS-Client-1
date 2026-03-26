import { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  QrCode,
  Share2,
  RefreshCcw,
  BarChart2,
  Palette,
  Globe,
  Zap,
  Crown,
  CheckCircle2,
  Link2,
  FileText,
  Image,
  LayoutGrid,
  ArrowRight,
  Sparkles,
  Mail,
  Send,
  HelpCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Generate dynamic, custom QR codes with logo support for free. DQCR is the leading platform for trackable QR codes, dynamic links, and real-time scan analytics.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://dqcr.alphaprime.co.in/#website",
        "url": "https://dqcr.alphaprime.co.in",
        "name": "DQCR",
        "description": "Dynamic QR Code Platform with Logic-Based Redirection and Real-Time Analytics.",
        "publisher": {
          "@id": "https://dqcr.alphaprime.co.in/#organization"
        }
      },
      {
        "@type": "WebApplication",
        "name": "DQCR QR Generator",
        "description": "Create, customize, and track dynamic QR codes with logo support and real-time analytics.",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Any",
        "url": "https://dqcr.alphaprime.co.in",
        "featureList": [
          "Dynamic QR Codes",
          "Custom Design with Logo",
          "Scan Analytics",
          "Multi-Action Pages"
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Is DQCR a free QR code generator?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, DQCR offers a forever-free plan that includes 2 dynamic QR codes with unlimited scans and basic customization."
            }
          },
          {
            "@type": "Question",
            "name": "How do dynamic QR codes work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Unlike static QR codes, dynamic QR codes from DQCR point to a short URL that redirects to your destination. This allows you to change the destination URL anytime without reprinting the QR code."
            }
          },
          {
            "@type": "Question",
            "name": "Can I add a logo to my QR code?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! With our Pro plan, you can upload your own brand logo and place it in the center of the QR code to build brand trust and improve scan rates."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24">
          {/* Background blobs */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] gradient-primary opacity-10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500 opacity-5 blur-[100px] rounded-full" />
          </div>

          <div className="container mx-auto px-4 text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6 border border-primary/20 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5" />
              DQCR by Lavanya Lahari — Dynamic QR Codes
            </div>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-6 animate-slide-up">
              Dynamic QR Code Platform with <br className="hidden md:block" />
              <span className="gradient-text">Logic-Based Redirection</span> and Real-Time Analytics.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
              Create dynamic QR codes that redirect to links, display text, show
              images, or open a multi-action page — all updatable anytime without
              reprinting.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 animate-slide-up">
              <Link href="/login">
                <Button
                  size="lg"
                  className="gradient-primary text-white border-0 gap-2 text-base px-8 h-12 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow"
                  aria-label="Get Started for Free"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/#how-it-works">
                <Button variant="outline" size="lg" className="gap-2 h-12 px-8 text-base" aria-label="Learn how it works">
                  How it works
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-8 text-center animate-fade-in">
              {[
                { value: "4 types", label: "QR content types" },
                { value: "Real-time", label: "Scan analytics" },
                { value: "Free forever", label: "Basic plan" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section id="how-it-works" className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">How it works</h2>
              <p className="text-muted-foreground text-lg">
                Three steps to your first dynamic QR code
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  icon: QrCode,
                  title: "Create",
                  description:
                    "Sign in with Google, pick a content type (link, text, image, or multi-action), and customize your QR design.",
                },
                {
                  step: "02",
                  icon: Share2,
                  title: "Share",
                  description:
                    "Download your QR code and share it anywhere — print it, embed it in emails, or add it to presentations.",
                },
                {
                  step: "03",
                  icon: RefreshCcw,
                  title: "Update Anytime",
                  description:
                    "Change the destination URL or content from your dashboard — the printed QR code still works perfectly.",
                },
              ].map((item) => (
                <div key={item.step} className="relative text-center group">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30 transition-transform group-hover:scale-110">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 text-7xl font-black text-muted-foreground/10 select-none">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section id="features" className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Everything you need
              </h2>
              <p className="text-muted-foreground text-lg">
                Powerful features in a clean, minimal interface
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Link2,
                  title: "Dynamic Links",
                  description: "Change the URL anytime. Your QR code always points to the latest destination.",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  icon: LayoutGrid,
                  title: "Multi-Action",
                  description: "Linktree-style pages with multiple buttons — links, text, images.",
                  color: "from-purple-500 to-violet-600",
                },
                {
                  icon: BarChart2,
                  title: "Scan Analytics",
                  description: "Track scans in real-time. Pro users get detailed logs and charts.",
                  color: "from-emerald-500 to-green-600",
                },
                {
                  icon: Palette,
                  title: "Custom Design",
                  description: "Pick colors, adjust size, and add your logo (Pro). Make it yours.",
                  color: "from-rose-500 to-pink-600",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="p-6 rounded-2xl border border-border/50 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 group"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}
                  >
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-base mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>

            {/* QR Types Grid */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Link2, label: "Link QR", sub: "URL redirect" },
                { icon: FileText, label: "Text QR", sub: "Display message" },
                { icon: Image, label: "Image QR", sub: "Show photo" },
                { icon: LayoutGrid, label: "Multi QR", sub: "Action buttons" },
              ].map((t) => (
                <div
                  key={t.label}
                  className="flex flex-col items-center gap-3 p-5 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors group cursor-default"
                >
                  <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center transition-transform group-hover:scale-110">
                    <t.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">{t.label}</p>
                    <p className="text-xs text-muted-foreground">{t.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PRICING ===== */}
        <section id="pricing" className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Simple pricing</h2>
              <p className="text-muted-foreground text-lg mb-6">
                Start free. Upgrade when you need more.
              </p>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" />
                Pro plans are coming soon 🚀 — enter your email to get notified at launch
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Free */}
              <div className="p-8 rounded-2xl border border-border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-muted-foreground" />
                  <h3 className="text-xl font-bold">Free</h3>
                </div>
                <p className="text-4xl font-extrabold mb-1">₹0</p>
                <p className="text-muted-foreground text-sm mb-6">Forever free</p>

                <ul className="space-y-3 mb-8">
                  {[
                    "2 QR codes",
                    "Link, Text, Image, Multi types",
                    "Color & size customization",
                    "Total scan count",
                    "QR download (PNG)",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link href="/login">
                  <Button className="w-full" variant="outline" aria-label="Sign up for Free plan">
                    Get Started Free
                  </Button>
                </Link>
              </div>

              {/* Pro */}
              <div className="relative p-8 rounded-2xl border-2 border-primary bg-card overflow-hidden shadow-2xl shadow-primary/10">
                <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold">Pro</h3>
                  <span className="ml-auto text-xs gradient-primary text-white rounded-full px-2 py-0.5 font-medium">
                    Popular
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <p className="text-4xl font-extrabold gradient-text">₹19</p>
                  <p className="text-xl font-bold text-muted-foreground line-through decoration-destructive/60 decoration-2">₹199</p>
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <p className="text-muted-foreground text-sm">per month</p>
                  <span className="bg-destructive/10 text-destructive text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Limited Time
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "Unlimited QR codes",
                    "All Free features",
                    "Logo in QR code",
                    "Detailed analytics & charts",
                    "Device & time tracking",
                    "Priority support",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Coming soon button replacement */}
                <div className="flex flex-col gap-3 mt-8">
                  <div className="w-full text-center py-2.5 rounded-lg bg-muted text-muted-foreground font-medium text-sm border border-border/50 cursor-not-allowed select-none">
                    Coming Soon
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full gap-2 border-primary/20 hover:border-primary/50 text-foreground" aria-label="Notify me when Pro plan launches">
                        <Mail className="w-4 h-4" />
                        Notify Me
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Get Notified</DialogTitle>
                        <DialogDescription>
                          Enter your email to join the waitlist. We'll let you know as soon as the Pro plan launches!
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex items-center space-x-2 mt-4">
                        <Input type="email" placeholder="you@example.com" />
                        <Button type="button" className="gradient-primary text-white border-0 px-4">
                          <Send className="w-4 h-4 mr-2" />
                          Submit
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section id="faq" className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 flex items-center justify-center gap-3">
                <HelpCircle className="w-8 h-8 text-primary" />
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground text-lg">
                Common questions about our dynamic QR code generator
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  q: "What is a dynamic QR code?",
                  a: "A dynamic QR code is trackable and updatable. You can change the destination link after printing, whereas static QR codes are fixed forever once created."
                },
                {
                  q: "Can I use DQCR for free?",
                  a: "Absolutely! Our basic plan allows you to create up to 2 free dynamic QR codes with logo-support features coming soon to the free tier."
                },
                {
                  q: "Are the scans limited?",
                  a: "No, all QR codes generated on DQCR have unlimited scans. We don't block your QR codes regardless of how many people scan them."
                },
                {
                  q: "How do I track my QR code scans?",
                  a: "Each dynamic QR code has a built-in analytics dashboard. You can see total scan counts, and Pro users get detailed charts and location data."
                }
              ].map((faq, i) => (
                <div key={i} className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                  <h3 className="font-semibold text-base mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center text-sm text-muted-foreground">
              Have more questions? Contact us at <a href="mailto:alphaone4050@gmail.com" className="text-primary hover:underline">alphaone4050@gmail.com</a>
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-16 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 gradient-primary opacity-[0.07]" />
          </div>
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 glow">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to create your first QR?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Sign up with Google and create your first dynamic QR code in under 60 seconds.
            </p>
            <Link href="/login">
              <Button
                size="lg"
                className="gradient-primary text-white border-0 gap-2 px-10 h-12 text-base shadow-lg shadow-primary/30"
                aria-label="Start creating your first QR for free"
              >
                <QrCode className="w-5 h-5" />
                Start for Free
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
