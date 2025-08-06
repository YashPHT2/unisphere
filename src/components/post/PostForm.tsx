import { useState, useEffect } from 'react';
import { Save, X, Upload, Image as ImageIcon } from 'lucide-react';
import { Post, PostFormData } from '@/types/post';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { RichTextEditor } from '@/components/editor/RichTextEditor';

interface PostFormProps {
  post?: Post;
  onSave: (data: PostFormData) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export const PostForm = ({ post, onSave, onCancel, isEdit = false }: PostFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    description: '',
    tag: '',
    image: '',
  });
  const [errors, setErrors] = useState<Partial<PostFormData>>({});

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        description: post.description,
        tag: post.tag || '',
        image: post.image || '',
      });
    }
  }, [post]);

  const validate = (): boolean => {
    const newErrors: Partial<PostFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    onSave({
      title: formData.title.trim(),
      description: formData.description.trim(),
      tag: formData.tag?.trim() || undefined,
      image: formData.image || undefined,
    });

    toast({
      title: isEdit ? 'Post Updated' : 'Post Created',
      description: `Your post has been ${isEdit ? 'updated' : 'created'} successfully.`,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'File too large',
          description: 'Please select an image smaller than 5MB.',
          variant: 'destructive',
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (field: keyof PostFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card className="max-w-2xl mx-auto glass-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          {isEdit ? 'Edit Post' : 'Create New Post'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-foreground">
              Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter post title..."
              className={errors.title ? 'border-red-500' : 'glass-input'}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-foreground">
              Content *
            </Label>
            <RichTextEditor
              value={formData.description}
              onChange={(value) => handleChange('description', value)}
              placeholder="Write your post content here..."
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-sm font-medium text-foreground">
              Featured Image
            </Label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="glass"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Image
                </Button>
                {formData.image && (
                  <Button
                    type="button"
                    variant="glass"
                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {formData.image && (
                <div className="glass-card p-3">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag" className="text-sm font-medium text-foreground">
              Tag / Category
            </Label>
            <Input
              id="tag"
              value={formData.tag}
              onChange={(e) => handleChange('tag', e.target.value)}
              placeholder="Enter a tag or category (optional)..."
              className="glass-input"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="twitter"
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {isEdit ? 'Update Post' : 'Create Post'}
            </Button>
            <Button
              type="button"
              variant="glass"
              onClick={onCancel}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};