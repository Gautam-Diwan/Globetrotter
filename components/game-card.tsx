"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Confetti } from '@/components/ui/confetti';
import { Clue, Fact } from '@/lib/types';
import { CheckCircle, XCircle } from 'lucide-react';

interface GameCardProps {
  clues: Clue[];
  options: string[];
  destinationId: string;
  onAnswer: (isCorrect: boolean, fact: Fact) => void;
  onNextQuestion: () => void;
  userId?: string;
}

export function GameCard({ clues, options, destinationId, onAnswer, onNextQuestion, userId }: GameCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [fact, setFact] = useState<Fact | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSubmit = async () => {
    if (!selectedOption) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/game/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destinationId,
          answer: selectedOption,
          userId,
        }),
      });
      
      const data = await response.json();
      
      setIsCorrect(data.isCorrect);
      setFact(data.fact);
      setIsAnswered(true);
      
      if (data.isCorrect) {
        setShowConfetti(true);
      }
      
      onAnswer(data.isCorrect, data.fact);
    } catch (error) {
      console.error('Error checking answer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setFact(null);
    setShowConfetti(false);
    onNextQuestion();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Globetrotter Challenge</CardTitle>
        <CardDescription>Guess the destination based on the clues</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Clues:</h3>
          <ul className="space-y-2">
            {clues.map((clue) => (
              <li key={clue.id} className="p-3 bg-secondary rounded-md">
                {clue.text}
              </li>
            ))}
          </ul>
        </div>
        
        {!isAnswered ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Where is this place?</h3>
            <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption}>
              {options.map((option) => (
                <div key={option} className="flex items-center space-x-2 p-2 hover:bg-secondary/50 rounded-md">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="flex-1 cursor-pointer">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {isCorrect ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <h3 className="text-lg font-medium text-green-500">Correct!</h3>
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-500" />
                  <h3 className="text-lg font-medium text-red-500">Incorrect!</h3>
                </>
              )}
            </div>
            
            {fact && (
              <div className="p-4 bg-secondary rounded-md">
                <h4 className="font-medium mb-1">Fun Fact:</h4>
                <p>{fact.text}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!isAnswered ? (
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedOption || isLoading}
            className="w-full"
          >
            {isLoading ? 'Checking...' : 'Submit Answer'}
          </Button>
        ) : (
          <Button 
            onClick={handleNextQuestion}
            className="w-full"
          >
            Next Question
          </Button>
        )}
      </CardFooter>
      
      <Confetti isActive={showConfetti} />
    </Card>
  );
}