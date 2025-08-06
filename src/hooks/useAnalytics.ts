import { useState, useEffect } from 'react';
import { Post } from '@/types/post';

export interface AnalyticsData {
  totalPosts: number;
  totalViews: number;
  postsThisMonth: number;
  topTags: { tag: string; count: number }[];
  postsByMonth: { month: string; count: number }[];
  recentActivity: { type: 'created' | 'edited' | 'viewed'; postTitle: string; date: string }[];
}

export const useAnalytics = (posts: Post[]) => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalPosts: 0,
    totalViews: 0,
    postsThisMonth: 0,
    topTags: [],
    postsByMonth: [],
    recentActivity: [],
  });

  useEffect(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    // Calculate basic stats
    const totalPosts = posts.length;
    const postsThisMonth = posts.filter(post => {
      const postDate = new Date(post.createdAt);
      return postDate.getMonth() === thisMonth && postDate.getFullYear() === thisYear;
    }).length;

    // Calculate top tags
    const tagCounts: { [key: string]: number } = {};
    posts.forEach(post => {
      if (post.tag) {
        tagCounts[post.tag] = (tagCounts[post.tag] || 0) + 1;
      }
    });
    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate posts by month (last 6 months)
    const postsByMonth = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(thisYear, thisMonth - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const count = posts.filter(post => {
        const postDate = new Date(post.createdAt);
        return postDate.getMonth() === date.getMonth() && postDate.getFullYear() === date.getFullYear();
      }).length;
      postsByMonth.push({ month: monthName, count });
    }

    // Recent activity (mock some views and edits)
    const recentActivity = posts
      .slice(-10)
      .map(post => ({
        type: 'created' as const,
        postTitle: post.title,
        date: post.createdAt,
      }))
      .reverse();

    setAnalytics({
      totalPosts,
      totalViews: totalPosts * 12, // Mock view count
      postsThisMonth,
      topTags,
      postsByMonth,
      recentActivity,
    });
  }, [posts]);

  return analytics;
};