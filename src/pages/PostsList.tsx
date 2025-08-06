import { useState } from 'react';
import { Plus, Search, Filter, Grid, List } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import { Post } from '@/types/post';
import { PostCard } from '@/components/post/PostCard';
import { DeleteDialog } from '@/components/post/DeleteDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const PostsList = () => {
  const { posts, deletePost } = usePosts();
  console.log('PostsList - Current posts:', posts);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  // Get unique tags
  const uniqueTags = Array.from(new Set(posts.filter(p => p.tag).map(p => p.tag)));

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'all' || post.tag === selectedTag;
    return matchesSearch && matchesTag;
  });

  const handleEdit = (post: Post) => {
    navigate(`/posts/edit/${post.id}`);
  };

  const handleView = (post: Post) => {
    navigate(`/posts/${post.id}`);
  };

  const handleDeleteClick = (post: Post) => {
    setPostToDelete(post);
  };

  const handleDeleteConfirm = () => {
    if (postToDelete) {
      deletePost(postToDelete.id);
      setPostToDelete(null);
      toast({
        title: 'Post Deleted',
        description: 'The post has been deleted successfully.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Posts</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize your content
          </p>
        </div>
        <Button 
          onClick={() => navigate('/posts/new')}
          variant="twitter"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 glass-card p-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={selectedTag} onValueChange={setSelectedTag}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {uniqueTags.map(tag => (
              <SelectItem key={tag} value={tag!}>{tag}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex border border-border rounded-md">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="rounded-r-none"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="rounded-l-none"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Posts Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredPosts.length} of {posts.length} posts
      </div>

      {/* Posts Grid/List */}
      {filteredPosts.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onView={handleView}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 glass-card">
          <Search className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No posts found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || selectedTag !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first post'
            }
          </p>
          {!searchTerm && selectedTag === 'all' && (
            <Button 
              onClick={() => navigate('/posts/new')}
              variant="twitter"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          )}
        </div>
      )}

      {/* Delete Dialog */}
      <DeleteDialog
        post={postToDelete}
        isOpen={!!postToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPostToDelete(null)}
      />
    </div>
  );
};