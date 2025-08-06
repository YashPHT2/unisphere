import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import { Post } from '@/types/post';
import { PostCard } from '@/components/post/PostCard';
import { DeleteDialog } from '@/components/post/DeleteDialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const SearchPosts = () => {
  const { posts, deletePost } = usePosts();
  console.log('SearchPosts - Current posts:', posts);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  // Get unique tags
  const uniqueTags = Array.from(new Set(posts.filter(p => p.tag).map(p => p.tag)));

  // Advanced search functionality
  const searchResults = posts.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.tag && post.tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
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
      <div>
        <h1 className="text-3xl font-bold text-foreground">Search Posts</h1>
        <p className="text-muted-foreground mt-1">
          Find content quickly with advanced search and filtering
        </p>
      </div>

      {/* Search Interface */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search by title, description, or tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 text-base"
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
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
            {searchTerm && ` for "${searchTerm}"`}
          </span>
          {(searchTerm || selectedTag !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedTag('all');
              }}
              className="text-twitter-blue hover:text-twitter-blue-light"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map(post => (
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
          <h3 className="text-lg font-medium text-foreground mb-2">No results found</h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedTag !== 'all' 
              ? 'Try adjusting your search terms or removing filters'
              : 'Enter a search term to find posts'
            }
          </p>
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