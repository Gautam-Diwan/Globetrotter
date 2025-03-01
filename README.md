# Globetrotter Challenge - The Ultimate Travel Guessing Game

Globetrotter Challenge is a full-stack web application where users get cryptic clues about famous places and must guess which destination they refer to. Once they guess, they'll unlock fun facts and trivia about the destination!

## Live Demo

Try the app: [Globetrotter Challenge](https://globetrotter-sandy.vercel.app/)

## Features

- Random destination selection with cryptic clues
- Multiple-choice answers
- Immediate feedback with animations (confetti for correct answers)
- Score tracking
- Challenge friends via shareable links
- Fun facts and trivia about destinations

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes with route handlers
- **Database**: Supabase PostgreSQL 16 with Prisma ORM
- **Animations**: canvas-confetti for celebration animations
- **Image Generation**: html-to-image for challenge sharing
- **Deployment**: Vercel with serverless functions

## Architecture

The application follows a modern full-stack architecture:

- **App Router**: Next.js 15 App Router for server-side rendering and client components
- **Server Components**: Leveraging React Server Components for better performance
- **API Layer**: Next.js route handlers for backend API endpoints
- **Database Layer**: Prisma ORM for type-safe database access
- **Authentication**: Stateless session management
- **UI Components**: Modular, reusable components built with shadcn/ui and Tailwind CSS

## Setup Instructions

### Prerequisites

- Node.js (v20 or higher)
- PostgreSQL database [v16 or higher]

### Installation

1. Clone the repository:
   ```
   git clone git@github.com:Gautam-Diwan/Globetrotter.git
   ```

2. Install dependencies:
   ```
   npm i
   ```

3. Set up your environment variables:
   Create a `.env` file in the root directory with the following:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/globetrotter?schema=public"
   DIRECT_URL="postgresql://username:password@localhost:5432/globetrotter?schema=public"
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

- `/app` - Next.js app router pages, layouts, and API route handlers
- `/components` - Reusable React components
- `/lib` - Utility functions, data fetching, and types
- `/prisma` - Prisma schema and migrations
- `/hooks` - Custom React hooks for state management and side effects

## API Endpoints

- `GET /api/destinations` - Get all destinations
- `GET /api/game/random` - Get a random game with clues and options
- `POST /api/game/check` - Check an answer
- `POST /api/users` - Create or find a user
- `GET /api/users?username=xyz` - Get a user by username

## Database Schema

The application uses a PostgreSQL database with the following models:

![Database Schema](./schema.png)

- `Destination` - Information about travel destinations (name, country, continent)
- `Clue` - Cryptic clues for destinations with difficulty levels
- `Fact` - Fun facts and trivia about destinations
- `User` - User information and overall scores
- `Game` - Game session information tracking correct/incorrect answers

## Deployment

This application is deployed on Vercel, taking advantage of:

- Vercel Postgres for the database
- Vercel Edge Functions for API routes
- Vercel CDN for static assets and caching

## License

MIT