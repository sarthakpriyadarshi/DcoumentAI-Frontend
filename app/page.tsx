"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquare, ArrowRight, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export default function Home() {
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
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="size-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold">DocumentAI</h1>
          </div>
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

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container max-w-6xl py-24 md:py-32 space-y-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center mb-6">
              <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                Powered by LangChain
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Intelligent Document Analysis with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                Agentic AI
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload documents, ask questions, and get intelligent answers powered by advanced NLP.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
              <Link href="/signin">
                <Button size="lg" className="gap-2 px-8 h-12 rounded-full w-full sm:w-auto">
                  <MessageSquare className="w-5 h-5" />
                  Start Chatting
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

          {/* Interactive Document Visualization */}
          <div className="relative mx-auto max-w-5xl rounded-xl border bg-card/30 backdrop-blur-sm shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5" />
            <div className="relative p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    <span>AI-Powered Analysis</span>
                  </div>
                  <h2 className="text-3xl font-bold">Transform Your Documents Into Insights</h2>
                  <p className="text-muted-foreground">
                    Our agentic AI processes multiple document formats and understands their content using advanced NLP
                    techniques.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "PDF, DOCX, TXT documents",
                      "CSV data analysis",
                      "JPG, PNG image analysis",
                      "MP3 & WAV audio transcription",
                      "Natural language understanding",
                      "Contextual question answering",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                          <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24">
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        </div>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative">
                  <DocumentVisualizer />
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="max-w-5xl mx-auto pt-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our AI-powered platform makes it easy to extract insights from your documents
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Upload Documents",
                  description: "Upload PDFs, DOCXs, TXTs, CSVs, images, or audio files to our secure platform.",
                  icon: (
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  ),
                },
                {
                  title: "AI Processing",
                  description: "Our AI analyzes your documents using advanced NLP techniques and LangChain.",
                  icon: (
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Ask Questions",
                  description: "Chat with the AI to get insights, summaries, and answers from your documents.",
                  icon: (
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  ),
                },
              ].map((step, i) => (
                <div key={i} className="relative group">
                  <div className="absolute -inset-px bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                  <div className="relative flex flex-col h-full p-6 rounded-xl border bg-card">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-medium mb-2">
                      {i + 1}. {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="max-w-5xl mx-auto pt-16">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-500 rounded-xl blur-xl opacity-20"></div>
              <div className="relative rounded-xl bg-card/50 backdrop-blur-sm border p-8 md:p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Experience the power of AI-driven document analysis and natural language processing.
                </p>
                <Link href="/signin">
                  <Button size="lg" className="gap-2 px-8 h-12 rounded-full">
                    <MessageSquare className="w-5 h-5" />
                    Start Chatting Now
                  </Button>
                </Link>
              </div>
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

function DocumentVisualizer() {
  const [activeDoc, setActiveDoc] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDoc((prev) => (prev + 1) % 4)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const documents = [
    { type: "PDF", color: "from-red-500/20 to-orange-500/20", icon: "📄" },
    { type: "CSV", color: "from-green-500/20 to-emerald-500/20", icon: "📊" },
    { type: "Image", color: "from-purple-500/20 to-pink-500/20", icon: "🖼️" },
    { type: "Audio", color: "from-blue-500/20 to-cyan-500/20", icon: "🎵" },
  ]

  return (
    <div className="relative h-[400px] w-full max-w-[400px] mx-auto">
      {/* Animated connection lines */}
      <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 400 400">
        <path
          d="M200,80 C240,140 280,160 320,200"
          stroke="url(#gradient1)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="6,6"
          className="animate-dash"
        />
        <path
          d="M200,80 C160,140 120,160 80,200"
          stroke="url(#gradient2)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="6,6"
          className="animate-dash"
        />
        <path
          d="M200,80 C200,140 200,160 200,320"
          stroke="url(#gradient3)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="6,6"
          className="animate-dash"
        />
        <path
          d="M200,80 C260,120 300,140 340,160"
          stroke="url(#gradient4)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="6,6"
          className="animate-dash"
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(168, 85, 247, 0.4)" />
            <stop offset="100%" stopColor="rgba(217, 70, 239, 0.2)" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(79, 70, 229, 0.4)" />
            <stop offset="100%" stopColor="rgba(16, 185, 129, 0.2)" />
          </linearGradient>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(236, 72, 153, 0.4)" />
            <stop offset="100%" stopColor="rgba(239, 68, 68, 0.2)" />
          </linearGradient>
          <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(124, 58, 237, 0.4)" />
            <stop offset="100%" stopColor="rgba(219, 39, 119, 0.2)" />
          </linearGradient>
        </defs>
      </svg>

      {/* AI Brain in the center */}
      <div className="absolute top-[60px] left-1/2 -translate-x-1/2 size-24 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 backdrop-blur-md flex items-center justify-center z-10 border border-white/10 shadow-lg">
        <div className="size-16 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
          <Sparkles className="size-8 text-white" />
        </div>
      </div>

      {/* Document types */}
      {documents.map((doc, i) => {
        let position
        if (i === 0) position = "left-[40px] top-[200px]"
        else if (i === 1) position = "left-[320px] top-[200px]"
        else if (i === 2) position = "left-[60px] top-[320px]"
        else position = "left-[280px] top-[320px]"

        return (
          <div
            key={i}
            className={cn(
              "absolute size-20 rounded-xl flex items-center justify-center transition-all duration-500 border shadow-lg",
              position,
              activeDoc === i ? "scale-110 z-20" : "scale-100 z-10",
            )}
          >
            <div
              className={cn(
                "size-full rounded-xl bg-gradient-to-br backdrop-blur-md flex flex-col items-center justify-center p-2",
                doc.color,
              )}
            >
              <div className="text-2xl mb-1">{doc.icon}</div>
              <div className="text-xs font-medium">{doc.type}</div>
            </div>
          </div>
        )
      })}

      {/* Animated particles */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute size-1 rounded-full bg-primary/50 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
