export const revalidate = 60;
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import PostActions from '@/components/PostActions';
import CommentsSection from '@/components/CommentsSection';
import PostInfo from '@/components/PostInfo';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PostPage(props: Props) {
  const { id } = await props.params;
  const docRef = doc(db, 'posts', id);
  const postSnap = await getDoc(docRef);
  if (!postSnap.exists()) return notFound();

  const data = postSnap.data() || {};
  const post = {
    id: id,
    title: data.title || '',
    content: data.content || '',
    author: data.author || '',
    authorId: data.authorId || '',
    category: data.category || '',
    createdAt: typeof data.createdAt === 'string'
      ? data.createdAt
      : (data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : ''),
    updatedAt: typeof data.updatedAt === 'string'
      ? data.updatedAt
      : (data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : ''),
  };

  return (
    <div className="container-small">
      <PostActions post={post} />
      <h1 className="h1">{post.title}</h1>
      <PostInfo post={post} />
      <CommentsSection postId={post.id} />
    </div>
  );
} 