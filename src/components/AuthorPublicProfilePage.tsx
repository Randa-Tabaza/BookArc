import { useState } from "react";
import { ArrowLeft, BookMarked, Star, Users, BookOpen, TrendingUp, Award, MapPin, Link as LinkIcon, Twitter, Instagram, Facebook, Mail, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { ThemeToggle } from "./ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BookCard } from "./BookCard";
import { Book } from "./BrowseBooksPage";
import { ReportDialog } from "./ReportDialog";
import { WriteReviewDialog } from "./WriteReviewDialog";
import { toast } from "sonner";

export interface AuthorReview {
  id: string;
  reader: string;
  rating: number;
  book?: string;
  comment: string;
  date: string;
  avatarSeed: string;
}

export interface Author {
  id: number;
  name: string;
  penName?: string;
  email?: string;
  avatarUrl: string;
  bio: string;
  website?: string;
  location?: string;
  joinDate: string;
  verified: boolean;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  stats: {
    totalBooks: number;
    totalReads: number;
    totalRatings: number;
    avgRating: number;
    followers: number;
  };
  books: Book[];
  reviews?: AuthorReview[];
}

interface AuthorPublicProfilePageProps {
  author: Author;
  onBack: () => void;
  onLogoClick?: () => void;
  onBookSelect?: (book: Book) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  isUserLoggedIn: boolean;
  onLoginRequired?: () => void;
  onReportSubmit?: (reportType: "user" | "author" | "review" | "book", targetName: string, reason: string, details?: string) => void;
  isFollowing?: boolean;
  onFollowAuthor?: (author: Author) => void;
  onUnfollowAuthor?: (authorId: number) => void;
}

export function AuthorPublicProfilePage({ 
  author, 
  onBack, 
  onLogoClick, 
  onBookSelect,
  theme, 
  onToggleTheme,
  isUserLoggedIn,
  onLoginRequired,
  onReportSubmit,
  isFollowing = false,
  onFollowAuthor,
  onUnfollowAuthor
}: AuthorPublicProfilePageProps) {
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [booksPerPage] = useState(4);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState(false);
  const [userReviewId, setUserReviewId] = useState<string | null>(null);
  const [authorReviews, setAuthorReviews] = useState<AuthorReview[]>(
    author.reviews || [
      {
        id: "1",
        reader: "Emma Wilson",
        rating: 5,
        book: author.books[0]?.title || "Book Title",
        comment: "Absolutely captivating storytelling! I couldn't put it down.",
        date: "2 days ago",
        avatarSeed: "Emma"
      },
      {
        id: "2",
        reader: "Michael Chen",
        rating: 5,
        book: author.books[1]?.title || "Book Title",
        comment: "This author has an incredible talent for character development.",
        date: "1 week ago",
        avatarSeed: "Michael"
      },
      {
        id: "3",
        reader: "Sarah Martinez",
        rating: 4,
        book: author.books[0]?.title || "Book Title",
        comment: "Great read! The plot twists kept me engaged throughout.",
        date: "2 weeks ago",
        avatarSeed: "Sarah"
      }
    ]
  );

  const handleFollow = () => {
    // Check if user is logged in
    if (!isUserLoggedIn) {
      toast.error("Please log in to follow authors");
      if (onLoginRequired) {
        setTimeout(() => onLoginRequired(), 1500);
      }
      return;
    }
    
    // Use parent handlers if provided
    if (isFollowing) {
      if (onUnfollowAuthor) {
        onUnfollowAuthor(author.id);
      }
    } else {
      if (onFollowAuthor) {
        onFollowAuthor(author);
      }
    }
  };

  const handleRating = (rating: number) => {
    // Check if user is logged in
    if (!isUserLoggedIn) {
      toast.error("Please log in to rate this author");
      if (onLoginRequired) {
        setTimeout(() => onLoginRequired(), 1500);
      }
      return;
    }
    
    // Update rating (user can change their rating)
    const previousRating = userRating;
    setUserRating(rating);
    setHasRated(true);
    
    if (previousRating > 0) {
      toast.success(`You updated your rating to ${rating} stars!`);
    } else {
      toast.success(`You rated ${author.name} ${rating} stars!`);
    }
  };

  const handleReviewSubmit = (rating: number, reviewText: string) => {
    // Check if user already has a review
    if (userReviewId) {
      // Update existing review
      setAuthorReviews(prevReviews =>
        prevReviews.map(review =>
          review.id === userReviewId
            ? { ...review, rating, comment: reviewText, date: "Just now" }
            : review
        )
      );
      toast.success("Your review has been updated!");
    } else {
      // Create a new review
      const newReview: AuthorReview = {
        id: Date.now().toString(),
        reader: "Current User", // In a real app, this would be the actual user's name
        rating: rating,
        book: author.books[0]?.title || "General Review",
        comment: reviewText,
        date: "Just now",
        avatarSeed: "CurrentUser"
      };

      // Add the new review to the beginning of the list
      setAuthorReviews([newReview, ...authorReviews]);
      setUserReviewId(newReview.id);
    }

    // Sync the rating with the "Rate This Author" section
    setUserRating(rating);
    setHasRated(true);
  };

  // Carousel navigation
  const nextBooks = () => {
    if (currentBookIndex + booksPerPage < author.books.length) {
      setCurrentBookIndex(currentBookIndex + booksPerPage);
    }
  };

  const prevBooks = () => {
    if (currentBookIndex > 0) {
      setCurrentBookIndex(currentBookIndex - booksPerPage);
    }
  };

  const visibleBooks = author.books.slice(currentBookIndex, currentBookIndex + booksPerPage);
  const canGoNext = currentBookIndex + booksPerPage < author.books.length;
  const canGoPrev = currentBookIndex > 0;

  // Calculate genre distribution
  const genreDistribution = author.books.reduce((acc, book) => {
    acc[book.genre] = (acc[book.genre] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const topGenres = Object.entries(genreDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([genre]) => genre);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <BookMarked className="w-6 h-6 text-primary" />
            <span className="text-xl">BookArc</span>
          </button>

          {/* Right: Icons */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <Button variant="ghost" size="sm" onClick={onBack}>
              Back
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Author Header Section */}
        <div className="mb-8">
          <Card className="overflow-hidden">
            {/* Cover Background */}
            <div className="h-32 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(164,135,131,0.3),transparent_70%)]"></div>
            </div>

            <CardContent className="relative -mt-16 pb-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-card">
                    <AvatarImage src={author.avatarUrl} />
                    <AvatarFallback className="text-2xl">
                      {author.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {author.verified && (
                    <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2">
                      <Award className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Author Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl">{author.name}</h1>
                        {author.verified && (
                          <Badge variant="outline" className="border-primary/40 text-primary">
                            <Award className="w-3 h-3 mr-1" />
                            Verified Author
                          </Badge>
                        )}
                      </div>
                      {author.penName && author.penName !== author.name && (
                        <p className="text-muted-foreground mb-2">Pen Name: {author.penName}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {author.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {author.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Joined {author.joinDate}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant={isFollowing ? "outline" : "default"}
                        onClick={handleFollow}
                        className="min-w-[120px]"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                      {author.email && (
                        <Button 
                          variant="outline" 
                          size="icon"
                          asChild
                        >
                          <a 
                            href={`mailto:${author.email}`}
                            title={`Send email to ${author.name}`}
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      <ReportDialog 
                        reportType="author" 
                        targetName={author.name}
                        isUserLoggedIn={isUserLoggedIn}
                        onLoginRequired={onLoginRequired}
                        onSubmit={(reason, details) => {
                          if (onReportSubmit) {
                            onReportSubmit("author", author.name, reason, details);
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div className="text-center p-3 bg-accent/30 rounded-lg">
                      <div className="text-2xl mb-1">{author.stats.totalBooks}</div>
                      <div className="text-xs text-muted-foreground">Books</div>
                    </div>
                    <div className="text-center p-3 bg-accent/30 rounded-lg">
                      <div className="text-2xl mb-1 flex items-center justify-center gap-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        {author.stats.avgRating.toFixed(1)}
                      </div>
                      <div className="text-xs text-muted-foreground">Avg Rating</div>
                    </div>
                    <div className="text-center p-3 bg-accent/30 rounded-lg">
                      <div className="text-2xl mb-1">{author.stats.totalRatings.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Ratings</div>
                    </div>
                    <div className="text-center p-3 bg-accent/30 rounded-lg">
                      <div className="text-2xl mb-1">{author.stats.totalReads.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Reads</div>
                    </div>
                    <div className="text-center p-3 bg-accent/30 rounded-lg">
                      <div className="text-2xl mb-1">{author.stats.followers.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Followers</div>
                    </div>
                  </div>

                  {/* Social Links */}
                  {(author.website || author.socialLinks) && (
                    <div className="flex flex-wrap items-center gap-3">
                      {author.website && (
                        <a
                          href={author.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <LinkIcon className="w-4 h-4" />
                          Website
                        </a>
                      )}
                      {author.socialLinks?.twitter && (
                        <a
                          href={`https://twitter.com/${author.socialLinks.twitter.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Twitter className="w-4 h-4" />
                          {author.socialLinks.twitter}
                        </a>
                      )}
                      {author.socialLinks?.instagram && (
                        <a
                          href={`https://instagram.com/${author.socialLinks.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Instagram className="w-4 h-4" />
                          {author.socialLinks.instagram}
                        </a>
                      )}
                      {author.socialLinks?.facebook && (
                        <a
                          href={`https://facebook.com/${author.socialLinks.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Facebook className="w-4 h-4" />
                          Facebook
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About the Author</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {author.bio || "No biography available yet."}
                </p>
              </CardContent>
            </Card>

            {/* Published Books Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Published Books</CardTitle>
                    <CardDescription>
                      {author.stats.totalBooks} {author.stats.totalBooks === 1 ? 'book' : 'books'} published
                    </CardDescription>
                  </div>
                  {author.books.length > booksPerPage && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={prevBooks}
                        disabled={!canGoPrev}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={nextBooks}
                        disabled={!canGoNext}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {author.books.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No books published yet</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {visibleBooks.map((book) => (
                        <BookCard
                          key={book.id}
                          title={book.title}
                          author={book.author}
                          rating={book.rating}
                          reviews={book.totalRatings}
                          coverUrl={book.cover}
                          genre={book.genre}
                          onClick={() => onBookSelect?.(book)}
                        />
                      ))}
                    </div>
                    {author.books.length > booksPerPage && (
                      <div className="mt-4 text-center text-sm text-muted-foreground">
                        Showing {currentBookIndex + 1}-{Math.min(currentBookIndex + booksPerPage, author.books.length)} of {author.books.length} books
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Top Reviews Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Reader Reviews</CardTitle>
                    <CardDescription>What readers are saying about {author.name}'s work</CardDescription>
                  </div>
                  <WriteReviewDialog 
                    targetType="author"
                    targetName={author.name}
                    isUserLoggedIn={isUserLoggedIn}
                    onLoginRequired={onLoginRequired}
                    onReviewSubmit={handleReviewSubmit}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {authorReviews.map((review, index) => (
                    <div key={index}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.avatarSeed}`} />
                              <AvatarFallback>
                                {review.reader.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{review.reader}</div>
                              <div className="text-xs text-muted-foreground">on {review.book}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                        <p className="text-xs text-muted-foreground">{review.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rate This Author Section */}
            <Card>
              <CardHeader>
                <CardTitle>Rate This Author</CardTitle>
                <CardDescription>Share your experience with their work</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star 
                          className={`w-10 h-10 cursor-pointer transition-colors ${
                            star <= (hoverRating || userRating)
                              ? "fill-primary text-primary" 
                              : "text-muted-foreground hover:text-primary/50"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {userRating > 0 && (
                    <p className="text-sm text-muted-foreground text-center">
                      You rated this author {userRating} star{userRating !== 1 ? 's' : ''}
                    </p>
                  )}
                  <Separator />
                  <div className="text-center space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="text-2xl font-bold">{author.stats.avgRating.toFixed(1)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Average from {author.stats.totalRatings.toLocaleString()} ratings
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Similar Authors Section */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Authors</CardTitle>
                <CardDescription>You might also like</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Jane Parker", genre: "Mystery", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" },
                    { name: "David Chen", genre: "Sci-Fi", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David" },
                    { name: "Lisa Morgan", genre: "Fantasy", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa" }
                  ].map((similarAuthor, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 hover:bg-accent/30 rounded-lg cursor-pointer transition-colors">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={similarAuthor.avatar} />
                        <AvatarFallback>
                          {similarAuthor.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{similarAuthor.name}</div>
                        <div className="text-xs text-muted-foreground">{similarAuthor.genre}</div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}