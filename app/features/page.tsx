"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, FileText, FileSpreadsheet, Headphones, MessageSquare, ArrowRight, Check } from "lucide-react"

export default function FeaturesPage() {
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
              className="text-sm font-medium text-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
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
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Powerful Features for Document Intelligence
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover how DocumentAI transforms your documents into actionable insights with advanced AI technology.
            </p>
          </div>

          <Tabs defaultValue="documents" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-3 w-full max-w-xl">
                <TabsTrigger value="documents">Document Processing</TabsTrigger>
                <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
                <TabsTrigger value="integration">Integrations</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="documents" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <FileText className="w-4 h-4" />
                    <span>Document Processing</span>
                  </div>
                  <h2 className="text-3xl font-bold">Process Multiple Document Formats</h2>
                  <p className="text-muted-foreground">
                    DocumentAI can process a wide range of document formats, extracting text, data, and insights from
                    various file types.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "PDF documents with text extraction and layout analysis",
                      "Word documents (DOCX) with formatting preservation",
                      "Plain text files (TXT) with semantic parsing",
                      "Spreadsheets (CSV) with data structure recognition",
                      "Audio files (MP3, WAV) with transcription capabilities",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative p-6 rounded-xl border bg-card/30 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-xl" />
                  <div className="relative space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/50 border">
                        <FileText className="h-8 w-8 text-primary mb-2" />
                        <h3 className="font-medium">PDF & DOCX</h3>
                        <p className="text-xs text-muted-foreground mt-1">Text extraction & layout analysis</p>
                      </div>
                      <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/50 border">
                        <FileSpreadsheet className="h-8 w-8 text-primary mb-2" />
                        <h3 className="font-medium">CSV & Data</h3>
                        <p className="text-xs text-muted-foreground mt-1">Structured data processing</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/50 border">
                        <Headphones className="h-8 w-8 text-primary mb-2" />
                        <h3 className="font-medium">Audio Files</h3>
                        <p className="text-xs text-muted-foreground mt-1">Speech-to-text transcription</p>
                      </div>
                      <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/50 border">
                        <MessageSquare className="h-8 w-8 text-primary mb-2" />
                        <h3 className="font-medium">Chat Interface</h3>
                        <p className="text-xs text-muted-foreground mt-1">Natural language interaction</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Document Processing</CardTitle>
                  <CardDescription>
                    Our AI can handle complex document structures and extract meaningful information
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Layout Recognition",
                      description:
                        "Automatically identifies headers, paragraphs, tables, and other structural elements in documents.",
                    },
                    {
                      title: "OCR Capabilities",
                      description:
                        "Extracts text from scanned documents and images with high accuracy using optical character recognition.",
                    },
                    {
                      title: "Multi-language Support",
                      description:
                        "Process documents in multiple languages with support for translation and cross-lingual analysis.",
                    },
                  ].map((feature, i) => (
                    <div key={i} className="space-y-2">
                      <h3 className="font-medium">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Analysis</span>
                  </div>
                  <h2 className="text-3xl font-bold">Advanced Natural Language Processing</h2>
                  <p className="text-muted-foreground">
                    Our AI uses state-of-the-art NLP techniques powered by LangChain to understand document content and
                    answer complex questions.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Semantic understanding of document content",
                      "Entity recognition and relationship mapping",
                      "Sentiment analysis and opinion extraction",
                      "Summarization of key points and insights",
                      "Question answering with contextual awareness",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative p-6 rounded-xl border bg-card/30 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-xl" />
                  <div className="relative space-y-4">
                    <div className="p-4 rounded-lg bg-background/50 border">
                      <h3 className="font-medium mb-2">Document Analysis Pipeline</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-medium">1</span>
                          </div>
                          <div className="flex-1 text-sm">Document parsing and tokenization</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-medium">2</span>
                          </div>
                          <div className="flex-1 text-sm">Semantic analysis and entity extraction</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-medium">3</span>
                          </div>
                          <div className="flex-1 text-sm">Knowledge graph construction</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-medium">4</span>
                          </div>
                          <div className="flex-1 text-sm">Query processing and response generation</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>AI-Powered Insights</CardTitle>
                  <CardDescription>
                    Extract valuable insights from your documents with our advanced AI analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Contextual Understanding",
                      description:
                        "Our AI understands the context of your documents, allowing for more accurate and relevant answers to your questions.",
                    },
                    {
                      title: "Cross-Document Analysis",
                      description:
                        "Connect information across multiple documents to identify patterns, relationships, and insights.",
                    },
                    {
                      title: "Customizable Analysis",
                      description:
                        "Tailor the AI's analysis to focus on specific topics, entities, or aspects of your documents.",
                    },
                  ].map((feature, i) => (
                    <div key={i} className="space-y-2">
                      <h3 className="font-medium">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integration" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span>Integrations</span>
                  </div>
                  <h2 className="text-3xl font-bold">Seamless Integration with Your Workflow</h2>
                  <p className="text-muted-foreground">
                    DocumentAI integrates with your existing tools and workflows to provide a seamless experience.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "API access for custom integrations",
                      "Cloud storage integration (Google Drive, Dropbox, OneDrive)",
                      "CRM and document management system connections",
                      "Workflow automation with webhooks",
                      "Export capabilities to various formats",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative p-6 rounded-xl border bg-card/30 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-xl" />
                  <div className="relative space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { name: "Google Drive", icon: "📁" },
                        { name: "Dropbox", icon: "📦" },
                        { name: "Slack", icon: "💬" },
                        { name: "Microsoft 365", icon: "📊" },
                      ].map((integration, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-background/50 border">
                          <div className="text-2xl">{integration.icon}</div>
                          <div className="text-sm font-medium">{integration.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Enterprise Integration</CardTitle>
                  <CardDescription>
                    Connect DocumentAI with your enterprise systems for seamless document processing
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Secure API Access",
                      description:
                        "Enterprise-grade API with authentication and rate limiting for secure integration with your systems.",
                    },
                    {
                      title: "Custom Workflows",
                      description:
                        "Create custom document processing workflows that integrate with your existing business processes.",
                    },
                    {
                      title: "Data Export & Reporting",
                      description:
                        "Export analysis results and generate reports in various formats for sharing and presentation.",
                    },
                  ].map((feature, i) => (
                    <div key={i} className="space-y-2">
                      <h3 className="font-medium">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to experience these features?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start analyzing your documents with our powerful AI technology today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/chat">
                <Button size="lg" className="gap-2 px-8 h-12 rounded-full w-full sm:w-auto">
                  <MessageSquare className="w-5 h-5" />
                  Try It Now
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="lg" className="h-12 rounded-full w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
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
