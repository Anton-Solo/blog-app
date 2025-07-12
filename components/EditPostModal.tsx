"use client";

import { useEffect } from "react";
import { EditPostModalProps } from "@/types";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { useUpdatePostMutation } from '@/slices/postsApi';
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

const editPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

type EditPostFormValues = z.infer<typeof editPostSchema>;

type RTKQueryError = { status: string; error: string };

function EditPostModal({ post, isOpen, onClose }: Omit<EditPostModalProps, 'onSave' | 'isSaving'>) {
  const [updatePost, { isLoading }] = useUpdatePostMutation();
  const router = useRouter();

  const form = useForm<EditPostFormValues>({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      title: post.title,
      content: post.content,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({ title: post.title, content: post.content });
    }
  }, [isOpen, post]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const onSubmit = async (data: EditPostFormValues) => {
    try {
      await updatePost({ id: post.id, updates: data }).unwrap();
      toast.success("Post updated!");
      router.refresh();
      onClose();
    } catch (error: unknown) {
      let message = "Failed to update post";
      if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        "error" in error &&
        typeof (error as RTKQueryError).error === "string"
      ) {
        message = (error as RTKQueryError).error;
      }
      toast.error(message);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit post</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea rows={6} placeholder="Enter post content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4 mt-6">
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default EditPostModal;