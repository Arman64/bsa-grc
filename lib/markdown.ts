import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { slugify } from "./data";

export interface TocItem {
  id: string;
  text: string;
  level: number; // 2 for H2, 3 for H3
}

export function generateToc(markdown: string): TocItem[] {
  const tokens = marked.lexer(markdown);
  const toc: TocItem[] = [];
  const seen = new Map<string, number>();

  for (const token of tokens) {
    if (token.type === "heading" && (token.depth === 2 || token.depth === 3)) {
      const rawText = (token as any).text || "";
      // Strip markdown formatting for TOC text
      const cleanText = rawText.replace(/[*_`[\]#]/g, "").trim();
      let id = slugify(cleanText);

      // Handle duplicate ids
      const count = seen.get(id) || 0;
      if (count > 0) {
        id = `${id}-${count}`;
      }
      seen.set(slugify(cleanText), count + 1);

      toc.push({
        id,
        text: cleanText,
        level: token.depth,
      });
    }
  }

  return toc;
}

export function renderMarkdownWithIds(markdown: string): string {
  const seen = new Map<string, number>();

  const renderer = new marked.Renderer();

  // Custom heading renderer with IDs for TOC anchor
  renderer.heading = function (this: any, token: any) {
    // marked v12+ passes token object, older versions pass text, level, raw
    let text: string;
    let level: number;

    if (typeof token === "object" && token !== null && "text" in token) {
      text = token.text;
      level = token.depth;
    } else {
      // Fallback for older API - token is actually text string
      text = String(token);
      level = arguments[1] as number;
    }

    // Strip HTML tags for ID generation, but keep text for display
    const strippedText = text.replace(/<[^>]*>/g, "").replace(/[*_`]/g, "").trim();
    let id = slugify(strippedText);

    const count = seen.get(id) || 0;
    if (count > 0) {
      id = `${id}-${count}`;
    }
    seen.set(slugify(strippedText), count + 1);

    return `<h${level} id="${id}" class="scroll-mt-24 group relative"><a href="#${id}" class="no-underline"><span class="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gold-500 transition-opacity">#</span>${text}</a></h${level}>\n`;
  };

  // Custom link renderer - internal links maroon red
  renderer.link = function (this: any, token: any) {
    let href: string;
    let title: string | null | undefined;
    let text: string;

    if (typeof token === "object" && token !== null && "href" in token) {
      href = token.href;
      title = token.title;
      text = token.tokens ? this.parser.parseInline(token.tokens) : token.text || "";
    } else {
      href = token;
      title = arguments[1];
      text = arguments[2];
    }

    // Check if internal link (bsagrc.co.id or starts with /)
    const isInternal = href.includes("bsagrc.co.id") || href.startsWith("/") || href.startsWith("#") || (!href.startsWith("http") && !href.startsWith("mailto:") && !href.startsWith("tel:"));
    const cls = isInternal
      ? "text-maroon-700 font-semibold hover:text-gold-600 underline decoration-maroon-200 hover:decoration-gold-400 underline-offset-4 transition-colors"
      : "text-maroon-600 hover:text-maroon-800 underline decoration-gold-200 hover:decoration-maroon-300 underline-offset-4 transition-colors";
    const titleAttr = title ? ` title="${title}"` : "";

    return `<a href="${href}"${titleAttr} class="${cls}">${text}</a>`;
  };

  // Custom table renderer - attractive table
  const originalTable = renderer.table.bind(renderer);
  renderer.table = function (this: any, token: any) {
    const html = originalTable.call(this, token);
    // Wrap table in div for overflow and styling
    return `<div class="my-8 overflow-hidden rounded-2xl border-2 border-gold-100 shadow-large"><div class="overflow-x-auto">${html}</div></div>`;
  };

  // Custom list renderer - attractive bullets will be handled via CSS
  // But we can add classes

  marked.setOptions({
    renderer: renderer as any,
    gfm: true,
    breaks: false,
  });

  let html = marked.parse(markdown, { async: false }) as string;

  // Post-process tables to add attractive styling classes
  html = html.replace(/<table>/g, '<table class="w-full text-sm">');
  html = html.replace(/<thead>/g, '<thead class="bg-gradient-to-r from-maroon-700 to-maroon-800 text-white">');
  html = html.replace(/<th>/g, '<th class="px-5 py-4 text-left font-bold tracking-wide">');
  html = html.replace(/<td>/g, '<td class="px-5 py-3.5 border-t border-gold-50">');
  html = html.replace(/<tr>/g, '<tr class="hover:bg-gold-50/50 transition-colors even:bg-muted/30">');

  // Lists - add custom classes for attractive styling
  html = html.replace(/<ul>/g, '<ul class="my-6 space-y-3">');
  html = html.replace(/<ol>/g, '<ol class="my-6 space-y-3 list-decimal pl-6">');
  html = html.replace(/<li>/g, '<li class="flex gap-3 items-start"><span class="w-2 h-2 rounded-full bg-gold-400 mt-2.5 flex-shrink-0"></span><span class="flex-1">');
  html = html.replace(/<\/li>/g, '</span></li>');

  // Blockquote - attractive
  html = html.replace(/<blockquote>/g, '<blockquote class="border-l-4 border-gold-400 bg-gold-50/50 pl-6 py-4 my-8 rounded-r-2xl italic text-foreground">');

  // Paragraph spacing
  html = html.replace(/<p>/g, '<p class="my-4 leading-relaxed text-[15px]">');

  // SEC: sanitize final HTML - blocks stored XSS from untrusted article content (e.g. via MCP tokens)
  // while still allowing all the custom classes/ids/hrefs injected above.
  html = sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "hr", "strong", "em", "b", "i", "u", "s", "del", "sub", "sup",
      "a", "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6",
      "blockquote", "code", "pre", "span", "div",
      "table", "thead", "tbody", "tr", "th", "td", "img",
    ],
    allowedAttributes: {
      a: ["href", "title", "class"],
      img: ["src", "alt", "title", "width", "height", "class"],
      "*": ["class", "id"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    disallowedTagsMode: "discard",
  });

  return html;
}
