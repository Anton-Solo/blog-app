"use client";

import { useSelector } from 'react-redux';
import { RootState, Post } from '@/types';
import { useDeletePostMutation } from '@/slices/postsApi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EditPostModal from './EditPostModal';

export default function PostActions({ post }: { post: Post }) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  if (!user || user.uid !== post.authorId) return null;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    await deletePost(post.id);
    router.push('/');
  };

  return (
    <>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setIsEditing((v) => !v)}
          className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500 h-max"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 h-max"
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
      <EditPostModal
        post={post}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
      />
    </>
  );
} 