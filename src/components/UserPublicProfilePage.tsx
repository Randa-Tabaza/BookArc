import { useState } from "react";
import { ArrowLeft, BookOpen, Star, Users, Calendar, MapPin, Link as LinkIcon, Lock, Globe, MessageSquare, ThumbsUp, Heart, BookCheck, Clock, Award, TrendingUp, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";
import { Separator } from "./ui/separator";

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatarUrl: string;
  bio?: string;
  location?: string;
  website?: string;
  joinDate: string;
  isPrivate: boolean;
  stats: {
    totalReviews: number;
    totalRatings: number;
    booksRead: number;
    followers: number;
    following: number;
  };
  lists: Array<{
    id: number;
    name: string;
    count: number;
    isPublic: boolean;
  }>;
  recentReviews: Array<{
    id: number;
    bookTitle: string;
    bookAuthor: string;
    rating: number;
    comment: string;
    date: string;
    likes: number;
  }>;
  favoriteGenres: string[];
}

interface UserPublicProfilePageProps {
  user: UserProfile;
  onBack: () => void;
  onLogoClick?: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  isCurrentUser: boolean;
  isUserLoggedIn: boolean;
  isAuthorLoggedIn?: boolean;
  onLoginRequired?: () => void;
  isFollowing?: boolean;
  hasRequestedFollow?: boolean;
  onFollowUser?: (userId: number) => void;
  onUnfollowUser?: (userId: number) => void;
  onCancelRequest?: () => void;
  onEditProfile?: () => void;
  onViewBookDetails?: (bookId: number) => void;
  currentUser?: { isAdmin?: boolean };
}

export function UserPublicProfilePage({
  user,
  onBack,
  onLogoClick,
  theme,
  onToggleTheme,
  isCurrentUser,
  isUserLoggedIn,
  isAuthorLoggedIn = false,
  onLoginRequired,
  isFollowing = false,
  hasRequestedFollow = false,
  onFollowUser,
  onUnfollowUser,
  onCancelRequest,
  onEditProfile,
  onViewBookDetails,
  currentUser,
}: UserPublicProfilePageProps) {
  const [activeTab, setActiveTab] = useState("reviews");

  const handleFollow = () => {
    if (!isUserLoggedIn) {
      if (onLoginRequired) {
        onLoginRequired();
      }
      return;
    }

    // Prevent admins from following
    if (currentUser?.isAdmin) {
      return; // Silently fail since button will be hidden
    }

    if (isFollowing && onUnfollowUser) {
      onUnfollowUser(user.id);
    } else if (hasRequestedFollow && onCancelRequest) {
      onCancelRequest();
    } else if (onFollowUser) {
      onFollowUser(user.id);
    }
  };

  // Get button text and variant based on state
  const getFollowButtonProps = () => {
    if (isFollowing) {
      return { text: "Unfollow", variant: "outline" as const };
    } else if (hasRequestedFollow) {
      return { text: "Requested", variant: "secondary" as const };
    } else {
      return { text: "Follow", variant: "default" as const };
    }
  };

  const followButtonProps = getFollowButtonProps();

  // Check if profile is private and user is not the owner
  // Profile is locked if: private AND (not following OR only requested but not accepted)
  const isProfileLocked = user.isPrivate && !isCurrentUser && (!isFollowing || hasRequestedFollow);

  const userInitials = user.username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={onLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Logo className="w-6 h-6" />
            <span className="text-xl">BookArc</span>
          </button>

          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="w-32 h-32 border-4 border-primary/20">
                  <AvatarImage src={user.avatarUrl} alt={user.username} />
                  <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-3xl">{user.username}</h1>
                      {user.isPrivate && (
                        <Badge variant="outline" className="gap-1">
                          <Lock className="w-3 h-3" />
                          Private
                        </Badge>
                      )}
                      {!user.isPrivate && (
                        <Badge variant="outline" className="gap-1">
                          <Globe className="w-3 h-3" />
                          Public
                        </Badge>
                      )}
                    </div>
                    {user.bio && <p className="text-muted-foreground mb-3">{user.bio}</p>}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {user.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {user.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Joined {user.joinDate}
                      </span>
                      {user.website && (
                        <a
                          href={user.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          <LinkIcon className="w-4 h-4" />
                          Website
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {isCurrentUser ? (
                      <Button onClick={onEditProfile}>Edit Profile</Button>
                    ) : !isAuthorLoggedIn && !currentUser?.isAdmin ? (
                      <Button
                        onClick={handleFollow}
                        variant={followButtonProps.variant}
                      >
                        {followButtonProps.text}
                      </Button>
                    ) : null}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-3 rounded-lg bg-accent/10">
                    <div className="text-2xl mb-1">{user.stats.booksRead}</div>
                    <div className="text-xs text-muted-foreground">Books Read</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-accent/10">
                    <div className="text-2xl mb-1">{user.stats.totalReviews}</div>
                    <div className="text-xs text-muted-foreground">Reviews</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-accent/10">
                    <div className="text-2xl mb-1">{user.stats.totalRatings}</div>
                    <div className="text-xs text-muted-foreground">Ratings</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-accent/10">
                    <div className="text-2xl mb-1">{user.stats.followers}</div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-accent/10">
                    <div className="text-2xl mb-1">{user.stats.following}</div>
                    <div className="text-xs text-muted-foreground">Following</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Private Profile Message */}
        {isProfileLocked ? (
          <Card>
            <CardContent className="text-center py-12">
              <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
              <h3 className="text-xl mb-2">This Account is Private</h3>
              <p className="text-muted-foreground mb-4">
                {isAuthorLoggedIn
                  ? `This account is private. Only regular users can follow other users.`
                  : hasRequestedFollow 
                  ? `Your follow request is pending. Once ${user.username} accepts, you'll be able to see their reviews, ratings, and reading lists.`
                  : `Follow ${user.username} to see their reviews, ratings, and reading lists.`
                }
              </p>
              {!isAuthorLoggedIn && !isUserLoggedIn && (
                <Button onClick={onLoginRequired}>Log In to Follow</Button>
              )}
              {!isAuthorLoggedIn && isUserLoggedIn && hasRequestedFollow && (
                <Button variant="outline" onClick={handleFollow}>
                  Cancel Request
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Favorite Genres */}
            {user.favoriteGenres && user.favoriteGenres.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Favorite Genres
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.favoriteGenres.map((genre, index) => (
                      <Badge key={index} variant="secondary">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tabs for Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="reviews">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Reviews ({user.stats.totalReviews})
                </TabsTrigger>
                <TabsTrigger value="lists">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Lists ({user.lists.filter(l => l.isPublic || isCurrentUser).length})
                </TabsTrigger>
                <TabsTrigger value="activity">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Activity
                </TabsTrigger>
              </TabsList>

              {/* Reviews Tab */}
              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Reviews</CardTitle>
                    <CardDescription>
                      Reviews written by {isCurrentUser ? "you" : user.username}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user.recentReviews.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No reviews yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {user.recentReviews.map((review) => (
                          <div
                            key={review.id}
                            className="p-4 rounded-lg border border-border hover:border-primary transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="mb-1">{review.bookTitle}</h4>
                                <p className="text-sm text-muted-foreground">
                                  by {review.bookAuthor}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "fill-yellow-500 text-yellow-500"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm mb-3">{review.comment}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{review.date}</span>
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="w-3 h-3" />
                                {review.likes} helpful
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Lists Tab */}
              <TabsContent value="lists">
                <Card>
                  <CardHeader>
                    <CardTitle>Reading Lists</CardTitle>
                    <CardDescription>
                      {isCurrentUser ? "Your" : `${user.username}'s`} curated book collections
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user.lists.filter(l => l.isPublic || isCurrentUser).length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No public lists yet</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {user.lists
                          .filter(l => l.isPublic || isCurrentUser)
                          .map((list) => (
                            <div
                              key={list.id}
                              className="p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <BookOpen className="w-5 h-5 text-primary" />
                                {!list.isPublic && (
                                  <Badge variant="outline" className="text-xs">
                                    <Lock className="w-3 h-3 mr-1" />
                                    Private
                                  </Badge>
                                )}
                              </div>
                              <h4 className="mb-1">{list.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {list.count} {list.count === 1 ? "book" : "books"}
                              </p>
                            </div>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Latest actions by {isCurrentUser ? "you" : user.username}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Mock activity data */}
                      <div className="flex gap-3 p-3 rounded-lg bg-accent/10">
                        <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm">
                            Rated <span className="font-medium">The Midnight Library</span> 5 stars
                          </p>
                          <p className="text-xs text-muted-foreground">2 days ago</p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 rounded-lg bg-accent/10">
                        <MessageSquare className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm">
                            Reviewed <span className="font-medium">Project Hail Mary</span>
                          </p>
                          <p className="text-xs text-muted-foreground">3 days ago</p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 rounded-lg bg-accent/10">
                        <BookCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm">
                            Finished reading <span className="font-medium">Atomic Habits</span>
                          </p>
                          <p className="text-xs text-muted-foreground">1 week ago</p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 rounded-lg bg-accent/10">
                        <Heart className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm">
                            Added <span className="font-medium">The Seven Husbands of Evelyn Hugo</span> to Want to Read
                          </p>
                          <p className="text-xs text-muted-foreground">1 week ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}