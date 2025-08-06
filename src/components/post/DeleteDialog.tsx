import { AlertTriangle } from 'lucide-react';
import { Post } from '@/types/post';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteDialogProps {
  post: Post | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteDialog = ({ post, isOpen, onConfirm, onCancel }: DeleteDialogProps) => {
  if (!post) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-cms-danger">
            <AlertTriangle className="w-5 h-5" />
            Delete Post
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="font-medium text-foreground">{post.title}</p>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {post.description}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-cms-danger hover:bg-red-700"
          >
            Delete Post
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};