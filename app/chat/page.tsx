"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  FileText,
  Upload,
  Send,
  ArrowLeft,
  Sparkles,
  X,
  Check,
  AlertCircle,
  ImageIcon,
  Server,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

// Add this after the imports
const scrollbarHideStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`

interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

export default function ChatPage() {
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [message, setMessage] = useState("")
  const [isChatEnabled, setIsChatEnabled] = useState(false)
  const [apiUrl, setApiUrl] = useState("")
  const [apiConnectionStatus, setApiConnectionStatus] = useState<"connected" | "disconnected" | "checking">("checking")
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm DocumentAI. I can help you analyze your documents and answer questions about them. Upload a document to get started.",
    },
  ])
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  useEffect(() => {
    // Get API URL from localStorage
    const storedApiUrl = localStorage.getItem("documentai_api_url")
    if (storedApiUrl) {
      setApiUrl(storedApiUrl)
      checkApiConnection(storedApiUrl)
    } else {
      // Redirect to sign-in if no API URL is found
      router.push("/signin")
    }
  }, [router])

  // Check if session is expired
  useEffect(() => {
    if (sessionExpiry && new Date() > sessionExpiry) {
      setSessionId(null)
      setSessionExpiry(null)
      setIsChatEnabled(false)
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "Your session has expired. Please upload a new document to continue.",
        },
      ])
    }
  }, [sessionExpiry])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const checkApiConnection = async (url: string) => {
    try {
      setApiConnectionStatus("checking")
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
        setApiConnectionStatus("connected")
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            content: `Successfully connected to API at ${url}. You can now upload documents and ask questions.`,
          },
        ])
        return true
      } else {
        setApiConnectionStatus("disconnected")
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            content: `Failed to connect to API at ${url}. Please check the URL and ensure the server is running.`,
          },
        ])
        return false
      }
    } catch (error) {
      console.error("API connection check failed:", error)
      setApiConnectionStatus("disconnected")
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: `Failed to connect to API at ${url}. Please check the URL and ensure the server is running.`,
        },
      ])
      return false
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...filesArray])
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const removeUploadedFile = (index: number) => {
    const fileName = uploadedFiles[index]
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))

    // If all files are removed, disable chat
    if (uploadedFiles.length === 1) {
      setIsChatEnabled(false)
      setSessionId(null)
      setSessionExpiry(null)
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "All documents have been removed. Please upload a new document to continue.",
        },
      ])
    }
  }

  const handleUploadFiles = async () => {
    if (selectedFiles.length === 0 || !apiUrl) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Create a progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 5
        })
      }, 100)

      // Upload each file
      for (const file of selectedFiles) {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch(`${apiUrl}/upload`, {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Upload failed with status: ${response.status}`)
        }

        const data = await response.json()

        if (data.session_id) {
          setSessionId(data.session_id)

          // Set session expiry to 1 hour from now
          const expiryTime = new Date()
          expiryTime.setHours(expiryTime.getHours() + 1)
          setSessionExpiry(expiryTime)

          setUploadedFiles((prev) => [...prev, file.name])
        } else {
          throw new Error("No session ID received from server")
        }
      }

      // Complete the upload
      clearInterval(progressInterval)
      setUploadProgress(100)
      setIsUploading(false)
      setSelectedFiles([])
      setIsFileDialogOpen(false)
      setIsChatEnabled(true)

      // Add a system message about successful upload
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content:
            "Your documents have been successfully uploaded and processed. You can now ask questions about them. Note that your session will expire in 1 hour.",
        },
      ])
    } catch (error) {
      console.error("Upload failed:", error)
      setIsUploading(false)
      setUploadProgress(0)

      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
        },
      ])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files)
      setSelectedFiles((prev) => [...prev, ...filesArray])
      setIsFileDialogOpen(true)
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !isChatEnabled || !sessionId) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: message }])

    const userQuestion = message
    setMessage("")
    setIsProcessing(true)

    try {
      const response = await fetch(`${apiUrl}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          question: userQuestion,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.answer) {
          setMessages((prev) => [...prev, { role: "assistant", content: data.answer }])
        } else {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "I couldn't find an answer to your question in the provided documents." },
          ])
        }
      } else {
        // Handle error responses
        if (data.error && data.error.includes("Invalid or expired session")) {
          setSessionId(null)
          setSessionExpiry(null)
          setIsChatEnabled(false)
          setMessages((prev) => [
            ...prev,
            {
              role: "system",
              content: "Your session has expired. Please upload a new document to continue.",
            },
          ])
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "system",
              content: `Error: ${data.error || "Unknown error occurred"}`,
            },
          ])
        }
      }
    } catch (error) {
      console.error("Question submission failed:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: `Failed to send question: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSourceSubmit = () => {
    // This is a placeholder for source citation functionality
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          "Here are the sources for the information provided:\n\n1. Document: example-document.pdf, Page 12\n2. Document: financial-report.csv, Row 145\n\nWould you like me to provide more specific citations?",
      },
    ])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)

    // Auto-resize textarea only after exceeding one line
    if (textareaRef.current) {
      const lineHeight = 24 // Approximate height of one line
      textareaRef.current.style.height = "40px" // Reset to default height

      // Only resize if content exceeds one line
      if (textareaRef.current.scrollHeight > lineHeight + 16) {
        // 16px for padding
        const newHeight = Math.min(textareaRef.current.scrollHeight, 120) // 120px = ~4 lines
        textareaRef.current.style.height = `${newHeight}px`

        // Adjust border radius based on height
        if (newHeight <= 40) {
          textareaRef.current.style.borderRadius = "9999px" // Full rounded for single line
        } else if (newHeight <= 70) {
          textareaRef.current.style.borderRadius = "1.5rem" // Less rounded for 2 lines
        } else if (newHeight <= 100) {
          textareaRef.current.style.borderRadius = "1rem" // Even less rounded for 3 lines
        } else {
          textareaRef.current.style.borderRadius = "0.75rem" // Least rounded for 4 lines
        }
      } else {
        // Reset to full rounded for single line
        textareaRef.current.style.borderRadius = "9999px"
      }
    }
  }

  // Function to get file icon based on file extension
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(extension || "")) {
      return <ImageIcon className="h-4 w-4 mr-2 text-muted-foreground" />
    }

    return <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
  }

  // Function to reconnect to API
  const handleReconnect = () => {
    if (apiUrl) {
      checkApiConnection(apiUrl)
    }
  }

  // Function to format time remaining for session
  const getSessionTimeRemaining = () => {
    if (!sessionExpiry) return null

    const now = new Date()
    const diffMs = sessionExpiry.getTime() - now.getTime()

    if (diffMs <= 0) return "Expired"

    const diffMins = Math.floor(diffMs / 60000)
    const diffSecs = Math.floor((diffMs % 60000) / 1000)

    return `${diffMins}m ${diffSecs}s`
  }

  return (
    <div className="relative min-h-screen bg-background">
      <style jsx global>
        {scrollbarHideStyles}
      </style>
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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs">
              <Server className="h-3 w-3" />
              <span className="truncate max-w-[150px]">{apiUrl}</span>
              <div
                className={cn(
                  "size-2 rounded-full",
                  apiConnectionStatus === "connected"
                    ? "bg-green-500"
                    : apiConnectionStatus === "checking"
                      ? "bg-amber-500"
                      : "bg-red-500",
                )}
              />
              {apiConnectionStatus === "disconnected" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1"
                  onClick={handleReconnect}
                  title="Reconnect"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              )}
            </div>
            {sessionId && sessionExpiry && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs">
                <span>Session: {getSessionTimeRemaining()}</span>
              </div>
            )}
            <Link
              href="/"
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="container max-w-6xl py-8 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="relative group h-[600px]">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              <Card className="relative h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Sparkles className="size-5 text-primary" />
                    </div>
                    <CardTitle>Upload Documents</CardTitle>
                  </div>
                  <CardDescription>Upload files to analyze with AI</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer",
                      apiConnectionStatus !== "connected"
                        ? "bg-muted/10 opacity-50 pointer-events-none"
                        : "bg-muted/30",
                    )}
                    onClick={() => apiConnectionStatus === "connected" && setIsFileDialogOpen(true)}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">Drag and drop files here or click to browse</p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Supports PDF, DOCX, TXT, CSV, MP3, WAV, JPG, PNG
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={handleBrowseClick}
                      disabled={apiConnectionStatus !== "connected"}
                    >
                      Browse Files
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileSelect}
                      multiple
                      accept=".pdf,.docx,.txt,.csv,.mp3,.wav,.jpg,.jpeg,.png,.gif,.webp"
                      disabled={apiConnectionStatus !== "connected"}
                    />
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-medium mb-2">Uploaded Files</p>
                    {uploadedFiles.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No files uploaded yet</p>
                    ) : (
                      <div className="w-full space-y-2 max-h-[250px] overflow-y-auto">
                        {uploadedFiles.map((fileName, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <div className="flex items-center">
                              {getFileIcon(fileName)}
                              <span className="text-sm">{fileName}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => removeUploadedFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {sessionId && sessionExpiry && (
                    <div className="mt-4">
                      <Alert className="bg-primary/10 text-primary border-primary/20">
                        <div className="flex flex-col">
                          <p className="text-xs font-medium">Active Session</p>
                          <p className="text-xs">Time remaining: {getSessionTimeRemaining()}</p>
                        </div>
                      </Alert>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="mt-auto">
                  {apiConnectionStatus === "checking" && (
                    <Alert className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>Connecting to API...</AlertDescription>
                    </Alert>
                  )}
                  {apiConnectionStatus === "disconnected" && (
                    <Alert className="bg-red-500/10 text-red-500 border-red-500/20">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>Failed to connect to API. Please check the URL and try again.</AlertDescription>
                    </Alert>
                  )}
                  {apiConnectionStatus === "connected" && !isChatEnabled && uploadedFiles.length === 0 && (
                    <Alert className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>Upload documents to enable the chat functionality</AlertDescription>
                    </Alert>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="relative group h-[600px]">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              <Card className={cn("relative h-full flex flex-col", !isChatEnabled && "opacity-75")}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MessageSquareIcon className="size-5 text-primary" />
                    </div>
                    <CardTitle>Chat with DocumentAI</CardTitle>
                  </div>
                  <CardDescription>
                    {apiConnectionStatus !== "connected"
                      ? "Connecting to API..."
                      : isChatEnabled
                        ? "Ask questions about your uploaded documents"
                        : "Upload documents to start chatting"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto pr-2">
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex items-start gap-3",
                          msg.role === "user" && "justify-end",
                          msg.role === "system" && "justify-center",
                        )}
                      >
                        {msg.role === "assistant" && (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <div
                          className={cn(
                            "p-3 rounded-lg",
                            msg.role === "assistant"
                              ? "bg-muted/50"
                              : msg.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-amber-500/10 text-amber-600 border border-amber-200/20 max-w-[80%]",
                          )}
                        >
                          <p className="text-sm whitespace-pre-line">{msg.content}</p>
                        </div>
                        {msg.role === "user" && (
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <svg
                              className="h-4 w-4 text-primary-foreground"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                    {isProcessing && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <div className="flex space-x-2">
                            <div
                              className="h-2 w-2 bg-primary/40 rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className="h-2 w-2 bg-primary/40 rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></div>
                            <div
                              className="h-2 w-2 bg-primary/40 rounded-full animate-bounce"
                              style={{ animationDelay: "600ms" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 mt-auto">
                  <div className="flex w-full items-start space-x-2">
                    <Textarea
                      ref={textareaRef}
                      placeholder={
                        apiConnectionStatus !== "connected"
                          ? "Connecting to API..."
                          : isChatEnabled
                            ? "Ask a question about your documents..."
                            : "Upload documents to enable chat"
                      }
                      className="flex-1 min-h-10 max-h-[120px] resize-none px-4 py-2 overflow-y-auto scrollbar-hide"
                      value={message}
                      onChange={handleTextareaChange}
                      onKeyDown={handleKeyDown}
                      disabled={!isChatEnabled || apiConnectionStatus !== "connected" || isProcessing}
                      style={{
                        height: "40px",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        borderRadius: "9999px",
                      }}
                    />
                    <Button
                      size="icon"
                      className="flex-shrink-0 rounded-full h-10 w-10"
                      onClick={handleSendMessage}
                      disabled={
                        !isChatEnabled || !message.trim() || apiConnectionStatus !== "connected" || isProcessing
                      }
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send message</span>
                    </Button>
                  </div>
                  <div className="flex justify-between w-full items-center">
                    <p className="text-xs text-muted-foreground">Press Enter to send, Shift+Enter for new line</p>
                    {isChatEnabled && apiConnectionStatus === "connected" && (
                      <Button variant="outline" size="sm" className="text-xs" onClick={handleSourceSubmit}>
                        Request Sources
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* File Selection Dialog */}
      <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Files</DialogTitle>
            <DialogDescription>Choose the documents you want to analyze with DocumentAI</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div
              className="border-2 border-dashed rounded-lg p-6 text-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">Drag and drop files here or click to browse</p>
              <Button size="sm" variant="outline" onClick={handleBrowseClick}>
                Browse Files
              </Button>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                <p className="text-sm font-medium">Selected Files:</p>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                    <div className="flex items-center">
                      {getFileIcon(file.name)}
                      <span className="text-sm truncate max-w-[250px]">{file.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeSelectedFile(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {isUploading && (
              <div className="space-y-2">
                <p className="text-sm">Uploading files...</p>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFileDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadFiles} disabled={selectedFiles.length === 0 || isUploading} className="gap-2">
              {isUploading ? "Uploading..." : "Upload Files"}
              {!isUploading && <Check className="h-4 w-4" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function MessageSquareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
      />
    </svg>
  )
}
