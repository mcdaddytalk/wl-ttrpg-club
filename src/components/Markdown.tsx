"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

const clampClassMap: Record<number, string> = {
  1: "line-clamp-1",
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
  6: "line-clamp-6",
};

type BaseProps = {
  children: string;
  className?: string;
  clamp?: number; // visual clamp helper
};

/** Block/prose Markdown (good for previews and full bodies) */
export function Markdown({ children, className, clamp }: BaseProps) {
  const clamped = clamp ? clampClassMap[Math.min(Math.max(clamp, 1), 6)] : undefined;

  return (
    <div className={cn("prose prose-sm max-w-full dark:prose-invert prose-pre:whitespace-pre-wrap prose-pre:break-words prose-code:break-words [overflow-wrap:anywhere] [word-break:break-word]", clamped, className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // open links in new tab
          a: (props: any) => (
            <a {...props} target="_blank" rel="noopener noreferrer" className={cn("underline underline-offset-2", props.className)} />
          ),
          // code renderer (typed as any to access `inline` in v10)
          code: ({ inline, className, children, ...props }: any) =>
            inline ? (
              <code className={cn("px-1 py-0.5 rounded bg-muted", className)} {...props}>
                {children}
              </code>
            ) : (
              <pre className="rounded-md border bg-muted/50 p-3 overflow-x-auto">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ),
          // make tables scroll
          table: ({ children }: any) => (
            <div className="w-full overflow-x-auto">
              <table className="w-full">{children}</table>
            </div>
          ),
        }}
      >
        {children || ""}
      </ReactMarkdown>
    </div>
  );
}

/** Inline/compact Markdown (great for list rows and titles) */
export function MarkdownInline({ children, className, clamp }: BaseProps) {
  const clamped = clamp ? clampClassMap[Math.min(Math.max(clamp, 1), 6)] : undefined;

  return (
    <span className={cn("inline break-words", clamped, className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }: any) => <span>{children}</span>, // paragraphs→span
          a: (props: any) => <a {...props} target="_blank" rel="noopener noreferrer" className="underline" />,
          code: ({ inline, className, children, ...props }: any) =>
            inline ? (
              <code className={cn("px-1 rounded bg-muted", className)} {...props}>
                {children}
              </code>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            ),
        }}
      >
        {children || ""}
      </ReactMarkdown>
    </span>
  );
}