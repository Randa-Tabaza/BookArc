import { useState } from "react";
import { BookMarked, ChevronLeft, Star, Plus, Trash2, BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ThemeToggle } from "./ThemeToggle";

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

interface ListViewPageProps {
  list: {
    id: number;
    name: string;
    count: number;
    bookIds: number[];
    icon: any;
  };
  allBooks: Book[];
  onBack: () => void;
  onLogoClick: () => void;
  onBookClick: (book: Book) => void;
  onRemoveFromList: (bookId: number) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function ListViewPage({
  list,
  allBooks,
  onBack,
  onLogoClick,
  onBookClick,
  onRemoveFromList,
  theme,
  onToggleTheme,
}: ListViewPageProps) {
  const ListIcon = list.icon;
  
  // Filter books that are in this list
  const booksInList = allBooks.filter(book => list.bookIds.includes(book.id));

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

      <div className="container mx-auto px-4 py-8">
        {/* List Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
              <ListIcon className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl mb-2">{list.name}</h1>
              <p className="text-muted-foreground">
                {list.count} {list.count === 1 ? "book" : "books"} in this list
              </p>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {booksInList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {booksInList.map((book) => (
              <Card key={book.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <div 
                      className="aspect-[2/3] overflow-hidden cursor-pointer"
                      onClick={() => onBookClick(book)}
                    >
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity gap-1"
                      onClick={() => onRemoveFromList(book.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </Button>
                  </div>
                  
                  <div className="p-4">
                    <h3 
                      className="line-clamp-2 mb-1 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => onBookClick(book)}
                    >
                      {book.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm">{book.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({book.totalRatings})
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {book.genre}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <BookOpen className="w-10 h-10 text-muted-foreground" />
              </div>
              <CardTitle className="mb-2">No books yet</CardTitle>
              <CardDescription className="text-center max-w-md mb-6">
                This list is empty. Browse books and add them to this list to start building your collection!
              </CardDescription>
              <Button onClick={onLogoClick} className="gap-2">
                <Plus className="w-4 h-4" />
                Browse Books
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}