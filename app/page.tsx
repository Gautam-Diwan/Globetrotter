"use client";

import { useState, useEffect } from 'react';
import { GameCard } from '@/components/game-card';
import { ScoreDisplay } from '@/components/score-display';
import { ChallengeFriend } from '@/components/challenge-friend';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Destination, Clue, Fact } from '@/lib/types';
import { GlobeIcon, RefreshCw } from 'lucide-react';

export default function Home() {
  const [currentDestination, setCurrentDestination] = useState<Destination | null>(null);
  const [selectedClues, setSelectedClues] = useState<Clue[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');

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
    
    // Check URL for username parameter (for challenges)
    const urlParams = new URLSearchParams(window.location.search);
    const challengeUsername = urlParams.get('username');
    
    if (challengeUsername) {
      fetchUserScore(challengeUsername);
    }
  }, []);

  const fetchUserScore = async (username: string) => {
    try {
      const response = await fetch(`/api/users?username=${encodeURIComponent(username)}`);
      
      if (response.ok) {
        const userData = await response.json();
        // Just display the challenged user's score, don't set it as the current user
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

  const handleUsernameChange = (newUsername: string) => {
    setUsername(newUsername);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <GlobeIcon className="h-6 w-6" />
            <h1 className="text-xl font-bold">Globetrotter Challenge</h1>
          </div>
          <Button variant="outline" size="sm" onClick={fetchRandomGame} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            New Game
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
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
                  userId={userId}
                />
              )
            )}
          </div>
          
          <div className="space-y-6">
            <ScoreDisplay
              score={score}
              correct={correct}
              incorrect={incorrect}
              username={username}
            />
            
            <Separator />
            
            <ChallengeFriend
              username={username}
              score={score}
              onUsernameChange={handleUsernameChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
}