export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface EditPostModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface AuthState {
  user: AuthUser | null;
}

export interface RootState {
  auth: AuthState;
} 