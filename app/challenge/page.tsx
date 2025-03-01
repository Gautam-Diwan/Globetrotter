"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { GameCard } from '@/components/game-card';
import { ScoreDisplay } from '@/components/score-display';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Destination, Clue, Fact } from '@/lib/types';
import { GlobeIcon, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ChallengePage() {
  const searchParams = useSearchParams();
  const challengeUsername = searchParams.get('username');
  
  const [currentDestination, setCurrentDestination] = useState<Destination | null>(null);
  const [selectedClues, setSelectedClues] = useState<Clue[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [challengerScore, setChallengerScore] = useState(0);

  const fetchRandomGame = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/game/random');
      const data = await response.json();
      
      setCurrentDestination(data.destination);
      setSelectedClues(data.clues);
      setOptions(data.options);
    } catch (error) {
      console.error('Error fetching random game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomGame();
    
    if (challengeUsername) {
      fetchUserScore(challengeUsername);
    }
  }, [challengeUsername]);

  const fetchUserScore = async (username: string) => {
    try {
      const response = await fetch(`/api/users?username=${encodeURIComponent(username)}`);
      
      if (response.ok) {
        const userData = await response.json();
        setChallengerScore(userData.score || 0);
      }
    } catch (error) {
      console.error('Error fetching user score:', error);
    }
  };

  const handleAnswer = (isCorrect: boolean, fact: Fact) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCorrect(prev => prev + 1);
    } else {
      setIncorrect(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <GlobeIcon className="h-6 w-6" />
            <h1 className="text-xl font-bold">Globetrotter Challenge</h1>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {challengeUsername && (
          <div className="mb-8 p-4 bg-secondary rounded-lg">
            <h2 className="text-xl font-bold mb-2">
              You've been challenged by {challengeUsername}!
            </h2>
            <p className="text-muted-foreground">
              Their score: <span className="font-bold">{challengerScore}</span>. Can you beat it?
            </p>
          </div>
        )}
        
        <div className="grid gap-8 md:grid-cols-[1fr_300px]">
          <div className="space-y-8">
            {isLoading ? (
              <div className="w-full h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              currentDestination && (
                <GameCard
                  clues={selectedClues}
                  options={options}
                  destinationId={currentDestination.id}
                  onAnswer={handleAnswer}
                  onNextQuestion={fetchRandomGame}
                />
              )
            )}
            
            <Button 
              onClick={fetchRandomGame} 
              disabled={isLoading}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              New Question
            </Button>
          </div>
          
          <div className="space-y-6">
            <ScoreDisplay
              score={score}
              correct={correct}
              incorrect={incorrect}
            />
            
            {challengeUsername && (
              <>
                <Separator />
                
                <div className="p-4 bg-secondary rounded-lg">
                  <h3 className="font-medium mb-2">Challenge Status:</h3>
                  {score > challengerScore ? (
                    <p className="text-green-500 font-bold">
                      You're winning! Keep going!
                    </p>
                  ) : score === challengerScore ? (
                    <p className="text-yellow-500 font-bold">
                      You're tied! One more correct answer to win!
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      You need {challengerScore - score + 1} more points to win!
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}