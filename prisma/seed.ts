import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.clue.deleteMany();
  await prisma.fact.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.game.deleteMany();
  await prisma.user.deleteMany();

  // Create sample destinations
  const paris = await prisma.destination.create({
    data: {
      name: 'Paris',
      country: 'France',
      continent: 'Europe',
      clues: {
        create: [
          { text: 'This city is known as the "City of Light"', difficulty: 'easy' },
          { text: 'A famous iron tower dominates the skyline of this city', difficulty: 'easy' },
          { text: 'This city is divided by a river with many historic bridges', difficulty: 'medium' },
          { text: 'This city hosted the 1900 and 1924 Summer Olympics', difficulty: 'hard' },
        ],
      },
      facts: {
        create: [
          { text: 'The Eiffel Tower was originally intended as a temporary structure', isFunny: false },
          { text: 'There is a smaller replica of the Statue of Liberty on an island in the Seine River', isFunny: true },
          { text: 'This city has more dogs than children', isFunny: true },
        ],
      },
    },
  });

  const tokyo = await prisma.destination.create({
    data: {
      name: 'Tokyo',
      country: 'Japan',
      continent: 'Asia',
      clues: {
        create: [
          { text: 'This city is the most populous metropolitan area in the world', difficulty: 'medium' },
          { text: 'This city has the world\'s busiest pedestrian crossing', difficulty: 'medium' },
          { text: 'This city hosted the 2020 Summer Olympics (held in 2021)', difficulty: 'easy' },
          { text: 'This city has over 200 Michelin-starred restaurants', difficulty: 'hard' },
        ],
      },
      facts: {
        create: [
          { text: 'This city has over 12,000 vending machines', isFunny: false },
          { text: 'There is a cat café where you can drink coffee surrounded by cats', isFunny: true },
          { text: 'The city\'s subway system employs "pushers" to help squeeze passengers into crowded trains', isFunny: true },
        ],
      },
    },
  });

  const newyork = await prisma.destination.create({
    data: {
      name: 'New York City',
      country: 'United States',
      continent: 'North America',
      clues: {
        create: [
          { text: 'This city is known as the "Big Apple"', difficulty: 'easy' },
          { text: 'This city has a famous statue that was a gift from France', difficulty: 'easy' },
          { text: 'This city has a large green space in the middle of its main island', difficulty: 'medium' },
          { text: 'This city\'s subway system has 472 stations', difficulty: 'hard' },
        ],
      },
      facts: {
        create: [
          { text: 'The New York Public Library has over 50 million items', isFunny: false },
          { text: 'There are more than 26,000 restaurants in this city', isFunny: false },
          { text: 'Pizza rats are considered unofficial mascots of the city', isFunny: true },
        ],
      },
    },
  });

  const sydney = await prisma.destination.create({
    data: {
      name: 'Sydney',
      country: 'Australia',
      continent: 'Oceania',
      clues: {
        create: [
          { text: 'This city has a famous opera house with a unique sail-like design', difficulty: 'easy' },
          { text: 'This city hosted the 2000 Summer Olympics', difficulty: 'medium' },
          { text: 'This city has the world\'s largest natural harbor', difficulty: 'medium' },
          { text: 'This city\'s name comes from a British Home Secretary', difficulty: 'hard' },
        ],
      },
      facts: {
        create: [
          { text: 'The Sydney Harbour Bridge is nicknamed "The Coathanger"', isFunny: true },
          { text: 'The Sydney Opera House has over one million roof tiles', isFunny: false },
          { text: 'This city has over 100 beaches', isFunny: false },
        ],
      },
    },
  });

  const cairo = await prisma.destination.create({
    data: {
      name: 'Cairo',
      country: 'Egypt',
      continent: 'Africa',
      clues: {
        create: [
          { text: 'This city is located near some of the world\'s most famous ancient pyramids', difficulty: 'easy' },
          { text: 'This city is situated along the banks of the longest river in the world', difficulty: 'medium' },
          { text: 'This city\'s name means "The Victorious" in Arabic', difficulty: 'hard' },
          { text: 'This city is home to one of the oldest Islamic universities in the world', difficulty: 'hard' },
        ],
      },
      facts: {
        create: [
          { text: 'This city is called "The City of a Thousand Minarets"', isFunny: false },
          { text: 'The traffic in this city is so chaotic that locals joke it has its own rules of physics', isFunny: true },
          { text: 'This city has a "City of the Dead" which is a massive cemetery where people actually live', isFunny: true },
        ],
      },
    },
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