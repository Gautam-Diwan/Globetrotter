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
  {
    name: 'Rio de Janeiro',
    country: 'Brazil',
    continent: 'South America',
    clues: [
      { text: 'This city is famous for its Christ the Redeemer statue', difficulty: 'easy' },
      { text: 'This city hosts one of the biggest carnivals in the world', difficulty: 'medium' },
      { text: 'This city has a famous mountain called Sugarloaf', difficulty: 'medium' },
      { text: 'This city hosted the 2016 Summer Olympics', difficulty: 'hard' },
    ],
    facts: [
      { text: 'The beach sand in this city is imported from the Sahara Desert', isFunny: true },
      { text: 'This city\'s name means "River of January"', isFunny: false },
      { text: 'This city has the largest urban forest in the world', isFunny: false },
    ],
  },
  {
    name: 'Istanbul',
    country: 'Turkey',
    continent: 'Europe',
    clues: [
      { text: 'This city is known as the "City of Two Continents"', difficulty: 'easy' },
      { text: 'This city is home to the world\'s largest underground cistern', difficulty: 'medium' },
      { text: 'This city is known for its unique architecture', difficulty: 'hard' },
      { text: 'This city was once known as Constantinople', difficulty: 'medium' },
    ],
    facts: [
      { text: 'This city has more than 1,500 bridges', isFunny: false },
      { text: 'The Hagia Sophia was originally a church, then a mosque, then a museum, then a mosque again', isFunny: true },
      { text: 'This city is known for its delicious baklava', isFunny: true },
    ],
  },
  {
    name: 'Cape Town',
    country: 'South Africa',
    continent: 'Africa',
    clues: [
      { text: 'This city is known for its beautiful Table Mountain', difficulty: 'easy' },
      { text: 'This city is home to the world\'s largest cable car system', difficulty: 'medium' },
      { text: 'This city is known for its vibrant street art', difficulty: 'hard' },
      { text: 'This city is the legislative capital of South Africa', difficulty: 'medium' },
    ],  
    facts: [
      { text: 'This city has the most diverse floral kingdom in the world', isFunny: false },
      { text: 'This city is home to the oldest functioning windmill in Sub-Saharan Africa', isFunny: true },
      { text: 'There is a colony of African penguins living on the beaches near this city', isFunny: true },
    ],
  },  
  {
    name: 'San Francisco',
    country: 'United States',
    continent: 'North America',
    clues: [
      { text: 'This city is known for its Golden Gate Bridge', difficulty: 'easy' }, 
      { text: 'This city is known for its cable cars', difficulty: 'medium' },
      { text: 'This city is known for its foggy weather', difficulty: 'hard' },
      { text: 'This city is built on more than 40 hills', difficulty: 'medium' },
    ],
    facts: [
      { text: 'This city has the world\'s last manually operated cable car system', isFunny: false },
      { text: 'This city was almost completely destroyed by an earthquake and fire in 1906', isFunny: false },  
      { text: 'The iconic fog in this city has been officially named "Karl"', isFunny: true },
    ],
  },
  {
    name: 'New Delhi',
    country: 'India',
    continent: 'Asia',
    clues: [
      { text: 'This city is known for its Red Fort', difficulty: 'easy' },
      { text: 'This city is known for its unique architecture', difficulty: 'medium' },  
      { text: 'This city is known for its delicious street food', difficulty: 'hard' },
      { text: 'This city has been the capital of multiple empires throughout history', difficulty: 'medium' },  
    ],
    facts: [
      { text: 'This city has the tallest brick minaret in the world', isFunny: false },
      { text: 'This city contains both New Delhi and Old Delhi', isFunny: true },
      { text: 'The Lotus Temple in this city is made of 27 free-standing marble petals', isFunny: false },
    ],
  },
  {
    name: 'Hong Kong',
    country: 'China',
    continent: 'Asia',
    clues: [
      { text: 'This city is known for having the most skyscrapers in the world', difficulty: 'easy' },
      { text: 'This city has a famous symphony of lights show on its harbor every night', difficulty: 'medium' },
      { text: 'This city was a British colony until 1997', difficulty: 'medium' },
      { text: 'This city\'s name means "Fragrant Harbor" in Cantonese', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has the world\'s longest outdoor covered escalator system', isFunny: false },
      { text: 'Despite its small size, this city has over 200 islands', isFunny: false },
      { text: 'In this city, many buildings skip the 4th floor because the word "four" sounds like "death" in Cantonese', isFunny: true },
    ],
  },
  {
    name: 'Beijing',
    country: 'China',
    continent: 'Asia',
    clues: [
      { text: 'This city is home to the Forbidden City palace complex', difficulty: 'easy' },
      { text: 'This city hosted the 2008 Summer Olympics', difficulty: 'medium' },
      { text: 'This city has the world\'s largest palace square', difficulty: 'medium' },
      { text: 'This city\'s name means "Northern Capital"', difficulty: 'hard' },
    ],
    facts: [
      { text: 'The Forbidden City has exactly 9,999 rooms, one short of the mythical 10,000 that would belong to the gods', isFunny: false },
      { text: 'This city\'s subway system is the world\'s busiest with over 10 million daily riders', isFunny: false },
      { text: 'Locals often wear pajamas in public, considering them comfortable outdoor wear', isFunny: true },
    ],
  },
  {
    name: 'Berlin',
    country: 'Germany',
    continent: 'Europe',
    clues: [
      { text: 'This city was once divided by a famous wall', difficulty: 'easy' },
      { text: 'This city is known for its vibrant street art scene', difficulty: 'medium' },
      { text: 'This city has more bridges than Venice', difficulty: 'hard' },
      { text: 'This city has a famous TV tower that is visible from almost anywhere in the city', difficulty: 'medium' },
    ],
    facts: [
      { text: 'This city has the largest train station in Europe', isFunny: false },
      { text: 'This city has more canals than Amsterdam and Venice combined', isFunny: false },
      { text: 'The traffic lights in this city feature a little man with a hat called "Ampelmännchen"', isFunny: true },
    ],
  },
  {
    name: 'Dresden',
    country: 'Germany',
    continent: 'Europe',
    clues: [
      { text: 'This city is known as the "Florence of the Elbe"', difficulty: 'medium' },
      { text: 'This city is famous for its baroque architecture', difficulty: 'medium' },
      { text: 'This city was heavily bombed during World War II but has been meticulously reconstructed', difficulty: 'easy' },
      { text: 'This city is home to one of the world\'s oldest Christmas markets', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city produced the first European porcelain', isFunny: false },
      { text: 'The Green Vault in this city houses one of Europe\'s largest treasure collections', isFunny: false },
      { text: 'A local pastry called Eierschecke is so beloved that locals claim it\'s better than cake', isFunny: true },
    ],
  },
  {
    name: 'Seoul',
    country: 'South Korea',
    continent: 'Asia',
    clues: [
      { text: 'This city has ancient palaces alongside futuristic skyscrapers', difficulty: 'easy' },
      { text: 'This city is surrounded by mountains and bisected by the Han River', difficulty: 'medium' },
      { text: 'This city hosted the 1988 Summer Olympics', difficulty: 'medium' },
      { text: 'This city has a famous district known as "Gangnam"', difficulty: 'easy' },
    ],
    facts: [
      { text: 'This city has the world\'s fastest average internet speed', isFunny: false },
      { text: 'This city\'s subway system is among the world\'s longest and most used', isFunny: false },
      { text: 'This city has over 20,000 coffee shops, more per capita than anywhere else in the world', isFunny: true },
    ],
  },
  {
    name: 'Amsterdam',
    country: 'Netherlands',
    continent: 'Europe',
    clues: [
      { text: 'This city has more bicycles than people', difficulty: 'easy' },
      { text: 'This city has over 100 kilometers of canals', difficulty: 'medium' },
      { text: 'This city\'s houses typically lean forward to facilitate moving furniture through windows', difficulty: 'hard' },
      { text: 'This city is built entirely on wooden poles driven into the soggy ground', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has more than 1,500 bridges', isFunny: false },
      { text: 'The narrowest house in this city is only 2.02 meters wide', isFunny: false },
      { text: 'Over 12,000 bicycles are fished out of this city\'s canals every year', isFunny: true },
    ],
  },
  {
    name: 'Austin',
    country: 'United States',
    continent: 'North America',
    clues: [
      { text: 'This city\'s motto is "Keep It Weird"', difficulty: 'easy' },
      { text: 'This city is the "Live Music Capital of the World"', difficulty: 'medium' },
      { text: 'This city hosts the annual South by Southwest (SXSW) festival', difficulty: 'medium' },
      { text: 'This city has the largest urban bat colony in North America', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city is the only place in the world where you can find Barton Springs salamanders', isFunny: false },
      { text: 'This city has the oldest continuously running music series in American television history', isFunny: false },
      { text: 'Locals celebrate "Eeyore\'s Birthday Party" every year with costumes and drum circles', isFunny: true },
    ],
  },
  {
    name: 'Chandigarh',
    country: 'India',
    continent: 'Asia',
    clues: [
      { text: 'This city was designed by the famous Swiss-French architect Le Corbusier', difficulty: 'medium' },
      { text: 'This city is known as "The City Beautiful"', difficulty: 'easy' },
      { text: 'This city serves as the capital of two Indian states', difficulty: 'medium' },
      { text: 'This city is laid out in a grid pattern like a human body', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has the highest per capita income in India', isFunny: false },
      { text: 'This city has a unique Rock Garden made entirely from industrial and urban waste', isFunny: false },
      { text: 'Traffic police in this city were once famous for standing on raised platforms with umbrellas like living traffic lights', isFunny: true },
    ],
  },
  {
    name: 'Bengaluru',
    country: 'India',
    continent: 'Asia',
    clues: [
      { text: 'This city is known as the "Silicon Valley of India"', difficulty: 'easy' },
      { text: 'This city was once known as the "Garden City" for its many parks and green spaces', difficulty: 'medium' },
      { text: 'This city has the highest number of pubs in Asia', difficulty: 'medium' },
      { text: 'This city sits at one of the highest elevations among major Indian cities', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has the first and only liquor museum in India', isFunny: false },
      { text: 'This city has India\'s oldest running restaurant, established in 1924', isFunny: false },
      { text: 'Traffic jams in this city are so notorious that locals joke about growing old in them', isFunny: true },
    ],
  },
  {
    name: 'Mumbai',
    country: 'India',
    continent: 'Asia',
    clues: [
      { text: 'This city is home to the world\'s most expensive private residence', difficulty: 'medium' },
      { text: 'This city is known as the financial capital of India', difficulty: 'easy' },
      { text: 'This city has a famous colonial-era railway station that\'s a UNESCO World Heritage site', difficulty: 'medium' },
      { text: 'This city was originally seven separate islands', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has the world\'s largest outdoor laundry facility called Dhobi Ghat', isFunny: false },
      { text: 'This city\'s dabbawalas (lunch box carriers) have a six-sigma accuracy rating', isFunny: false },
      { text: 'This city\'s local trains are so crowded that they have professional "pushers" to help people board', isFunny: true },
    ],
  },
  {
    name: 'Hyderabad',
    country: 'India',
    continent: 'Asia',
    clues: [
      { text: 'This city is known as the "City of Pearls"', difficulty: 'easy' },
      { text: 'This city has a famous 400-year-old monument with four towering minarets', difficulty: 'medium' },
      { text: 'This city is known for its biryani, a spiced rice dish', difficulty: 'medium' },
      { text: 'This city has an artificial lake built in 1562 that\'s shaped like a necklace', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city is home to the world\'s largest film studio complex, Ramoji Film City', isFunny: false },
      { text: 'This city has a unique blend of North and South Indian cultures, known as "Deccani"', isFunny: false },
      { text: 'Locals traditionally end every sentence with "amma" or "anna" as a sign of respect, even when angry', isFunny: true },
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