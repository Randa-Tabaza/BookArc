import { useState } from "react";
import { BookMarked, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { GoogleLogo } from "./GoogleLogo";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";

interface LoginPageProps {
  onBack?: () => void;
  onLogin?: (userData: { username: string; email: string }) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  defaultTab?: "login" | "register";
}

export function LoginPage({ onBack, onLogin, theme, onToggleTheme, defaultTab = "login" }: LoginPageProps) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!loginEmail) {
      newErrors.loginEmail = "Email is required";
    } else if (!validateEmail(loginEmail)) {
      newErrors.loginEmail = "Please enter a valid email";
    }

    if (!loginPassword) {
      newErrors.loginPassword = "Password is required";
    } else if (!validatePassword(loginPassword)) {
      newErrors.loginPassword = "Password must be at least 8 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        console.log("Login successful", { email: loginEmail });
        setIsLoading(false);
        if (onLogin) {
          // Extract username from email (before @)
          const usernameFromEmail = loginEmail.split("@")[0].replace(/[._]/g, " ");
          const capitalizedUsername = usernameFromEmail
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          
          onLogin({
            username: capitalizedUsername,
            email: loginEmail
          });
        }
      }, 1500);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!registerEmail) {
      newErrors.registerEmail = "Email is required";
    } else if (!validateEmail(registerEmail)) {
      newErrors.registerEmail = "Please enter a valid email";
    }

    if (!registerUsername) {
      newErrors.registerUsername = "Username is required";
    } else if (registerUsername.length < 3) {
      newErrors.registerUsername = "Username must be at least 3 characters";
    }

    if (!registerPassword) {
      newErrors.registerPassword = "Password is required";
    } else if (!validatePassword(registerPassword)) {
      newErrors.registerPassword = "Password must be at least 8 characters";
    }

    if (!registerConfirmPassword) {
      newErrors.registerConfirmPassword = "Please confirm your password";
    } else if (registerPassword !== registerConfirmPassword) {
      newErrors.registerConfirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        console.log("Registration successful", { email: registerEmail, username: registerUsername });
        setIsLoading(false);
        if (onLogin) {
          onLogin({
            username: registerUsername,
            email: registerEmail
          });
        }
      }, 1500);
    }
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    // Simulate Google OAuth
    setTimeout(() => {
      console.log("Google sign-in initiated");
      setIsLoading(false);
      if (onLogin) {
        // Simulate Google user data
        onLogin({
          username: "Google User",
          email: "user@gmail.com"
        });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-b from-background via-background to-card">
      <div className="w-full max-w-md">
        {/* Top Bar with Back and Theme Toggle */}
        <div className="flex items-center justify-between mb-4">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          )}
          <div className={onBack ? "" : "ml-auto"}>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Logo className="w-10 h-10" />
          <span className="text-3xl">BookArc</span>
        </div>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Sign in to your BookArc account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Google Sign In */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <GoogleLogo className="w-5 h-5 mr-2" />
                  Continue with Google
                </Button>

                <div className="relative">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">
                    or
                  </span>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        className={`pl-10 ${errors.loginEmail ? 'border-red-500' : ''}`}
                        value={loginEmail}
                        onChange={(e) => {
                          setLoginEmail(e.target.value);
                          setErrors((prev) => ({ ...prev, loginEmail: "" }));
                        }}
                      />
                    </div>
                    {errors.loginEmail && (
                      <p className="text-sm text-red-500">{errors.loginEmail}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        className={`pl-10 ${errors.loginPassword ? 'border-red-500' : ''}`}
                        value={loginPassword}
                        onChange={(e) => {
                          setLoginPassword(e.target.value);
                          setErrors((prev) => ({ ...prev, loginPassword: "" }));
                        }}
                      />
                    </div>
                    {errors.loginPassword && (
                      <p className="text-sm text-red-500">{errors.loginPassword}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-end">
                    <a href="#forgot" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Join the BookArc community</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Google Sign In */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <GoogleLogo className="w-5 h-5 mr-2" />
                  Sign up with Google
                </Button>

                <div className="relative">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">
                    or
                  </span>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your@email.com"
                        className={`pl-10 ${errors.registerEmail ? 'border-red-500' : ''}`}
                        value={registerEmail}
                        onChange={(e) => {
                          setRegisterEmail(e.target.value);
                          setErrors((prev) => ({ ...prev, registerEmail: "" }));
                        }}
                      />
                    </div>
                    {errors.registerEmail && (
                      <p className="text-sm text-red-500">{errors.registerEmail}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-username"
                        type="text"
                        placeholder="bookworm42"
                        className={`pl-10 ${errors.registerUsername ? 'border-red-500' : ''}`}
                        value={registerUsername}
                        onChange={(e) => {
                          setRegisterUsername(e.target.value);
                          setErrors((prev) => ({ ...prev, registerUsername: "" }));
                        }}
                      />
                    </div>
                    {errors.registerUsername && (
                      <p className="text-sm text-red-500">{errors.registerUsername}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        className={`pl-10 ${errors.registerPassword ? 'border-red-500' : ''}`}
                        value={registerPassword}
                        onChange={(e) => {
                          setRegisterPassword(e.target.value);
                          setErrors((prev) => ({ ...prev, registerPassword: "" }));
                        }}
                      />
                    </div>
                    {errors.registerPassword && (
                      <p className="text-sm text-red-500">{errors.registerPassword}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="••••••••"
                        className={`pl-10 ${errors.registerConfirmPassword ? 'border-red-500' : ''}`}
                        value={registerConfirmPassword}
                        onChange={(e) => {
                          setRegisterConfirmPassword(e.target.value);
                          setErrors((prev) => ({ ...prev, registerConfirmPassword: "" }));
                        }}
                      />
                    </div>
                    {errors.registerConfirmPassword && (
                      <p className="text-sm text-red-500">{errors.registerConfirmPassword}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground text-center">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          Need help? <a href="#support" className="text-primary hover:underline">Contact Support</a>
        </p>
      </div>
    </div>
  );
}