"use client";

import React, { useEffect, useState } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";

interface NewsArticle {
  title: string;
  link: string;
  image_url?: string;
  description?: string;
  source_id?: string;
  pubDate?: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        if (data.status === "success" && Array.isArray(data.results)) {
          setNews(data.results);
        } else {
          setError("Failed to fetch news  articles.");
        }
      } catch (err) {
        setError("Failed to fetch news articles.");
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <main className="min-h-screen py-6 relative">
      <BackgroundBeams />
      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        <h1 className="text-2xl font-bold mb-6">Latest Crypto News</h1>
        {loading && <div className="p-4 text-center">Loading news...</div>}
        {error && <div className="p-4 text-center text-red-500">{error}</div>}
        {!loading && !error && (
          <div className="space-y-4">
            {news.map((article, idx) => (
              <a
                key={idx}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="flex gap-3 p-2 hover:bg-secondary/50 rounded-md transition-colors">
                  {article.image_url ? (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-20 h-20 rounded-md object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-muted rounded-md shrink-0 flex items-center justify-center text-xs text-muted-foreground">
                      No Image
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium line-clamp-2 text-sm">{article.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {article.description || "No summary available."}
                    </p>
                    <div className="flex justify-between mt-1.5">
                      <span className="text-xs font-medium">{article.source_id || "Unknown Source"}</span>
                      <span className="text-xs text-muted-foreground">
                        {article.pubDate ? new Date(article.pubDate).toLocaleString() : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 