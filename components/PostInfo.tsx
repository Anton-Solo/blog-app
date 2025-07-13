import Image from 'next/image';
import { Post } from '@/types';
import { categoryImages } from '@/constants';
import DateDisplay from './DateDisplay';

export default function PostInfo({ post }: { post: Post }) {
  
  return (
    <>
        {categoryImages[post.category] && (
        <Image
          src={categoryImages[post.category]}
          alt={post.category}
          className="rounded-xl mb-6 w-full max-h-72 object-cover border shadow"
          width={800}
          height={300}
          priority
        />
        )}
        <div className="mb-2 text-gray-500">By: {post.author}</div>
        <div className="mb-2 text-gray-500">Category: {post.category}</div>
        <div className="mb-2 text-gray-500">Created: <DateDisplay isoString={post.createdAt} /></div>
        <div className="mb-6 text-lg whitespace-pre-line">{post.content}</div>
    </>
    
  );
} 