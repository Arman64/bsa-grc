import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Tag, User, Eye } from "lucide-react";
import type { BlogPost } from "@/lib/data";

interface BlogCardProps {
 post: BlogPost;
 variant?: "default" | "featured";
}

export function BlogCard({ post, variant = "default" }: BlogCardProps) {
 const isFeatured = variant === "featured";

 return (
 <Link
  href={`/blog/${post.slug}`}
  className={`group bg-white rounded-2xl border shadow-soft overflow-hidden hover:shadow-large hover:-translate-y-1 transition-all duration-500 flex flex-col ${isFeatured ? "lg:flex-row" : ""}`}
 >
  <div className={`relative overflow-hidden bg-muted flex-shrink-0 ${isFeatured ? "lg:w-1/2 h-64 lg:h-auto" : "h-48"}`}>
  <Image
   src={post.coverImage}
   alt={post.title}
   fill
   className="object-cover group-hover:scale-105 transition-transform duration-700"
   sizes={isFeatured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
   loading="lazy"
  />
  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold border border-gold-200">
   {post.category}
  </div>
  {isFeatured && (
   <div className="absolute top-3 right-3 bg-gold-400 text-maroon-900 text-xs font-bold px-3 py-1 rounded-full shadow-gold">
   Featured
   </div>
  )}
  </div>

  <div className="p-5 flex flex-col flex-1">
  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
   <span className="flex items-center gap-1">
   <Calendar className="w-3 h-3" />
   {new Date(post.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
   </span>
   <span className="flex items-center gap-1">
   <Clock className="w-3 h-3" />
   {post.readingTime || 5} menit
   </span>
   <span className="flex items-center gap-1">
   <Eye className="w-3 h-3" />
   {post.views}
   </span>
  </div>

  <h3 className={`font-bold leading-tight group-hover:text-maroon-700 transition-colors line-clamp-2 ${isFeatured ? "text-xl lg:text-2xl" : "text-[15px]"}`}>{post.title}</h3>

  <p className="text-sm text-muted-foreground line-clamp-2 mt-3 leading-relaxed flex-1">{post.excerpt}</p>

  <div className="mt-4 flex items-center justify-between">
   <div className="flex items-center gap-2">
   <div className="w-6 h-6 rounded-full bg-maroon-100 flex items-center justify-center">
    <User className="w-3 h-3 text-maroon-700" />
   </div>
   <span className="text-xs font-medium">{post.author}</span>
   </div>
   <div className="flex gap-1">
   {post.tags.slice(0, 2).map((tag) => (
    <span key={tag} className="text-[10px] bg-muted border px-2 py-1 rounded-full">
    {tag}
    </span>
   ))}
   </div>
  </div>
  </div>
 </Link>
 );
}

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
 if (posts.length === 0) {
 return (
  <div className="text-center py-16 bg-white rounded-2xl border">
  <p className="text-muted-foreground">Belum ada artikel.</p>
  </div>
 );
 }

 const featured = posts[0];
 const rest = posts.slice(1);

 return (
 <div className="space-y-8">
  {featured && <BlogCard post={featured} variant="featured" />}
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {rest.map((post) => (
   <BlogCard key={post.id} post={post} />
  ))}
  </div>
 </div>
 );
}
