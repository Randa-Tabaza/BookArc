import { useState } from "react";
import { BookMarked, Star, Share2, ShoppingCart, ExternalLink, Plus, Check, ChevronLeft, TrendingUp, Award, Clock, BookOpen, ChevronDown, BookCheck, Pause, X as XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";
import { toast } from "sonner";
import { ReportDialog } from "./ReportDialog";
import { WriteReviewDialog } from "./WriteReviewDialog";

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  totalRatings: number;
  genre: string;
  description: string;
  publishYear: number;
}

interface BookDetailsPageProps {
  book: Book;
  onBack: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onLogoClick: () => void;
  isUserLoggedIn: boolean;
  onLoginRequired?: () => void;
  userLists: Array<{id: number; name: string; count: number; bookIds: number[]; icon: any}>;
  setUserLists: React.Dispatch<React.SetStateAction<Array<{id: number; name: string; count: number; bookIds: number[]; icon: any}>>>;
  userReviews?: Array<{
    id: number;
    user: string;
    avatar: string;
    rating: number;
    date: string;
    review: string;
    helpful: number;
  }>;
  onAddReview?: (rating: number, reviewText: string) => void;
  helpfulReviews?: { [reviewId: number]: boolean };
  onToggleHelpful?: (reviewId: number) => void;
  onReportSubmit?: (reportType: "user" | "author" | "review" | "book", targetName: string, reason: string, details?: string) => void;
}

export function BookDetailsPage({ book, onBack, theme, onToggleTheme, onLogoClick, isUserLoggedIn, onLoginRequired, userLists, setUserLists, userReviews = [], onAddReview, helpfulReviews = {}, onToggleHelpful, onReportSubmit }: BookDetailsPageProps) {
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [isListMenuOpen, setIsListMenuOpen] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState(false);
  const [userReviewId, setUserReviewId] = useState<number | null>(null);

  // Mock detailed book data
  const bookDetails = {
    ...book,
    fullDescription: `${book.description} This captivating novel has touched the hearts of millions of readers worldwide. With its compelling narrative and unforgettable characters, it explores themes of love, loss, redemption, and the human spirit. The author's masterful storytelling weaves together multiple perspectives to create a rich tapestry that will stay with you long after you turn the final page.`,
    isbn: "978-1-234567-89-0",
    pages: 384,
    language: "English",
    publisher: "Penguin Random House",
    tags: ["Contemporary", "Literary Fiction", "Drama", "Bestseller"],
  };

  // Mock price comparison data
  const retailers = [
    { name: "Amazon", price: 14.99, link: "#", logo: "🛒", inStock: true, shipping: "Free" },
    { name: "Barnes & Noble", price: 15.49, link: "#", logo: "📚", inStock: true, shipping: "Free" },
    { name: "Book Depository", price: 13.99, link: "#", logo: "📖", inStock: true, shipping: "Free worldwide" },
    { name: "Target", price: 16.99, link: "#", logo: "🎯", inStock: false, shipping: "N/A" },
  ];

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      user: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      rating: 5,
      date: "2 weeks ago",
      review: "Absolutely phenomenal! I couldn't put this book down. The characters felt so real and the story was gripping from start to finish.",
      helpful: 234,
    },
    {
      id: 2,
      user: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      rating: 4,
      date: "1 month ago",
      review: "A beautifully written book with deep emotional resonance. Some parts felt a bit slow, but overall an excellent read.",
      helpful: 156,
    },
    {
      id: 3,
      user: "Emma Williams",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      rating: 5,
      date: "1 month ago",
      review: "One of the best books I've read this year. The prose is stunning and the themes are explored with nuance and depth.",
      helpful: 189,
    },
    {
      id: 4,
      user: "David Martinez",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      rating: 4,
      date: "2 months ago",
      review: "Really enjoyed this one. The author has a unique voice and the story kept me engaged throughout.",
      helpful: 98,
    },
  ];

  // Combine user reviews with mock reviews
  const allReviews = [...userReviews, ...reviews];

  // Rating distribution
  const ratingDistribution = [
    { stars: 5, count: 1845, percentage: 74 },
    { stars: 4, count: 478, percentage: 19 },
    { stars: 3, count: 125, percentage: 5 },
    { stars: 2, count: 37, percentage: 1 },
    { stars: 1, count: 25, percentage: 1 },
  ];

  const handleAddToList = (listId: number, listName: string) => {
    // Check if user is logged in
    if (!isUserLoggedIn) {
      toast.error("Please log in to add books to your lists");
      if (onLoginRequired) {
        setTimeout(() => onLoginRequired(), 1500);
      }
      return;
    }
    
    // Check if book is already in list
    const list = userLists.find(l => l.id === listId);
    if (list && list.bookIds.includes(book.id)) {
      toast.info(`Already in ${listName}`);
      return;
    }
    
    // Add book to list
    setUserLists(userLists.map(list => 
      list.id === listId 
        ? { ...list, bookIds: [...list.bookIds, book.id], count: list.count + 1 }
        : list
    ));
    
    setSelectedList(listName);
    setIsListMenuOpen(false);
    toast.success(`Added to ${listName}!`);
    setTimeout(() => setSelectedList(null), 2000);
  };

  const handleShare = () => {
    toast.success("Link copied to clipboard!");
  };

  const handleRating = (rating: number) => {
    // Check if user is logged in
    if (!isUserLoggedIn) {
      toast.error("Please log in to rate this book");
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
      toast.success(`You rated this book ${rating} stars!`);
    }
  };

  const handleReviewSubmit = (rating: number, reviewText: string) => {
    // Sync the rating with the "Rate This Book" section
    setUserRating(rating);
    setHasRated(true);
    
    // Call the onAddReview callback if provided
    if (onAddReview) {
      onAddReview(rating, reviewText);
    }
  };

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
            <Logo className="w-6 h-6" />
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

      <div className="container mx-auto px-4 py-8">
        {/* Book Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Book Cover */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <img 
                src={book.cover} 
                alt={book.title}
                className="w-full max-w-sm mx-auto rounded-lg shadow-2xl mb-4"
              />
              
              {/* Action Buttons */}
              <div className="space-y-3">
                {userLists.length > 0 ? (
                  <DropdownMenu open={isListMenuOpen} onOpenChange={setIsListMenuOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        className="w-full gap-2" 
                        size="lg"
                      >
                        {selectedList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        {selectedList || "Add to List"}
                        <ChevronDown className="w-4 h-4 ml-auto" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                      <DropdownMenuLabel>Choose a list</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {userLists.map((list) => {
                        const Icon = list.icon;
                        const isInList = list.bookIds.includes(book.id);
                        return (
                          <DropdownMenuItem
                            key={list.id}
                            onClick={() => handleAddToList(list.id, list.name)}
                            className="gap-2"
                          >
                            <Icon className="w-4 h-4" />
                            <span className="flex-1">{list.name}</span>
                            {isInList && <Check className="w-4 h-4 text-primary" />}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button 
                    className="w-full gap-2" 
                    size="lg"
                    onClick={() => toast.info("Create a list first from your dashboard!")}
                  >
                    <Plus className="w-5 h-5" />
                    Add to List
                  </Button>
                )}
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
                
                {/* Report Book Button */}
                <div className="pt-2">
                  <ReportDialog 
                    reportType="book" 
                    targetName={book.title}
                    isUserLoggedIn={isUserLoggedIn}
                    onLoginRequired={onLoginRequired}
                    onSubmit={(reason, details) => {
                      if (onReportSubmit) {
                        onReportSubmit("book", book.title, reason, details);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <Card className="mt-4">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pages</span>
                    <span className="font-medium">{bookDetails.pages}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Published</span>
                    <span className="font-medium">{book.publishYear}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Language</span>
                    <span className="font-medium">{bookDetails.language}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">ISBN</span>
                    <span className="font-medium text-xs">{bookDetails.isbn}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Book Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Author */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl mb-2">{book.title}</h1>
                  <p className="text-xl text-muted-foreground mb-3">by {book.author}</p>
                  
                  {/* Genre and Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="default">{book.genre}</Badge>
                    {bookDetails.tags.map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rating Summary */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <div className="text-5xl font-bold">{book.rating}</div>
                        <div className="flex flex-col">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-5 h-5 ${i < Math.floor(book.rating) ? "fill-primary text-primary" : "text-muted-foreground"}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {book.totalRatings.toLocaleString()} ratings
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator orientation="vertical" className="hidden md:block" />
                    
                    <div className="flex-1 space-y-2">
                      {ratingDistribution.map((dist) => (
                        <div key={dist.stars} className="flex items-center gap-3">
                          <span className="text-sm w-12">{dist.stars} star</span>
                          <Progress value={dist.percentage} className="flex-1" />
                          <span className="text-sm text-muted-foreground w-16 text-right">
                            {dist.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Rate This Book Section */}
                  <Separator className="my-6" />
                  <div className="space-y-3">
                    <p className="font-medium text-center md:text-left">Rate this book</p>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-transform hover:scale-110 focus:outline-none"
                        >
                          <Star 
                            className={`w-8 h-8 cursor-pointer transition-colors ${
                              star <= (hoverRating || userRating)
                                ? "fill-primary text-primary" 
                                : "text-muted-foreground hover:text-primary/50"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {userRating > 0 && (
                      <p className="text-sm text-muted-foreground text-center md:text-left">
                        You rated this book {userRating} star{userRating !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Price Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Price Comparison
                </CardTitle>
                <CardDescription>Find the best deal from trusted retailers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {retailers.map((retailer, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{retailer.logo}</span>
                        <div>
                          <p className="font-medium">{retailer.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {retailer.inStock ? `${retailer.shipping} shipping` : "Out of stock"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold">${retailer.price}</p>
                          {i === 2 && (
                            <Badge variant="default" className="text-xs">Best Price</Badge>
                          )}
                        </div>
                        <Button 
                          size="sm" 
                          disabled={!retailer.inStock}
                          className="gap-2"
                        >
                          Buy Now
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Description and Reviews */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({allReviews.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About this book</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {bookDetails.fullDescription}
                    </p>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <BookOpen className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="font-medium mb-1">Publisher</p>
                          <p className="text-sm text-muted-foreground">{bookDetails.publisher}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="font-medium mb-1">Publication Date</p>
                          <p className="text-sm text-muted-foreground">{book.publishYear}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Similar Books */}
                <Card>
                  <CardHeader>
                    <CardTitle>Readers also enjoyed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="cursor-pointer hover:opacity-80 transition-opacity">
                          <div className="aspect-[2/3] bg-muted rounded-md mb-2" />
                          <p className="text-sm font-medium line-clamp-2">Similar Book {i}</p>
                          <p className="text-xs text-muted-foreground">Author Name</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6 space-y-4">
                {/* Review Stats */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Reader Reviews</CardTitle>
                      <WriteReviewDialog 
                        targetType="book"
                        targetName={book.title}
                        isUserLoggedIn={isUserLoggedIn}
                        onLoginRequired={onLoginRequired}
                        onReviewSubmit={handleReviewSubmit}
                      />
                    </div>
                  </CardHeader>
                </Card>

                {/* Reviews List */}
                {allReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={review.avatar} alt={review.user} />
                          <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium">{review.user}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-4 h-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"}`} 
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground mb-3">{review.review}</p>
                          
                          <div className="flex items-center gap-4">
                            <Button 
                              variant={helpfulReviews[review.id] ? "default" : "ghost"} 
                              size="sm" 
                              className="gap-2 h-8"
                              onClick={() => {
                                if (!isUserLoggedIn) {
                                  toast.error("Please log in to mark reviews as helpful");
                                  if (onLoginRequired) {
                                    setTimeout(() => onLoginRequired(), 1500);
                                  }
                                  return;
                                }
                                if (onToggleHelpful) {
                                  onToggleHelpful(review.id);
                                  if (!helpfulReviews[review.id]) {
                                    toast.success("Marked as helpful!");
                                  }
                                }
                              }}
                            >
                              <TrendingUp className="w-4 h-4" />
                              Helpful ({review.helpful + (helpfulReviews[review.id] ? 1 : 0)})
                            </Button>
                            <ReportDialog 
                              reportType="review" 
                              targetName={`${review.user}'s review`} 
                              isUserLoggedIn={isUserLoggedIn}
                              onLoginRequired={onLoginRequired}
                              onSubmit={(reason, details) => {
                                if (onReportSubmit) {
                                  onReportSubmit("review", `${review.user}'s review`, reason, details);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button variant="outline" className="w-full">
                  Load More Reviews
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}