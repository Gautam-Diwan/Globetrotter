import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { username },
    });
    
    // If user doesn't exist, create a new one
    if (!user) {
      user = await prisma.user.create({
        data: {
          username,
          games: {
            create: {
              score: 0,
              correct: 0,
              incorrect: 0,
            },
          },
        },
      });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating/finding user:', error);
    return NextResponse.json(
      { error: 'Failed to create/find user' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    if (username) {
      const user = await prisma.user.findUnique({
        where: { username },
        include: {
          games: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      });
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(user);
    }
    
    const users = await prisma.user.findMany({
      orderBy: {
        score: 'desc',
      },
      take: 10,
    });
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}