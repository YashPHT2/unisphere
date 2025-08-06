export interface Post {
  id: string;
  title: string;
  description: string;
  tag?: string;
  image?: string; // Base64 image data
  createdAt: string;
  updatedAt: string;
}

export interface PostFormData {
  title: string;
  description: string;
  tag?: string;
  image?: string; // Base64 image data
}