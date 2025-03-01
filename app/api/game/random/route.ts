import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRandomClues, generateOptions, getRandomFact } from '@/lib/utils/game';

// Add dynamic configuration for Next.js static export
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get all destinations
    const allDestinations = await prisma.destination.findMany({
      include: {
        clues: true,
        facts: true,
      },
    });
    
    if (allDestinations.length === 0) {
      return NextResponse.json(
        { error: 'No destinations found in the database' },
        { status: 404 }
      );
    }
    
    // Select a random destination
    const randomIndex = Math.floor(Math.random() * allDestinations.length);
    const selectedDestination = allDestinations[randomIndex];
    
    // Get random clues for the selected destination
    const selectedClues = getRandomClues(selectedDestination, 2);
    
    // Generate options (including the correct answer)
    const options = generateOptions(selectedDestination, allDestinations);
    
    return NextResponse.json({
      destination: {
        id: selectedDestination.id,
        name: selectedDestination.name,
      },
      clues: selectedClues,
      options: options,
    });
  } catch (error) {
    console.error('Error generating random game:', error);
    return NextResponse.json(
      { error: 'Failed to generate random game' },
      { status: 500 }
    );
  }
}