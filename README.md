# Blog App

A modern blog platform built with **Next.js**, **TypeScript**, **Redux Toolkit (RTK Query)**, **Firebase Firestore**, and **Zod**. The app supports SSR, adaptive UI, authentication, comments, post CRUD, filtering, and more.

---

## Project Structure

```
blog-app/
├── app/                # Next.js app directory (routing, pages, layout)
│   ├── page.tsx        # Main page (posts list)
│   ├── layout.tsx      # Root layout
│   └── ...
├── components/         # Reusable UI and feature components
│   ├── ui/             # UI primitives (Button, Input, Card, Skeleton, etc.)
│   ├── AddPostForm.tsx
│   ├── EditPostModal.tsx
│   ├── PostCard.tsx
│   ├── PostInfo.tsx
│   ├── CommentsSection.tsx
│   └── ...
├── slices/             # Redux Toolkit slices & RTK Query APIs
│   ├── postsApi.ts
│   ├── commentsApi.ts
│   └── authSlice.ts
├── store/              # Redux store setup
│   └── store.ts
├── constants/          # App-wide constants (categories, images, etc.)
│   └── index.ts
├── types/              # TypeScript types
│   └── index.ts
├── lib/                # Firebase config and helpers
│   └── firebase.ts
├── public/             # Static assets (images, icons)
├── README.md           # Project documentation
└── ...
```

---

## Main Features & Components

- **PostsList**: Displays all posts with category filtering and skeleton loading.
- **PostCard**: Card component for a single post (with category image background).
- **AddPostForm**: Form to create a new post (with Zod validation).
- **EditPostModal**: Modal for editing a post (only for the author).
- **CommentsSection**: Real-time comments for each post (with add comment form).
- **PostInfo**: Shows post details (author, date, content, category image).
- **RTK Query**: All CRUD operations for posts and comments use RTK Query endpoints.
- **Authentication**: Google login (custom button), only authors can edit/delete their posts.
- **Adaptive UI**: Responsive design, modern UI components, skeleton loaders.
- **Firestore Security**: All access is protected by Firestore rules.

---

## Tech Stack
- **Next.js** (App Router, SSR)
- **TypeScript**
- **Redux Toolkit & RTK Query**
- **Firebase Firestore**
- **Zod** (form validation)
- **Tailwind CSS** (UI)

---

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Configure Firebase:**
   - Copy your Firebase config to `.env.local`:
     ```env
     NEXT_PUBLIC_FIREBASE_API_KEY=...
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
     NEXT_PUBLIC_FIREBASE_APP_ID=...
     NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
     ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.
