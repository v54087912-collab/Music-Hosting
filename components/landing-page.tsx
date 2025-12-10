import React from 'react';
import { BarChart3, Lightbulb, Trophy, Rocket, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface LandingPageProps {
  onAnalyze: (url: string) => void;
  isAnalyzing: boolean;
}

export function LandingPage({ onAnalyze, isAnalyzing }: LandingPageProps) {
  const [url, setUrl] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-[#0f172a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0f172a]/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
               <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">YT Analyzer</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#" className="hover:text-white transition-colors">Home</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
             <Button variant="ghost" className="hidden md:inline-flex text-slate-300 hover:text-white hover:bg-slate-800">Login</Button>
             <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center py-20 md:py-32 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-blue-600/30 bg-blue-600/10 px-3 py-1 text-sm font-medium text-blue-400">
              <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2 animate-pulse"></span>
              v2.0 is now live
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Get Your Free <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">YouTube SEO Score</span>
              <br/> Instantly
            </h1>
            <p className="text-lg text-slate-400 max-w-xl">
              Paste your video URL below to uncover key insights, optimize your metadata, and boost your rankings with our AI-powered analysis tool.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg">
              <Input
                placeholder="Enter YouTube Video URL..."
                className="h-12 bg-slate-900/50 border-slate-700 text-base"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <Button type="submit" size="lg" className="h-12 px-8 bg-blue-600 hover:bg-blue-700" disabled={isAnalyzing}>
                {isAnalyzing ? "Analyzing..." : "Analyze Now"}
              </Button>
            </form>

            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0f172a] bg-slate-700 flex items-center justify-center text-xs text-white">
                    <span className="sr-only">User</span>
                  </div>
                ))}
              </div>
              <p>Trusted by 10,000+ Creators</p>
            </div>
          </div>

          <div className="relative">
             <div className="relative rounded-2xl border border-slate-800 bg-slate-900/50 p-2 shadow-2xl">
                {/* Abstract visual representation of the app or the rocket image from the prompt */}
                <div className="aspect-video rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden flex items-center justify-center relative">
                   {/* Mimicking the rocket image */}
                   <Rocket className="w-32 h-32 text-blue-500 animate-bounce duration-[3000ms]" />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent opacity-60"></div>

                   {/* Floating cards for effect */}
                   <div className="absolute bottom-8 left-8 p-3 rounded-lg bg-slate-800 border border-slate-700 shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-4 fade-in duration-1000 delay-300">
                      <div className="p-2 bg-green-500/20 rounded-md">
                        <Trophy className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">SEO Score</p>
                        <p className="text-sm font-bold text-white">98/100</p>
                      </div>
                   </div>

                   <div className="absolute top-8 right-8 p-3 rounded-lg bg-slate-800 border border-slate-700 shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 fade-in duration-1000 delay-500">
                      <div className="p-2 bg-blue-500/20 rounded-md">
                        <Youtube className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Rank #1</p>
                        <p className="text-sm font-bold text-white">Trending</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover Powerful Features</h2>
              <p className="text-slate-400 text-lg">Everything you need to optimize your videos and climb the search rankings.</p>
            </div>
            <Button variant="outline" className="border-slate-700 hover:bg-slate-800">View All Features</Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle>In-Depth SEO Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">Receive a detailed score based on titles, descriptions, tags, and more to identify gaps.</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 hover:border-purple-500/50 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <Lightbulb className="w-6 h-6 text-purple-400" />
                </div>
                <CardTitle>Actionable Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">Get clear, step-by-step tips to improve your video&apos;s visibility and click-through rates.</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 hover:border-green-500/50 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                  <Trophy className="w-6 h-6 text-green-400" />
                </div>
                <CardTitle>Competitor Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">See how you stack up against top-ranking videos in your niche and steal their strategies.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2024 YT Analyzer. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
