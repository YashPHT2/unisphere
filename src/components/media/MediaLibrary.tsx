import { useState } from 'react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image, File, Search } from 'lucide-react';
import { useMediaLibrary, MediaItem } from '@/hooks/useMediaLibrary';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface MediaLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (item: MediaItem) => void;
  allowMultiple?: boolean;
}

export const MediaLibrary = ({ isOpen, onClose, onSelect, allowMultiple = false }: MediaLibraryProps) => {
  const { mediaItems, addMediaItem, removeMediaItem } = useMediaLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<MediaItem[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      try {
        await addMediaItem(file);
        toast({
          title: 'File uploaded',
          description: `${file.name} has been added to your media library.`,
        });
      } catch (error) {
        toast({
          title: 'Upload failed',
          description: `Failed to upload ${file.name}.`,
          variant: 'destructive',
        });
      }
    }
  }, [addMediaItem, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const filteredItems = mediaItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItemClick = (item: MediaItem) => {
    if (allowMultiple) {
      setSelectedItems(prev => 
        prev.find(i => i.id === item.id)
          ? prev.filter(i => i.id !== item.id)
          : [...prev, item]
      );
    } else {
      onSelect?.(item);
      onClose();
    }
  };

  const handleSelectMultiple = () => {
    selectedItems.forEach(item => onSelect?.(item));
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] glass-card">
        <DialogHeader>
          <DialogTitle className="text-foreground">Media Library</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-twitter-blue bg-twitter-blue/10' : 'border-border hover:border-twitter-blue/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse (Images, PDFs up to 10MB)
            </p>
            <Button variant="twitter" size="sm">
              Choose Files
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass-input"
            />
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  selectedItems.find(i => i.id === item.id)
                    ? 'border-twitter-blue bg-twitter-blue/10'
                    : 'border-border hover:border-twitter-blue/50'
                }`}
                onClick={() => handleItemClick(item)}
              >
                <div className="aspect-square bg-card flex items-center justify-center">
                  {item.type.startsWith('image/') ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <File className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2">
                  <p className="text-xs text-white truncate">{item.name}</p>
                  <p className="text-xs text-white/60">{formatFileSize(item.size)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeMediaItem(item.id);
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-8">
              <Image className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-foreground font-medium">No media found</p>
              <p className="text-muted-foreground text-sm">
                {searchTerm ? 'Try a different search term' : 'Upload some files to get started'}
              </p>
            </div>
          )}

          {/* Actions */}
          {allowMultiple && selectedItems.length > 0 && (
            <div className="flex justify-between items-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
              </p>
              <Button onClick={handleSelectMultiple} variant="twitter">
                Use Selected
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};