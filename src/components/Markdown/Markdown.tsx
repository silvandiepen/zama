import React, { useEffect, useMemo, useRef } from "react";
import MarkdownIt from "markdown-it";
import { useToast } from "@/store/toast";

type Props = {
  source: string;
  className?: string;
};

export const Markdown: React.FC<Props> = ({ source, className }) => {
  const md = useMemo(
    () =>
      new MarkdownIt({
        html: false,
        linkify: true,
        breaks: false,
        typographer: true,
      }),
    []
  );
  const html = useMemo(() => md.render(source), [md, source]);
  const ref = useRef<HTMLElement | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    
    // Add copy buttons to code blocks with delay to ensure polyfills are loaded
    const addCopyButtons = () => {
      const blocks = root.querySelectorAll("pre > code");
      
      blocks.forEach((code) => {
        const pre = code.parentElement as HTMLElement;
        if (!pre) return;
        if (pre.querySelector(".md-copy")) return;
        
        const btn = document.createElement("button");
        btn.textContent = "Copy";
        btn.className = "md-copy";

        btn.addEventListener("click", async (e) => {
          e.preventDefault();
          try {
            await navigator.clipboard.writeText(code.textContent || "");
            addToast({
              title: "Copied",
              message: "Snippet copied to clipboard",
              variant: "success",
            });
          } catch {
            addToast({
              title: "Copy failed",
              message: "Unable to access clipboard",
              variant: "error",
            });
          }
        });
        pre.style.position = "relative";
        pre.appendChild(btn);
      });
    };

    // Try immediately
    addCopyButtons();
    
    // Also try after a delay in case polyfills affected DOM
    const timeoutId = setTimeout(addCopyButtons, 100);
    const timeoutId2 = setTimeout(addCopyButtons, 500);
    
    // Watch for DOM changes that might affect code blocks
    const observer = new MutationObserver(() => {
      addCopyButtons();
    });
    
    observer.observe(root, {
      childList: true,
      subtree: true
    });
    
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
      observer.disconnect();
    };
  }, [html, addToast]);

  return (
    <article
      ref={ref as any}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
