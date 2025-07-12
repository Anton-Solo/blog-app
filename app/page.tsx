export const revalidate = 60;
import PostsList from '../components/PostsList';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Post } from '@/types';

export default async function Home() {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  const posts: Post[] = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
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
  });

  return <PostsList posts={posts} />;
}
