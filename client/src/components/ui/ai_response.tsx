'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AiResponseProps {
  content: string;
  isStreaming?: boolean;
  streamingSpeed?: number;
}

export default function AiResponse({ 
  content, 
  isStreaming = false,
  streamingSpeed = 30 // milliseconds per character
}: AiResponseProps) {
  const [displayedContent, setDisplayedContent] = useState('');

  useEffect(() => {
    if (!isStreaming) {
      // Show full content immediately if not streaming
      setDisplayedContent(content);
      return;
    }

    setDisplayedContent('');
    let currentIndex = 0;

    const streamText = () => {
      if (currentIndex < content.length) {
        // Add character by character with slight variations for natural feel
        setDisplayedContent(content.substring(0, currentIndex + 1));
        currentIndex++;

        // Vary speed slightly for natural streaming effect
        const randomDelay = streamingSpeed + Math.random() * 15 - 7;
        setTimeout(streamText, randomDelay);
      }
    };

    const timer = setTimeout(streamText, streamingSpeed);

    return () => clearTimeout(timer);
  }, [content, isStreaming, streamingSpeed]);

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none 
                    prose-p:leading-7 prose-li:my-1 prose-headings:mb-3
                    prose-code:bg-[#2D2A36] prose-code:text-[#E8D5F2] prose-code:px-2 prose-code:py-1 prose-code:rounded
                    prose-pre:bg-[#2D2A36] prose-pre:border prose-pre:border-[#323042]
                    prose-blockquote:border-l-purple-500 prose-blockquote:text-gray-300">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className, children, ...props }) {
            return (
              <code className="bg-[#2D2A36] text-[#E8D5F2] px-2 py-1 rounded text-sm" {...props}>
                {children}
              </code>
            );
          },
          pre({ node, children, ...props }) {
            return (
              <pre className="bg-[#2D2A36] border border-[#323042] rounded-lg p-4 overflow-x-auto" {...props}>
                {children}
              </pre>
            );
          },
        }}
      >
        {displayedContent}
      </ReactMarkdown>
      {isStreaming && displayedContent.length < content.length && (
        <span className="inline-block w-2 h-5 ml-1 bg-purple-500 animate-pulse" />
      )}
    </div>
  );
}
