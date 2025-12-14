import { useState } from "react";
import { Bell, ArrowLeft, Moon, Sun, Settings, Check, CheckCheck, Star, Heart, BookOpen, Users, TrendingUp, AlertCircle, MessageSquare, Mail, ShieldCheck, BookMarked } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ThemeToggle } from "./ThemeToggle";
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
  type: "review" | "follow" | "recommendation" | "system" | "comment" | "rating" | "trending";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  bookTitle?: string;
  userName?: string;
}

interface NotificationsPageProps {
  onBack: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function NotificationsPage({ onBack, theme, onToggleTheme }: NotificationsPageProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "read">("all");
  const [showSettings, setShowSettings] = useState(false);
  
  // Email settings
  const [notificationEmail, setNotificationEmail] = useState("");
  const [savedEmail, setSavedEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSaveSuccess, setEmailSaveSuccess] = useState(false);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState({
    newReviews: true,
    newFollowers: true,
    bookRecommendations: true,
    systemUpdates: false,
    weeklyDigest: true,
  });

  const [inAppNotifications, setInAppNotifications] = useState({
    newReviews: true,
    newFollowers: true,
    bookRecommendations: true,
    systemUpdates: true,
    comments: true,
    ratings: true,
  });

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "review",
      title: "New Review on Your List",
      message: "Sarah Johnson reviewed 'The Midnight Library' that you added to your Want to Read list.",
      timestamp: "2 hours ago",
      isRead: false,
      bookTitle: "The Midnight Library",
      userName: "Sarah Johnson",
    },
    {
      id: 2,
      type: "follow",
      title: "New Follower",
      message: "Alex Chen started following you.",
      timestamp: "5 hours ago",
      isRead: false,
      userName: "Alex Chen",
    },
    {
      id: 3,
      type: "recommendation",
      title: "Book Recommendation",
      message: "Based on your reading history, you might like 'Tomorrow, and Tomorrow, and Tomorrow'.",
      timestamp: "1 day ago",
      isRead: false,
      bookTitle: "Tomorrow, and Tomorrow, and Tomorrow",
    },
    {
      id: 4,
      type: "comment",
      title: "New Comment",
      message: "Emma Wilson replied to your review of 'Project Hail Mary'.",
      timestamp: "1 day ago",
      isRead: true,
      bookTitle: "Project Hail Mary",
      userName: "Emma Wilson",
    },
    {
      id: 5,
      type: "system",
      title: "System Update",
      message: "BookArc has been updated with new features! Check out our improved book recommendations.",
      timestamp: "3 days ago",
      isRead: false,
    },
    {
      id: 6,
      type: "trending",
      title: "Trending Book",
      message: "'Fourth Wing' is trending in Fantasy. Check it out!",
      timestamp: "2 days ago",
      isRead: true,
      bookTitle: "Fourth Wing",
    },
    {
      id: 7,
      type: "follow",
      title: "New Follower",
      message: "Marcus Lee started following you.",
      timestamp: "4 days ago",
      isRead: true,
      userName: "Marcus Lee",
    },
    {
      id: 8,
      type: "review",
      title: "Friend's Review",
      message: "Your friend David posted a review of 'The Seven Husbands of Evelyn Hugo'.",
      timestamp: "5 days ago",
      isRead: true,
      bookTitle: "The Seven Husbands of Evelyn Hugo",
      userName: "David",
    },
  ]);

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "review":
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case "follow":
        return <Users className="w-5 h-5 text-purple-500" />;
      case "recommendation":
        return <BookOpen className="w-5 h-5 text-primary" />;
      case "comment":
        return <MessageSquare className="w-5 h-5 text-green-500" />;
      case "rating":
        return <Star className="w-5 h-5 text-yellow-500" />;
      case "trending":
        return <TrendingUp className="w-5 h-5 text-orange-500" />;
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl mb-1">Your Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with your reading community
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