"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Check, ArrowRight, Server, Code } from "lucide-react"

export default function PricingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const plans = [
    {
      name: "Locally Deployed",
      description: "Self-hosted solution for individual use",
      price: "Free",
      icon: <Server className="h-6 w-6" />,
      features: [
        "Unlimited document uploads",
        "All file formats supported",
        "Local processing - no data leaves your machine",
        "PDF, DOCX, TXT, CSV, MP3, WAV, and image support",
        "Basic question answering",
        "No internet connection required",
        "Community support",
      ],
      cta: "Download Now",
      ctaLink: "/download",
      popular: false,
    },
    {
      name: "Developer API",
      description: "For integrating DocumentAI into your applications",
      price: "Custom",
      icon: <Code className="h-6 w-6" />,
      features: [
        "Full REST API access",
        "Cloud-based processing",
        "Advanced document analysis",
        "Custom AI model training",
        "All file formats supported",
        "Unlimited storage",
        "Dedicated support",
        "SSO and team management",
        "Custom integrations",
      ],
      cta: "Contact Me",
      ctaLink: "/contact",
      popular: true,
    },
  ]

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-background">
      {/* Cursor Radial Blur */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 119, 198, 0.15), transparent 40%)`,
        }}
      />

      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.02]" />
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-40">
        <div className="container max-w-6xl flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="size-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold">DocumentAI</h1>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Docs
            </Link>
            <Link href="/signin">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container max-w-6xl py-16 md:py-24">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the option that's right for you and start analyzing your documents with AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <div key={i} className="relative group">
                {plan.popular && (
                  <>
                    <div className="absolute -inset-px bg-gradient-to-r from-primary to-purple-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                    <div className="absolute -top-3 left-0 right-0 mx-auto w-fit px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      Recommended for Teams
                    </div>
                  </>
                )}
                <Card className={`relative h-full flex flex-col ${plan.popular ? "border-primary" : ""}`}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        {plan.icon}
                      </div>
                      <CardTitle>{plan.name}</CardTitle>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="mb-6">
                      <div className="text-4xl font-bold">{plan.price}</div>
                      {plan.price === "Free" ? (
                        <p className="text-sm text-muted-foreground mt-1">No credit card required</p>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">Custom pricing based on your needs</p>
                      )}
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                            <Check className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Link href={plan.ctaLink} className="w-full">
                      <Button
                        className={`w-full gap-2 ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {plan.cta}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    question: "What's the difference between the two options?",
                    answer:
                      "The Locally Deployed version runs entirely on your machine with no data sent to external servers. The Developer API is a cloud-based solution for integrating DocumentAI into your applications.",
                  },
                  {
                    question: "Is my data secure with the locally deployed version?",
                    answer:
                      "Yes, the locally deployed version processes all documents on your machine. No data is sent to external servers, ensuring complete privacy and security.",
                  },
                  {
                    question: "What are the system requirements for the local version?",
                    answer:
                      "The local version requires at least 8GB RAM, 4GB of disk space, and a modern CPU. It supports Windows 10/11, macOS 10.15+, and most Linux distributions.",
                  },
                  {
                    question: "How do I get API access?",
                    answer:
                      "Contact us through the 'Contact Me' button to discuss your specific requirements and get custom pricing for API access.",
                  },
                  {
                    question: "Do you offer discounts for non-profits or educational institutions?",
                    answer:
                      "Yes, we offer special pricing for non-profits, educational institutions, and startups. Contact us for details.",
                  },
                  {
                    question: "How secure is my data with the API version?",
                    answer:
                      "We use enterprise-grade encryption and security measures to protect your data. Your documents are encrypted at rest and in transit.",
                  },
                ].map((faq, i) => (
                  <div key={i} className="space-y-2">
                    <h3 className="font-medium">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Need a custom solution?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Contact me to discuss your specific requirements and get a tailored solution.
            </p>
            <Button size="lg" className="gap-2 px-8 h-12 rounded-full">
              Contact Me
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 backdrop-blur-sm bg-background/80">
        <div className="container max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-md bg-primary/10 flex items-center justify-center">
              <Sparkles className="size-3 text-primary" />
            </div>
            <p className="text-sm font-medium">© 2025 DocumentAI. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
