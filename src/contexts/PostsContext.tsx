import React, { createContext, useContext } from 'react';
import { usePosts } from '@/hooks/usePosts';
import { Post, PostFormData } from '@/types/post';

interface PostsContextType {
  posts: Post[];
  createPost: (formData: PostFormData) => Post;
  updatePost: (id: string, formData: PostFormData) => void;
  deletePost: (id: string) => void;
  getPostById: (id: string) => Post | undefined;
  importPosts: (importedPosts: any[]) => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const postsHook = usePosts();
  
  return (
    <PostsContext.Provider value={postsHook}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePostsContext = () => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePostsContext must be used within a PostsProvider');
  }
  return context;
};