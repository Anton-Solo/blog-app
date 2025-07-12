'use client';

import { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { categories } from '@/constants';
import PostCard from './PostCard';
import { Post } from '@/types';

const cats = [
  { value: 'all', label: 'All categories' },
  ...categories
];

interface PostsListProps {
  posts: Post[];
}

export default function PostsList({ posts }: PostsListProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter((post) => post.category === selectedCategory);

  return (
    <div className="wrapper">
      <h1 className="h1">Blog Posts</h1>
      <div className="mb-6 flex justify-end">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {cats.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <span className="text-gray-400 text-4xl mb-4">🗒️</span>
          <p className="text-gray-500 text-lg">No posts found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
} 