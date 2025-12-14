import { useState } from "react";
import { BookMarked, Search, SlidersHorizontal, Grid3x3, List, Star, X, ChevronLeft, ChevronRight, Users, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export interface Book {
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

interface BrowseBooksPageProps {
  onBack: () => void;
  onBookSelect: (book: Book) => void;
  onAuthorSelect?: (authorName: string) => void;
  onUserSelect?: (userId: number) => void;
  mockUsers?: Array<{
    id: number;
    username: string;
    avatarUrl: string;
    bio?: string;
    isPrivate: boolean;
    stats: {
      totalReviews: number;
      booksRead: number;
      followers: number;
    };
  }>;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function BrowseBooksPage({ onBack, onBookSelect, onAuthorSelect, onUserSelect, mockUsers = [], theme, onToggleTheme }: BrowseBooksPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"books" | "authors" | "users">("books");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState("all");
  const [minRating, setMinRating] = useState([0]);
  const [sortBy, setSortBy] = useState("popular");
  const itemsPerPage = 12;

  // Mock book data
  const allBooks = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
      rating: 4.6,
      totalRatings: 2341,
      genre: "Fiction",
      description: "A dazzling novel about all the choices that go into a life well lived.",
      publishYear: 2020
    },
    {
      id: 2,
      title: "Project Hail Mary",
      author: "Andy Weir",
      cover: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop",
      rating: 4.8,
      totalRatings: 3892,
      genre: "Sci-Fi",
      description: "A lone astronaut must save the earth from disaster in this incredible new science-based thriller.",
      publishYear: 2021
    },
    {
      id: 3,
      title: "The Silent Patient",
      author: "Alex Michaelides",
      cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
      rating: 4.4,
      totalRatings: 5234,
      genre: "Mystery",
      description: "A woman's act of violence against her husband and her therapist's search for the truth.",
      publishYear: 2019
    },
    {
      id: 4,
      title: "Educated",
      author: "Tara Westover",
      cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
      rating: 4.7,
      totalRatings: 6789,
      genre: "Biography",
      description: "A memoir about a young woman who leaves her survivalist family and goes on to earn a PhD.",
      publishYear: 2018
    },
    {
      id: 5,
      title: "Where the Crawdads Sing",
      author: "Delia Owens",
      cover: "https://images.unsplash.com/photo-1580831355254-7dc2eedf6d8e?w=400&h=600&fit=crop",
      rating: 4.5,
      totalRatings: 8921,
      genre: "Fiction",
      description: "A murder mystery set in the marshlands of North Carolina.",
      publishYear: 2018
    },
    {
      id: 6,
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
      rating: 4.9,
      totalRatings: 7234,
      genre: "Romance",
      description: "Aging Hollywood icon Evelyn Hugo finally tells the story of her glamorous and scandalous life.",
      publishYear: 2017
    },
    {
      id: 7,
      title: "Atomic Habits",
      author: "James Clear",
      cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop",
      rating: 4.8,
      totalRatings: 9876,
      genre: "Self-Help",
      description: "Tiny changes, remarkable results - a practical guide to building good habits.",
      publishYear: 2018
    },
    {
      id: 8,
      title: "The Last Thing He Told Me",
      author: "Laura Dave",
      cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
      rating: 4.3,
      totalRatings: 4321,
      genre: "Thriller",
      description: "A woman searches for the truth after her husband disappears.",
      publishYear: 2021
    },
    {
      id: 9,
      title: "Dune",
      author: "Frank Herbert",
      cover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop",
      rating: 4.6,
      totalRatings: 12345,
      genre: "Sci-Fi",
      description: "The epic story of Paul Atreides on the desert planet Arrakis.",
      publishYear: 1965
    },
    {
      id: 10,
      title: "The Invisible Life of Addie LaRue",
      author: "V.E. Schwab",
      cover: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400&h=600&fit=crop",
      rating: 4.5,
      totalRatings: 5678,
      genre: "Fantasy",
      description: "A woman makes a Faustian bargain to live forever but is cursed to be forgotten by everyone.",
      publishYear: 2020
    },
    {
      id: 11,
      title: "The Thursday Murder Club",
      author: "Richard Osman",
      cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
      rating: 4.4,
      totalRatings: 6543,
      genre: "Mystery",
      description: "Four friends meet weekly to investigate unsolved murders.",
      publishYear: 2020
    },
    {
      id: 12,
      title: "The Song of Achilles",
      author: "Madeline Miller",
      cover: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop",
      rating: 4.7,
      totalRatings: 8234,
      genre: "Fantasy",
      description: "A tale of gods, kings, immortal fame and the human heart.",
      publishYear: 2011
    },
    {
      id: 13,
      title: "Sapiens",
      author: "Yuval Noah Harari",
      cover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop",
      rating: 4.6,
      totalRatings: 11234,
      genre: "Non-Fiction",
      description: "A brief history of humankind.",
      publishYear: 2011
    },
    {
      id: 14,
      title: "The Nightingale",
      author: "Kristin Hannah",
      cover: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&h=600&fit=crop",
      rating: 4.8,
      totalRatings: 9123,
      genre: "Historical",
      description: "Two sisters in France during World War II navigate survival and resistance.",
      publishYear: 2015
    },
    {
      id: 15,
      title: "Circe",
      author: "Madeline Miller",
      cover: "https://images.unsplash.com/photo-1526243741027-444d633d7365?w=400&h=600&fit=crop",
      rating: 4.5,
      totalRatings: 7654,
      genre: "Fantasy",
      description: "The story of the goddess and enchantress from Greek mythology.",
      publishYear: 2018
    },
    {
      id: 16,
      title: "The Guest List",
      author: "Lucy Foley",
      cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
      rating: 4.2,
      totalRatings: 5432,
      genre: "Thriller",
      description: "A wedding celebration turns dark and deadly on a remote Irish island.",
      publishYear: 2020
    },
    {
      id: 17,
      title: "Normal People",
      author: "Sally Rooney",
      cover: "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=400&h=600&fit=crop",
      rating: 4.3,
      totalRatings: 6789,
      genre: "Romance",
      description: "The story of mutual fascination, friendship and love between two young people.",
      publishYear: 2018
    },
    {
      id: 18,
      title: "The House in the Cerulean Sea",
      author: "TJ Klune",
      cover: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop",
      rating: 4.7,
      totalRatings: 8901,
      genre: "Fantasy",
      description: "A magical story about found family and discovering where you truly belong.",
      publishYear: 2020
    }
  ];

  const genres = ["Fiction", "Sci-Fi", "Mystery", "Biography", "Romance", "Self-Help", "Thriller", "Fantasy", "Non-Fiction", "Historical"];
  const authors = [...new Set(allBooks.map(book => book.author))].sort();

  // Mock author profiles for search
  const authorProfiles = [
    { name: "Matt Haig", bio: "Bestselling author", genre: "Fiction" },
    { name: "Andy Weir", bio: "Science fiction author", genre: "Sci-Fi" },
    { name: "Alex Michaelides", bio: "Psychological thriller writer", genre: "Mystery" },
    { name: "Tara Westover", bio: "Memoir writer", genre: "Biography" },
    { name: "Delia Owens", bio: "Fiction and nature writing", genre: "Fiction" },
    { name: "Stephen King", bio: "Master of horror", genre: "Thriller" },
    { name: "Madeline Miller", bio: "Mythological fiction", genre: "Fantasy" },
    { name: "Lucy Foley", bio: "Thriller novelist", genre: "Thriller" },
    { name: "Sally Rooney", bio: "Contemporary fiction", genre: "Romance" },
    { name: "TJ Klune", bio: "Fantasy romance author", genre: "Fantasy" }
  ];

  // Filter authors based on search
  const filteredAuthors = authorProfiles.filter(author =>
    author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    author.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    author.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter books based on search, genre, author, and rating
  const filteredBooks = allBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenres.length === 0 || selectedGenres.includes(book.genre);
    const matchesAuthor = selectedAuthor === "all" || book.author === selectedAuthor;
    const matchesRating = book.rating >= minRating[0];
    
    return matchesSearch && matchesGenre && matchesAuthor && matchesRating;
  });

  // Sort books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.publishYear - a.publishYear;
      case "oldest":
        return a.publishYear - b.publishYear;
      case "title":
        return a.title.localeCompare(b.title);
      default: // popular
        return b.totalRatings - a.totalRatings;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooks = sortedBooks.slice(startIndex, endIndex);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedAuthor("all");
    setMinRating([0]);
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedGenres.length > 0 || (selectedAuthor !== "all") || minRating[0] > 0;

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
              Back to Home
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Browse Books</h1>
          <p className="text-muted-foreground">Explore our collection of {allBooks.length} amazing books</p>
        </div>

        {/* Search and Controls */}
        <div className="mb-6 space-y-4">
          {/* Search Bar with Toggle */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                variant={searchType === "books" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSearchType("books");
                  setSearchQuery("");
                }}
              >
                <BookMarked className="w-4 h-4 mr-2" />
                Books
              </Button>
              <Button
                variant={searchType === "authors" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSearchType("authors");
                  setSearchQuery("");
                }}
              >
                <Users className="w-4 h-4 mr-2" />
                Authors
              </Button>
              <Button
                variant={searchType === "users" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSearchType("users");
                  setSearchQuery("");
                }}
              >
                <Users className="w-4 h-4 mr-2" />
                Users
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={searchType === "books" ? "Search by title, author, or description..." : "Search for authors..."}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-12 pr-4 h-12 text-lg"
              />
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Mobile Filter Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                      {selectedGenres.length + (selectedAuthor ? 1 : 0) + (minRating[0] > 0 ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Refine your book search</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Genre Filter */}
                  <div className="space-y-3">
                    <Label>Genre</Label>
                    <div className="flex flex-wrap gap-2">
                      {genres.map(genre => (
                        <Badge
                          key={genre}
                          variant={selectedGenres.includes(genre) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleGenre(genre)}
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Author Filter */}
                  <div className="space-y-3">
                    <Label>Author</Label>
                    <Select value={selectedAuthor} onValueChange={(value) => {
                      setSelectedAuthor(value);
                      setCurrentPage(1);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="All authors" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All authors</SelectItem>
                        {authors.map(author => (
                          <SelectItem key={author} value={author}>{author}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Rating Filter */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Minimum Rating</Label>
                      <span className="text-sm font-medium">{minRating[0].toFixed(1)} ⭐</span>
                    </div>
                    <Slider
                      value={minRating}
                      onValueChange={(value) => {
                        setMinRating(value);
                        setCurrentPage(1);
                      }}
                      max={5}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  {hasActiveFilters && (
                    <>
                      <Separator />
                      <Button variant="outline" onClick={clearFilters} className="w-full gap-2">
                        <X className="w-4 h-4" />
                        Clear All Filters
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">Title (A-Z)</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex border border-border rounded-md ml-auto">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {selectedGenres.map(genre => (
                <Badge key={genre} variant="secondary" className="gap-1">
                  {genre}
                  <button onClick={() => toggleGenre(genre)} className="ml-1 hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {selectedAuthor !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Author: {selectedAuthor}
                  <button onClick={() => setSelectedAuthor("all")} className="ml-1 hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {minRating[0] > 0 && (
                <Badge variant="secondary" className="gap-1">
                  Rating ≥ {minRating[0].toFixed(1)}
                  <button onClick={() => setMinRating([0])} className="ml-1 hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 text-xs">
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {searchType === "books" 
              ? `Showing ${startIndex + 1}-${Math.min(endIndex, sortedBooks.length)} of ${sortedBooks.length} books`
              : `Found ${filteredAuthors.length} ${filteredAuthors.length === 1 ? 'author' : 'authors'}`
            }
          </p>
        </div>

        {/* Author Results Display */}
        {searchType === "authors" && (
          <div className="space-y-4 mb-8">
            {filteredAuthors.length > 0 ? (
              filteredAuthors.map((author, index) => (
                <Card 
                  key={index} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onAuthorSelect?.(author.name)}
                >
                  <div className="flex items-center gap-4 p-6">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${author.name}`} />
                      <AvatarFallback>
                        {author.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl">{author.name}</h3>
                        <Badge variant="outline">{author.genre}</Badge>
                      </div>
                      <p className="text-muted-foreground">{author.bio}</p>
                      <div className="mt-2 text-sm text-muted-foreground">
                        {allBooks.filter(b => b.author === author.name).length} published {allBooks.filter(b => b.author === author.name).length === 1 ? 'book' : 'books'}
                      </div>
                    </div>
                    <Button variant="outline">
                      View Profile
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl mb-2">No authors found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search to find authors
                </p>
              </Card>
            )}
          </div>
        )}

        {/* User Results Display */}
        {searchType === "users" && (
          <div className="space-y-4 mb-8">
            {mockUsers.length > 0 ? (
              mockUsers.map((user, index) => (
                <Card 
                  key={index} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onUserSelect?.(user.id)}
                >
                  <div className="flex items-center gap-4 p-6">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback>
                        {user.username.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl">{user.username}</h3>
                        <Badge variant="outline">{user.isPrivate ? 'Private' : 'Public'}</Badge>
                      </div>
                      <p className="text-muted-foreground">{user.bio || 'No bio available'}</p>
                      <div className="mt-2 text-sm text-muted-foreground">
                        {user.stats.totalReviews} reviews, {user.stats.booksRead} books read, {user.stats.followers} followers
                      </div>
                    </div>
                    <Button variant="outline">
                      View Profile
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl mb-2">No users found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search to find users
                </p>
              </Card>
            )}
          </div>
        )}

        {/* Books Display */}
        {searchType === "books" && (currentBooks.length > 0 ? (
          <>
            {viewMode === "grid" ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
                {currentBooks.map(book => (
                  <Card 
                    key={book.id} 
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => onBookSelect(book)}
                  >
                    <div className="relative h-64">
                      <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                      <Badge className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm">
                        {book.genre}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{book.title}</CardTitle>
                      <CardDescription>{book.author}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">{book.description}</p>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-primary text-primary" />
                          <span className="font-medium">{book.rating}</span>
                          <span className="text-sm text-muted-foreground">({book.totalRatings.toLocaleString()})</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{book.publishYear}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                {currentBooks.map(book => (
                  <Card 
                    key={book.id} 
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => onBookSelect(book)}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                        <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <CardTitle className="mb-1">{book.title}</CardTitle>
                              <CardDescription className="text-base">{book.author}</CardDescription>
                            </div>
                            <Badge variant="outline">{book.genre}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-muted-foreground">{book.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-primary text-primary" />
                              <span className="font-medium">{book.rating}</span>
                              <span className="text-sm text-muted-foreground">({book.totalRatings.toLocaleString()} ratings)</span>
                            </div>
                            <span className="text-sm text-muted-foreground">Published {book.publishYear}</span>
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNumber = i + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNumber)}
                            isActive={currentPage === pageNumber}
                            className="cursor-pointer"
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return <PaginationEllipsis key={pageNumber} />;
                    }
                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        ) : (
          <Card className="py-12">
            <CardContent className="flex flex-col items-center justify-center">
              <Search className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-xl mb-2">No books found</h3>
              <p className="text-muted-foreground text-center mb-4">
                Try adjusting your filters or search query
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}