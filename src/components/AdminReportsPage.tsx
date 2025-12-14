import { useState } from "react";
import { BookMarked, TrendingUp, Users, BookOpen, AlertCircle, Activity, Globe, ChevronDown, Shield, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AdminReportsPageProps {
  onBack: () => void;
  onLogoClick: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function AdminReportsPage({ onBack, onLogoClick, theme, onToggleTheme }: AdminReportsPageProps) {
  const [timeRange, setTimeRange] = useState("7days");

  // User activity data over time
  const userActivityData = [
    { date: "Oct 25", users: 2400, newUsers: 240, sessions: 4800 },
    { date: "Oct 26", users: 2210, newUsers: 198, sessions: 4420 },
    { date: "Oct 27", users: 2800, newUsers: 320, sessions: 5600 },
    { date: "Oct 28", users: 3200, newUsers: 380, sessions: 6400 },
    { date: "Oct 29", users: 2900, newUsers: 290, sessions: 5800 },
    { date: "Oct 30", users: 3400, newUsers: 420, sessions: 6800 },
    { date: "Oct 31", users: 3800, newUsers: 480, sessions: 7600 },
  ];

  // Top authors data
  const topAuthorsData = [
    { name: "Matt Haig", books: 12, rating: 4.8, reads: 45200 },
    { name: "Andy Weir", books: 8, rating: 4.7, reads: 52300 },
    { name: "Taylor Jenkins Reid", books: 10, rating: 4.6, reads: 38900 },
    { name: "Alex Michaelides", books: 6, rating: 4.5, reads: 41200 },
    { name: "Emily Henry", books: 9, rating: 4.7, reads: 35600 },
  ];

  // Top genres data
  const topGenresData = [
    { name: "Fiction", value: 32, color: "#A4787E" }, // River Rouge
    { name: "Mystery", value: 24, color: "#54313C" }, // Blackberry
    { name: "Sci-Fi", value: 18, color: "#8B6F72" }, // Mauve blend
    { name: "Romance", value: 15, color: "#705560" }, // Dark mauve
    { name: "Fantasy", value: 11, color: "#4A4948" }, // Dark gray
  ];

  // Traffic sources data
  const trafficSourcesData = [
    { name: "Direct", value: 42, color: "#A4787E" },
    { name: "Search", value: 28, color: "#54313C" },
    { name: "Social Media", value: 18, color: "#8B6F72" },
    { name: "Referral", value: 12, color: "#705560" },
  ];

  // Revenue/engagement data
  const engagementData = [
    { month: "May", reviews: 3200, ratings: 5400, bookmarks: 2800 },
    { month: "Jun", reviews: 3800, ratings: 6200, bookmarks: 3200 },
    { month: "Jul", reviews: 4200, ratings: 7100, bookmarks: 3600 },
    { month: "Aug", reviews: 4600, ratings: 7800, bookmarks: 3900 },
    { month: "Sep", reviews: 5100, ratings: 8500, bookmarks: 4300 },
    { month: "Oct", reviews: 5800, ratings: 9200, bookmarks: 4800 },
  ];

  // Error logs data
  const errorLogs = [
    {
      id: 1,
      timestamp: "2024-10-31 14:23:45",
      level: "error",
      message: "Database connection timeout",
      source: "BookService",
      count: 3,
    },
    {
      id: 2,
      timestamp: "2024-10-31 13:45:12",
      level: "warning",
      message: "High memory usage detected",
      source: "SystemMonitor",
      count: 1,
    },
    {
      id: 3,
      timestamp: "2024-10-31 12:30:20",
      level: "error",
      message: "Failed to upload book cover",
      source: "UploadService",
      count: 2,
    },
    {
      id: 4,
      timestamp: "2024-10-31 11:15:33",
      level: "warning",
      message: "Slow query performance",
      source: "DatabaseService",
      count: 5,
    },
    {
      id: 5,
      timestamp: "2024-10-31 10:05:42",
      level: "error",
      message: "Email delivery failed",
      source: "NotificationService",
      count: 1,
    },
  ];

  // Key metrics
  const keyMetrics = [
    {
      title: "Total Page Views",
      value: "2.4M",
      change: "+12.3%",
      trend: "up",
      icon: Activity,
    },
    {
      title: "Active Users",
      value: "45.2K",
      change: "+8.1%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Books Added",
      value: "1,234",
      change: "+15.2%",
      trend: "up",
      icon: BookOpen,
    },
    {
      title: "Avg. Session Time",
      value: "8m 32s",
      change: "-2.3%",
      trend: "down",
      icon: TrendingUp,
    },
  ];

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
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <Badge variant="outline" className="border-primary/40 text-primary hidden md:flex">
              <Shield className="w-3 h-3 mr-1" />
              Admin
            </Badge>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <Button variant="ghost" size="sm" onClick={onLogoClick}>
              Back
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-8 space-y-8">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl mb-2">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into platform performance and user engagement
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {keyMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">{metric.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{metric.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span
                      className={
                        metric.trend === "up"
                          ? "text-primary"
                          : "text-destructive"
                      }
                    >
                      {metric.change}
                    </span>{" "}
                    from last period
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="activity">User Activity</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="content">Content Stats</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
          </TabsList>

          {/* User Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Activity Over Time</CardTitle>
                <CardDescription>
                  Daily active users, new registrations, and session count
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={userActivityData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A4787E" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#A4787E" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#54313C" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#54313C" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#333" : "#e5e7eb"} />
                    <XAxis 
                      dataKey="date" 
                      stroke={theme === "dark" ? "#999" : "#666"}
                    />
                    <YAxis stroke={theme === "dark" ? "#999" : "#666"} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === "dark" ? "#2D2B2A" : "#fff",
                        border: "1px solid #A4787E",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="#A4787E"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorUsers)"
                      name="Active Users"
                    />
                    <Area
                      type="monotone"
                      dataKey="newUsers"
                      stroke="#54313C"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorNew)"
                      name="New Users"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sessions Overview</CardTitle>
                <CardDescription>
                  Total user sessions per day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#333" : "#e5e7eb"} />
                    <XAxis 
                      dataKey="date" 
                      stroke={theme === "dark" ? "#999" : "#666"}
                    />
                    <YAxis stroke={theme === "dark" ? "#999" : "#666"} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === "dark" ? "#2D2B2A" : "#fff",
                        border: "1px solid #A4787E",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sessions"
                      stroke="#A4787E"
                      strokeWidth={3}
                      name="Sessions"
                      dot={{ fill: "#A4787E", r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Engagement Trends</CardTitle>
                <CardDescription>
                  Reviews, ratings, and bookmarks over the past 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#333" : "#e5e7eb"} />
                    <XAxis 
                      dataKey="month" 
                      stroke={theme === "dark" ? "#999" : "#666"}
                    />
                    <YAxis stroke={theme === "dark" ? "#999" : "#666"} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === "dark" ? "#2D2B2A" : "#fff",
                        border: "1px solid #A4787E",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="reviews" fill="#A4787E" name="Reviews" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="ratings" fill="#54313C" name="Ratings" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="bookmarks" fill="#8B6F72" name="Bookmarks" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Stats Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Authors by Reads</CardTitle>
                  <CardDescription>
                    Most popular authors on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={topAuthorsData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#333" : "#e5e7eb"} />
                      <XAxis type="number" stroke={theme === "dark" ? "#999" : "#666"} />
                      <YAxis dataKey="name" type="category" stroke={theme === "dark" ? "#999" : "#666"} width={100} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme === "dark" ? "#2D2B2A" : "#fff",
                          border: "1px solid #A4787E",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="reads" fill="#A4787E" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Genres</CardTitle>
                  <CardDescription>
                    Distribution of books by genre
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={topGenresData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {topGenresData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme === "dark" ? "#2D2B2A" : "#fff",
                          border: "1px solid #A4787E",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Author Performance Details</CardTitle>
                <CardDescription>
                  Comprehensive author statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Author Name</TableHead>
                      <TableHead>Books Published</TableHead>
                      <TableHead>Average Rating</TableHead>
                      <TableHead>Total Reads</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topAuthorsData.map((author, index) => (
                      <TableRow key={index}>
                        <TableCell>{author.name}</TableCell>
                        <TableCell>{author.books}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span>{author.rating}</span>
                            <span className="text-yellow-500">★</span>
                          </div>
                        </TableCell>
                        <TableCell>{author.reads.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Traffic Tab */}
          <TabsContent value="traffic" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                  <CardDescription>
                    Where users are coming from
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={trafficSourcesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        innerRadius={60}
                      >
                        {trafficSourcesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme === "dark" ? "#2D2B2A" : "#fff",
                          border: "1px solid #A4787E",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Traffic Summary</CardTitle>
                  <CardDescription>
                    Detailed breakdown of traffic sources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trafficSourcesData.map((source, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: source.color }}
                            />
                            <span>{source.name}</span>
                          </div>
                          <span>{source.value}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${source.value}%`,
                              backgroundColor: source.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>
                  Top regions by user count (Mock Data)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { region: "United States", users: 18500, percentage: 35 },
                    { region: "United Kingdom", users: 9200, percentage: 18 },
                    { region: "Canada", users: 7400, percentage: 14 },
                    { region: "Australia", users: 5900, percentage: 11 },
                    { region: "Germany", users: 4800, percentage: 9 },
                    { region: "Other", users: 6800, percentage: 13 },
                  ].map((region, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          <span>{region.region}</span>
                        </div>
                        <span className="text-muted-foreground">
                          {region.users.toLocaleString()} users
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${region.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Error Logs Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              System Error Logs
            </CardTitle>
            <CardDescription>
              Recent errors and warnings from the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {errorLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-muted-foreground">
                      {log.timestamp}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={log.level === "error" ? "destructive" : "secondary"}
                      >
                        {log.level}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.source}</TableCell>
                    <TableCell>{log.message}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.count}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}