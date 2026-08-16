"use client";

import { useMemo } from "react";
import { renderMarkdownWithIds } from "@/lib/markdown";

interface BlogContentProps {
  content: string;
}

export default function BlogContent({ content }: BlogContentProps) {
  const html = useMemo(() => {
    try {
      return renderMarkdownWithIds(content);
    } catch {
      return `<p>${content.replace(/\n/g, "<br/>")}</p>`;
    }
  }, [content]);

  return (
    <>
      <style jsx global>{`
        /* Attractive Table - Maroon header, gold accents, rounded, shadow */
        .prose table {
          border-collapse: separate;
          border-spacing: 0;
          overflow: hidden;
        }
        
        .prose th {
          background: linear-gradient(135deg, #7A0C10 0%, #5A080C 100%);
          color: white;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.05em;
        }
        
        .prose th:first-child {
          border-top-left-radius: 0;
        }
        
        .prose th:last-child {
          border-top-right-radius: 0;
        }
        
        .prose td {
          border-color: #FDF2F2;
        }
        
        .prose tr:hover td {
          background-color: rgba(212, 175, 55, 0.05);
        }
        
        .prose tr:nth-child(even) td {
          background-color: rgba(249, 245, 241, 0.5);
        }

        /* Attractive Lists - Custom bullets */
        .prose ul {
          list-style: none;
          padding-left: 0;
        }
        
        .prose ul li {
          position: relative;
          padding-left: 0;
        }
        
        .prose ul li span:first-child {
          background: linear-gradient(135deg, #D4AF37 0%, #B8932F 100%);
          box-shadow: 0 2px 4px rgba(212, 175, 55, 0.3);
        }

        /* Internal links - Maroon red per request */
        .prose a.text-maroon-700 {
          color: #7A0C10;
          font-weight: 600;
          text-decoration: underline;
          text-decoration-color: #F9D0D0;
          text-underline-offset: 4px;
          transition: all 0.2s;
        }
        
        .prose a.text-maroon-700:hover {
          color: #B8932F;
          text-decoration-color: #D4AF37;
        }

        /* Headings with anchor */
        .prose h2, .prose h3 {
          scroll-margin-top: 100px;
        }
        
        .prose h2 {
          font-size: 24px;
          font-weight: 800;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #FDF2F2;
          position: relative;
        }
        
        .prose h2::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, #7A0C10, #D4AF37);
        }
        
        .prose h3 {
          font-size: 18px;
          font-weight: 700;
          margin-top: 2rem;
          color: #5A080C;
        }
      `}</style>
      
      <div 
        className="prose prose-neutral max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-[15px] prose-a:no-underline prose-strong:text-foreground prose-img:rounded-2xl prose-img:shadow-soft prose-li:marker:text-maroon-700 prose-li:my-1"
      >
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </>
  );
}
