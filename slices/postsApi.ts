import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Post } from '../types';

type RTKQueryError = { status: string; error: string };

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Posts'],
  endpoints: (builder) => ({
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
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi; 