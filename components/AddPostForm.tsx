"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { useAddPostMutation } from '@/slices/postsApi';
import { useSelector } from "react-redux";
import { RootState } from "../types";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { categories } from "@/constants";

// Типізація помилки RTK Query
interface RTKQueryError {
  status: 'CUSTOM_ERROR';
  error: string;
}

const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  author: z.string().min(2, "Author name must be at least 2 characters"),
  authorId: z.string().min(1, "Author ID is required"),
  category: z.enum(["nature", "food", "travel"]),
  image: z.any().optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

export default function AddPostForm() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [addPost, { isLoading, error }] = useAddPostMutation();
  const router = useRouter();

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      author: "",
      authorId: "",
      category: "nature",
      image: null,
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue("author", user.displayName || user.email || "Unknown");
      form.setValue("authorId", user.uid);
    }
  }, [form, user]);

  const onSubmit = async (data: PostFormValues) => {
    try {
      await addPost({
        ...data,
      }).unwrap();
      toast.success('Post created!');
      form.reset();
      router.push('/');
    } catch (e) {
      toast.error('Error creating post');
    }
  };

  const errorMessage = (() => {
    if (!error) return '';
    
    if (typeof error === 'object' && error !== null && 'status' in error && 'error' in error) {
      const rtkError = error as RTKQueryError;
      if (rtkError.status === 'CUSTOM_ERROR') {
        return rtkError.error;
      }
    }
    
    return typeof error === 'string' ? error : 'Failed to create post';
  })();

  return (
    <Card className="max-w-xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="mb-4">
            <CardTitle>Add new post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Textarea placeholder="Content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {errorMessage && (
              <div className="text-red-500 text-sm">Error: {errorMessage}</div>
            )}
          </CardContent>
          <CardFooter className="mt-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create post'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
} 