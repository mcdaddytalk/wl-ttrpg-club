"use client";

import React from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

type Clamp = 1 | 2 | 3 | 4 | 5 | 6;
const clampClassMap: Record<Clamp, string> = {
  1: "line-clamp-1",
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
  6: "line-clamp-6",
};

function clampTo1to6(n: number): Clamp {
  return Math.min(Math.max(n, 1), 6) as Clamp;
}

type BaseProps = {
  children: string;
  className?: string;
  clamp?: Clamp; // visual clamp helper
};

/** Shared component overrides for block/prose rendering */
const proseComponents: Components = {
  // Open links in a new tab with safe rel
  a: ({ href, children, className, ...rest }) => (
    <a
      href={href}
      {...rest}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("underline underline-offset-2", className)}
    >
      {children}
    </a>
  ),

  /** Block code: style the <pre> wrapper */
  pre: ({ children, className, ...rest }) => (
    <pre
      className={cn("rounded-md border bg-muted/50 p-3 overflow-x-auto", className)}
      {...rest}
    >
      {children}
    </pre>
  ),

  /** Inline code (also wraps the <code> inside <pre>, which is fine) */
  code: ({ className, children, ...rest }) => (
    <code className={cn("px-1 py-0.5 rounded bg-muted", className)} {...rest}>
      {children}
    </code>
  ),

  // Make tables horizontally scrollable
  table: ({ children, className, ...rest }) => (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full", className)} {...rest}>
        {children}
      </table>
    </div>
  ),
};

/** Block/prose Markdown (good for previews and full bodies) */
export function Markdown({ children, className, clamp }: BaseProps) {
  const clamped = clamp ? clampClassMap[clampTo1to6(clamp)] : undefined;

  return (
    <div 
      className={cn(
        "prose prose-sm max-w-full dark:prose-invert",
        "prose-pre:whitespace-pre-wrap prose-pre:break-words prose-code:break-words",
        "[overflow-wrap:anywhere] [word-break:break-word]",
         clamped,
          className
        )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={proseComponents}
      >
        {children || ""}
      </ReactMarkdown>
    </div>
  );
}

/** Inline/compact Markdown (great for list rows and titles) */
/** Inline/compact Markdown (great for list rows and titles) */
const inlineComponents: Components = {
  // Paragraphs become spans to avoid extra block spacing in inline contexts
  p: ({ children }) => <span>{children}</span>,

  a: ({ href, children, className, ...rest }) => (
    <a
      href={href}
      {...rest}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("underline", className)}
    >
      {children}
    </a>
  ),

  // No inline prop here either—just style the code element
  code: ({ className, children, ...rest }) => (
    <code className={cn("px-1 rounded bg-muted", className)} {...rest}>
      {children}
    </code>
  ),
};

export function MarkdownInline({ children, className, clamp }: BaseProps) {
  const clamped = clamp ? clampClassMap[clampTo1to6(clamp)] : undefined;

  return (
    <span className={cn("inline break-words", clamped, className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={inlineComponents}>
        {children || ""}
      </ReactMarkdown>
    </span>
  );
}