# Globetrotter Challenge - The Ultimate Travel Guessing Game

Globetrotter Challenge is a full-stack web application where users get cryptic clues about famous places and must guess which destination they refer to. Once they guess, they'll unlock fun facts and trivia about the destination!

## Features

- Random destination selection with cryptic clues
- Multiple-choice answers
- Immediate feedback with animations (confetti for correct answers)
- Score tracking
- Challenge friends via shareable links
- Fun facts and trivia about destinations

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Animations**: canvas-confetti for celebration animations
- **Image Generation**: html-to-image for challenge sharing

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/globetrotter-challenge.git
   cd globetrotter-challenge
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your environment variables:
   Create a `.env` file in the root directory with the following:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/globetrotter?schema=public"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. Set up the database:
   ```
   npx prisma migrate dev --name init
   npm run seed
   ```

5. Start the development server:
   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - React components
- `/lib` - Utility functions and types
- `/prisma` - Prisma schema and migrations

## API Endpoints

- `GET /api/destinations` - Get all destinations
- `GET /api/game/random` - Get a random game with clues and options
- `POST /api/game/check` - Check an answer
- `POST /api/users` - Create or find a user
- `GET /api/users?username=xyz` - Get a user by username

## Database Schema

- `Destination` - Information about travel destinations
- `Clue` - Cryptic clues for destinations
- `Fact` - Fun facts and trivia about destinations
- `User` - User information and scores
- `Game` - Game session information

## Deployment

This application can be deployed on Vercel, Netlify, or any other platform that supports Next.js applications.

## License

MIT