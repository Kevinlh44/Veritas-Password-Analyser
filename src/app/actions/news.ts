"use server";

export interface CyberNewsItem {
  id: number;
  title: string;
  url: string;
  time: number;
  score: number;
}

export async function fetchCyberNews(): Promise<CyberNewsItem[]> {
  try {
    // Fetch top stories from Hacker News
    const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty", {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!res.ok) throw new Error("Failed to fetch top stories");
    
    const storyIds: number[] = await res.json();
    
    // Grab the first 15 stories, filter for tech/security relevance manually if needed, 
    // but top HackerNews is generally acceptable. We'll just grab top 5 for the preview.
    const top5Ids = storyIds.slice(0, 5);
    
    const stories = await Promise.all(
      top5Ids.map(async (id) => {
        const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`, {
          next: { revalidate: 3600 }
        });
        return itemRes.json();
      })
    );

    return stories.filter(story => story && story.title && story.url).map(story => ({
      id: story.id,
      title: story.title,
      url: story.url,
      time: story.time,
      score: story.score
    }));
  } catch (error) {
    console.error("Error fetching cyber news:", error);
    return [];
  }
}
