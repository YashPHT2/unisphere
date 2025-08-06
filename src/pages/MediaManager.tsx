import { useState } from 'react';
import { MediaLibrary } from '@/components/media/MediaLibrary';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const MediaManager = () => {
  const [isLibraryOpen, setIsLibraryOpen] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Media Library</h1>
          <p className="text-muted-foreground mt-1">
            Manage your images, documents and media files
          </p>
        </div>
        <Button 
          onClick={() => setIsLibraryOpen(true)}
          variant="twitter"
        >
          <Plus className="w-4 h-4 mr-2" />
          Upload Media
        </Button>
      </div>

      <MediaLibrary
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        allowMultiple={true}
      />
    </div>
  );
};