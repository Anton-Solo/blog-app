import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Post } from '../types';

const convertTimestamp = (timestamp: Timestamp) => {
  return timestamp.toDate().toISOString();
};

type RTKQueryError = { status: string; error: string };

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Posts'],
  endpoints: (builder) => ({
    getPosts: builder.query<
      { posts: Post[]; hasMore: boolean },
      { postsPerPage?: number; lastDoc?: QueryDocumentSnapshot<DocumentData> | null }
    >({
      async queryFn({ postsPerPage = 6, lastDoc = null }) {
        try {
          let q = query(
            collection(db, 'posts'),
            orderBy('createdAt', 'desc'),
            limit(postsPerPage)
          );
          if (lastDoc) {
            q = query(q, startAfter(lastDoc));
          }
          const querySnapshot = await getDocs(q);
          const posts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: convertTimestamp(doc.data().createdAt),
            updatedAt: convertTimestamp(doc.data().updatedAt),
          })) as Post[];
          const hasMore = querySnapshot.docs.length === postsPerPage;
          return { data: { posts, hasMore } };
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
      providesTags: (result) => [{ type: 'Posts', id: 'LIST' }],
    }),
    addPost: builder.mutation<Post, Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'imageUrl'> & { imageUrl?: string }>(
      {
        async queryFn(post) {
          try {
            const now = Timestamp.now();
            const docRef = await addDoc(collection(db, 'posts'), {
              ...post,
              createdAt: now,
              updatedAt: now,
            });
            return {
              data: {
                id: docRef.id,
                ...post,
                createdAt: now.toDate().toISOString(),
                updatedAt: now.toDate().toISOString(),
              } as Post,
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
        invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
      }
    ),
    updatePost: builder.mutation<Post, { id: string; updates: Partial<Post> }>({
      async queryFn({ id, updates }) {
        try {
          const postRef = doc(db, 'posts', id);
          await updateDoc(postRef, {
            ...updates,
            updatedAt: Timestamp.now(),
          });
          return { data: { id, ...updates } as Post };
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
      invalidatesTags: (result, error, { id }) => [
        { type: 'Posts', id: 'LIST' },
        { type: 'Posts', id },
      ],
    }),
    deletePost: builder.mutation<string, string>({
      async queryFn(id) {
        try {
          const postRef = doc(db, 'posts', id);
          await deleteDoc(postRef);
          return { data: id };
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
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi; 