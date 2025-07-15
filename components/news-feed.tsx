import { newsItems } from "@/lib/mockData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export function NewsFeed() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Latest News</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newsItems.map((news) => (
            <div key={news.id} className="flex gap-3 p-2 hover:bg-secondary/50 rounded-md transition-colors">
              <div className="w-20 h-20 relative shrink-0">
                <Image
                  src={news.imageUrl}
                  alt={news.title}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium line-clamp-2 text-sm">{news.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{news.summary}</p>
                <div className="flex justify-between mt-1.5">
                  <span className="text-xs font-medium">{news.source}</span>
                  <span className="text-xs text-muted-foreground">{news.publishedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}