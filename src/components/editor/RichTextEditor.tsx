import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Button } from '@/components/ui/button';
import { Image, Link } from 'lucide-react';
import { MediaLibrary } from '@/components/media/MediaLibrary';
import { MediaItem } from '@/hooks/useMediaLibrary';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor = ({ value, onChange, placeholder = "Start writing..." }: RichTextEditorProps) => {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  const insertImage = (item: MediaItem) => {
    const imageMarkdown = `![${item.name}](${item.url})`;
    const before = value.substring(0, cursorPosition);
    const after = value.substring(cursorPosition);
    const newValue = before + imageMarkdown + after;
    onChange(newValue);
    setShowMediaLibrary(false);
  };

  const insertLink = () => {
    const linkMarkdown = `[Link text](https://example.com)`;
    const before = value.substring(0, cursorPosition);
    const after = value.substring(cursorPosition);
    const newValue = before + linkMarkdown + after;
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex gap-2 p-2 glass-card">
        <Button
          type="button"
          variant="glass"
          size="sm"
          onClick={() => setShowMediaLibrary(true)}
        >
          <Image className="h-4 w-4 mr-1" />
          Image
        </Button>
        <Button
          type="button"
          variant="glass"
          size="sm"
          onClick={insertLink}
        >
          <Link className="h-4 w-4 mr-1" />
          Link
        </Button>
      </div>

      {/* Editor */}
      <div data-color-mode="dark">
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || '')}
          preview="edit"
          hideToolbar
          visibleDragbar={false}
          textareaProps={{
            placeholder,
            style: {
              backgroundColor: 'hsl(var(--glass-bg))',
              border: '1px solid hsl(var(--glass-border))',
              color: 'hsl(var(--foreground))',
              fontSize: '14px',
              minHeight: '200px',
            },
            onSelect: (e) => {
              const target = e.target as HTMLTextAreaElement;
              setCursorPosition(target.selectionStart);
            },
          }}
        />
      </div>

      {/* Preview */}
      <div className="glass-card p-4">
        <h4 className="text-sm font-medium text-foreground mb-2">Preview:</h4>
        <div data-color-mode="dark">
          <MDEditor.Markdown 
            source={value || '*Nothing to preview*'} 
            style={{ 
              backgroundColor: 'transparent',
              color: 'hsl(var(--foreground))',
            }}
          />
        </div>
      </div>

      <MediaLibrary
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={insertImage}
      />
    </div>
  );
};