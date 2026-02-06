import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/stores/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, User, ArrowRight, Sparkles, ShieldCheck } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(email, password)
      navigate("/dashboard")
    } catch (err) {
      setError("Invalid email or password. Try one of the demo accounts:")
    } finally {
      setIsLoading(false)
    }
  }

  const demoAccounts = [
    {
      email: "john.doe@fmg.com",
      role: "End User",
      icon: User,
      color: "bg-blue-500/10 text-blue-600 border-blue-200",
      badgeVariant: "secondary" as const
    },
    {
      email: "jane.smith@fmg.com",
      role: "Manager",
      icon: Shield,
      color: "bg-purple-500/10 text-purple-600 border-purple-200",
      badgeVariant: "secondary" as const
    },
    {
      email: "alice.admin@fmg.com",
      role: "Super Admin",
      icon: ShieldCheck,
      color: "bg-red-500/10 text-red-600 border-red-200",
      badgeVariant: "destructive" as const
    },
    {
      email: "bob.auditor@fmg.com",
      role: "Audit Viewer",
      icon: Lock,
      color: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
      badgeVariant: "secondary" as const
    },
  ]

  const handleDemoLogin = async (email: string) => {
    setEmail(email)
    setPassword("demo")
    setError("")
    setIsLoading(true)

    try {
      await login(email, "demo")
      navigate("/dashboard")
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
        {/* Left side - Branding */}
        <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center justify-center lg:justify-start space-x-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-blue-500 blur-xl opacity-50 animate-pulse" />
              <div className="relative rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 p-4">
                <Shield className="h-10 w-10 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                FMG RBAC
              </h1>
              <p className="text-sm text-muted-foreground">Access Control System</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Secure Access Management
            </h2>
            <p className="text-lg text-muted-foreground">
              Enterprise-grade Role-Based Access Control system with Active Directory integration
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-4 rounded-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur">
              <div className="mt-1 rounded-full bg-blue-500/10 p-2">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Enterprise Security</h3>
                <p className="text-xs text-muted-foreground">Advanced role-based permissions</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 rounded-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur">
              <div className="mt-1 rounded-full bg-purple-500/10 p-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">AD Integration</h3>
                <p className="text-xs text-muted-foreground">Seamless user synchronization</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 rounded-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur">
              <div className="mt-1 rounded-full bg-indigo-500/10 p-2">
                <Lock className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Compliance Ready</h3>
                <p className="text-xs text-muted-foreground">SOX, GDPR, PCI-DSS compliant</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 rounded-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur">
              <div className="mt-1 rounded-full bg-green-500/10 p-2">
                <User className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">User Friendly</h3>
                <p className="text-xs text-muted-foreground">Intuitive interface design</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md shadow-2xl border-2">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Welcome Back</CardTitle>
                <Badge variant="outline" className="font-normal">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Demo
                </Badge>
              </div>
              <CardDescription>
                Sign in to access your account and manage permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@fmg.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground font-medium">
                    Quick Demo Access
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {demoAccounts.map((account) => {
                  const Icon = account.icon
                  return (
                    <button
                      key={account.email}
                      onClick={() => handleDemoLogin(account.email)}
                      disabled={isLoading}
                      className={`group relative flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${account.color}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="rounded-full bg-white/50 dark:bg-slate-900/50 p-2">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-sm">{account.email}</div>
                          <div className="text-xs opacity-70">{account.role}</div>
                        </div>
                      </div>
                      <Badge variant={account.badgeVariant} className="text-xs">
                        {account.role === "Super Admin" ? "Admin" : "User"}
                      </Badge>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-xs text-muted-foreground">
          This is a demonstration prototype. Use any password with demo accounts.
        </p>
      </div>
    </div>
  )
}
