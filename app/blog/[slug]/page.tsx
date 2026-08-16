import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, User, Eye, Tag, ArrowLeft, BookOpen, List, ChevronRight } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import { getBlogData, getBlogBySlug, getPublishedBlogs } from "@/lib/data";
import { generateSEOMetadata } from "@/lib/seo";
import { generateToc } from "@/lib/markdown";
import BlogContent from "@/components/sections/BlogContent";
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

  // Generate TOC from markdown content
  const toc = generateToc(post.content);

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
            <div className="max-w-7xl mx-auto">
              <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} className="mb-6" />

              <div className="flex items-center gap-2 mb-4">
                <span className="bg-maroon-700 text-white text-xs font-bold px-3 py-1 rounded-full">{post.category}</span>
                <span className="bg-gold-50 text-gold-700 border border-gold-200 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> {post.readingTime} menit baca
                </span>
                {post.isPublished && <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-2.5 py-1 rounded-full">Published</span>}
              </div>

              <h1 className="text-3xl lg:text-[42px] font-bold leading-[1.15] tracking-tight text-foreground max-w-4xl">{post.title}</h1>

              <p className="text-lg text-muted-foreground leading-relaxed mt-4 max-w-3xl">{post.excerpt}</p>

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
          <div className="max-w-7xl mx-auto">
            <div className="relative h-[360px] lg:h-[480px] rounded-[2rem] overflow-hidden bg-muted border shadow-soft">
              <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="(max-width: 1280px) 100vw, 1280px" priority />
            </div>
          </div>
        </div>

        {/* Main Content with TOC Left */}
        <div className="container mx-auto px-4 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-[280px_1fr_300px] gap-8 lg:gap-10 items-start">
            {/* TOC - Left Side - Sticky */}
            <div className="hidden lg:block sticky top-24 self-start">
              <div className="bg-white border-2 border-gold-100 rounded-2xl shadow-soft overflow-hidden">
                <div className="bg-gradient-to-r from-maroon-700 to-maroon-800 text-white p-4">
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    <List className="w-4 h-4 text-gold-300" />
                    Daftar Isi
                  </h4>
                  <p className="text-[11px] text-white/70 mt-1">{toc.length} topik • Klik untuk lompat</p>
                </div>
                
                <div className="p-3 max-h-[70vh] overflow-y-auto">
                  {toc.length === 0 ? (
                    <p className="text-xs text-muted-foreground p-2">Tidak ada daftar isi, artikel terlalu pendek.</p>
                  ) : (
                    <nav className="space-y-1">
                      {toc.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={`group flex items-start gap-2 px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-maroon-50 hover:text-maroon-700 ${
                            item.level === 3 ? "ml-4 text-xs text-muted-foreground border-l-2 border-gold-100 pl-4" : "font-medium text-foreground"
                          }`}
                        >
                          <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-gold-400 group-hover:text-maroon-600 group-hover:translate-x-0.5 transition-all" />
                          <span className="leading-snug">{item.text}</span>
                        </a>
                      ))}
                    </nav>
                  )}
                </div>

                <div className="p-3 border-t bg-gold-50/50">
                  <p className="text-[11px] text-muted-foreground">💡 Klik judul di atas untuk lompat ke bagian artikel</p>
                </div>
              </div>

              {/* CTA in TOC sidebar */}
              <div className="mt-4 bg-gradient-to-br from-maroon-700 to-maroon-900 text-white rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "16px 16px" }} />
                <div className="relative">
                  <h5 className="font-bold text-sm">Butuh Kubah Masjid?</h5>
                  <p className="text-xs text-white/70 mt-2 leading-relaxed">Gratis desain 3D & survey se-Indonesia. Tim BSA hubungi &lt;5 menit.</p>
                  <Link href="/kontak" className="mt-3 inline-flex w-full justify-center bg-gold-400 text-maroon-900 text-xs font-bold py-2.5 rounded-xl hover:bg-gold-300 transition-colors">
                    Konsultasi Gratis
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile TOC - Collapsible on top */}
            <div className="lg:hidden col-span-full">
              <details className="bg-white border-2 border-gold-100 rounded-2xl shadow-soft overflow-hidden group">
                <summary className="flex items-center justify-between p-4 cursor-pointer bg-gradient-to-r from-maroon-700 to-maroon-800 text-white list-none">
                  <span className="font-bold text-sm flex items-center gap-2">
                    <List className="w-4 h-4 text-gold-300" /> Daftar Isi ({toc.length} topik)
                  </span>
                  <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="p-3 max-h-[50vh] overflow-y-auto">
                  <nav className="space-y-1">
                    {toc.map((item) => (
                      <a key={item.id} href={`#${item.id}`} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-maroon-50 ${item.level === 3 ? "ml-4 text-xs" : "font-medium"}`}>
                        <ChevronRight className="w-3 h-3 text-gold-400" />
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </details>
            </div>

            {/* Main Content */}
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

            {/* Right Sidebar */}
            <div className="hidden lg:block space-y-6 sticky top-24 self-start">
              <div className="bg-white border rounded-2xl p-5 shadow-soft">
                <h4 className="font-bold text-sm mb-3">Tentang Penulis</h4>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-maroon-700 text-white flex items-center justify-center font-bold">B</div>
                  <div>
                    <p className="font-bold text-sm">{post.author}</p>
                    <p className="text-xs text-muted-foreground">Tim Tehnis BSA GRC</p>
                    <p className="text-xs text-muted-foreground mt-1">{post.readingTime} menit baca • {post.views} views</p>
                  </div>
                </div>
              </div>

              <div className="bg-gold-50 border-2 border-gold-200 rounded-2xl p-5">
                <h4 className="font-bold text-sm mb-2 text-gold-800">Butuh Penawaran {post.category}?</h4>
                <p className="text-xs text-gold-700/80 leading-relaxed">Gratis desain 3D, survey lokasi nasional, garansi 1 tahun, harga pabrik langsung dari Trenggalek.</p>
                <Link href="/kontak" className="mt-4 inline-flex w-full justify-center bg-maroon-700 text-white text-xs font-bold py-3 rounded-xl hover:bg-maroon-800 shadow-maroon">
                  Form Penawaran Gratis
                </Link>
                <p className="text-[11px] text-center text-muted-foreground mt-2">Respon &lt;5 menit • Data dari Neon DB</p>
              </div>

              <div className="bg-white border rounded-2xl p-5 shadow-soft">
                <h4 className="font-bold text-sm mb-3">Artikel Terkait</h4>
                <div className="space-y-3">
                  {allRelated.slice(0, 3).map((r) => (
                    <Link key={r.id} href={`/blog/${r.slug}`} className="block group">
                      <p className="font-semibold text-sm group-hover:text-maroon-700 line-clamp-2 leading-snug">{r.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{r.category} • {r.readingTime} menit</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {allRelated.length > 0 && (
          <section className="py-12 bg-muted/30 border-t">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <h3 className="font-bold text-xl mb-6">Artikel Terkait Lainnya</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {allRelated.map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="bg-white rounded-2xl border shadow-soft overflow-hidden hover:shadow-large transition-all p-5 group">
                      <span className="text-xs bg-maroon-50 text-maroon-700 border border-maroon-100 px-2.5 py-1 rounded-full font-semibold">{relatedPost.category}</span>
                      <p className="font-bold text-sm mt-3 line-clamp-2 group-hover:text-maroon-700">{relatedPost.title}</p>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{relatedPost.excerpt}</p>
                    </Link>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Link href="/blog" className="inline-flex items-center gap-2 border-2 px-6 py-3 rounded-xl text-sm font-bold hover:bg-maroon-700 hover:text-white hover:border-maroon-700 transition-all">
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
