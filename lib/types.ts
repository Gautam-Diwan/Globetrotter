export interface Destination {
  id: string;
  name: string;
  country: string;
  continent: string;
  clues: Clue[];
  facts: Fact[];
}

export interface Clue {
  id: string;
  text: string;
  difficulty: string;
}

export interface Fact {
  id: string;
  text: string;
  isFunny: boolean;
}

export interface User {
  id: string;
  username: string;
  score: number;
}

export interface Game {
  id: string;
  userId: string;
  score: number;
  correct: number;
  incorrect: number;
}

export interface GameState {
  currentDestination: Destination | null;
  options: string[];
  selectedClues: Clue[];
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  score: number;
  correct: number;
  incorrect: number;
  fact: Fact | null;
}