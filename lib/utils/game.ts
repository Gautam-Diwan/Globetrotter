import { Destination, Clue, Fact } from '../types';

export function getRandomClues(destination: Destination, count: number = 2): Clue[] {
  if (!destination.clues.length) return [];
  
  const shuffled = [...destination.clues].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getRandomFact(destination: Destination): Fact | null {
  if (!destination.facts.length) return null;
  
  const randomIndex = Math.floor(Math.random() * destination.facts.length);
  return destination.facts[randomIndex];
}

export function generateOptions(correctDestination: Destination, allDestinations: Destination[], count: number = 4): string[] {
  // Always include the correct answer
  const options = [correctDestination.name];
  
  // Filter out the correct destination from all destinations
  const otherDestinations = allDestinations.filter(d => d.id !== correctDestination.id);
  
  // Shuffle the remaining destinations
  const shuffled = [...otherDestinations].sort(() => 0.5 - Math.random());
  
  // Add random destinations until we reach the desired count
  for (let i = 0; i < Math.min(count - 1, shuffled.length); i++) {
    options.push(shuffled[i].name);
  }
  
  // Shuffle the options so the correct answer isn't always first
  return options.sort(() => 0.5 - Math.random());
}