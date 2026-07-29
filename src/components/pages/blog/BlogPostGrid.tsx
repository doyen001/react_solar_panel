"use client";

import { BlogPostCard } from "@/components/pages/blog/BlogPostCard";
import { fetchPublicBlogs } from "@/lib/public/blogs";
import type { BlogPost } from "@/utils/constant";
import { useEffect, useState } from "react";

export function BlogPostGrid() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPublicBlogs()
      .then((items) => {
        if (!cancelled) setPosts(items);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load posts");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-6 py-10 text-center text-white">
        {error}
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 justify-items-center gap-x-5 gap-y-[21px] md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <li key={post.id} className="w-full">
          <BlogPostCard post={post} />
        </li>
      ))}
    </ul>
  );
}
