"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, ArrowLeft, Lock, Eye, EyeOff, Server, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function SignInPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [password, setPassword] = useState("")
  const [apiUrl, setApiUrl] = useState("http://127.0.0.1:8000")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [apiCheckStatus, setApiCheckStatus] = useState<"idle" | "checking" | "success" | "error">("idle")
  const router = useRouter()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const checkApiConnection = async (url: string) => {
    try {
      setApiCheckStatus("checking")
      const response = await fetch(`${url}/healthcare`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`API check failed with status: ${response.status}`)
      }

      const data = await response.json()

      if (data.message === "success") {
        setApiCheckStatus("success")
        return true
      } else {
        setApiCheckStatus("error")
        return false
      }
    } catch (error) {
      console.error("API connection check failed:", error)
      setApiCheckStatus("error")
      return false
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate API URL
    if (!apiUrl.trim()) {
      setError("API URL is required")
      setIsLoading(false)
      return
    }

    try {
      // Basic URL validation
      new URL(apiUrl)
    } catch (e) {
      setError("Please enter a valid URL (e.g., http://127.0.0.1:8000)")
      setIsLoading(false)
      return
    }

    // Check API connection
    const isApiConnected = await checkApiConnection(apiUrl)

    if (!isApiConnected) {
      setError("Failed to connect to the API. Please check the URL and ensure the server is running.")
      setIsLoading(false)
      return
    }

    // For demo purposes, use a simple password check
    // In a real app, you would validate against a secure backend
    if (password === "documentai") {
      // Store API URL in localStorage for later use
      localStorage.setItem("documentai_api_url", apiUrl)
      router.push("/chat")
    } else {
      setError("Invalid password. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-background">
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
              href="/"
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lock className="size-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Sign In</CardTitle>
            </div>
            <CardDescription>
              Enter your credentials to access DocumentAI. For demo purposes, use "documentai" as the password.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSignIn}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="apiUrl">API URL</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <Info className="h-3.5 w-3.5" />
                          <span className="sr-only">API URL Info</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>
                          For locally deployed instances, use http://127.0.0.1:8000. The API must have /healthcare,
                          /upload, and /ask endpoints.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="rounded-l-md bg-muted px-3 py-2 text-sm text-muted-foreground">
                    <Server className="h-4 w-4" />
                  </div>
                  <Input
                    id="apiUrl"
                    type="text"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="http://127.0.0.1:8000"
                    className="rounded-l-none"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter the base URL of your DocumentAI API. For local deployment, use http://127.0.0.1:8000
                </p>
                {apiCheckStatus === "checking" && <p className="text-xs text-amber-500">Checking API connection...</p>}
                {apiCheckStatus === "success" && <p className="text-xs text-green-500">API connection successful!</p>}
                {apiCheckStatus === "error" && (
                  <p className="text-xs text-red-500">
                    API connection failed. Please check the URL and ensure the server is running.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="bg-amber-500/10 text-amber-600 p-3 rounded-md border border-amber-200/20 text-sm">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">API Requirements</p>
                    <p className="mt-1 text-xs">
                      The API must have the following endpoints:
                      <br />- GET /healthcare - Health check endpoint
                      <br />- POST /upload - For document uploads (form-data with 'file' key)
                      <br />- POST /ask - For asking questions (JSON with session_id and question)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                By signing in, you agree to our{" "}
                <Link href="/terms" className="underline hover:text-foreground">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline hover:text-foreground">
                  Privacy Policy
                </Link>
                .
              </p>
            </CardFooter>
          </form>
        </Card>
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
