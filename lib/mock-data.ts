export const mockAnalysisData = {
  videoTitle: "How to Rank #1 on YouTube in 2024",
  channelName: "MrBeast",
  stats: {
    seoScore: 85,
    seoScoreChange: 5,
    views: "1.2M",
    viewsChange: -2,
    likes: "98K",
    likesChange: 1,
    comments: "4.2K",
    commentsChange: 8,
  },
  titleAnalysis: [
    { text: "Title contains target keyword", passed: true },
    { text: "Title length is optimal (55 chars)", passed: true },
    { text: "Keyword at the beginning", passed: true }
  ],
  tags: [
    "YouTube SEO",
    "Rank #1",
    "Video Marketing",
    "2024 Guide",
    "Growth Hacking"
  ],
  competitors: [
    {
      id: "1",
      title: "The Ultimate SEO Tutorial for Beginners",
      views: "2.1M",
      score: 92,
      thumbnail: "/placeholder"
    },
    {
      id: "2",
      title: "How I Got 1M Views With SEO",
      views: "1.8M",
      score: 88,
      thumbnail: "/placeholder"
    },
    {
      id: "3",
      title: "YouTube Ranking Factors Revealed!",
      views: "950K",
      score: 81,
      thumbnail: "/placeholder"
    }
  ]
};
