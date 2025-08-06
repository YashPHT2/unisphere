import { FileText, Plus, TrendingUp, Eye } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/cms-hero.jpg';

export const Dashboard = () => {
  const { posts } = usePosts();
  const navigate = useNavigate();

  const totalPosts = posts.length;
  const recentPosts = posts.slice(0, 5);
  const tagsCount = new Set(posts.filter(p => p.tag).map(p => p.tag)).size;

  const stats = [
    {
      title: 'Total Posts',
      value: totalPosts,
      icon: FileText,
      color: 'text-twitter-blue',
    },
    {
      title: 'Unique Tags',
      value: tagsCount,
      icon: TrendingUp,
      color: 'text-purple-400',
    },
    {
      title: 'Recent Activity',
      value: recentPosts.length,
      icon: Eye,
      color: 'text-green-400',
    },
  ];

  return (
    <div className="space-y-6 relative">
      {/* Floating background elements */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-twitter-blue/10 rounded-full blur-3xl animate-float opacity-30" />
      <div className="fixed bottom-20 left-20 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl animate-float opacity-40" style={{ animationDelay: '2s' }} />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="liquid-animation">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-twitter-blue-light to-white bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-white/60 mt-2 flex items-center gap-2">
            <span className="text-twitter-blue animate-pulse">⚡</span>
          </p>
        </div>
        <Button 
          onClick={() => navigate('/posts/new')}
          variant="twitter"
          size="lg"
          className="animate-pulse-glow"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Post
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {stats.map((stat, index) => (
          <Card key={stat.title} className="glass-card twitter-hover group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-white/60 group-hover:text-white transition-colors">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-white group-hover:text-twitter-blue-light transition-colors">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <Card className="glass-card relative z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-twitter-blue/5 via-transparent to-purple-500/5" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center justify-between text-white">
              <span className="flex items-center gap-2">
                Recent Posts
                <span className="text-twitter-blue">🚀</span>
              </span>
              <Button 
                variant="glass" 
                size="sm"
                onClick={() => navigate('/posts')}
                className="hover:bg-twitter-blue/20 hover:text-twitter-blue"
              >
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div 
                  key={post.id}
                  className="flex items-center justify-between p-4 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer group backdrop-blur-sm twitter-hover"
                  onClick={() => navigate(`/posts/${post.id}`)}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-white group-hover:text-twitter-blue-light transition-colors">{post.title}</h3>
                    <p className="text-sm text-white/60 line-clamp-1 group-hover:text-white/80 transition-colors">
                      {post.description}
                    </p>
                  </div>
                  <div className="text-xs text-white/50 ml-4 group-hover:text-white/70 transition-colors">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hero Section - Empty State */}
      {totalPosts === 0 && (
        <Card className="glass-card relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-5"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-twitter-blue/10 via-transparent to-purple-500/10" />
          <CardContent className="relative text-center py-16 z-10">
            <div className="w-20 h-20 bg-twitter-blue/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-float backdrop-blur-sm border border-twitter-blue/30">
              <FileText className="h-10 w-10 text-twitter-blue" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-white to-twitter-blue-light bg-clip-text text-transparent">
              Welcome to Mini CMS X
            </h3>
            <p className="text-white/60 mb-8 max-w-lg mx-auto leading-relaxed">
            </p>
            <Button 
              onClick={() => navigate('/posts/new')}
              variant="twitter"
              size="lg"
              className="animate-pulse-glow"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Post
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};