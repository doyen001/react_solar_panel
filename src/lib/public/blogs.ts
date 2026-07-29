import { buildBackendUrl } from "@/lib/customers/backend";
import {
  BLOG_DETAIL_DEFAULT,
  type BlogDetailContent,
  type BlogPost,
} from "@/utils/constant";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

type BackendBlogPost = {
  slug: string;
  title: string;
  excerpt?: string | null;
  category?: string | null;
  authorName?: string | null;
  authorAvatarSrc?: string | null;
  authorAvatarAlt?: string | null;
  heroImageSrc?: string | null;
  heroImageAlt?: string | null;
  thumbnailImageSrc?: string | null;
  thumbnailImageAlt?: string | null;
  publishedAt?: string | null;
  readTimeLabel?: string | null;
  content?: {
    breadcrumbTitle?: string;
    body?: string[];
  } | null;
};

function publicUrl(frontendPath: string, backendPath: string) {
  if (typeof window !== "undefined") return frontendPath;
  const backendBaseUrl = process.env.BACKEND_API_BASE_URL;
  if (!backendBaseUrl) return frontendPath;
  return buildBackendUrl(backendBaseUrl, backendPath);
}

function formatDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function toBlogPost(post: BackendBlogPost): BlogPost {
  return {
    id: post.slug,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    category: post.category ?? "News",
    dateLabel: formatDate(post.publishedAt),
    authorName: post.authorName ?? "Easylink Solar",
    authorAvatarSrc: post.authorAvatarSrc ?? "/images/logo.webp",
    authorAvatarAlt: post.authorAvatarAlt ?? "Easylink Solar",
    heroImageSrc: post.heroImageSrc ?? "/images/home/blog-card-bg.png",
    heroImageAlt: post.heroImageAlt ?? "Solar grid graphic background",
    thumbnailImageSrc: post.thumbnailImageSrc ?? "/images/home/solar-panel-design.png",
    thumbnailImageAlt: post.thumbnailImageAlt ?? "Solar panels",
    href: "#",
  };
}

export function toBlogDetailContent(post: BackendBlogPost): BlogDetailContent {
  const card = toBlogPost(post);
  const body = Array.isArray(post.content?.body) && post.content.body.length > 0
    ? post.content.body
    : [card.excerpt];

  return {
    ...BLOG_DETAIL_DEFAULT,
    breadcrumbTitle: post.content?.breadcrumbTitle ?? card.title,
    categoryLabel: card.category,
    dateLabel: card.dateLabel,
    readTimeLabel: post.readTimeLabel ?? BLOG_DETAIL_DEFAULT.readTimeLabel,
    title: card.title,
    attributionName: card.authorName,
    leadParagraph: body[0] ?? card.excerpt,
    featuredImageSrc: card.thumbnailImageSrc,
    featuredImageAlt: card.thumbnailImageAlt,
    bodyParagraphs: body.slice(1),
  };
}

export async function fetchPublicBlogs(): Promise<BlogPost[]> {
  const res = await fetch(publicUrl("/api/blogs?limit=100", "/blogs?limit=100"), {
    cache: "no-store",
  });
  const json = (await res.json()) as ApiEnvelope<BackendBlogPost[]>;
  if (!res.ok) throw new Error(json.message || "Failed to load blog posts");
  return Array.isArray(json.data) ? json.data.map(toBlogPost) : [];
}

export async function fetchPublicBlog(slug: string): Promise<{
  post: BlogPost;
  content: BlogDetailContent;
}> {
  const res = await fetch(publicUrl(`/api/blogs/${slug}`, `/blogs/${slug}`), {
    cache: "no-store",
  });
  const json = (await res.json()) as ApiEnvelope<BackendBlogPost>;
  if (!res.ok || !json.data) throw new Error(json.message || "Failed to load blog post");
  return {
    post: toBlogPost(json.data),
    content: toBlogDetailContent(json.data),
  };
}
