import { useState, useEffect } from 'react';
import { Post, PostFormData } from '../types/post';

const STORAGE_KEY = 'cms-posts';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  // Load posts from localStorage on mount
  useEffect(() => {
    const savedPosts = localStorage.getItem(STORAGE_KEY);
    console.log('Loading posts from localStorage:', savedPosts);
    if (savedPosts) {
      try {
        const parsedPosts = JSON.parse(savedPosts);
        console.log('Parsed posts:', parsedPosts);
        setPosts(parsedPosts);
      } catch (error) {
        console.error('Error loading posts from localStorage:', error);
      }
    }
  }, []);

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    console.log('Saving posts to localStorage:', posts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const createPost = (formData: PostFormData) => {
    console.log('Creating post with data:', formData);
    const newPost: Post = {
      id: crypto.randomUUID(),
      title: formData.title,
      description: formData.description,
      tag: formData.tag,
      image: formData.image,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    console.log('New post created:', newPost);
    setPosts(prev => {
      const updatedPosts = [newPost, ...prev];
      console.log('Updated posts array:', updatedPosts);
      return updatedPosts;
    });
    return newPost;
  };

  const updatePost = (id: string, formData: PostFormData) => {
    setPosts(prev => prev.map(post => 
      post.id === id 
        ? { ...post, ...formData, updatedAt: new Date().toISOString() }
        : post
    ));
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(post => post.id !== id));
  };

  const getPostById = (id: string) => {
    return posts.find(post => post.id === id);
  };

  const importPosts = (importedPosts: any[]) => {
    const newPosts = importedPosts.map(post => ({
      id: crypto.randomUUID(),
      title: post.title,
      description: post.description,
      tag: post.tag,
      image: post.image,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    
    setPosts(prev => [...prev, ...newPosts]);
  };

  return {
    posts,
    createPost,
    updatePost,
    deletePost,
    getPostById,
    importPosts,
  };
};