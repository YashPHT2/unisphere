import { useState } from 'react';
import { usePosts } from '@/hooks/usePosts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Download, Upload, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const ImportExport = () => {
  const { posts, importPosts } = usePosts();
  const [importData, setImportData] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const exportToJSON = () => {
    const dataStr = JSON.stringify(posts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `cms-posts-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Export successful',
      description: `Exported ${posts.length} posts to JSON file.`,
    });
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Title', 'Description', 'Tag', 'Created At', 'Updated At'];
    const csvContent = [
      headers.join(','),
      ...posts.map(post => [
        post.id,
        `"${post.title.replace(/"/g, '""')}"`,
        `"${post.description.replace(/"/g, '""')}"`,
        `"${post.tag || ''}"`,
        post.createdAt,
        post.updatedAt
      ].join(','))
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `cms-posts-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Export successful',
      description: `Exported ${posts.length} posts to CSV file.`,
    });
  };

  const handleImport = async () => {
    if (!importData.trim()) {
      toast({
        title: 'Import failed',
        description: 'Please paste some data to import.',
        variant: 'destructive',
      });
      return;
    }

    setIsImporting(true);
    try {
      const data = JSON.parse(importData);
      
      if (!Array.isArray(data)) {
        throw new Error('Data must be an array of posts');
      }

      // Validate posts structure
      const validPosts = data.filter(post => 
        post && 
        typeof post.title === 'string' && 
        typeof post.description === 'string'
      );

      if (validPosts.length === 0) {
        throw new Error('No valid posts found in the data');
      }

      await importPosts(validPosts);
      setImportData('');
      
      toast({
        title: 'Import successful',
        description: `Imported ${validPosts.length} posts successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Import failed',
        description: error instanceof Error ? error.message : 'Invalid JSON format',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Import & Export</h1>
        <p className="text-muted-foreground mt-1">
          Backup your data or import content from other sources
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Download your posts in different formats for backup or migration purposes.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={exportToJSON} 
                variant="twitter" 
                className="w-full justify-start"
                disabled={posts.length === 0}
              >
                <FileText className="h-4 w-4 mr-2" />
                Export as JSON ({posts.length} posts)
              </Button>
              
              <Button 
                onClick={exportToCSV} 
                variant="glass" 
                className="w-full justify-start"
                disabled={posts.length === 0}
              >
                <FileText className="h-4 w-4 mr-2" />
                Export as CSV ({posts.length} posts)
              </Button>
            </div>

            {posts.length === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No posts available to export. Create some posts first.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Import Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Import posts from a JSON file. The data will be merged with your existing posts.
            </p>

            <div className="space-y-3">
              <Label htmlFor="import-data" className="text-foreground">
                Paste JSON data here:
              </Label>
              <Textarea
                id="import-data"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder='Paste your JSON data here, e.g., [{"title": "Post Title", "description": "Content...", "tag": "Category"}]'
                className="min-h-[200px] glass-input font-mono text-sm"
              />
              
              <Button 
                onClick={handleImport}
                disabled={!importData.trim() || isImporting}
                variant="twitter"
                className="w-full"
              >
                {isImporting ? 'Importing...' : 'Import Posts'}
              </Button>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Expected format:</strong> Array of objects with "title", "description", and optional "tag" fields.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};