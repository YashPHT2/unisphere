import { useParams, useNavigate } from 'react-router-dom';
import { usePosts } from '@/hooks/usePosts';
import { ArrowLeft, Edit, Trash2, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DeleteDialog } from '@/components/post/DeleteDialog';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import MDEditor from '@uiw/react-md-editor';

export const ViewPost = () => {
  const { id } = useParams<{ id: string }>();
  const { getPostById, deletePost } = usePosts();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const post = id ? getPostById(id) : undefined;

  useEffect(() => {
    if (id && !post) {
      toast({
        title: 'Post Not Found',
        description: 'The requested post could not be found.',
        variant: 'destructive',
      });
      navigate('/posts');
    }
  }, [id, post, navigate, toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleEdit = () => {
    navigate(`/posts/edit/${id}`);
  };

  const handleDeleteConfirm = () => {
    if (id) {
      deletePost(id);
      setShowDeleteDialog(false);
      toast({
        title: 'Post Deleted',
        description: 'The post has been deleted successfully.',
      });
      navigate('/posts');
    }
  };

  if (!post) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate('/posts')}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Posts
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowDeleteDialog(true)}
            className="text-cms-danger hover:text-cms-danger hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Featured Image */}
      {post.image && (
        <div className="mb-6">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-2xl font-bold text-foreground">
              {post.title}
            </CardTitle>
            {post.tag && (
              <Badge variant="secondary" className="ml-4">
                <Tag className="w-3 h-3 mr-1" />
                {post.tag}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Created: {formatDate(post.createdAt)}
            </div>
            {post.updatedAt !== post.createdAt && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Updated: {formatDate(post.updatedAt)}
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div 
            className="prose prose-sm max-w-none text-foreground"
            data-color-mode="dark"
          >
            <MDEditor.Markdown 
              source={post.description}
              style={{ 
                backgroundColor: 'transparent',
                color: 'hsl(var(--foreground))',
              }}
            />
          </div>
        </CardContent>
      </Card>

      <DeleteDialog
        post={post}
        isOpen={showDeleteDialog}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
};