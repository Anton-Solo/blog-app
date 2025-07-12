import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Comment } from '../types';

type RTKQueryError = { status: string; error: string };

export const commentsApi = createApi({
  reducerPath: 'commentsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Comments'],
  endpoints: (builder) => ({
    getComments: builder.query<Comment[], string>({
      async queryFn(postId) {
        try {
          const q = query(
            collection(db, 'comments'),
            where('postId', '==', postId),
            orderBy('createdAt', 'desc')
          );
          const snapshot = await getDocs(q);
          const comments = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              postId: data.postId,
              author: data.author,
              authorId: data.authorId,
              content: data.content,
              createdAt: typeof data.createdAt === 'string'
                ? data.createdAt
                : (data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : ''),
            } as Comment;
          });
          return { data: comments };
        } catch (error: unknown) {
          let message = 'Unknown error';
          if (
            typeof error === 'object' &&
            error !== null &&
            'message' in error &&
            typeof (error as { message?: string }).message === 'string'
          ) {
            message = (error as { message: string }).message;
          }
          console.error('Firestore error:', message);
          return { error: { status: 'CUSTOM_ERROR', error: message } as RTKQueryError };
        }
      },
      providesTags: (result, error, postId) => [{ type: 'Comments', id: postId }],
    }),
    addComment: builder.mutation<Comment, Omit<Comment, 'id' | 'createdAt'> & { createdAt?: string }>({
      async queryFn(comment) {
        try {
          const docRef = await addDoc(collection(db, 'comments'), {
            ...comment,
            createdAt: Timestamp.now(),
          });
          return {
            data: {
              id: docRef.id,
              ...comment,
              createdAt: Timestamp.now().toDate().toISOString(),
            } as Comment,
          };
        } catch (error: unknown) {
          let message = 'Unknown error';
          if (
            typeof error === 'object' &&
            error !== null &&
            'message' in error &&
            typeof (error as { message?: string }).message === 'string'
          ) {
            message = (error as { message: string }).message;
          }
          return { error: { status: 'CUSTOM_ERROR', error: message } as RTKQueryError };
        }
      },
      invalidatesTags: (result, error, comment) => [{ type: 'Comments', id: comment.postId }],
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useAddCommentMutation,
} = commentsApi; 