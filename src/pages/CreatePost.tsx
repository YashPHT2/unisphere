import { usePosts } from '@/hooks/usePosts';
import { PostForm } from '@/components/post/PostForm';
import { PostFormData } from '@/types/post';
import { useNavigate } from 'react-router-dom';

export const CreatePost = () => {
  const { createPost } = usePosts();
  const navigate = useNavigate();

  const handleSave = (data: PostFormData) => {
    createPost(data);
    navigate('/posts');
  };

  const handleCancel = () => {
    navigate('/posts');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create New Post</h1>
        <p className="text-muted-foreground mt-1">
          Add a new post to your content library
        </p>
      </div>

      <PostForm
        onSave={handleSave}
        onCancel={handleCancel}
        isEdit={false}
      />
    </div>
  );
};