import React from 'react';
import {
  BarChart3,
  User,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Play,
  Link
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Competitor {
  id: string;
  title: string;
  views: string;
  score: number;
  thumbnail: string;
}

interface AnalysisData {
  videoTitle: string;
  channelName: string;
  stats: {
    seoScore: number;
    seoScoreChange: number;
    views: string;
    viewsChange: number;
    likes: string;
    likesChange: number;
    comments: string;
    commentsChange: number;
  };
  titleAnalysis: Array<{
    text: string;
    passed: boolean;
  }>;
  tags: string[];
  competitors: Competitor[];
}

interface DashboardProps {
  data: AnalysisData;
  onBack: () => void;
  onReanalyze: () => void;
}

export function Dashboard({ data, onBack, onReanalyze }: DashboardProps) {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col">
      {/* Dashboard Navbar */}
      <nav className="border-b border-slate-800 bg-[#0f172a]">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
              <div className="bg-blue-600 p-1.5 rounded-lg">
                 <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block">SEO Analyzer</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <a href="#" className="text-white">Dashboard</a>
              <a href="#" className="hover:text-white transition-colors">Keyword Research</a>
              <a href="#" className="hover:text-white transition-colors">Competitors</a>
            </div>
          </div>

          <div className="flex-1 max-w-xl hidden md:flex items-center gap-2">
            <div className="relative flex-1">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Enter YouTube Video URL..."
                className="pl-9 bg-slate-800 border-slate-700"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">Analyze</Button>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full bg-slate-800 hover:bg-slate-700">
              <User className="w-5 h-5 text-slate-300" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 space-y-6 flex-1">
        {/* Video Header Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 md:p-8 flex flex-col md:flex-row justify-between gap-8 items-start">
          <div className="space-y-4 max-w-2xl">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">{data.videoTitle}</h1>
              <p className="text-slate-400 mt-1">{data.channelName}</p>
            </div>
            <Button variant="secondary" className="gap-2 border border-slate-700" onClick={onReanalyze}>
              Re-analyze <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          <div className="relative w-full md:w-80 aspect-video rounded-lg overflow-hidden bg-slate-800 border border-slate-700 group">
             {/* Placeholder for Video Thumbnail - Rocket Image logic */}
             <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-black flex items-center justify-center">
                 {/* Visual placeholder matching Image 14 roughly */}
                 <div className="text-9xl font-bold text-slate-700/30 select-none absolute right-2 bottom-0">1</div>
                 <div className="relative z-10">
                   {/* Just a visual generic icon since we don't have the actual image assets */}
                   <Play className="w-12 h-12 text-white fill-white opacity-80 group-hover:scale-110 transition-transform duration-300" />
                 </div>
             </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Overall SEO Score"
            value={`${data.stats.seoScore}/100`}
            change={data.stats.seoScoreChange}
          />
          <StatsCard
            title="Views"
            value={data.stats.views}
            change={data.stats.viewsChange}
          />
          <StatsCard
            title="Likes"
            value={data.stats.likes}
            change={data.stats.likesChange}
          />
          <StatsCard
            title="Comments"
            value={data.stats.comments}
            change={data.stats.commentsChange}
          />
        </div>

        {/* Analysis Columns */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column: Title & Tags Analysis */}
          <div className="space-y-6">
             <Card className="bg-slate-900 border-slate-800">
               <CardHeader>
                 <CardTitle className="flex items-center gap-2 text-lg">
                   Title Analysis
                   <span className="text-slate-400 text-base font-normal">(95/100)</span>
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 {data.titleAnalysis.map((item, i) => (
                   <div key={i} className="flex items-start gap-3">
                     <div className={cn("mt-0.5 p-0.5 rounded", item.passed ? "bg-blue-500" : "bg-red-500")}>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                     </div>
                     <span className="text-sm text-slate-300">{item.text}</span>
                   </div>
                 ))}
               </CardContent>
             </Card>

            <Card className="bg-slate-900 border-slate-800">
               <CardHeader>
                 <CardTitle className="text-lg">Tags Analysis</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="flex flex-wrap gap-2">
                   {data.tags.map((tag, i) => (
                     <Badge key={i} variant="secondary" className={cn(
                       "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 py-1 px-3",
                       i % 2 === 0 ? "text-blue-400" : "text-purple-400" // Just alternating colors for variety
                     )}>
                       {tag}
                     </Badge>
                   ))}
                 </div>
               </CardContent>
             </Card>
          </div>

          {/* Right Column: Competitor Analysis */}
          <div className="h-full">
             <Card className="bg-slate-900 border-slate-800 h-full">
               <CardHeader>
                 <CardTitle className="text-lg">Competitor Analysis</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4">
                   <div className="flex justify-between text-xs font-medium text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-800">
                     <span>Competitor Video</span>
                     <div className="flex gap-4">
                       <span>Views</span>
                       <span>SEO Score</span>
                     </div>
                   </div>

                   {data.competitors.map((comp) => (
                     <div key={comp.id} className="flex items-center gap-3 py-2">
                       <div className="w-16 h-10 bg-slate-800 rounded overflow-hidden flex-shrink-0 relative">
                         {/* Placeholder thumb */}
                         <div className="absolute inset-0 bg-slate-700"></div>
                         <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-sm font-medium text-slate-200 truncate pr-2" title={comp.title}>{comp.title}</p>
                       </div>
                       <div className="flex gap-4 text-sm font-medium">
                         <span className="text-slate-400 w-12 text-right">{comp.views}</span>
                         <span className={cn("w-12 text-right", comp.score > 90 ? "text-green-500" : "text-yellow-500")}>{comp.score}/100</span>
                       </div>
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatsCard({ title, value, change }: { title: string, value: string, change: number }) {
  const isPositive = change > 0;
  return (
    <Card className="bg-slate-800/50 border-slate-800">
      <CardContent className="p-6">
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <div className="mt-2 flex items-baseline justify-between">
          <p className="text-3xl font-bold text-white">{value}</p>
          <div className={cn(
            "flex items-center text-sm font-medium",
            isPositive ? "text-green-500" : "text-red-500"
          )}>
            {isPositive ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
            {isPositive ? "+" : ""}{change}%
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
