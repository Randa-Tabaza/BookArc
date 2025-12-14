import { useState, useEffect } from "react";
import { BookMarked, TrendingUp, Eye, Star, MessageSquare, Upload, BarChart3, Bell, User, LogOut, Moon, Sun, Edit, Search, Book, Calendar, DollarSign, FileText, Users, Award, BadgeCheck, Settings, BookOpen, Plus, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";

interface AuthorDashboardProps {
  onLogout: () => void;
  onLogoClick: () => void;
  onViewNotifications?: () => void;
  onEditProfile?: () => void;
  onViewBookDetails?: (bookId: number) => void;
  currentAuthor?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function AuthorDashboard({ onLogout, onLogoClick, onViewNotifications, onEditProfile, onViewBookDetails, currentAuthor, theme, onToggleTheme }: AuthorDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [unreadNotifications] = useState(5);
  const [authorData, setAuthorData] = useState({
    name: "Author Name",
    email: "author@email.com",
    avatarUrl: ""
  });
  const [showAddBookDialog, setShowAddBookDialog] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    genre: "",
    publishDate: "",
    description: "",
    coverUrl: "",
    manuscriptUrl: ""
  });
  const [showEditBookDialog, setShowEditBookDialog] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);

  // Initialize authorBooks with mock data
  const [authorBooks, setAuthorBooks] = useState([
    {
      id: 1,
      title: "The Last Eclipse",
      cover: "https://images.unsplash.com/photo-1580831355254-7dc2eedf6d8e?w=400&h=600&fit=crop",
      genre: "Sci-Fi",
      publishDate: "2024-08-15",
      rating: 4.6,
      totalRatings: 2341,
      totalReviews: 487,
      views: 45230,
      reads: 12450,
      status: "Published",
      description: "A thrilling sci-fi adventure set in a distant future."
    },
    {
      id: 2,
      title: "Whispers in the Dark",
      cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
      genre: "Mystery",
      publishDate: "2024-03-22",
      rating: 4.4,
      totalRatings: 1892,
      totalReviews: 312,
      views: 38420,
      reads: 9830,
      status: "Published",
      description: "A gripping mystery that will keep you on the edge of your seat."
    },
    {
      id: 3,
      title: "Beyond the Horizon",
      cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
      genre: "Romance",
      publishDate: "2023-11-10",
      rating: 4.8,
      totalRatings: 3201,
      totalReviews: 645,
      views: 52340,
      reads: 15670,
      status: "Published",
      description: "A heartwarming romance that transcends boundaries."
    }
  ]);

  // Load author data and books from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("authorData");
    if (storedData) {
      const parsed = JSON.parse(storedData);
      setAuthorData({
        name: parsed.name || "Author Name",
        email: parsed.email || "author@email.com",
        avatarUrl: parsed.profilePicture || parsed.avatarUrl || ""
      });
    } else if (currentAuthor) {
      setAuthorData({
        name: currentAuthor.name,
        email: currentAuthor.email,
        avatarUrl: currentAuthor.avatarUrl || "",
      });
    }

    // Load author books from localStorage
    const storedBooks = localStorage.getItem("authorBooks");
    if (storedBooks) {
      try {
        const parsedBooks = JSON.parse(storedBooks);
        if (parsedBooks.length > 0) {
          setAuthorBooks(parsedBooks);
        }
      } catch (e) {
        console.error("Error loading books:", e);
      }
    }
  }, [currentAuthor]);

  const authorInitials = authorData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Mock reviews data
  const recentReviews = [
    {
      id: 1,
      bookId: 1,
      bookTitle: "The Last Eclipse",
      reader: "Sarah Mitchell",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      rating: 5,
      comment: "An absolute masterpiece! The world-building is incredible and the characters are so well-developed. Can't wait for the sequel!",
      date: "2024-10-28",
      sentiment: "positive",
      replies: []
    },
    {
      id: 2,
      bookId: 2,
      bookTitle: "Whispers in the Dark",
      reader: "Michael Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      rating: 5,
      comment: "The plot twists kept me on the edge of my seat. One of the best mysteries I've read this year!",
      date: "2024-10-27",
      sentiment: "positive",
      replies: [{
        author: true,
        text: "Thank you so much! I'm thrilled you enjoyed the twists!",
        date: "2024-10-27"
      }]
    },
    {
      id: 3,
      bookId: 1,
      bookTitle: "The Last Eclipse",
      reader: "Emma Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      rating: 4,
      comment: "Great story overall, though I felt the pacing in the middle could have been tighter. Still highly recommend!",
      date: "2024-10-26",
      sentiment: "neutral",
      replies: []
    },
    {
      id: 4,
      bookId: 3,
      bookTitle: "Beyond the Horizon",
      reader: "James Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      rating: 5,
      comment: "Adventure at its finest! The descriptions made me feel like I was right there with the characters.",
      date: "2024-10-25",
      sentiment: "positive",
      replies: []
    }
  ];

  // Analytics data
  const analyticsData = {
    totalViews: 156250,
    totalReads: 46200,
    totalRatings: 7800,
    avgRating: 4.6,
    viewsGrowth: "+24%",
    readsGrowth: "+18%",
    ratingsGrowth: "+32%",
    sentimentBreakdown: {
      positive: 78,
      neutral: 18,
      negative: 4
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <button 
            onClick={onLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <Logo className="w-6 h-6" />
            <span className="text-xl">BookArc</span>
          </button>

          {/* Right: Icons */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <Badge variant="outline" className="border-primary/40 text-primary hidden md:flex">
              Author
            </Badge>
            
            {/* Notifications */}
            {onViewNotifications && (
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={onViewNotifications}
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground"
                  >
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
            )}

            {/* Theme Toggle */}
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{authorData.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {authorData.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {onEditProfile && (
                  <DropdownMenuItem onClick={onEditProfile}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Edit Profile</span>
                  </DropdownMenuItem>
                )}
                {onViewNotifications && (
                  <DropdownMenuItem onClick={onViewNotifications}>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
                    {unreadNotifications > 0 && (
                      <Badge className="ml-auto bg-destructive text-destructive-foreground">
                        {unreadNotifications}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={onEditProfile}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Welcome back, {authorData.name.split(' ')[0]}!</h1>
          <p className="text-muted-foreground">Manage your books, track your performance, and engage with your readers.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="books" className="gap-2">
              <BookOpen className="w-4 h-4" />
              My Books
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Reviews
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Analytics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{analyticsData.totalViews.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-primary">{analyticsData.viewsGrowth}</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Total Reads</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{analyticsData.totalReads.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-primary">{analyticsData.readsGrowth}</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Total Ratings</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{analyticsData.totalRatings.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-primary">{analyticsData.ratingsGrowth}</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Average Rating</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{analyticsData.avgRating}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(analyticsData.avgRating) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sentiment Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Reader Sentiment Analysis</CardTitle>
                <CardDescription>Based on reviews and ratings across all your books</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4 text-primary" />
                      <span className="text-sm">Positive</span>
                    </div>
                    <span className="text-sm">{analyticsData.sentimentBreakdown.positive}%</span>
                  </div>
                  <Progress value={analyticsData.sentimentBreakdown.positive} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-muted-foreground" />
                      <span className="text-sm">Neutral</span>
                    </div>
                    <span className="text-sm">{analyticsData.sentimentBreakdown.neutral}%</span>
                  </div>
                  <Progress value={analyticsData.sentimentBreakdown.neutral} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ThumbsDown className="w-4 h-4 text-destructive" />
                      <span className="text-sm">Negative</span>
                    </div>
                    <span className="text-sm">{analyticsData.sentimentBreakdown.negative}%</span>
                  </div>
                  <Progress value={analyticsData.sentimentBreakdown.negative} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Books */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Books</CardTitle>
                <CardDescription>Your most popular books this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {authorBooks.slice(0, 3).map((book, index) => (
                    <div key={book.id} className="flex items-center gap-4">
                      <div className="text-2xl text-muted-foreground w-8">#{index + 1}</div>
                      <img src={book.cover} alt={book.title} className="w-12 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <div className="font-medium">{book.title}</div>
                        <div className="text-sm text-muted-foreground">{book.genre}</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-primary text-primary" />
                          <span className="font-medium">{book.rating}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{book.totalRatings.toLocaleString()} ratings</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Books Tab */}
          <TabsContent value="books" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl">My Books</h2>
                <p className="text-muted-foreground">Manage and track your published works</p>
              </div>
              <Dialog open={showAddBookDialog} onOpenChange={setShowAddBookDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Upload New Book
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Upload New Book</DialogTitle>
                    <DialogDescription>Add a new book to your author portfolio</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Book Title</Label>
                      <Input 
                        id="title" 
                        placeholder="Enter book title" 
                        value={newBook.title}
                        onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="genre">Genre</Label>
                        <Select value={newBook.genre} onValueChange={(value) => setNewBook({...newBook, genre: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select genre" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Fiction">Fiction</SelectItem>
                            <SelectItem value="Mystery">Mystery</SelectItem>
                            <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                            <SelectItem value="Romance">Romance</SelectItem>
                            <SelectItem value="Thriller">Thriller</SelectItem>
                            <SelectItem value="Fantasy">Fantasy</SelectItem>
                            <SelectItem value="Horror">Horror</SelectItem>
                            <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="publishDate">Publish Date</Label>
                        <Input 
                          id="publishDate" 
                          type="date" 
                          value={newBook.publishDate}
                          onChange={(e) => setNewBook({...newBook, publishDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Enter book description" 
                        rows={4}
                        value={newBook.description}
                        onChange={(e) => setNewBook({...newBook, description: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cover">Book Cover URL</Label>
                      <Input 
                        id="cover" 
                        placeholder="Enter book cover image URL"
                        value={newBook.coverUrl}
                        onChange={(e) => setNewBook({...newBook, coverUrl: e.target.value})}
                      />
                      <p className="text-xs text-muted-foreground">Paste an image URL (e.g., from Unsplash)</p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setShowAddBookDialog(false);
                      setNewBook({
                        title: "",
                        genre: "",
                        publishDate: "",
                        description: "",
                        coverUrl: "",
                        manuscriptUrl: ""
                      });
                    }}>Cancel</Button>
                    <Button onClick={() => {
                      // Validation
                      if (!newBook.title || !newBook.genre || !newBook.publishDate || !newBook.description) {
                        toast.error("Please fill in all required fields");
                        return;
                      }

                      // Create new book object
                      const bookToAdd = {
                        id: Date.now(),
                        title: newBook.title,
                        cover: newBook.coverUrl || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
                        genre: newBook.genre,
                        publishDate: newBook.publishDate,
                        rating: 0,
                        totalRatings: 0,
                        totalReviews: 0,
                        views: 0,
                        reads: 0,
                        status: "Published",
                        description: newBook.description,
                        author: authorData.name
                      };

                      // Add to state
                      const updatedBooks = [...authorBooks, bookToAdd];
                      setAuthorBooks(updatedBooks);

                      // Save to localStorage
                      localStorage.setItem("authorBooks", JSON.stringify(updatedBooks));

                      // Reset form
                      setNewBook({
                        title: "",
                        genre: "",
                        publishDate: "",
                        description: "",
                        coverUrl: "",
                        manuscriptUrl: ""
                      });

                      // Close dialog
                      setShowAddBookDialog(false);

                      // Show success message
                      toast.success("Book added successfully!");
                    }}>Upload Book</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Edit Book Dialog */}
              <Dialog open={showEditBookDialog} onOpenChange={setShowEditBookDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Book</DialogTitle>
                    <DialogDescription>Update your book information</DialogDescription>
                  </DialogHeader>
                  {editingBook && (
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-title">Book Title</Label>
                        <Input 
                          id="edit-title" 
                          placeholder="Enter book title" 
                          value={editingBook.title}
                          onChange={(e) => setEditingBook({...editingBook, title: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-genre">Genre</Label>
                          <Select value={editingBook.genre} onValueChange={(value) => setEditingBook({...editingBook, genre: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select genre" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Fiction">Fiction</SelectItem>
                              <SelectItem value="Mystery">Mystery</SelectItem>
                              <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                              <SelectItem value="Romance">Romance</SelectItem>
                              <SelectItem value="Thriller">Thriller</SelectItem>
                              <SelectItem value="Fantasy">Fantasy</SelectItem>
                              <SelectItem value="Horror">Horror</SelectItem>
                              <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-publishDate">Publish Date</Label>
                          <Input 
                            id="edit-publishDate" 
                            type="date" 
                            value={editingBook.publishDate}
                            onChange={(e) => setEditingBook({...editingBook, publishDate: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea 
                          id="edit-description" 
                          placeholder="Enter book description" 
                          rows={4}
                          value={editingBook.description}
                          onChange={(e) => setEditingBook({...editingBook, description: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-cover">Book Cover URL</Label>
                        <Input 
                          id="edit-cover" 
                          placeholder="Enter book cover image URL"
                          value={editingBook.cover}
                          onChange={(e) => setEditingBook({...editingBook, cover: e.target.value})}
                        />
                        <p className="text-xs text-muted-foreground">Paste an image URL (e.g., from Unsplash)</p>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setShowEditBookDialog(false);
                      setEditingBook(null);
                    }}>Cancel</Button>
                    <Button onClick={() => {
                      if (!editingBook) return;

                      // Validation
                      if (!editingBook.title || !editingBook.genre || !editingBook.publishDate || !editingBook.description) {
                        toast.error("Please fill in all required fields");
                        return;
                      }

                      // Update book in state
                      const updatedBooks = authorBooks.map(book => 
                        book.id === editingBook.id ? editingBook : book
                      );
                      setAuthorBooks(updatedBooks);

                      // Save to localStorage
                      localStorage.setItem("authorBooks", JSON.stringify(updatedBooks));

                      // Close dialog
                      setShowEditBookDialog(false);
                      setEditingBook(null);

                      // Show success message
                      toast.success("Book updated successfully!");
                    }}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {authorBooks.map((book) => (
                <Card key={book.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                    <Badge className="absolute top-2 right-2 bg-primary/90">
                      {book.status}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle>{book.title}</CardTitle>
                    <CardDescription>{book.genre} • Published {new Date(book.publishDate).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Rating</div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 fill-primary text-primary" />
                          <span className="font-medium">{book.rating}</span>
                          <span className="text-muted-foreground">({book.totalRatings})</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Reviews</div>
                        <div className="font-medium mt-1">{book.totalReviews}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Views</div>
                        <div className="font-medium mt-1">{book.views.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Reads</div>
                        <div className="font-medium mt-1">{book.reads.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 gap-2"
                        onClick={() => {
                          setEditingBook(book);
                          setShowEditBookDialog(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => onViewBookDetails?.(book.id)}>
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div>
              <h2 className="text-2xl mb-1">All Reviews</h2>
              <p className="text-muted-foreground">See what readers are saying about your books</p>
            </div>

            <div className="space-y-4">
              {recentReviews
                .filter(review => authorBooks.some(book => book.id === review.bookId))
                .map((review) => (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.avatar} />
                          <AvatarFallback>{review.reader[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{review.reader}</div>
                          <div className="text-sm text-muted-foreground">{review.bookTitle}</div>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{review.comment}</p>
                    
                    {review.replies.length > 0 && (
                      <div className="space-y-2 mb-4 pl-4 border-l-2 border-border">
                        {review.replies.map((reply, idx) => (
                          <div key={idx} className="flex gap-2">
                            <Badge variant="outline" className="h-fit">Author</Badge>
                            <div className="flex-1">
                              <p className="text-sm">{reply.text}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(reply.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={review.sentiment === 'positive' ? 'default' : review.sentiment === 'negative' ? 'destructive' : 'secondary'}
                        className="capitalize"
                      >
                        {review.sentiment === 'positive' && <ThumbsUp className="w-3 h-3 mr-1" />}
                        {review.sentiment === 'negative' && <ThumbsDown className="w-3 h-3 mr-1" />}
                        {review.sentiment}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}