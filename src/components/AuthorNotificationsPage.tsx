import { useState } from "react";
import { Bell, ArrowLeft, Moon, Sun, Settings, Check, CheckCheck, Star, Heart, BookOpen, Users, TrendingUp, AlertCircle, MessageSquare, Award, DollarSign, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface Notification {
  id: number;
  type: "review" | "sale" | "milestone" | "system" | "comment" | "rating" | "trending" | "follower";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  bookTitle?: string;
  userName?: string;
}

interface AuthorNotificationsPageProps {
  onBack: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function AuthorNotificationsPage({ onBack, theme, onToggleTheme }: AuthorNotificationsPageProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "read">("all");
  const [showSettings, setShowSettings] = useState(false);
  
  // Email settings
  const [notificationEmail, setNotificationEmail] = useState("");
  const [savedEmail, setSavedEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSaveSuccess, setEmailSaveSuccess] = useState(false);
  
  // Notification settings for authors
  const [emailNotifications, setEmailNotifications] = useState({
    newReviews: true,
    bookSales: true,
    milestones: true,
    readerEngagement: true,
    systemUpdates: false,
    weeklyReport: true,
  });

  const [inAppNotifications, setInAppNotifications] = useState({
    newReviews: true,
    bookSales: true,
    milestones: true,
    readerEngagement: true,
    systemUpdates: true,
    comments: true,
    ratings: true,
  });

  // Mock notifications data for authors
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "review",
      title: "New 5-Star Review",
      message: "Sarah Mitchell left a glowing review on 'The Last Eclipse': 'An absolute masterpiece!'",
      timestamp: "1 hour ago",
      isRead: false,
      bookTitle: "The Last Eclipse",
      userName: "Sarah Mitchell",
    },
    {
      id: 2,
      type: "milestone",
      title: "Milestone Achieved!",
      message: "'Whispers in the Dark' has reached 1,000 reads! Congratulations!",
      timestamp: "3 hours ago",
      isRead: false,
      bookTitle: "Whispers in the Dark",
    },
    {
      id: 3,
      type: "trending",
      title: "Trending Book",
      message: "'The Last Eclipse' is now trending in the Sci-Fi category!",
      timestamp: "5 hours ago",
      isRead: false,
      bookTitle: "The Last Eclipse",
    },
    {
      id: 4,
      type: "comment",
      title: "New Comment on Review",
      message: "Michael Chen replied to your response on 'Whispers in the Dark' review.",
      timestamp: "1 day ago",
      isRead: true,
      bookTitle: "Whispers in the Dark",
      userName: "Michael Chen",
    },
    {
      id: 5,
      type: "rating",
      title: "High Rating",
      message: "Your book 'Beyond the Horizon' received a 5-star rating from James Wilson.",
      timestamp: "1 day ago",
      isRead: true,
      bookTitle: "Beyond the Horizon",
      userName: "James Wilson",
    },
    {
      id: 6,
      type: "follower",
      title: "New Follower",
      message: "Emma Rodriguez started following you to get updates on your new releases.",
      timestamp: "2 days ago",
      isRead: true,
      userName: "Emma Rodriguez",
    },
    {
      id: 7,
      type: "milestone",
      title: "Rating Milestone",
      message: "'The Last Eclipse' has received over 2,000 ratings! Your readers love it!",
      timestamp: "2 days ago",
      isRead: true,
      bookTitle: "The Last Eclipse",
    },
    {
      id: 8,
      type: "system",
      title: "Platform Update",
      message: "BookArc has launched new analytics features for authors. Check your dashboard!",
      timestamp: "3 days ago",
      isRead: false,
    },
    {
      id: 9,
      type: "review",
      title: "New Review",
      message: "David Park left a thoughtful 4-star review on 'Beyond the Horizon'.",
      timestamp: "4 days ago",
      isRead: true,
      bookTitle: "Beyond the Horizon",
      userName: "David Park",
    },
  ]);

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "review":
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case "sale":
        return <DollarSign className="w-5 h-5 text-green-500" />;
      case "milestone":
        return <Award className="w-5 h-5 text-yellow-500" />;
      case "comment":
        return <MessageSquare className="w-5 h-5 text-purple-500" />;
      case "rating":
        return <Star className="w-5 h-5 text-orange-500" />;
      case "trending":
        return <TrendingUp className="w-5 h-5 text-pink-500" />;
      case "follower":
        return <Users className="w-5 h-5 text-indigo-500" />;
      case "system":
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSaveEmail = () => {
    setEmailError("");
    setEmailSaveSuccess(false);

    if (!notificationEmail) {
      setEmailError("Email address is required");
      return;
    }

    if (!validateEmail(notificationEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Save the email
    setSavedEmail(notificationEmail);
    setEmailSaveSuccess(true);
    
    // Simulate sending verification email
    setTimeout(() => {
      setEmailVerified(true);
    }, 2000);

    setTimeout(() => {
      setEmailSaveSuccess(false);
    }, 3000);
  };

  const handleSendVerification = () => {
    setEmailSaveSuccess(true);
    setTimeout(() => {
      setEmailSaveSuccess(false);
    }, 3000);
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeFilter === "unread") return !notif.isRead;
    if (activeFilter === "read") return notif.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Bell className="w-6 h-6 text-primary" />
              <span className="text-xl">Notifications</span>
              {unreadCount > 0 && (
                <Badge className="bg-destructive text-destructive-foreground">
                  {unreadCount}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/40 text-primary">
              Author
            </Badge>
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Notification Settings</DialogTitle>
                  <DialogDescription>
                    Manage how you receive notifications about your books and readers
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  {/* Email Address Section */}
                  <div className="bg-accent/50 rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <h3 className="text-lg">Email Address for Notifications</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Enter your email address to receive notifications about your books and reader engagement
                    </p>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="notification-email">Email Address</Label>
                        <div className="flex gap-2">
                          <Input
                            id="notification-email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={notificationEmail}
                            onChange={(e) => {
                              setNotificationEmail(e.target.value);
                              setEmailError("");
                            }}
                            className={emailError ? "border-destructive" : ""}
                          />
                          <Button 
                            onClick={handleSaveEmail}
                            disabled={!notificationEmail}
                          >
                            Save Email
                          </Button>
                        </div>
                        {emailError && (
                          <p className="text-sm text-destructive">{emailError}</p>
                        )}
                        {emailSaveSuccess && (
                          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                            <Check className="w-4 h-4" />
                            <span>Email saved successfully!</span>
                          </div>
                        )}
                      </div>

                      {savedEmail && (
                        <div className="pt-2 space-y-2">
                          <div className="flex items-center justify-between p-3 bg-background rounded-md border border-border">
                            <div className="flex items-center gap-3">
                              <div className={`flex items-center gap-2 ${emailVerified ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                                {emailVerified ? (
                                  <>
                                    <Check className="w-4 h-4" />
                                    <span className="text-sm">Verified</span>
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm">Not verified</span>
                                  </>
                                )}
                              </div>
                              <Separator orientation="vertical" className="h-4" />
                              <span className="text-sm">{savedEmail}</span>
                            </div>
                            {!emailVerified && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={handleSendVerification}
                              >
                                Verify Email
                              </Button>
                            )}
                          </div>
                          {!emailVerified && (
                            <p className="text-xs text-muted-foreground">
                              Please verify your email to start receiving notifications
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Email Notifications */}
                  <div>
                    <h3 className="text-lg mb-2">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose which notifications you want to receive via email
                      {!savedEmail && " (Email address required)"}
                    </p>
                    <div className={`space-y-4 ${!savedEmail ? "opacity-50 pointer-events-none" : ""}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">New Reviews</div>
                          <div className="text-sm text-muted-foreground">
                            When readers review your books
                          </div>
                        </div>
                        <Switch
                          checked={emailNotifications.newReviews}
                          onCheckedChange={(checked) =>
                            setEmailNotifications({ ...emailNotifications, newReviews: checked })
                          }
                          disabled={!savedEmail}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Reader Engagement</div>
                          <div className="text-sm text-muted-foreground">
                            Comments, ratings, and interactions
                          </div>
                        </div>
                        <Switch
                          checked={emailNotifications.readerEngagement}
                          onCheckedChange={(checked) =>
                            setEmailNotifications({ ...emailNotifications, readerEngagement: checked })
                          }
                          disabled={!savedEmail}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Milestones</div>
                          <div className="text-sm text-muted-foreground">
                            Book achievements and milestones
                          </div>
                        </div>
                        <Switch
                          checked={emailNotifications.milestones}
                          onCheckedChange={(checked) =>
                            setEmailNotifications({ ...emailNotifications, milestones: checked })
                          }
                          disabled={!savedEmail}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">System Updates</div>
                          <div className="text-sm text-muted-foreground">
                            Platform updates and new features
                          </div>
                        </div>
                        <Switch
                          checked={emailNotifications.systemUpdates}
                          onCheckedChange={(checked) =>
                            setEmailNotifications({ ...emailNotifications, systemUpdates: checked })
                          }
                          disabled={!savedEmail}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Weekly Report</div>
                          <div className="text-sm text-muted-foreground">
                            Weekly summary of your book performance
                          </div>
                        </div>
                        <Switch
                          checked={emailNotifications.weeklyReport}
                          onCheckedChange={(checked) =>
                            setEmailNotifications({ ...emailNotifications, weeklyReport: checked })
                          }
                          disabled={!savedEmail}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* In-App Notifications */}
                  <div>
                    <h3 className="text-lg mb-4">In-App Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">New Reviews</div>
                          <div className="text-sm text-muted-foreground">
                            Show notifications for new book reviews
                          </div>
                        </div>
                        <Switch
                          checked={inAppNotifications.newReviews}
                          onCheckedChange={(checked) =>
                            setInAppNotifications({ ...inAppNotifications, newReviews: checked })
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Reader Engagement</div>
                          <div className="text-sm text-muted-foreground">
                            Show notifications for reader interactions
                          </div>
                        </div>
                        <Switch
                          checked={inAppNotifications.readerEngagement}
                          onCheckedChange={(checked) =>
                            setInAppNotifications({ ...inAppNotifications, readerEngagement: checked })
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Milestones</div>
                          <div className="text-sm text-muted-foreground">
                            Show achievement notifications
                          </div>
                        </div>
                        <Switch
                          checked={inAppNotifications.milestones}
                          onCheckedChange={(checked) =>
                            setInAppNotifications({ ...inAppNotifications, milestones: checked })
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">System Updates</div>
                          <div className="text-sm text-muted-foreground">
                            Show system announcements
                          </div>
                        </div>
                        <Switch
                          checked={inAppNotifications.systemUpdates}
                          onCheckedChange={(checked) =>
                            setInAppNotifications({ ...inAppNotifications, systemUpdates: checked })
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Comments</div>
                          <div className="text-sm text-muted-foreground">
                            Show notifications for review comments
                          </div>
                        </div>
                        <Switch
                          checked={inAppNotifications.comments}
                          onCheckedChange={(checked) =>
                            setInAppNotifications({ ...inAppNotifications, comments: checked })
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Ratings</div>
                          <div className="text-sm text-muted-foreground">
                            Show notifications for new book ratings
                          </div>
                        </div>
                        <Switch
                          checked={inAppNotifications.ratings}
                          onCheckedChange={(checked) =>
                            setInAppNotifications({ ...inAppNotifications, ratings: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleTheme}
              className="hover:bg-accent"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl mb-1">Your Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with your book performance and reader engagement
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as any)}>
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-2">
                {notifications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-destructive text-destructive-foreground">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="read">
              Read
              <Badge variant="secondary" className="ml-2">
                {notifications.length - unreadCount}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeFilter}>
            <ScrollArea className="h-[calc(100vh-300px)]">
              {filteredNotifications.length === 0 ? (
                <Card className="p-12 text-center">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl mb-2">No notifications</h3>
                  <p className="text-muted-foreground">
                    {activeFilter === "unread"
                      ? "You're all caught up! No unread notifications."
                      : "You don't have any notifications yet."}
                  </p>
                </Card>
              ) : (
                <div className="space-y-2">
                  {filteredNotifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className={`p-4 transition-all hover:border-primary/40 ${
                        !notification.isRead ? "bg-accent/20 border-primary/20" : ""
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-1">
                            <h3 className={!notification.isRead ? "font-semibold" : ""}>
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {notification.timestamp}
                            </span>
                            <div className="flex gap-2">
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Mark as Read
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}