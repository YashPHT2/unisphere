import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { usePosts } from '@/hooks/usePosts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, FileText, Eye, Calendar, Tag, Activity } from 'lucide-react';

const COLORS = ['#1DA1F2', '#7856FF', '#FF6B6B', '#4ECDC4', '#45B7D1'];

export const Analytics = () => {
  const { posts } = usePosts();
  const analytics = useAnalytics(posts);

  const StatCard = ({ title, value, icon: Icon, trend }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: string;
  }) => (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-twitter-blue" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Insights and performance metrics for your content
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Posts"
          value={analytics.totalPosts}
          icon={FileText}
          trend="All time"
        />
        <StatCard
          title="Total Views"
          value={analytics.totalViews.toLocaleString()}
          icon={Eye}
          trend="Estimated"
        />
        <StatCard
          title="This Month"
          value={analytics.postsThisMonth}
          icon={Calendar}
          trend="New posts"
        />
        <StatCard
          title="Top Tags"
          value={analytics.topTags.length}
          icon={Tag}
          trend="Categories used"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Posts by Month */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Posts Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.postsByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--twitter-blue))" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Tags */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Popular Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.topTags.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.topTags}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ tag, count }) => `${tag} (${count})`}
                  >
                    {analytics.topTags.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tags data available</p>
                  <p className="text-sm">Add tags to your posts to see analytics</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 glass-card rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-twitter-blue rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      <span className="capitalize">{activity.type}</span> post: 
                      <span className="font-medium ml-1">{activity.postTitle}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};