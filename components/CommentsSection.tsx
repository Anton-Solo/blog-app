"use client";

import { useSelector } from 'react-redux';
import {  RootState } from '@/types';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "./ui/form";
import CommentCard from './CommentCard';
import { useGetCommentsQuery, useAddCommentMutation } from '@/slices/commentsApi';

const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment is too long"),
});

type CommentFormValues = z.infer<typeof commentSchema>;

export default function CommentsSection({ postId }: { postId: string }) {
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: comments = [], isLoading, error } = useGetCommentsQuery(postId);
  const [addComment, { isLoading: isSubmitting }] = useAddCommentMutation();

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: CommentFormValues) => {
    try {
      await addComment({
        postId,
        author: user?.displayName || user?.email || (user ? 'User' : 'anonymous'),
        authorId: user?.uid || '',
        content: data.content.trim(),
      }).unwrap();
      form.reset();
      toast.success('Comment added!');
    } catch {
      toast.error('Failed to add comment');
    }
  };

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold mb-4">Comments</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-6 space-y-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Add a comment..."
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add comment'}
            </Button>
          </div>
        </form>
      </Form>
      {isLoading ? (
        <div className="text-gray-400">Loading comments...</div>
      ) : error ? (
        <div className="text-red-500">Failed to load comments</div>
      ) : comments.length === 0 ? (
        <div className="text-gray-400">No comments yet</div>
      ) : (
        <ul className="space-y-4">
          {comments.map(comment => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </ul>
      )}
    </div>
  );
} 