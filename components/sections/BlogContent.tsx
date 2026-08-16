"use client";

import { useMemo } from "react";
import { marked } from "marked";

interface BlogContentProps {
  content: string;
}

export default function BlogContent({ content }: BlogContentProps) {
  const html = useMemo(() => {
    try {
      // Configure marked minimal
      const parsed = marked.parse(content, { async: false }) as string;
      return parsed;
    } catch {
      return `<p>${content.replace(/\n/g, "<br/>")}</p>`;
    }
  }, [content]);

  return (
    <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-8 prose-h3:text-xl prose-p:leading-relaxed prose-p:text-[15px] prose-a:text-maroon-700 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-img:rounded-2xl prose-img:shadow-soft prose-table:border prose-th:bg-muted prose-td:border prose-li:marker:text-maroon-700">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
