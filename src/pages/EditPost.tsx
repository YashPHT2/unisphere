import { useParams, useNavigate } from 'react-router-dom';
import { usePosts } from '@/hooks/usePosts';
import { PostForm } from '@/components/post/PostForm';
import { PostFormData } from '@/types/post';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const { getPostById, updatePost } = usePosts();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleSave = (data: PostFormData) => {
    if (id) {
      updatePost(id, data);
      navigate('/posts');
    }
  };

  const handleCancel = () => {
    navigate('/posts');
  };

  if (!post) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Edit Post</h1>
        <p className="text-muted-foreground mt-1">
          Update your post content and settings
        </p>
      </div>

      <PostForm
        post={post}
        onSave={handleSave}
        onCancel={handleCancel}
        isEdit={true}
      />
    </div>
  );
};