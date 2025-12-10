'use client';

import React, { useState } from 'react';
import { LandingPage } from '@/components/landing-page';
import { Dashboard } from '@/components/dashboard';
import { mockAnalysisData } from '@/lib/mock-data';

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<typeof mockAnalysisData | null>(null);

  const handleAnalyze = async (_url: string) => {
    setIsAnalyzing(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAnalysisData(mockAnalysisData);
    setIsAnalyzing(false);
  };

  const handleBack = () => {
    setAnalysisData(null);
  };

  const handleReanalyze = async () => {
      // For now, just simulate a reload of data
      setIsAnalyzing(true); // Maybe add a local loading state in dashboard if I wanted to be fancy, but global is fine or passed down
      // Actually dashboard doesn't use isAnalyzing prop, so I won't block UI there unless I add it.
      // But since we are mocking, let's just do nothing or show a toast.
      // Let's just simulate delay.
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Data stays the same
  };

  if (analysisData) {
    return (
      <Dashboard
        data={analysisData}
        onBack={handleBack}
        onReanalyze={handleReanalyze}
      />
    );
  }

  return (
    <LandingPage
      onAnalyze={handleAnalyze}
      isAnalyzing={isAnalyzing}
    />
  );
}
