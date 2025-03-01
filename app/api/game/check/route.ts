import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRandomFact } from '@/lib/utils/game';

export async function POST(request: Request) {
  try {
    const { destinationId, answer, userId } = await request.json();
    
    if (!destinationId || !answer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get the correct destination
    const destination = await prisma.destination.findUnique({
      where: { id: destinationId },
      include: { 
        facts: true,
        clues: true 
      },
    });
    
    if (!destination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      );
    }
    
    // Check if the answer is correct
    const isCorrect = destination.name === answer;
    
    // Get a random fact
    const fact = getRandomFact(destination);
    
    // Update user score if userId is provided
    let user = null;
    if (userId) {
      // First, update the user's score
      user = await prisma.user.update({
        where: { id: userId },
        data: {
          score: { increment: isCorrect ? 1 : 0 },
        },
      });
      
      // Then separately update or create a game for this user
      await prisma.game.upsert({
        where: { 
          id: userId // Assuming game ID is the same as user ID
        },
        create: {
          userId,
          score: isCorrect ? 1 : 0,
          correct: isCorrect ? 1 : 0,
          incorrect: isCorrect ? 0 : 1
        },
        update: {
          score: { increment: isCorrect ? 1 : 0 },
          correct: { increment: isCorrect ? 1 : 0 },
          incorrect: { increment: isCorrect ? 0 : 1 }
        }
      });
    }
    
    return NextResponse.json({
      isCorrect,
      fact,
      user,
    });
  } catch (error) {
    console.error('Error checking answer:', error);
    return NextResponse.json(
      { error: 'Failed to check answer' },
      { status: 500 }
    );
  }
}