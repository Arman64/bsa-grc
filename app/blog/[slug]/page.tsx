import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, User, Eye, Tag, ArrowLeft, BookOpen } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import { getBlogData, getBlogBySlug, getPublishedBlogs } from "@/lib/data";
import { generateSEOMetadata } from "@/lib/seo";
import BlogContent from "@/components/sections/BlogContent";
import { BlogCard } from "@/components/ui/BlogCard";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ShareButton from "@/components/ui/ShareButton";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  try {
    const blogs = await getBlogData();
    return blogs.map((b) => ({ slug: b.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogBySlug(params.slug);
  if (!post) return {};

  return generateSEOMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    keywords: post.keywords,
    image: post.coverImage,
    url: `${COMPANY_INFO.website}/blog/${post.slug}`,
    type: "article",
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const post = await getBlogBySlug(params.slug);
  if (!post || !post.isPublished) notFound();

  const allBlogs = await getPublishedBlogs();
  const related = allBlogs.filter((b) => b.id !== post.id && b.category === post.category).slice(0, 3);
  const more = related.length < 3 ? allBlogs.filter((b) => b.id !== post.id && !related.some((r) => r.id === b.id)).slice(0, 3 - related.length) : [];

  const allRelated = [...related, ...more];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: post.coverImage,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: COMPANY_INFO.name,
      logo: { "@type": "ImageObject", url: "https://bsagrc.co.id/wp-content/uploads/2023/10/logo-BSA-GRC.png" },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${COMPANY_INFO.website}/blog/${post.slug}` },
    keywords: (post.keywords || post.tags).join(", "),
    articleSection: post.category,
    wordCount: post.content.split(/\s+/).length,
    timeRequired: `PT${post.readingTime || 5}M`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: COMPANY_INFO.website },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${COMPANY_INFO.website}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${COMPANY_INFO.website}/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article className="min-h-screen bg-white">
        <header className="py-8 lg:py-12 bg-gradient-to-br from-white to-gold-50/30 border-b">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} className="mb-6" />

              <div className="flex items-center gap-2 mb-4">
                <span className="bg-maroon-700 text-white text-xs font-bold px-3 py-1 rounded-full">{post.category}</span>
                <span className="bg-gold-50 text-gold-700 border border-gold-200 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> {post.readingTime} menit baca
                </span>
                {post.isPublished && <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-2.5 py-1 rounded-full">Published</span>}
              </div>

              <h1 className="text-3xl lg:text-[40px] font-bold leading-[1.15] tracking-tight text-foreground">{post.title}</h1>

              <p className="text-lg text-muted-foreground leading-relaxed mt-4">{post.excerpt}</p>

              <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" /> {post.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> {new Date(post.publishedAt).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> {post.readingTime} menit
                </span>
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4" /> {post.views} views
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 bg-muted border px-3 py-1 rounded-full text-xs">
                    <Tag className="w-3 h-3" /> {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative h-[360px] lg:h-[480px] rounded-[2rem] overflow-hidden bg-muted border shadow-soft">
              <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 896px" priority />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 pb-16">
          <div className="max-w-4xl mx-auto grid lg:grid-cols-[1fr_240px] gap-10 items-start">
            <div className="min-w-0">
              <BlogContent content={post.content} />

              <div className="mt-12 p-6 bg-muted/50 rounded-2xl border">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-bold">Bagikan artikel ini</p>
                    <p className="text-xs text-muted-foreground mt-1">Bantu panitia masjid lain dapat info kubah terbaik</p>
                  </div>
                  <div className="flex gap-2">
                    <ShareButton title={post.title} text={post.excerpt} />
                    <Link href="/kontak" className="bg-maroon-700 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-maroon-800">
                      Konsultasi Gratis
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-gradient-to-br from-maroon-700 to-maroon-900 text-white rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "16px 16px" }} />
                <div className="relative flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold-400 text-maroon-900 flex items-center justify-center font-bold text-lg flex-shrink-0">B</div>
                  <div>
                    <p className="font-bold">Ditulis oleh {post.author}</p>
                    <p className="text-sm text-white/70 mt-1 leading-relaxed">Tim ahli BSA GRC berpengalaman {COMPANY_INFO.yearsExperience}+ tahun, {COMPANY_INFO.projectsCompleted}+ proyek kubah masjid selesai di seluruh Indonesia.</p>
                    <Link href={COMPANY_INFO.contact.whatsappLink} target="_blank" className="inline-flex mt-3 bg-white text-maroon-800 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-gold-50">
                      Chat WhatsApp {COMPANY_INFO.contact.whatsappDisplay}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block space-y-6 sticky top-24">
              <div className="bg-white border rounded-2xl p-5 shadow-soft">
                <h4 className="font-bold text-sm mb-3">Daftar Isi</h4>
                <p className="text-xs text-muted-foreground">Artikel ini membahas model kubah, harga, bahan & tips memilih kontraktor kubah GRC terbaik.</p>
              </div>

              <div className="bg-gold-50 border border-gold-200 rounded-2xl p-5">
                <h4 className="font-bold text-sm mb-2 text-gold-800">Butuh Penawaran?</h4>
                <p className="text-xs text-gold-700/80 leading-relaxed">Gratis desain 3D, survey lokasi nasional, garansi 1 tahun, harga pabrik langsung.</p>
                <Link href="/kontak" className="mt-3 inline-flex w-full justify-center bg-maroon-700 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-maroon-800">
                  Form Penawaran Gratis
                </Link>
              </div>
            </div>
          </div>
        </div>

        {allRelated.length > 0 && (
          <section className="py-12 bg-muted/30 border-t">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <h3 className="font-bold text-xl mb-6">Artikel Terkait</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {allRelated.map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="bg-white rounded-2xl border shadow-soft overflow-hidden hover:shadow-large transition-all p-4">
                      <p className="font-bold text-sm line-clamp-2">{relatedPost.title}</p>
                      <p className="text-xs text-muted-foreground mt-2">{relatedPost.category}</p>
                    </Link>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Link href="/blog" className="inline-flex items-center gap-2 border px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white transition-colors">
                    <ArrowLeft className="w-4 h-4 rotate-180" /> Lihat Semua Artikel
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  );
}
