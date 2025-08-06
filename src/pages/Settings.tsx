import { Settings as SettingsIcon, Database, Download, Upload, Trash2 } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export const Settings = () => {
  const { posts } = usePosts();
  const { toast } = useToast();
  const [showClearDialog, setShowClearDialog] = useState(false);

  const exportData = () => {
    const dataStr = JSON.stringify(posts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `cms-posts-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Data Exported',
      description: 'Your posts have been exported successfully.',
    });
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        localStorage.setItem('cms-posts', JSON.stringify(importedData));
        window.location.reload(); // Refresh to load imported data
      } catch (error) {
        toast({
          title: 'Import Failed',
          description: 'Invalid file format. Please select a valid JSON file.',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    localStorage.removeItem('cms-posts');
    setShowClearDialog(false);
    window.location.reload();
    toast({
      title: 'Data Cleared',
      description: 'All posts have been deleted.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your CMS data and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <p className="font-medium">Total Posts</p>
                <p className="text-sm text-muted-foreground">{posts.length} posts stored locally</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={exportData}
                variant="outline"
                className="w-full justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                Export All Data
              </Button>

              <div>
                <input
                  type="file"
                  id="import-file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <label htmlFor="import-file" className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Data
                  </label>
                </Button>
              </div>

              <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-cms-danger hover:text-cms-danger hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-cms-danger">Clear All Data</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your posts. This action cannot be undone.
                      Consider exporting your data first.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clearAllData} className="bg-cms-danger hover:bg-red-700">
                      Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="w-5 h-5 mr-2" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">Storage Type</span>
                <span className="text-muted-foreground">LocalStorage</span>
              </div>
              <div className="flex justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">Data Size</span>
                <span className="text-muted-foreground">
                  {new Blob([JSON.stringify(posts)]).size} bytes
                </span>
              </div>
              <div className="flex justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">Version</span>
                <span className="text-muted-foreground">1.0.0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};