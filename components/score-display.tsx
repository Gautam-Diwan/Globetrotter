"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ScoreDisplayProps {
  score: number;
  correct: number;
  incorrect: number;
  username?: string;
}

export function ScoreDisplay({ score, correct, incorrect, username }: ScoreDisplayProps) {
  const total = correct + incorrect;
  const correctPercentage = total > 0 ? (correct / total) * 100 : 0;
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">
          {username ? `${username}'s Score` : 'Your Score'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Total Score:</span>
          <span className="text-2xl font-bold">{score}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Correct: {correct}</span>
            <span>Incorrect: {incorrect}</span>
          </div>
          <Progress value={correctPercentage} className="h-2" />
          <div className="text-xs text-muted-foreground text-right">
            {correctPercentage.toFixed(0)}% correct
          </div>
        </div>
      </CardContent>
    </Card>
  );
}