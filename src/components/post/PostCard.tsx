import { Edit, Trash2, Eye, Calendar, Tag } from 'lucide-react';
import { Post } from '@/types/post';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  onView: (post: Post) => void;
}

export const PostCard = ({ post, onEdit, onDelete, onView }: PostCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="glass-card hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-twitter-blue/20 group relative overflow-hidden twitter-hover">
      <div className="absolute inset-0 bg-gradient-to-br from-twitter-blue/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Featured Image */}
      {post.image && (
        <div className="relative">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-bold text-white line-clamp-2 group-hover:text-twitter-blue-light transition-colors">
            {post.title}
          </CardTitle>
          {post.tag && (
            <Badge variant="secondary" className="ml-2 shrink-0 bg-twitter-blue/20 text-twitter-blue border-twitter-blue/30 backdrop-blur-sm">
              <Tag className="w-3 h-3 mr-1" />
              {post.tag}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-4 relative z-10">
        <p className="text-white/80 line-clamp-3 text-sm leading-relaxed group-hover:text-white transition-colors">
          {post.description}
        </p>
        
        <div className="flex items-center text-xs text-white/50 mt-4 space-x-4">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            Created: {formatDate(post.createdAt)}
          </div>
          {post.updatedAt !== post.createdAt && (
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              Updated: {formatDate(post.updatedAt)}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 gap-2 relative z-10">
        <Button
          variant="glass"
          size="sm"
          onClick={() => onView(post)}
          className="flex-1 hover:bg-twitter-blue/20 hover:text-twitter-blue"
        >
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
        <Button
          variant="glass"
          size="sm"
          onClick={() => onEdit(post)}
          className="flex-1 hover:bg-twitter-blue/20 hover:text-twitter-blue"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="glass"
          size="sm"
          onClick={() => onDelete(post)}
          className="hover:bg-red-500/20 hover:text-red-400"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};