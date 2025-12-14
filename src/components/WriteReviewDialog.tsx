import { useState } from "react";
import { Star, PenSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

interface WriteReviewDialogProps {
  targetType: "book" | "author";
  targetName: string;
  onSubmit?: (rating: number, reviewText: string) => void;
  isUserLoggedIn: boolean;
  onLoginRequired?: () => void;
  onReviewSubmit?: (rating: number, reviewText: string) => void;
}

export function WriteReviewDialog({ 
  targetType, 
  targetName, 
  onSubmit,
  isUserLoggedIn,
  onLoginRequired,
  onReviewSubmit
}: WriteReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && !isUserLoggedIn) {
      toast.error("Please log in to write a review");
      if (onLoginRequired) {
        setTimeout(() => onLoginRequired(), 1500);
      }
      return;
    }
    setOpen(newOpen);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }

    if (reviewText.trim().length < 10) {
      toast.error("Review must be at least 10 characters long");
      return;
    }

    // Call the optional onSubmit callback if provided
    if (onSubmit) {
      onSubmit(rating, reviewText);
    }

    // Call the optional onReviewSubmit callback if provided
    if (onReviewSubmit) {
      onReviewSubmit(rating, reviewText);
    }

    // Show success message
    toast.success("Review submitted successfully!", {
      description: "Thank you for sharing your thoughts with the community."
    });

    // Reset and close
    setRating(0);
    setHoverRating(0);
    setReviewText("");
    setOpen(false);
  };

  const getPlaceholder = () => {
    if (targetType === "book") {
      return "Share your thoughts about this book. What did you like? What could be better? Would you recommend it to others?";
    } else {
      return "Share your thoughts about this author's work. What do you enjoy about their writing style? What makes their books special?";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <PenSquare className="w-4 h-4" />
          Write a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PenSquare className="w-5 h-5 text-primary" />
            Write a Review
          </DialogTitle>
          <DialogDescription>
            Share your experience with "{targetName}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 overflow-y-auto flex-1">
          {/* Rating Section */}
          <div className="space-y-3">
            <Label>Your Rating *</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star 
                    className={`w-10 h-10 cursor-pointer transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-primary text-primary" 
                        : "text-muted-foreground hover:text-primary/50"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating} star{rating !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Review Text Section */}
          <div className="space-y-2">
            <Label htmlFor="review-text">Your Review *</Label>
            <Textarea
              id="review-text"
              placeholder={getPlaceholder()}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={8}
              className="resize-y min-h-[150px] max-h-[300px]"
            />
            <p className="text-xs text-muted-foreground">
              {reviewText.length} characters (minimum 10)
            </p>
          </div>

          {/* Guidelines */}
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Review Guidelines</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Be honest and constructive in your feedback</li>
              <li>• Avoid spoilers or use spoiler warnings</li>
              <li>• Keep your review focused on the {targetType}</li>
              <li>• Be respectful to authors and other readers</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={rating === 0 || !reviewText.trim()}
          >
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}