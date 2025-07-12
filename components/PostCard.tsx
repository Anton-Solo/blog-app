import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Post } from '@/types';
import { categoryImages } from '@/constants';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/post/${post.id}`}
      className="group"
      style={{ textDecoration: 'none' }}
    >
      <Card className="relative overflow-hidden transition-colors duration-200 group-hover:bg-black/10 cursor-pointer">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${categoryImages[post.category] || ''})` }}
        />
        <div className="relative z-10">
          <CardHeader>
            <CardTitle className="text-gray-900 group-hover:text-black">
              {post.title}
            </CardTitle>
            <CardDescription className="truncate text-gray-700 group-hover:text-gray-900">
              {post.content}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 mb-2">
              <span>By: {post.author}</span>
              <span className="ml-4">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium mb-2">
              {post.category}
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
} 