import { Comment } from '@/types';

interface CommentCardProps {
  comment: Comment;
}

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <li className="bg-gray-50 rounded p-4 border">
      <div className="text-sm text-gray-600 mb-1">
        <span className="font-semibold">{comment.author || 'anonymous'}</span>
        <span className="ml-2 text-xs text-gray-400">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>
      <div className="text-gray-800 whitespace-pre-line">
        {comment.content}
      </div>
    </li>
  );
} 