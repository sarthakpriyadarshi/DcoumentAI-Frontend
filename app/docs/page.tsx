"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, FileText, FileSpreadsheet, Headphones, ArrowRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DocsPage() {
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

  const docCategories = [
    {
      title: "Getting Started",
      icon: <Sparkles className="h-5 w-5" />,
      docs: [
        { title: "Introduction to DocumentAI", path: "#introduction" },
        { title: "Quick Start Guide", path: "#quick-start" },
        { title: "Creating Your First Project", path: "#first-project" },
        { title: "Understanding the Interface", path: "#interface" },
      ],
    },
    {
      title: "Document Processing",
      icon: <FileText className="h-5 w-5" />,
      docs: [
        { title: "Supported Document Formats", path: "#formats" },
        { title: "Uploading Documents", path: "#uploading" },
        { title: "Document Processing Pipeline", path: "#pipeline" },
        { title: "Handling Large Documents", path: "#large-docs" },
      ],
    },
    {
      title: "Data Analysis",
      icon: <FileSpreadsheet className="h-5 w-5" />,
      docs: [
        { title: "Extracting Insights", path: "#insights" },
        { title: "Question Answering", path: "#qa" },
        { title: "Data Visualization", path: "#visualization" },
        { title: "Exporting Results", path: "#exporting" },
      ],
    },
    {
      title: "Audio Processing",
      icon: <Headphones className="h-5 w-5" />,
      docs: [
        { title: "Audio Transcription", path: "#transcription" },
        { title: "Speech Analysis", path: "#speech-analysis" },
        { title: "Multi-language Support", path: "#multi-language" },
        { title: "Audio Quality Optimization", path: "#audio-quality" },
      ],
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
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link href="/docs" className="text-sm font-medium text-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
            <Link href="/chat">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container max-w-6xl py-16 md:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Documentation</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Learn how to use DocumentAI to analyze your documents and extract valuable insights.
            </p>
            <div className="max-w-xl mx-auto mt-8 relative">
              <Input type="text" placeholder="Search documentation..." className="pl-10 h-12 rounded-full" />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <Tabs defaultValue="guides" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-3 w-full max-w-xl">
                <TabsTrigger value="guides">Guides</TabsTrigger>
                <TabsTrigger value="api">API Reference</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="guides" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {docCategories.map((category, i) => (
                  <Card key={i} className="h-full">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          {category.icon}
                        </div>
                        <CardTitle>{category.title}</CardTitle>
                      </div>
                      <CardDescription>Essential guides for {category.title.toLowerCase()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {category.docs.map((doc, j) => (
                          <li key={j}>
                            <Link
                              href={doc.path}
                              className="text-sm hover:text-primary hover:underline transition-colors"
                            >
                              {doc.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="p-6 rounded-xl border bg-card/30 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">New to DocumentAI?</h3>
                    <p className="text-muted-foreground mb-4">
                      Start with our comprehensive getting started guide to learn the basics of document analysis with
                      AI.
                    </p>
                    <Button variant="outline" className="gap-2">
                      Read Getting Started Guide
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="api" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>API Reference</CardTitle>
                  <CardDescription>Complete reference documentation for the DocumentAI API</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Authentication</h3>
                      <p className="text-sm text-muted-foreground">
                        Learn how to authenticate with the DocumentAI API using API keys and OAuth.
                      </p>
                      <div className="mt-2">
                        <Link href="#auth" className="text-sm text-primary hover:underline">
                          View Authentication Docs →
                        </Link>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Endpoints</h3>
                      <p className="text-sm text-muted-foreground">
                        Explore the available API endpoints for document processing, analysis, and more.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {[
                          { name: "Documents", description: "Upload, retrieve, and manage documents" },
                          { name: "Analysis", description: "Extract insights and analyze document content" },
                          { name: "Questions", description: "Ask questions about documents and get answers" },
                          { name: "Users", description: "Manage users and permissions" },
                        ].map((endpoint, i) => (
                          <div key={i} className="p-3 rounded-lg border bg-card">
                            <h4 className="font-medium">{endpoint.name}</h4>
                            <p className="text-xs text-muted-foreground">{endpoint.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">SDKs & Libraries</h3>
                      <p className="text-sm text-muted-foreground">
                        Use our official client libraries to integrate DocumentAI into your applications.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {["JavaScript", "Python", "Ruby", "Go", "Java", "PHP"].map((lang, i) => (
                          <div key={i} className="px-3 py-1 rounded-full bg-muted text-xs font-medium">
                            {lang}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="p-6 rounded-xl border bg-card/30 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Need API Keys?</h3>
                    <p className="text-muted-foreground mb-4">
                      Sign up for a developer account to get API keys and start integrating DocumentAI into your
                      applications.
                    </p>
                    <Button className="gap-2">
                      Get API Keys
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="examples" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Document Analysis",
                    description: "Learn how to extract insights from documents",
                    examples: [
                      "Text extraction from PDFs",
                      "Table extraction from spreadsheets",
                      "Entity recognition in legal documents",
                      "Sentiment analysis in customer feedback",
                    ],
                  },
                  {
                    title: "Question Answering",
                    description: "Examples of asking questions about documents",
                    examples: [
                      "Simple factual questions",
                      "Complex reasoning questions",
                      "Multi-document queries",
                      "Contextual follow-up questions",
                    ],
                  },
                  {
                    title: "Integration Examples",
                    description: "How to integrate DocumentAI with other tools",
                    examples: [
                      "Web application integration",
                      "CRM integration",
                      "Workflow automation",
                      "Custom reporting dashboards",
                    ],
                  },
                ].map((category, i) => (
                  <Card key={i} className="h-full">
                    <CardHeader>
                      <CardTitle>{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {category.examples.map((example, j) => (
                          <li key={j} className="flex items-center gap-2">
                            <div className="size-4 rounded-full bg-primary/10 flex items-center justify-center">
                              <div className="size-1.5 rounded-full bg-primary" />
                            </div>
                            <span className="text-sm">{example}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="p-6 rounded-xl border bg-card/30 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Sample Projects</h3>
                    <p className="text-muted-foreground mb-4">
                      Explore complete sample projects that demonstrate how to use DocumentAI in real-world scenarios.
                    </p>
                    <Button variant="outline" className="gap-2">
                      View Sample Projects
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Need help with something specific?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our support team is here to help you get the most out of DocumentAI.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="outline" size="lg" className="gap-2 px-8 h-12 rounded-full w-full sm:w-auto">
                Contact Support
              </Button>
              <Button variant="outline" size="lg" className="gap-2 px-8 h-12 rounded-full w-full sm:w-auto">
                Join Community
              </Button>
            </div>
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
