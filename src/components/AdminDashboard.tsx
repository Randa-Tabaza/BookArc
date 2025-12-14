import { useState } from "react";
import { BookMarked, Users, BookOpen, Flag, Database, BarChart3, AlertTriangle, CheckCircle, XCircle, Eye, Trash2, FileUp, Search, Shield, TrendingUp, UserCheck, UserX, LineChart } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";

interface AdminDashboardProps {
  onLogout: () => void;
  onLogoClick: () => void;
  onViewReports?: () => void;
  onViewAuthorProfile?: (authorId: number) => void;
  onViewBookDetails?: (bookId: number) => void;
  pendingVerificationRequests?: Array<{
    id: number;
    userId: number;
    userName: string;
    userEmail: string;
    fullName: string;
    idCardPreview: string;
    selfiePreview: string;
    submittedDate: string;
    status: "pending" | "approved" | "rejected";
  }>;
  onHandleVerification?: (requestId: number, approved: boolean) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  reports?: Array<{
    id: number;
    type: "User Report" | "Author Report" | "Review Report" | "Book Report";
    reporter: string;
    reported: string;
    reason: string;
    details?: string;
    date: string;
    status: "pending" | "resolved" | "dismissed";
  }>;
  onResolveReport?: (reportId: number) => void;
  onDismissReport?: (reportId: number) => void;
}

export function AdminDashboard({ onLogout, onLogoClick, onViewReports, onViewAuthorProfile, onViewBookDetails, pendingVerificationRequests = [], onHandleVerification, theme, onToggleTheme, reports = [], onResolveReport, onDismissReport }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);

  // Mock data for system metrics
  const systemMetrics = {
    totalUsers: 45230,
    totalAuthors: 3892,
    totalBooks: 12450,
    totalReviews: 87654,
    activeUsers: 12340,
    flaggedReviews: 23,
    pendingReports: reports.filter(r => r.status === "pending").length,
    userGrowth: "+18%",
    authorGrowth: "+24%",
    bookGrowth: "+32%",
    storageUsed: 68,
    bandwidthUsed: 45
  };

  // Mock data for users with state management
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      status: "active",
      joinDate: "2024-03-15",
      booksRead: 45,
      reviewsWritten: 28
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "m.chen@email.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      status: "active",
      joinDate: "2024-05-20",
      booksRead: 32,
      reviewsWritten: 19
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      email: "emma.r@email.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      status: "suspended",
      joinDate: "2024-02-10",
      booksRead: 78,
      reviewsWritten: 54
    },
    {
      id: 4,
      name: "James Wilson",
      email: "j.wilson@email.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      status: "active",
      joinDate: "2024-06-05",
      booksRead: 23,
      reviewsWritten: 12
    }
  ]);

  // Mock data for authors with state management
  const [authors, setAuthors] = useState([
    {
      id: 1,
      name: "Alexandra Sterling",
      email: "a.sterling@authors.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexandra",
      verified: true,
      status: "active",
      books: 5,
      totalRatings: 7800,
      avgRating: 4.6,
      joinDate: "2023-08-15"
    },
    {
      id: 2,
      name: "Marcus Wright",
      email: "m.wright@authors.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
      verified: true,
      status: "active",
      books: 3,
      totalRatings: 5420,
      avgRating: 4.8,
      joinDate: "2023-11-20"
    },
    {
      id: 3,
      name: "Sophia Anderson",
      email: "s.anderson@authors.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
      verified: false,
      status: "active",
      books: 2,
      totalRatings: 1230,
      avgRating: 4.2,
      joinDate: "2024-03-10"
    }
  ]);

  // Add approved authors from verification requests
  const approvedAuthors = pendingVerificationRequests
    .filter(request => request.status === "approved")
    .map(request => ({
      id: request.userId,
      name: request.fullName,
      email: request.userEmail,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${request.fullName}`,
      verified: true,
      status: "active" as const,
      books: 0,
      totalRatings: 0,
      avgRating: 0,
      joinDate: new Date(request.submittedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }));

  // Combine mock authors with approved authors
  const allAuthors = [...authors, ...approvedAuthors];

  // Mock data for books with state management
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "The Last Eclipse",
      author: "Alexandra Sterling",
      cover: "https://images.unsplash.com/photo-1580831355254-7dc2eedf6d8e?w=400&h=600&fit=crop",
      genre: "Sci-Fi",
      status: "published",
      rating: 4.6,
      reviews: 487,
      publishDate: "2024-08-15"
    },
    {
      id: 2,
      title: "Whispers in the Dark",
      author: "Marcus Wright",
      cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
      genre: "Mystery",
      status: "published",
      rating: 4.8,
      reviews: 762,
      publishDate: "2024-06-20"
    },
    {
      id: 3,
      title: "Beyond the Horizon",
      author: "Sophia Anderson",
      cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
      genre: "Adventure",
      status: "pending",
      rating: 4.4,
      reviews: 312,
      publishDate: "2024-10-28"
    }
  ]);

  // Mock data for flagged reviews with state management
  const [flaggedReviews, setFlaggedReviews] = useState([
    {
      id: 1,
      bookId: 1,
      bookTitle: "The Last Eclipse",
      reviewer: "John Doe",
      reviewerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      content: "This book contains inappropriate content that violates community guidelines. I found several sections offensive and misleading.",
      reason: "Spam/Inappropriate",
      flaggedBy: "Sarah Johnson",
      flagDate: "2024-10-28",
      status: "pending"
    },
    {
      id: 2,
      bookId: 2,
      bookTitle: "Whispers in the Dark",
      reviewer: "Jane Smith",
      reviewerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      content: "Terrible book! Don't waste your money. The author clearly has no idea what they're doing!!!",
      reason: "Harassment",
      flaggedBy: "Michael Chen",
      flagDate: "2024-10-27",
      status: "pending"
    },
    {
      id: 3,
      bookId: 3,
      bookTitle: "Beyond the Horizon",
      reviewer: "Bob Wilson",
      reviewerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
      content: "Check out my blog for real book reviews! www.fake-reviews.com - I review all the latest releases!",
      reason: "Spam/Promotional",
      flaggedBy: "Emma Rodriguez",
      flagDate: "2024-10-26",
      status: "pending"
    }
  ]);

  // Reports are now passed as props

  const handleApproveReview = (reviewId: number) => {
    setFlaggedReviews(flaggedReviews.filter(r => r.id !== reviewId));
    toast.success("Review approved and restored");
  };

  const handleRejectReview = (reviewId: number) => {
    setFlaggedReviews(flaggedReviews.filter(r => r.id !== reviewId));
    toast.success("Review removed successfully");
  };

  const handleSuspendUser = (userId: number) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === "active" ? "suspended" : "active" }
        : u
    ));
    const user = users.find(u => u.id === userId);
    if (user) {
      if (user.status === "active") {
        toast.success(`User ${user.name} has been suspended`);
      } else {
        toast.success(`User ${user.name} has been reactivated`);
      }
    }
  };

  const handleSuspendAuthor = (authorId: number) => {
    setAuthors(authors.map(a => 
      a.id === authorId 
        ? { ...a, status: a.status === "active" ? "suspended" : "active" }
        : a
    ));
    const author = authors.find(a => a.id === authorId);
    if (author) {
      if (author.status === "active") {
        toast.success(`Author ${author.name} has been suspended`);
      } else {
        toast.success(`Author ${author.name} has been reactivated`);
      }
    }
  };

  const handleDeleteBook = (bookId: number) => {
    const book = books.find(b => b.id === bookId);
    if (book) {
      setBooks(books.filter(b => b.id !== bookId));
      toast.success(`"${book.title}" has been removed from the platform`);
    }
  };

  const handleViewBookFromReview = (bookId: number) => {
    setSelectedBookId(bookId);
    setActiveSection("books");
    toast.info("Navigated to Manage Books - Book highlighted");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-sm sticky top-0 h-screen flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <button 
            onClick={onLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <Logo className="w-6 h-6" />
            <span className="text-xl">BookArc</span>
          </button>
          <Badge variant="outline" className="border-primary/40 text-primary flex-shrink-0">
            <Shield className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveSection("overview")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              activeSection === "overview"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveSection("users")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              activeSection === "users"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Manage Users</span>
          </button>

          <button
            onClick={() => setActiveSection("authors")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              activeSection === "authors"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            <UserCheck className="w-5 h-5" />
            <span>Manage Authors</span>
          </button>

          <button
            onClick={() => setActiveSection("author-verifications")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              activeSection === "author-verifications"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            <Shield className="w-5 h-5" />
            <span>Author Verifications</span>
            {pendingVerificationRequests.filter(r => r.status === "pending").length > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {pendingVerificationRequests.filter(r => r.status === "pending").length}
              </Badge>
            )}
          </button>

          <button
            onClick={() => setActiveSection("books")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              activeSection === "books"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Manage Books</span>
          </button>

          <button
            onClick={() => setActiveSection("flagged")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              activeSection === "flagged"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            <Flag className="w-5 h-5" />
            <span>Flagged Reviews</span>
            {flaggedReviews.length > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {flaggedReviews.length}
              </Badge>
            )}
          </button>

          <button
            onClick={() => setActiveSection("reports")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              activeSection === "reports"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
            <span>Reports</span>
            {reports.filter(r => r.status === "pending").length > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {reports.filter(r => r.status === "pending").length}
              </Badge>
            )}
          </button>

          <button
            onClick={onViewReports}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-accent"
          >
            <LineChart className="w-5 h-5" />
            <span>Analytics & Reports</span>
          </button>

          <button
            onClick={() => setActiveSection("api")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              activeSection === "api"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            <Database className="w-5 h-5" />
            <span>API Import</span>
          </button>
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-8">
          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl mb-2">System Overview</h1>
                <p className="text-muted-foreground">Monitor platform performance and key metrics</p>
              </div>

              {/* Metrics Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl">{systemMetrics.totalUsers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-primary">{systemMetrics.userGrowth}</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm">Total Authors</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl">{systemMetrics.totalAuthors.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-primary">{systemMetrics.authorGrowth}</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm">Total Books</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl">{systemMetrics.totalBooks.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-primary">{systemMetrics.bookGrowth}</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm">Total Reviews</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl">{systemMetrics.totalReviews.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Active engagement
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Alerts and System Health */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Health</CardTitle>
                    <CardDescription>System status and alerts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Active Users (24h)</span>
                        <span className="text-sm">{systemMetrics.activeUsers.toLocaleString()}</span>
                      </div>
                    </div>

                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>{systemMetrics.flaggedReviews}</strong> flagged reviews pending review
                      </AlertDescription>
                    </Alert>

                    <Alert>
                      <Flag className="h-4 w-4" />
                      <AlertDescription>
                        <strong>{systemMetrics.pendingReports}</strong> reports pending investigation
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Resource Usage</CardTitle>
                    <CardDescription>Server and storage metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Storage Used</span>
                        <span className="text-sm">{systemMetrics.storageUsed}%</span>
                      </div>
                      <Progress value={systemMetrics.storageUsed} className="h-2" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Bandwidth Used</span>
                        <span className="text-sm">{systemMetrics.bandwidthUsed}%</span>
                      </div>
                      <Progress value={systemMetrics.bandwidthUsed} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest platform events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm">New author registered: <strong>Marcus Wright</strong></p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm">Book published: <strong>The Last Eclipse</strong></p>
                        <p className="text-xs text-muted-foreground">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-destructive rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm">Review flagged for spam</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Manage Users Section */}
          {activeSection === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl mb-2">Manage Users</h1>
                  <p className="text-muted-foreground">View and manage platform users</p>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Books Read</TableHead>
                      <TableHead>Reviews</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "default" : "destructive"}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell>{user.booksRead}</TableCell>
                        <TableCell>{user.reviewsWritten}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSuspendUser(user.id)}
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {/* Manage Authors Section */}
          {activeSection === "authors" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl mb-2">Manage Authors</h1>
                  <p className="text-muted-foreground">View and manage content creators</p>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search authors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Author</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Books</TableHead>
                      <TableHead>Avg Rating</TableHead>
                      <TableHead>Total Ratings</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allAuthors.map((author) => (
                      <TableRow key={author.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={author.avatar} />
                              <AvatarFallback>{author.name[0]}</AvatarFallback>
                            </Avatar>
                            <span>{author.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{author.email}</TableCell>
                        <TableCell>
                          <Badge variant={author.verified ? "default" : "secondary"}>
                            {author.verified ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </>
                            ) : (
                              "Unverified"
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={author.status === "active" ? "default" : "destructive"}>
                            {author.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{author.books}</TableCell>
                        <TableCell>{author.avgRating}</TableCell>
                        <TableCell>{author.totalRatings.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => onViewAuthorProfile?.(author.id)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSuspendAuthor(author.id)}
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {/* Author Verifications Section */}
          {activeSection === "author-verifications" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl mb-2">Author Verifications</h1>
                <p className="text-muted-foreground">Review and verify author identities</p>
              </div>

              {pendingVerificationRequests.filter(r => r.status === "pending").length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <CheckCircle className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">No Pending Verifications</p>
                    <p className="text-sm text-muted-foreground">All verification requests have been reviewed.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {pendingVerificationRequests
                    .filter(r => r.status === "pending")
                    .map((request) => (
                      <Card key={request.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarFallback>{request.userName[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{request.userName}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {request.userEmail}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Badge variant="secondary">
                              Submitted: {new Date(request.submittedDate).toLocaleDateString()}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Full Name */}
                          <div className="space-y-2">
                            <Label className="text-sm">Full Name Submitted</Label>
                            <div className="p-3 bg-muted/50 rounded-md">
                              <p className="font-medium">{request.fullName}</p>
                            </div>
                          </div>

                          {/* Document Previews */}
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* ID Card Preview */}
                            <div className="space-y-2">
                              <Label className="text-sm flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                ID Card / Government-Issued ID
                              </Label>
                              <div className="border border-border rounded-lg overflow-hidden">
                                <img
                                  src={request.idCardPreview}
                                  alt="ID Card"
                                  className="w-full h-64 object-cover"
                                />
                              </div>
                            </div>

                            {/* Selfie Preview */}
                            <div className="space-y-2">
                              <Label className="text-sm flex items-center gap-2">
                                <UserCheck className="w-4 h-4" />
                                Selfie Photo
                              </Label>
                              <div className="border border-border rounded-lg overflow-hidden">
                                <img
                                  src={request.selfiePreview}
                                  alt="Selfie"
                                  className="w-full h-64 object-cover"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 pt-4 border-t border-border">
                            <Button
                              onClick={() => onHandleVerification?.(request.id, true)}
                              className="gap-2 flex-1"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve Verification
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => onHandleVerification?.(request.id, false)}
                              className="gap-2 flex-1"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject Verification
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Manage Books Section */}
          {activeSection === "books" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl mb-2">Manage Books</h1>
                  <p className="text-muted-foreground">View and moderate book content</p>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search books..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {books.map((book) => (
                  <Card key={book.id}>
                    <div className="relative h-48">
                      <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                      <Badge className="absolute top-2 right-2" variant={book.status === "published" ? "default" : "secondary"}>
                        {book.status}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{book.title}</CardTitle>
                      <CardDescription>{book.author}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-muted-foreground">Genre</div>
                          <div>{book.genre}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Rating</div>
                          <div>{book.rating} ⭐</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Reviews</div>
                          <div>{book.reviews}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Published</div>
                          <div>{new Date(book.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => onViewBookDetails?.(book.id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteBook(book.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Flagged Reviews Section */}
          {activeSection === "flagged" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl mb-2">Flagged Reviews</h1>
                <p className="text-muted-foreground">Review and moderate flagged content</p>
              </div>

              <div className="space-y-4">
                {flaggedReviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={review.reviewerAvatar} />
                              <AvatarFallback>{review.reviewer[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{review.reviewer}</div>
                              <div className="text-sm text-muted-foreground">
                                Review on:{" "}
                                <button 
                                  onClick={() => handleViewBookFromReview(review.bookId)}
                                  className="text-primary hover:underline cursor-pointer"
                                >
                                  {review.bookTitle}
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="destructive">{review.reason}</Badge>
                            <Badge variant="outline">Flagged by: {review.flaggedBy}</Badge>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(review.flagDate).toLocaleDateString()}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm">{review.content}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleApproveReview(review.id)}
                          className="gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve Review
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRejectReview(review.id)}
                          className="gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Remove Review
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleViewBookFromReview(review.bookId)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Full Context
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Reports Section */}
          {activeSection === "reports" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl mb-2">Reports</h1>
                <p className="text-muted-foreground">Investigate user and content reports</p>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Reported</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No reports submitted yet
                        </TableCell>
                      </TableRow>
                    )}
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <Badge variant="outline">{report.type}</Badge>
                        </TableCell>
                        <TableCell>{report.reporter}</TableCell>
                        <TableCell>{report.reported}</TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="font-medium">{report.reason}</p>
                            {report.details && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {report.details}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={report.status === "pending" ? "secondary" : "default"}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {report.status === "pending" && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    if (onResolveReport) {
                                      onResolveReport(report.id);
                                    }
                                  }}
                                >
                                  Resolve
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    if (onDismissReport) {
                                      onDismissReport(report.id);
                                    }
                                  }}
                                >
                                  Dismiss
                                </Button>
                              </>
                            )}
                            {report.status !== "pending" && (
                              <span className="text-sm text-muted-foreground">
                                {report.status === "resolved" ? "Resolved" : "Dismissed"}
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {/* API Import Section */}
          {activeSection === "api" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl mb-2">API Import</h1>
                <p className="text-muted-foreground">Import book data from external sources</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Import from External APIs</CardTitle>
                    <CardDescription>Connect to book databases and import metadata</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Tabs defaultValue="google">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="google">Google Books</TabsTrigger>
                        <TabsTrigger value="openlibrary">Open Library</TabsTrigger>
                        <TabsTrigger value="goodreads">Goodreads</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="google" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="isbn-google">ISBN or Book Title</Label>
                          <Input id="isbn-google" placeholder="Enter ISBN or search query" />
                        </div>
                        <Button className="w-full gap-2">
                          <Search className="w-4 h-4" />
                          Search Google Books API
                        </Button>
                      </TabsContent>

                      <TabsContent value="openlibrary" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="isbn-openlibrary">ISBN or Book Title</Label>
                          <Input id="isbn-openlibrary" placeholder="Enter ISBN or search query" />
                        </div>
                        <Button className="w-full gap-2">
                          <Search className="w-4 h-4" />
                          Search Open Library API
                        </Button>
                      </TabsContent>

                      <TabsContent value="goodreads" className="space-y-4">
                        <Alert>
                          <AlertDescription>
                            Goodreads API requires authentication. Configure API keys in settings.
                          </AlertDescription>
                        </Alert>
                        <div className="space-y-2">
                          <Label htmlFor="isbn-goodreads">ISBN or Book Title</Label>
                          <Input id="isbn-goodreads" placeholder="Enter ISBN or search query" />
                        </div>
                        <Button className="w-full gap-2" disabled>
                          <Search className="w-4 h-4" />
                          Search Goodreads API
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Bulk Import</CardTitle>
                    <CardDescription>Upload CSV or JSON file with book data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <FileUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Drop your CSV or JSON file here, or click to browse
                      </p>
                      <Input type="file" accept=".csv,.json" className="max-w-xs mx-auto" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Import Format</Label>
                      <Select defaultValue="csv">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="csv">CSV Format</SelectItem>
                          <SelectItem value="json">JSON Format</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="w-full gap-2">
                      <Database className="w-4 h-4" />
                      Start Import
                    </Button>

                    <Alert>
                      <AlertDescription>
                        Supported fields: Title, Author, ISBN, Genre, Description, Cover URL
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Imports */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Imports</CardTitle>
                  <CardDescription>History of API imports and bulk uploads</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source</TableHead>
                        <TableHead>Books Imported</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Google Books API</TableCell>
                        <TableCell>245 books</TableCell>
                        <TableCell>
                          <Badge variant="default">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Success
                          </Badge>
                        </TableCell>
                        <TableCell>2024-10-27</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>CSV Bulk Upload</TableCell>
                        <TableCell>1,203 books</TableCell>
                        <TableCell>
                          <Badge variant="default">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Success
                          </Badge>
                        </TableCell>
                        <TableCell>2024-10-25</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Open Library API</TableCell>
                        <TableCell>89 books</TableCell>
                        <TableCell>
                          <Badge variant="destructive">
                            <XCircle className="w-3 h-3 mr-1" />
                            Failed
                          </Badge>
                        </TableCell>
                        <TableCell>2024-10-24</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}