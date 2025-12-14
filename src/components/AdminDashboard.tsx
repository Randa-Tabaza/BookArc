import { useState } from "react";
import { User, LayoutDashboard, LogOut, Users, BookOpen, FileText, Database, Search, FileUp, CheckCircle, XCircle, Shield, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";

interface AdminDashboardProps {
  currentUser: {
    name: string;
    email: string;
    avatarUrl?: string;
    isAdmin: boolean;
  };
  onNavigateToProfile: () => void;
  onNavigateToAdminReports: () => void;
  onLogout: () => void;
}

export function AdminDashboard({ currentUser, onNavigateToProfile, onNavigateToAdminReports, onLogout }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<"overview" | "users" | "authors" | "books" | "reports" | "api">("overview");

  // Mock data for statistics
  const stats = {
    totalUsers: 15234,
    totalAuthors: 892,
    totalBooks: 45678,
    pendingReports: 23,
  };

  // Mock data for reports
  const recentReports = [
    { id: "1", type: "Book", target: "The Great Gatsby", reporter: "john_doe", reason: "Inappropriate content", details: "Contains offensive language", date: "2024-10-28", status: "pending" },
    { id: "2", type: "Review", target: "Review by jane_smith", reporter: "mark_wilson", reason: "Spam", details: "Promotional content", date: "2024-10-27", status: "resolved" },
    { id: "3", type: "Author", target: "Stephen King", reporter: "alice_jones", reason: "Impersonation", details: "Fake author profile", date: "2024-10-26", status: "pending" },
  ];

  const onResolveReport = (reportId: string) => {
    console.log("Resolving report:", reportId);
  };

  const onDismissReport = (reportId: string) => {
    console.log("Dismissing report:", reportId);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card p-6">
        <div className="flex flex-col h-full">
          {/* Profile Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Avatar className="w-12 h-12">
                <AvatarImage src={currentUser.avatarUrl} />
                <AvatarFallback className="bg-primary/10">
                  <User className="w-6 h-6 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="truncate">{currentUser.name}</p>
                <p className="text-sm text-muted-foreground truncate">{currentUser.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            <button
              onClick={onNavigateToProfile}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-accent/10 hover:text-primary transition-colors text-left"
            >
              <User className="w-5 h-5" />
              Profile
            </button>
            <button
              onClick={onNavigateToAdminReports}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-accent/10 hover:text-primary transition-colors text-left"
            >
              <LayoutDashboard className="w-5 h-5" />
              Admin Dashboard
            </button>
          </nav>

          {/* Logout Button */}
          <div className="pt-4 border-t border-border">
            <button
              onClick={onLogout}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-accent/10 hover:text-destructive transition-colors text-left"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Section Navigation */}
          <div className="mb-8">
            <h1 className="text-3xl mb-6">Admin Dashboard</h1>
            <div className="flex gap-2 border-b border-border">
              <button
                onClick={() => setActiveSection("overview")}
                className={`px-4 py-2 border-b-2 transition-colors ${
                  activeSection === "overview"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveSection("users")}
                className={`px-4 py-2 border-b-2 transition-colors ${
                  activeSection === "users"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveSection("authors")}
                className={`px-4 py-2 border-b-2 transition-colors ${
                  activeSection === "authors"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Authors
              </button>
              <button
                onClick={() => setActiveSection("books")}
                className={`px-4 py-2 border-b-2 transition-colors ${
                  activeSection === "books"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Books
              </button>
              <button
                onClick={() => setActiveSection("reports")}
                className={`px-4 py-2 border-b-2 transition-colors ${
                  activeSection === "reports"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Reports
              </button>
              <button
                onClick={() => setActiveSection("api")}
                className={`px-4 py-2 border-b-2 transition-colors ${
                  activeSection === "api"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                API Import
              </button>
            </div>
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm">Total Users</CardTitle>
                    <Users className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl">{stats.totalUsers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                      +12% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm">Total Authors</CardTitle>
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl">{stats.totalAuthors.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                      +8% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm">Total Books</CardTitle>
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl">{stats.totalBooks.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                      +15% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm">Pending Reports</CardTitle>
                    <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl">{stats.pendingReports}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Requires attention
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                  <CardDescription>Latest reports that need review</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Reporter</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentReports.slice(0, 5).map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>
                            <Badge variant="outline">{report.type}</Badge>
                          </TableCell>
                          <TableCell>{report.target}</TableCell>
                          <TableCell>{report.reporter}</TableCell>
                          <TableCell>{report.reason}</TableCell>
                          <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={report.status === "pending" ? "secondary" : "default"}>
                              {report.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Users Section */}
          {activeSection === "users" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl mb-2">User Management</h1>
                <p className="text-muted-foreground">Manage registered users and their accounts</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>View and manage user accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Input placeholder="Search users..." className="max-w-sm" />
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>John Doe</TableCell>
                        <TableCell>john@example.com</TableCell>
                        <TableCell>2024-01-15</TableCell>
                        <TableCell>
                          <Badge variant="default">Active</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Jane Smith</TableCell>
                        <TableCell>jane@example.com</TableCell>
                        <TableCell>2024-02-20</TableCell>
                        <TableCell>
                          <Badge variant="default">Active</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Authors Section */}
          {activeSection === "authors" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl mb-2">Author Management</h1>
                <p className="text-muted-foreground">Manage authors and verification requests</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Authors</CardTitle>
                  <CardDescription>View and manage author accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Input placeholder="Search authors..." className="max-w-sm" />
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Books</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Stephen King</TableCell>
                        <TableCell>stephen@example.com</TableCell>
                        <TableCell>67</TableCell>
                        <TableCell>
                          <Badge variant="default">Verified</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>J.K. Rowling</TableCell>
                        <TableCell>jk@example.com</TableCell>
                        <TableCell>14</TableCell>
                        <TableCell>
                          <Badge variant="default">Verified</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Books Section */}
          {activeSection === "books" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl mb-2">Book Management</h1>
                <p className="text-muted-foreground">Manage books and their content</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Books</CardTitle>
                  <CardDescription>View and manage books in the database</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Input placeholder="Search books..." className="max-w-sm" />
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Genre</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>The Great Gatsby</TableCell>
                        <TableCell>F. Scott Fitzgerald</TableCell>
                        <TableCell>Classic</TableCell>
                        <TableCell>4.5</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>1984</TableCell>
                        <TableCell>George Orwell</TableCell>
                        <TableCell>Dystopian</TableCell>
                        <TableCell>4.7</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Reports Section */}
          {activeSection === "reports" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl mb-2">Reports Management</h1>
                <p className="text-muted-foreground">Review and manage user reports</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Reports</CardTitle>
                  <CardDescription>Review reports from users</CardDescription>
                </CardHeader>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <Badge variant="outline">{report.type}</Badge>
                        </TableCell>
                        <TableCell>{report.target}</TableCell>
                        <TableCell>{report.reporter}</TableCell>
                        <TableCell>
                          <div>
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
