import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import { PostsList } from "./pages/PostsList";
import { CreatePost } from "./pages/CreatePost";
import { EditPost } from "./pages/EditPost";
import { ViewPost } from "./pages/ViewPost";
import { SearchPosts } from "./pages/SearchPosts";
import { Analytics } from "./pages/Analytics";
import { MediaManager } from "./pages/MediaManager";
import { ImportExport } from "./pages/ImportExport";
import { Settings } from "./pages/Settings";
import { ThemeProvider } from "./contexts/ThemeContext";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <DashboardLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/posts" element={<PostsList />} />
              <Route path="/posts/new" element={<CreatePost />} />
              <Route path="/posts/edit/:id" element={<EditPost />} />
              <Route path="/posts/:id" element={<ViewPost />} />
              <Route path="/search" element={<SearchPosts />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/media" element={<MediaManager />} />
              <Route path="/import-export" element={<ImportExport />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DashboardLayout>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
