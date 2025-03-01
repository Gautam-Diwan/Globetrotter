import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { PrismaClient } from '@prisma/client';

// Get NODE_ENV from environment or default to local
const environment = process.env.NODE_ENV || 'local';
console.log(`Running seed script in ${environment} environment`);

// Try loading environment-specific .env file
const envFile = `.env.${environment}`;
const envPath = resolve(__dirname, `../${envFile}`);
if (existsSync(envPath)) {
  console.log(`Loading environment variables from ${envFile}`);
  dotenv.config({ path: envPath });
} else {
  console.log(`${envFile} not found, falling back to .env`);
  dotenv.config({ path: resolve(__dirname, '../.env') });
}

// Use DATABASE_URL from environment or fallback to a hardcoded connection string
const databaseUrl = process.env.DATABASE_URL;

// Check if DATABASE_URL is defined
if (!databaseUrl) {
  console.error('ERROR: DATABASE_URL environment variable is not set.');
  console.error('Please set DATABASE_URL in your .env file or environment variables.');
  process.exit(1);
}

// Initialize Prisma with explicit connection URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

// Log the connection URL being used (without password)
console.log('Using database connection:', databaseUrl.replace(/\/\/.*?@/, '//****:****@'));

// Define all seed data
const destinations = [
  {
    name: 'Paris',
    country: 'France',
    continent: 'Europe',
    clues: [
      { text: 'This city is known as the "City of Light"', difficulty: 'easy' },
      { text: 'A famous iron tower dominates the skyline of this city', difficulty: 'easy' },
      { text: 'This city is divided by a river with many historic bridges', difficulty: 'medium' },
      { text: 'This city hosted the 1900 and 1924 Summer Olympics', difficulty: 'hard' },
    ],
    facts: [
      { text: 'The Eiffel Tower was originally intended as a temporary structure', isFunny: false },
      { text: 'There is a smaller replica of the Statue of Liberty on an island in the Seine River', isFunny: true },
      { text: 'This city has more dogs than children', isFunny: true },
    ],
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    continent: 'Asia',
    clues: [
      { text: 'This city is the most populous metropolitan area in the world', difficulty: 'medium' },
      { text: 'This city has the world\'s busiest pedestrian crossing', difficulty: 'medium' },
      { text: 'This city hosted the 2020 Summer Olympics (held in 2021)', difficulty: 'easy' },
      { text: 'This city has over 200 Michelin-starred restaurants', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has over 12,000 vending machines', isFunny: false },
      { text: 'There is a cat café where you can drink coffee surrounded by cats', isFunny: true },
      { text: 'The city\'s subway system employs "pushers" to help squeeze passengers into crowded trains', isFunny: true },
    ],
  },
  {
    name: 'New York City',
    country: 'United States',
    continent: 'North America',
    clues: [
      { text: 'This city is known as the "Big Apple"', difficulty: 'easy' },
      { text: 'This city has a famous statue that was a gift from France', difficulty: 'easy' },
      { text: 'This city has a large green space in the middle of its main island', difficulty: 'medium' },
      { text: 'This city\'s subway system has 472 stations', difficulty: 'hard' },
    ],
    facts: [
      { text: 'The New York Public Library has over 50 million items', isFunny: false },
      { text: 'There are more than 26,000 restaurants in this city', isFunny: false },
      { text: 'Pizza rats are considered unofficial mascots of the city', isFunny: true },
    ],
  },
  {
    name: 'Sydney',
    country: 'Australia',
    continent: 'Oceania',
    clues: [
      { text: 'This city has a famous opera house with a unique sail-like design', difficulty: 'easy' },
      { text: 'This city hosted the 2000 Summer Olympics', difficulty: 'medium' },
      { text: 'This city has the world\'s largest natural harbor', difficulty: 'medium' },
      { text: 'This city\'s name comes from a British Home Secretary', difficulty: 'hard' },
    ],
    facts: [
      { text: 'The Sydney Harbour Bridge is nicknamed "The Coathanger"', isFunny: true },
      { text: 'The Sydney Opera House has over one million roof tiles', isFunny: false },
      { text: 'This city has over 100 beaches', isFunny: false },
    ],
  },
  {
    name: 'Cairo',
    country: 'Egypt',
    continent: 'Africa',
    clues: [
      { text: 'This city is located near some of the world\'s most famous ancient pyramids', difficulty: 'easy' },
      { text: 'This city is situated along the banks of the longest river in the world', difficulty: 'medium' },
      { text: 'This city\'s name means "The Victorious" in Arabic', difficulty: 'hard' },
      { text: 'This city is home to one of the oldest Islamic universities in the world', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city is called "The City of a Thousand Minarets"', isFunny: false },
      { text: 'The traffic in this city is so chaotic that locals joke it has its own rules of physics', isFunny: true },
      { text: 'This city has a "City of the Dead" which is a massive cemetery where people actually live', isFunny: true },
    ],
  },
  {
    name: 'Rome',
    country: 'Italy',
    continent: 'Europe',
    clues: [
      { text: 'This city is known as the "Eternal City"', difficulty: 'easy' },
      { text: 'This city has a famous ancient colosseum', difficulty: 'easy' }, 
      { text: 'This city is home to the Vatican City, which is the smallest country in the world', difficulty: 'medium' },
      { text: 'This city is known for its beautiful fountains', difficulty: 'hard' },
    ],
    facts: [
      { text: 'The Colosseum is the largest amphitheater in the world', isFunny: false },
      { text: 'The Trevi Fountain is the largest Baroque fountain in the world', isFunny: false },
      { text: 'This city is known for its delicious gelato', isFunny: true },
    ],
  },
];

async function main() {
  // Clear existing data
  await prisma.$transaction([
    prisma.clue.deleteMany(),
    prisma.fact.deleteMany(),
    prisma.destination.deleteMany(),
    prisma.game.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // Use transaction to ensure atomicity
  await prisma.$transaction(async (tx) => {
    for (const destination of destinations) {
      // Extract clues and facts
      const { clues, facts, ...destinationData } = destination;
      
      // Create destination
      const createdDestination = await tx.destination.create({
        data: destinationData,
      });
      
      // Create related clues
      if (clues && clues.length > 0) {
        await tx.clue.createMany({
          data: clues.map(clue => ({
            ...clue,
            destinationId: createdDestination.id,
          })),
        });
      }
      
      // Create related facts
      if (facts && facts.length > 0) {
        await tx.fact.createMany({
          data: facts.map(fact => ({
            ...fact,
            destinationId: createdDestination.id,
          })),
        });
      }
    }
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });