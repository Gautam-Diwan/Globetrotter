import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { PrismaClient } from '@prisma/client';

// Get NODE_ENV from environment or default to local
const environment: string = process.env.NODE_ENV || 'development';
console.log(`Running seed script in ${environment} environment`);

// Try loading environment-specific .env file
console.log('Loading environment variables from .env');
dotenv.config({ path: resolve(__dirname, '../.env') });

// Important: For seeding with transactions, we must use the DIRECT_URL
// PgBouncer (connection pooling) doesn't support transactions properly
console.log('DIRECT_URL:', process.env.DIRECT_URL);
console.log('DATABASE_URL:', process.env.DATABASE_URL);

// In development/local environments, prefer using DATABASE_URL directly
// for local database connections that don't use PgBouncer
let databaseUrl;
if (environment === 'development') {
  databaseUrl = process.env.DATABASE_URL;
  // If for some reason we still need to use DIRECT_URL in dev, uncomment below:
  // databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
} else {
  // For production-like environments with PgBouncer, prefer DIRECT_URL for transactions
  databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
}

console.log('Using database connection:', databaseUrl);

// Check if DATABASE_URL is defined
if (!databaseUrl) {
  console.error('ERROR: DATABASE_URL environment variable is not set.');
  console.error('Please set DATABASE_URL in your .env file or environment variables.');
  process.exit(1);
}

// Log the sanitized connection string (without password)
const sanitizedUrl = databaseUrl.replace(/:[^:@]+@/, ':****@');
console.log(`Using database connection: ${sanitizedUrl}`);

// Initialize Prisma with explicit connection URL and longer connection timeout
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
  // Add longer timeouts for seeding large datasets
  log: ['warn', 'error'],
});

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
  {
    name: 'Shimla',
    country: 'India',
    continent: 'Asia',
    clues: [
      { text: 'This city served as the summer capital of British India', difficulty: 'medium' },
      { text: 'This city is situated in the foothills of the Himalayas', difficulty: 'easy' },
      { text: 'This city is connected by a UNESCO World Heritage toy train', difficulty: 'medium' },
      { text: 'This city\'s name comes from "Shyamala", a form of the goddess Kali', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has the world\'s highest cricket ground at Chail', isFunny: false },
      { text: 'This city\'s Mall Road is completely vehicle-free', isFunny: false },
      { text: 'Monkeys in this city are known for stealing tourists\' sunglasses and returning them only for food', isFunny: true },
    ],
  },
  {
    name: 'Manali',
    country: 'India',
    continent: 'Asia',
    clues: [
      { text: 'This city is named after the lawgiver sage Manu in Hindu mythology', difficulty: 'hard' },
      { text: 'This city is a gateway to the Solang Valley, famous for winter sports', difficulty: 'medium' },
      { text: 'This city sits at the northern end of the Kullu Valley', difficulty: 'medium' },
      { text: 'This city is a popular honeymoon destination with snow-capped mountains', difficulty: 'easy' },
    ],
    facts: [
      { text: 'This city has hot springs containing medicinal sulfur', isFunny: false },
      { text: 'This city has a 450-year-old temple dedicated to Hidimba Devi, a character from the Mahabharata', isFunny: false },
      { text: 'The locals say you haven\'t truly visited this city until you\'ve eaten a "Manali momo" while shivering in the cold', isFunny: true },
    ],
  },
  {
    name: 'Leh',
    country: 'India',
    continent: 'Asia',
    clues: [
      { text: 'This city is one of the highest situated cities in the world at 3,500 meters', difficulty: 'medium' },
      { text: 'This city is home to the Hemis Monastery, the largest and richest monastery in the region', difficulty: 'hard' },
      { text: 'This city is known for its stark, lunar-like landscape', difficulty: 'medium' },
      { text: 'This city was the historical capital of the Himalayan kingdom of Ladakh', difficulty: 'easy' },
    ],
    facts: [
      { text: 'This city\'s Magnetic Hill is believed to have magnetic properties that can pull vehicles uphill', isFunny: true },
      { text: 'This city\'s Khardung La pass was once considered the highest motorable road in the world', isFunny: false },
      { text: 'This city has such thin air due to altitude that it\'s recommended to avoid even showering on your first day', isFunny: false },
    ],
  },
  {
    name: 'Amritsar',
    country: 'India',
    continent: 'Asia',
    clues: [
      { text: 'This city is home to the holiest shrine in Sikhism', difficulty: 'easy' },
      { text: 'This city\'s name means "Pool of the Nectar of Immortality"', difficulty: 'medium' },
      { text: 'This city is known for its unique culinary style, particularly for its rich, buttery dal', difficulty: 'medium' },
      { text: 'This city was the site of a tragic massacre under British colonial rule in 1919', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has the world\'s largest free community kitchen, serving over 100,000 meals daily', isFunny: false },
      { text: 'This city is home to a floating palace called Jal Mahal, situated in the middle of a man-made lake', isFunny: false },
      { text: 'Restaurants in this city compete for who can serve the most buttery paratha, often using entire sticks of butter per serving', isFunny: true },
    ],
  },
  {
    name: 'Patiala',
    country: 'India',
    continent: 'Asia',
    clues: [
      { text: 'This city is known for its distinctive "peg" measurement for liquor', difficulty: 'medium' },
      { text: 'This city is famous for its oversized turban style called "Patiala Shahi Pagri"', difficulty: 'easy' },
      { text: 'This city has an eight-story palace called Qila Mubarak', difficulty: 'medium' },
      { text: 'This city was founded by Baba Ala Singh in 1763', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city lends its name to a distinctive style of loose-fitting salwar pants in Indian fashion', isFunny: false },
      { text: 'This city\'s royal family once owned the world\'s most expensive necklace, the "Patiala Necklace"', isFunny: false },
      { text: 'The traditional "Patiala peg" is so large that locals joke it\'s not a drink but a challenge', isFunny: true },
    ],
  },
  {
    name: 'Ludhiana',
    country: 'India',
    continent: 'Asia',
    clues: [
      { text: 'This city is known as the "Manchester of India" for its textile industry', difficulty: 'easy' },
      { text: 'This city is home to Punjab Agricultural University, one of Asia\'s leading agricultural research centers', difficulty: 'medium' },
      { text: 'This city produces more than 60% of India\'s bicycle parts', difficulty: 'medium' },
      { text: 'This city was founded by members of the Lodhi dynasty in the 15th century', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has the largest bicycle manufacturing industry in Asia', isFunny: false },
      { text: 'This city is home to India\'s largest hosiery cluster, producing millions of garments daily', isFunny: false },
      { text: 'Locals joke that the city has two seasons: hot summer and "textile dust" season', isFunny: true },
    ],
  },
  {
    name: 'Jalandhar',
    country: 'India',
    continent: 'Asia',
    clues: [
      { text: 'This city is a major producer of sports equipment in India', difficulty: 'medium' },
      { text: 'This city is home to India\'s oldest newspaper still in circulation', difficulty: 'hard' },
      { text: 'This city was mentioned in the ancient Indian epic Mahabharata', difficulty: 'medium' },
      { text: 'This city is known for its ancient Devi Talab Mandir temple', difficulty: 'easy' },
    ],
    facts: [
      { text: 'This city manufactures sports goods used in international tournaments including the Olympics', isFunny: false },
      { text: 'This city\'s name is derived from "Jal" meaning water and "Andar" meaning within', isFunny: false },
      { text: 'The city is so obsessed with cricket that even wedding invitations sometimes include cricket statistics', isFunny: true },
    ],
  },
  {
    name: 'Malerkotla',
    country: 'India',
    continent: 'Asia',
    clues: [
      { text: 'This city is Punjab\'s only Muslim-majority city', difficulty: 'medium' },
      { text: 'This city is known for its religious harmony and cultural diversity', difficulty: 'easy' },
      { text: 'This city was ruled by an Afghan dynasty for nearly 200 years', difficulty: 'medium' },
      { text: 'This city is famous for its embroidery crafts, particularly "Phulkari"', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city was blessed by a Sikh Guru for its ruler\'s stand against the execution of the Guru\'s sons', isFunny: false },
      { text: 'This city is famous for its traditional craft of making decorated ceremonial scissors', isFunny: false },
      { text: 'This city\'s residents proudly claim they\'re the only ones who can understand the local dialect which mixes Punjabi, Urdu, and Hindi', isFunny: true },
    ],
  },
  {
    name: 'Ambala',
    country: 'India',
    continent: 'Asia',
    clues: [
      { text: 'This city is divided into distinct twin cities: Ambala Cantonment and Ambala City', difficulty: 'medium' },
      { text: 'This city is home to one of the oldest air force bases in India', difficulty: 'easy' },
      { text: 'This city was an important trading post during British colonial rule', difficulty: 'medium' },
      { text: 'This city\'s name is derived from "Amba Wala" meaning mango village', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city is known as the "Gateway to Haryana" as it\'s the first city when entering Haryana from Punjab', isFunny: false },
      { text: 'This city is famous for its scientific instruments manufacturing industry', isFunny: false },
      { text: 'The city has such a strong military presence that locals joke even the dogs march in formation', isFunny: true },
    ],
  },
  {
    name: 'Panipat',
    country: 'India',
    continent: 'Asia',
    clues: [
      { text: 'This city is known as the "City of Weavers" for its textile industry', difficulty: 'easy' },
      { text: 'This city was the site of three historic battles that shaped Indian history', difficulty: 'medium' },
      { text: 'This city is a major center for handloom products and carpets', difficulty: 'medium' },
      { text: 'This city\'s name comes from the Sanskrit words "Pani" (water) and "Patta" (loom)', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city is one of the largest producers of handmade carpets in India', isFunny: false },
      { text: 'This city has a 400-year-old mosque built by Emperor Babur after the First Battle of Panipat', isFunny: false },
      { text: 'The phrase "Panipat ka maidaan" (battlefield of Panipat) is used in Hindi when referring to a decisive contest', isFunny: true },
    ],
  },
  {
    name: 'Jaipur',
    country: 'India',
    continent: 'Asia',
    clues: [
      { text: 'This city is known as the "Pink City" for its distinctive colored buildings', difficulty: 'easy' },
      { text: 'This city has the world\'s largest stone sundial', difficulty: 'medium' },
      { text: 'This city was founded in 1727 by Maharaja Sawai Jai Singh II', difficulty: 'medium' },
      { text: 'This city was one of the first planned cities of India with a grid-like street system', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city was painted pink in 1876 to welcome Prince Albert and Queen Victoria', isFunny: false },
      { text: 'This city\'s Hawa Mahal palace has 953 small windows designed for royal ladies to observe street festivities unseen', isFunny: false },
      { text: 'The city\'s traffic is so colorful with decorated rickshaws that tourists often pay just to photograph traffic jams', isFunny: true },
    ],
  },
  {
    name: 'Udaipur',
    country: 'India',
    continent: 'Asia',
    clues: [
      { text: 'This city is known as the "City of Lakes" or "Venice of the East"', difficulty: 'easy' },
      { text: 'This city has a famous lake palace that appears to float on water', difficulty: 'medium' },
      { text: 'This city was the capital of the historic Mewar Kingdom', difficulty: 'medium' },
      { text: 'This city was founded by Maharana Udai Singh II in 1559', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city\'s Lake Palace served as a filming location for the James Bond film "Octopussy"', isFunny: false },
      { text: 'This city has the world\'s only vintage car museum housed in a former royal garage', isFunny: false },
      { text: 'Restaurants in this city compete for who has the best view, with some claiming you need mountaineering equipment to reach their rooftop', isFunny: true },
    ],
  },
  {
    name: 'Jodhpur',
    country: 'India',
    continent: 'Asia',
    clues: [
      { text: 'This city is known as the "Blue City" for its indigo-colored houses', difficulty: 'easy' },
      { text: 'This city has a massive 15th-century fort overlooking the entire city', difficulty: 'medium' },
      { text: 'This city lends its name to a specific style of horseback riding pants', difficulty: 'medium' },
      { text: 'This city was founded in 1459 by Rao Jodha, chief of the Rathore clan', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city\'s Mehrangarh Fort stands 410 feet above the city and is one of the largest forts in India', isFunny: false },
      { text: 'This city has houses painted blue traditionally to signify they were homes of Brahmins', isFunny: false },
      { text: 'The city is so consistently sunny that locals joke they use their raincoats as decorative wall hangings', isFunny: true },
    ],
  },
  {
    name: 'Bangkok',
    country: 'Thailand',
    continent: 'Asia',
    clues: [
      { text: 'This city has the longest official name of any city in the world', difficulty: 'hard' },
      { text: 'This city is home to the world\'s largest open-air market, Chatuchak', difficulty: 'medium' },
      { text: 'This city is known for its ornate shrines and vibrant street life', difficulty: 'easy' },
      { text: 'This city is crisscrossed by numerous canals, earning it the nickname "Venice of the East"', difficulty: 'medium' },
    ],
    facts: [
      { text: 'This city\'s full ceremonial name consists of 169 characters', isFunny: false },
      { text: 'This city is home to over 400 Buddhist temples (wats)', isFunny: false },
      { text: 'The traffic congestion in this city is so legendary that locals claim it\'s faster to deliver food by trained monkeys', isFunny: true },
    ],
  },
  {
    name: 'Hanoi',
    country: 'Vietnam',
    continent: 'Asia',
    clues: [
      { text: 'This city has been the capital of Vietnam for over a thousand years', difficulty: 'medium' },
      { text: 'This city is known for its centuries-old architecture and rich culture with Southeast Asian, Chinese, and French influences', difficulty: 'easy' },
      { text: 'This city is home to the Temple of Literature, built in 1070', difficulty: 'medium' },
      { text: 'This city\'s name means "city inside rivers" in Vietnamese', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city is famous for its street food, particularly a dish of rice noodles with herbs, meat, and broth', isFunny: false },
      { text: 'This city has a unique "train street" where a railway track runs inches from homes and cafes', isFunny: false },
      { text: 'Crossing the street in this city is considered an extreme sport due to the swarms of motorbikes', isFunny: true },
    ],
  },
  {
    name: 'Kuala Lumpur',
    country: 'Malaysia',
    continent: 'Asia',
    clues: [
      { text: 'This city\'s skyline is dominated by 88-story twin towers', difficulty: 'easy' },
      { text: 'This city\'s name means "muddy confluence" in Malay', difficulty: 'medium' },
      { text: 'This city has a giant 140-foot-tall golden statue of a Hindu deity at the Batu Caves', difficulty: 'medium' },
      { text: 'This city started as a tin mining settlement in the 1850s', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has the tallest twin towers in the world', isFunny: false },
      { text: 'This city is home to the world\'s largest covered bird park', isFunny: false },
      { text: 'The monkeys at the famous caves in this city are such skilled thieves that visitors are advised to bring decoy items', isFunny: true },
    ],
  },
  {
    name: 'Singapore',
    country: 'Singapore',
    continent: 'Asia',
    clues: [
      { text: 'This city-state is known as the "Garden City" for its many parks and tree-lined streets', difficulty: 'easy' },
      { text: 'This city has a landmark hotel with an infinity pool on its 57th-floor roof deck', difficulty: 'medium' },
      { text: 'This city has the world\'s first night zoo', difficulty: 'medium' },
      { text: 'This city\'s name is derived from the Sanskrit word for "lion city"', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has one of the lowest crime rates in the world', isFunny: false },
      { text: 'This city has a 16-story tall artificial waterfall inside its airport', isFunny: false },
      { text: 'Chewing gum is banned in this city, leading to the rise of a black market for minty-fresh contraband', isFunny: true },
    ],
  },
  {
    name: 'Manila',
    country: 'Philippines',
    continent: 'Asia',
    clues: [
      { text: 'This city is home to the oldest Chinatown in the world, established in 1594', difficulty: 'medium' },
      { text: 'This city was heavily damaged during World War II, second only to Warsaw in destruction', difficulty: 'hard' },
      { text: 'This city is known for its Spanish colonial architecture, especially its walled district', difficulty: 'medium' },
      { text: 'This city is one of the most densely populated cities in the world', difficulty: 'easy' },
    ],
    facts: [
      { text: 'This city has the world\'s oldest and smallest Chinatown, called Binondo', isFunny: false },
      { text: 'This city\'s famous sunset views over its bay are considered among the best in the world', isFunny: false },
      { text: 'This city\'s jeepneys (colorful public buses) are so elaborately decorated that they could qualify as mobile art galleries', isFunny: true },
    ],
  },
  {
    name: 'Jakarta',
    country: 'Indonesia',
    continent: 'Asia',
    clues: [
      { text: 'This city is sinking faster than any other big city on the planet', difficulty: 'medium' },
      { text: 'This city was formerly known as Batavia during Dutch colonial rule', difficulty: 'medium' },
      { text: 'This city is home to the world\'s largest mosque by capacity', difficulty: 'hard' },
      { text: 'This city is the largest in Southeast Asia', difficulty: 'easy' },
    ],
    facts: [
      { text: 'This city is sinking at a rate of 25 centimeters per year in some areas', isFunny: false },
      { text: 'This city has the world\'s longest bus rapid transit system', isFunny: false },
      { text: 'Traffic jams in this city are so bad that people hire "jockeys" (professional passengers) to meet vehicle occupancy requirements', isFunny: true },
    ],
  },
  {
    name: 'Phnom Penh',
    country: 'Cambodia',
    continent: 'Asia',
    clues: [
      { text: 'This city sits at the junction of three rivers, including the mighty Mekong', difficulty: 'medium' },
      { text: 'This city is home to a Royal Palace complex with its Silver Pagoda', difficulty: 'medium' },
      { text: 'This city was evacuated and nearly abandoned in 1975 under the Khmer Rouge regime', difficulty: 'hard' },
      { text: 'This city is known as the "Pearl of Asia" for its French colonial architecture', difficulty: 'easy' },
    ],
    facts: [
      { text: 'This city\'s Central Market is housed in one of the world\'s largest art deco buildings', isFunny: false },
      { text: 'This city\'s name means "Hill of Penh" after a wealthy widow who founded a temple there', isFunny: false },
      { text: 'Motorcycle taxis in this city often carry entire families, kitchen appliances, and occasionally live pigs all at once', isFunny: true },
    ],
  },
  {
    name: 'Vientiane',
    country: 'Laos',
    continent: 'Asia',
    clues: [
      { text: 'This city is one of the smallest and quietest capital cities in Asia', difficulty: 'medium' },
      { text: 'This city\'s most famous monument is a Buddhist stupa called Pha That Luang', difficulty: 'easy' },
      { text: 'This city has a replica of Paris\'s Arc de Triomphe called Patuxai', difficulty: 'medium' },
      { text: 'This city\'s name means "City of Sandalwood" in ancient Sanskrit', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city is located on a bend of the Mekong River bordering Thailand', isFunny: false },
      { text: 'This city\'s arc monument was built using cement donated by the USA that was meant for an airport runway', isFunny: false },
      { text: 'This capital city is so laid back that locals joke it\'s actually a village that accidentally got international recognition', isFunny: true },
    ],
  },
  {
    name: 'Naypyidaw',
    country: 'Myanmar',
    continent: 'Asia',
    clues: [
      { text: 'This city became the capital in 2006, replacing the former capital in a surprise move', difficulty: 'medium' },
      { text: 'This city has 20-lane highways that are almost completely empty', difficulty: 'medium' },
      { text: 'This city was built from scratch in a previously remote area', difficulty: 'easy' },
      { text: 'This city\'s name means "Abode of Kings" in Burmese', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city is approximately six times the size of New York City but has only about 1 million residents', isFunny: false },
      { text: 'This city has a copy of Myanmar\'s famous Shwedagon Pagoda, but smaller', isFunny: false },
      { text: 'This city\'s traffic lights reportedly change despite there being no cars at the intersection for hours', isFunny: true },
    ],
  },
  {
    name: 'Colombo',
    country: 'Sri Lanka',
    continent: 'Asia',
    clues: [
      { text: 'This city has a name derived from the Sinhalese word for "seaport"', difficulty: 'hard' },
      { text: 'This city was called "the garden city of the East" during colonial times', difficulty: 'medium' },
      { text: 'This city faces the Indian Ocean and is a major port', difficulty: 'easy' },
      { text: 'This city was an important trading post on the ancient Silk Road', difficulty: 'medium' },
    ],
    facts: [
      { text: 'This city was originally settled by Arab traders in the 8th century', isFunny: false },
      { text: 'This city has a floating market where vendors sell goods from traditional boats', isFunny: false },
      { text: 'Crows in this city are so brazen they\'ve been known to snatch ice cream cones directly from tourists\' hands', isFunny: true },
    ],
  },
  {
    name: 'Kathmandu',
    country: 'Nepal',
    continent: 'Asia',
    clues: [
      { text: 'This city sits in a valley surrounded by four major mountains', difficulty: 'medium' },
      { text: 'This city has more UNESCO World Heritage sites than any other capital in the world', difficulty: 'medium' },
      { text: 'This city is home to the sacred Pashupatinath Temple, a Hindu pilgrimage site', difficulty: 'easy' },
      { text: 'This city\'s name comes from an ancient structure supposedly built from the wood of a single tree', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has the densest concentration of World Heritage Sites, with seven in an area of 15 square kilometers', isFunny: false },
      { text: 'This city\'s streets were famously paved with brick instead of tarmac to preserve its heritage character', isFunny: false },
      { text: 'Cows roam freely in this city\'s streets and have more right of way than vehicles, leading to "holy traffic jams"', isFunny: true },
    ],
  },
  {
    name: 'Thimphu',
    country: 'Bhutan',
    continent: 'Asia',
    clues: [
      { text: 'This city is one of the few world capitals without traffic lights', difficulty: 'medium' },
      { text: 'This city is situated in a valley at an elevation of 2,320 meters', difficulty: 'medium' },
      { text: 'This city\'s development is guided by maintaining traditional Bhutanese architecture', difficulty: 'easy' },
      { text: 'This city did not have electricity until the 1960s and was only named the permanent capital in 1961', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has a police officer who directs traffic with elaborate white-gloved gestures instead of traffic lights', isFunny: false },
      { text: 'This city measures progress by Gross National Happiness instead of GDP', isFunny: false },
      { text: 'This city is likely the only capital in the world where you must dress traditionally to enter government buildings', isFunny: true },
    ],
  },
  {
    name: 'Dhaka',
    country: 'Bangladesh',
    continent: 'Asia',
    clues: [
      { text: 'This city is home to over 18 million people, making it one of the most densely populated cities in the world', difficulty: 'easy' },
      { text: 'This city is known as the "City of Mosques"', difficulty: 'medium' },
      { text: 'This city is the global center for the microcredit industry', difficulty: 'medium' },
      { text: 'This city was the capital of the Mughal province of Bengal from 1608 to 1706', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city produces over 60% of Bangladesh\'s garment exports, which account for 80% of the country\'s export earnings', isFunny: false },
      { text: 'This city has over 700,000 rickshaws, more than any other city in the world', isFunny: false },
      { text: 'This city\'s traffic jams are so epic that businessmen often conduct entire meetings while stuck on the road', isFunny: true },
    ],
  },
  {
    name: 'Islamabad',
    country: 'Pakistan',
    continent: 'Asia',
    clues: [
      { text: 'This city was built in the 1960s to replace another city as the country\'s capital', difficulty: 'medium' },
      { text: 'This city is located at the foot of the Margalla Hills', difficulty: 'easy' },
      { text: 'This city was designed by Greek architect Constantinos Doxiadis', difficulty: 'hard' },
      { text: 'This city\'s name means "City of Islam"', difficulty: 'medium' },
    ],
    facts: [
      { text: 'This city is divided into zones and sectors laid out in a grid, with sectors named according to a simple system', isFunny: false },
      { text: 'This city is home to the Faisal Mosque, one of the largest mosques in the world', isFunny: false },
      { text: 'This city is so meticulously planned that locals joke you need GPS coordinates instead of an address', isFunny: true },
    ],
  },
  {
    name: 'Kabul',
    country: 'Afghanistan',
    continent: 'Asia',
    clues: [
      { text: 'This city sits at an elevation of 1,790 meters, making it one of the highest capital cities in the world', difficulty: 'medium' },
      { text: 'This city is situated between the Hindu Kush mountains', difficulty: 'easy' },
      { text: 'This city has been inhabited for at least 3,500 years', difficulty: 'medium' },
      { text: 'This city\'s name may derive from Sanskrit meaning "of the god Kubha"', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city is crossed by the Kabul River which ultimately flows into the Indus River', isFunny: false },
      { text: 'This city was a key stop on the ancient Silk Road trading route', isFunny: false },
      { text: 'This city\'s residents are such skilled kite fighters that they can cut an opponent\'s string from a kilometer away', isFunny: true },
    ],
  },
  {
    name: 'Tehran',
    country: 'Iran',
    continent: 'Asia',
    clues: [
      { text: 'This city sits on the slopes of the Alborz Mountains', difficulty: 'medium' },
      { text: 'This city is home to the Azadi Tower, a landmark built in 1971', difficulty: 'easy' },
      { text: 'This city became the country\'s capital in 1796', difficulty: 'medium' },
      { text: 'This city\'s name may mean "warm place" in Persian', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has the highest domestic migration rate in the country', isFunny: false },
      { text: 'This city is home to the National Jewelry Treasury, housing one of the world\'s most expensive jewels, the pink Darya-i-Noor diamond', isFunny: false },
      { text: 'The nose job capital of the world, this city\'s residents often wear their post-surgery bandages with pride as a status symbol', isFunny: true },
    ],
  },
  {
    name: 'Baghdad',
    country: 'Iraq',
    continent: 'Asia',
    clues: [
      { text: 'This city was the center of the Islamic Golden Age during the 8th to 13th centuries', difficulty: 'medium' },
      { text: 'This city was built as a perfectly round city during the Abbasid Caliphate', difficulty: 'hard' },
      { text: 'This city is situated on the Tigris River', difficulty: 'easy' },
      { text: 'This city was the setting for many tales in "One Thousand and One Nights"', difficulty: 'medium' },
    ],
    facts: [
      { text: 'This city was the world\'s largest city for several centuries with a population over 1 million people', isFunny: false },
      { text: 'This city once housed the House of Wisdom, one of the greatest libraries and centers of learning in history', isFunny: false },
      { text: 'Despite modern challenges, this city\'s residents pride themselves on bargaining skills so legendary they claim they could sell sand in a desert', isFunny: true },
    ],
  },
  {
    name: 'Riyadh',
    country: 'Saudi Arabia',
    continent: 'Asia',
    clues: [
      { text: 'This city began as an oasis settlement and is now one of the wealthiest cities in the world', difficulty: 'medium' },
      { text: 'This city is home to the 99-story Kingdom Centre with its distinctive "bottle opener" top', difficulty: 'medium' },
      { text: 'This city is located in the central Nejd plateau', difficulty: 'easy' },
      { text: 'This city\'s name means "gardens" in Arabic', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has transformed from a walled desert outpost of 30,000 in 1950 to a metropolis of over 7 million today', isFunny: false },
      { text: 'This city is building the world\'s first 170 km long linear city with no cars or streets', isFunny: false },
      { text: 'In this city, residents joke that air conditioners aren\'t appliances—they\'re life support systems', isFunny: true },
    ],
  },
  {
    name: 'Doha',
    country: 'Qatar',
    continent: 'Asia',
    clues: [
      { text: 'This city\'s skyline has been completely transformed in just the last 20 years', difficulty: 'easy' },
      { text: 'This city hosted the 2022 FIFA World Cup', difficulty: 'medium' },
      { text: 'This city has an artificial island called "The Pearl" that resembles a string of pearls when viewed from above', difficulty: 'medium' },
      { text: 'This city\'s name means "big tree" in Arabic, referring to a prominent local tree that grew in the area', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city\'s Museum of Islamic Art was designed by I.M. Pei when he was 91 years old', isFunny: false },
      { text: 'This city built seven World Cup stadiums in record time, some of which are designed to be completely dismantled after use', isFunny: false },
      { text: 'This city is so meticulously clean that locals joke about receiving fines if their shadow falls in the wrong place', isFunny: true },
    ],
  },
  {
    name: 'Muscat',
    country: 'Oman',
    continent: 'Asia',
    clues: [
      { text: 'This city is surrounded by volcanic mountains and desert', difficulty: 'medium' },
      { text: 'This city is known for its distinctively white low-rise buildings', difficulty: 'easy' },
      { text: 'This city was an important trading port between East and West in the 1st century CE', difficulty: 'medium' },
      { text: 'This city\'s name means "place of dropping anchor" in Arabic', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has a law requiring all buildings to be white or cream-colored to maintain its distinct character', isFunny: false },
      { text: 'This city\'s Sultan Qaboos Grand Mosque contains the world\'s second-largest hand-woven carpet', isFunny: false },
      { text: 'The city is so proper that even taxi drivers wear freshly pressed traditional white dishdasha robes while working', isFunny: true },
    ],
  },
  {
    name: 'Ulaanbaatar',
    country: 'Mongolia',
    continent: 'Asia',
    clues: [
      { text: 'This city is the coldest capital city in the world', difficulty: 'medium' },
      { text: 'This city was founded as a nomadic Buddhist center in 1639', difficulty: 'hard' },
      { text: 'This city sits at an elevation of 1,300 meters, surrounded by mountains', difficulty: 'medium' },
      { text: 'This city\'s name means "Red Hero" in Mongolian', difficulty: 'easy' },
    ],
    facts: [
      { text: 'This city experiences temperature swings of over 80°C (176°F) between summer and winter extremes', isFunny: false },
      { text: 'This city is home to the winter palace of the last Mongolian Emperor, which survived the country\'s communist period', isFunny: false },
      { text: 'In this city\'s outskirts, traditional gers (nomadic tents) have satellite dishes and solar panels, creating what locals call "nomadic tech"', isFunny: true },
    ],
  },
  {
    name: 'Taipei',
    country: 'Taiwan',
    continent: 'Asia',
    clues: [
      { text: 'This city was once home to the world\'s tallest building from 2004 to 2010', difficulty: 'easy' },
      { text: 'This city is surrounded by the Yangmingshan mountain range and bisected by the Tamsui River', difficulty: 'medium' },
      { text: 'This city\'s name means "North Taiwan" in Chinese', difficulty: 'medium' },
      { text: 'This city was known as "Taihoku" during Japanese colonial rule', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city\'s landmark skyscraper is designed to withstand typhoons and earthquakes and is shaped like a bamboo stalk', isFunny: false },
      { text: 'This city has one of the world\'s most efficient recycling systems with over 20 categories of recyclables', isFunny: false },
      { text: 'This city\'s night markets are so popular that the local saying claims you haven\'t truly visited unless you\'ve gained at least 3 kilograms', isFunny: true },
    ],
  },
  {
    name: 'Pyongyang',
    country: 'North Korea',
    continent: 'Asia',
    clues: [
      { text: 'This city is bisected by the Taedong River and has large boulevards with almost no traffic', difficulty: 'medium' },
      { text: 'This city has the world\'s largest stadium with a capacity of 150,000', difficulty: 'medium' },
      { text: 'This city\'s name means "Flat Land" in Korean', difficulty: 'hard' },
      { text: 'This city is home to the 105-story Ryugyong Hotel, which began construction in 1987 but remains unfinished', difficulty: 'easy' },
    ],
    facts: [
      { text: 'This city\'s subway is one of the deepest in the world, doubling as a bomb shelter', isFunny: false },
      { text: 'This city\'s central square is large enough to accommodate up to 100,000 people for mass celebrations', isFunny: false },
      { text: 'This city\'s traffic lights are often manually operated by uniformed traffic controllers who perform with such precision they\'ve become tourist attractions', isFunny: true },
    ],
  },
  {
    name: 'Astana',
    country: 'Kazakhstan',
    continent: 'Asia',
    clues: [
      { text: 'This city was renamed Nur-Sultan in 2019 before reverting to its original name in 2022', difficulty: 'medium' },
      { text: 'This city becomes one of the world\'s coldest capitals in winter, with temperatures dropping to -40°C', difficulty: 'medium' },
      { text: 'This city was designed by renowned Japanese architect Kisho Kurokawa', difficulty: 'hard' },
      { text: 'This city replaced another city as the country\'s capital in 1997', difficulty: 'easy' },
    ],
    facts: [
      { text: 'This city features a 150-meter-tall tent-shaped building that contains an indoor beach resort with real sand', isFunny: false },
      { text: 'This city was built from scratch in the steppe and features futuristic architecture designed to represent the country\'s future', isFunny: false },
      { text: 'This city is so cold in winter that locals joke about their words freezing mid-air, only to thaw and be heard in spring', isFunny: true },
    ],
  },
  {
    name: 'Baku',
    country: 'Azerbaijan',
    continent: 'Asia',
    clues: [
      { text: 'This city is known as the "City of Winds"', difficulty: 'medium' },
      { text: 'This city is home to the Flame Towers, three skyscrapers resembling flames', difficulty: 'easy' },
      { text: 'This city hosted the 2012 Eurovision Song Contest', difficulty: 'medium' },
      { text: 'This city has buildings dating back to the 12th century alongside ultra-modern architecture', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has the world\'s first industrially drilled oil well, predating those in the United States', isFunny: false },
      { text: 'This city is home to Yanar Dag or "Burning Mountain," where natural gas seeps create perpetual flames', isFunny: false },
      { text: 'This city is so windy that locals claim they don\'t need fans—they just open two windows and enjoy the hurricane', isFunny: true },
    ],
  },
  {
    name: 'London',
    country: 'United Kingdom',
    continent: 'Europe',
    clues: [
      { text: 'This city is home to four UNESCO World Heritage Sites including an 11th-century fortress', difficulty: 'easy' },
      { text: 'This city has a famous underground railway system nicknamed "the Tube"', difficulty: 'easy' },
      { text: 'This city has a clock tower commonly but incorrectly called by the name of its bell', difficulty: 'medium' },
      { text: 'This city was originally founded as Londinium by the Romans in 43 CE', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has over 170 museums, including one dedicated entirely to fans', isFunny: false },
      { text: 'This city\'s underground system is the oldest in the world, opening in 1863', isFunny: false },
      { text: 'Black cabs in this city must pass "The Knowledge" test, requiring drivers to memorize 25,000 streets and 20,000 landmarks, a process that typically takes 3-4 years', isFunny: true },
    ],
  },
  {
    name: 'Madrid',
    country: 'Spain',
    continent: 'Europe',
    clues: [
      { text: 'This city is the highest capital in Europe at 650 meters above sea level', difficulty: 'medium' },
      { text: 'This city is home to the world\'s oldest restaurant still in operation', difficulty: 'hard' },
      { text: 'This city contains the Golden Triangle of Art, comprising three major museums', difficulty: 'medium' },
      { text: 'This city has a famous bear statue eating from a madroño tree as its symbol', difficulty: 'easy' },
    ],
    facts: [
      { text: 'This city\'s Royal Palace has 3,418 rooms, making it the largest royal palace in Europe by floor area', isFunny: false },
      { text: 'This city\'s main railway station contains a tropical garden with over 7,000 plants and a pond with turtles', isFunny: false },
      { text: 'Locals pride themselves on their nightlife so much they coined the phrase "los gatos de Madrid" (the cats of Madrid) for those who return home at dawn', isFunny: true },
    ],
  },
  {
    name: 'Lisbon',
    country: 'Portugal',
    continent: 'Europe',
    clues: [
      { text: 'This city is built on seven hills, similar to Rome', difficulty: 'medium' },
      { text: 'This city was nearly destroyed by a massive earthquake and tsunami in 1755', difficulty: 'medium' },
      { text: 'This city is known for its vintage yellow trams navigating narrow streets', difficulty: 'easy' },
      { text: 'This city\'s name may derive from Phoenician words meaning "safe harbor"', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city\'s Vasco da Gama Bridge is the longest bridge in Europe at 17.2 km', isFunny: false },
      { text: 'This city has the oldest bookstore in the world still in operation, established in 1732', isFunny: false },
      { text: 'The iconic trams in this city are so steep that passengers joke they don\'t need stair masters at the gym', isFunny: true },
    ],
  },
  {
    name: 'Dublin',
    country: 'Ireland',
    continent: 'Europe',
    clues: [
      { text: 'This city\'s name comes from the Irish phrase meaning "black pool"', difficulty: 'medium' },
      { text: 'This city is home to a famous book of illuminated manuscripts from the 9th century', difficulty: 'medium' },
      { text: 'This city has a well-known area filled with pubs and nightlife called Temple Bar', difficulty: 'easy' },
      { text: 'This city was founded by Vikings in 841 CE', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city\'s St. Patrick\'s Cathedral is the tallest and largest church in Ireland', isFunny: false },
      { text: 'This city has produced four Nobel Prize winners for Literature', isFunny: false },
      { text: 'Locals joke that there are more literary landmarks than actual readers in this city, as everyone\'s too busy at the pub', isFunny: true },
    ],
  },
  {
    name: 'Brussels',
    country: 'Belgium',
    continent: 'Europe',
    clues: [
      { text: 'This city is known for a small bronze fountain statue of a boy urinating', difficulty: 'easy' },
      { text: 'This city is home to the headquarters of the European Union', difficulty: 'medium' },
      { text: 'This city has a landmark building shaped like an atom, built for the 1958 World Fair', difficulty: 'medium' },
      { text: 'This city\'s name comes from the Old Dutch for "home in the marsh"', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has more than 1,000 varieties of beer available', isFunny: false },
      { text: 'This city\'s Grand Place is considered one of the most beautiful squares in Europe', isFunny: false },
      { text: 'The famous peeing statue in this city has over 1,000 costumes that are changed regularly, making it perhaps the world\'s most well-dressed fountain', isFunny: true },
    ],
  },
  {
    name: 'Vienna',
    country: 'Austria',
    continent: 'Europe',
    clues: [
      { text: 'This city is known as the "City of Music" for its musical legacy', difficulty: 'easy' },
      { text: 'This city is home to the world\'s oldest zoo still in operation, established in 1752', difficulty: 'medium' },
      { text: 'This city is famous for its coffee houses which UNESCO recognizes as part of its cultural heritage', difficulty: 'medium' },
      { text: 'This city was a Celtic settlement before becoming a Roman military camp named Vindobona', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has more than 150 palaces, including the 1,441-room Schönbrunn Palace', isFunny: false },
      { text: 'This city\'s central cemetery has over 2.5 million tombs, more than the city\'s current population', isFunny: false },
      { text: 'Coffee house waiters in this city are famously grumpy, with locals considering it part of the authentic experience to be served with a scowl', isFunny: true },
    ],
  },
  {
    name: 'Bern',
    country: 'Switzerland',
    continent: 'Europe',
    clues: [
      { text: 'This city\'s medieval old town is a UNESCO World Heritage site', difficulty: 'medium' },
      { text: 'This city is situated on a peninsula formed by a loop in a river', difficulty: 'medium' },
      { text: 'This city is named after an animal, which remains its symbol', difficulty: 'easy' },
      { text: 'This city is home to the world\'s longest covered shopping promenade at 6 kilometers', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has over 100 public fountains, including 11 historic ones decorated with colorful figures', isFunny: false },
      { text: 'This city\'s clock tower has a puppet show that has been performing before every hour for over 500 years', isFunny: false },
      { text: 'This city maintains a pit of bears (its namesake animal) in the city center, leading locals to joke that they have the world\'s most unusual civic pets', isFunny: true },
    ],
  },
  {
    name: 'Luxembourg City',
    country: 'Luxembourg',
    continent: 'Europe',
    clues: [
      { text: 'This city has a network of tunnels carved into rock called casemates', difficulty: 'medium' },
      { text: 'This city is built around deep gorges and valleys', difficulty: 'medium' },
      { text: 'This city served as a fortress for centuries and was known as the "Gibraltar of the North"', difficulty: 'easy' },
      { text: 'This city is home to the Court of Justice of the European Union', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city is one of the three official capitals of the European Union', isFunny: false },
      { text: 'This city\'s fortifications were so impressive that they were nicknamed the "Gibraltar of the North"', isFunny: false },
      { text: 'This city is so small that locals joke they can\'t keep secrets because you can whisper at one end and be heard at the other', isFunny: true },
    ],
  },
  {
    name: 'Oslo',
    country: 'Norway',
    continent: 'Europe',
    clues: [
      { text: 'This city awards the Nobel Peace Prize annually', difficulty: 'medium' },
      { text: 'This city is surrounded by forests and contains 40 islands within its fjord', difficulty: 'easy' },
      { text: 'This city has a ski jump with panoramic views of the entire area', difficulty: 'medium' },
      { text: 'This city was called Christiania for over 300 years until 1925', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city\'s subway system doubles as a massive public art gallery with unique art in every station', isFunny: false },
      { text: 'This city is implementing a car-free city center, one of the first European capitals to do so', isFunny: false },
      { text: 'Winter is so serious in this city that babies often take their first naps outdoors in sub-zero temperatures, which locals claim helps them sleep better', isFunny: true },
    ],
  },
  {
    name: 'Stockholm',
    country: 'Sweden',
    continent: 'Europe',
    clues: [
      { text: 'This city is spread across 14 islands connected by 57 bridges', difficulty: 'easy' },
      { text: 'This city hosts the annual Nobel Prize ceremonies (except for the Peace Prize)', difficulty: 'medium' },
      { text: 'This city contains a museum dedicated to a famous pop group formed here', difficulty: 'medium' },
      { text: 'This city\'s name means "log island" or "fortified island" in old Swedish', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city\'s subway system is known as the world\'s longest art gallery, with stations featuring installations by over 150 artists', isFunny: false },
      { text: 'This city is home to the world\'s first national urban park, established in 1995', isFunny: false },
      { text: 'In winter, this city gets so dark that locals joke they need vitamin D supplements instead of coffee to wake up in the morning', isFunny: true },
    ],
  },
  {
    name: 'Copenhagen',
    country: 'Denmark',
    continent: 'Europe',
    clues: [
      { text: 'This city has a famous bronze statue of a fairy tale character by the waterfront', difficulty: 'easy' },
      { text: 'This city contains the oldest functioning amusement park in the world', difficulty: 'medium' },
      { text: 'This city is connected to a neighboring country by the Øresund Bridge', difficulty: 'medium' },
      { text: 'This city\'s name originally meant "merchants\' harbor" in Danish', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has more bicycles than people and over 385 kilometers of designated bike lanes', isFunny: false },
      { text: 'This city\'s Christiansborg Palace is the only building in the world that houses all three branches of government', isFunny: false },
      { text: 'The harbor in this city is so clean that city officials take an annual swim in it, sometimes accidentally swallowing what they claim is the cleanest urban harbor water in the world', isFunny: true },
    ],
  },
  {
    name: 'Helsinki',
    country: 'Finland',
    continent: 'Europe',
    clues: [
      { text: 'This city has a church carved directly into solid rock', difficulty: 'medium' },
      { text: 'This city was completely rebuilt in a neoclassical style after 1812', difficulty: 'medium' },
      { text: 'This city hosts an annual sauna day where private saunas open to the public', difficulty: 'hard' },
      { text: 'This city is spread across a peninsula and 315 islands', difficulty: 'easy' },
    ],
    facts: [
      { text: 'This city has public saunas where business meetings are sometimes conducted in the nude, following Finnish tradition', isFunny: false },
      { text: 'This city has more than 80 kilometers of underground tunnels connecting shopping centers, parking, and transportation', isFunny: false },
      { text: 'Winter in this city is so dark and cold that locals joke they have only two expressions: silence and more silence', isFunny: true },
    ],
  },
  {
    name: 'Reykjavik',
    country: 'Iceland',
    continent: 'Europe',
    clues: [
      { text: 'This city is the northernmost capital of a sovereign state', difficulty: 'medium' },
      { text: 'This city is heated almost entirely by geothermal energy', difficulty: 'medium' },
      { text: 'This city has a distinctive church whose design was inspired by basalt lava flows', difficulty: 'easy' },
      { text: 'This city\'s name means "Smoky Bay" due to steam from hot springs', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has no mosquitoes, a rarity for a capital city', isFunny: false },
      { text: 'This city uses hot water from geothermal plants to heat sidewalks and keep them free of ice and snow', isFunny: false },
      { text: 'This city\'s phone book lists people by their first names since Icelanders don\'t traditionally use family surnames, leading to occasions where you might accidentally call the president', isFunny: true },
    ],
  },
  {
    name: 'Athens',
    country: 'Greece',
    continent: 'Europe',
    clues: [
      { text: 'This city is named after the goddess of wisdom and contains a temple dedicated to her', difficulty: 'easy' },
      { text: 'This city hosted the first modern Olympic Games in 1896', difficulty: 'medium' },
      { text: 'This city has been continuously inhabited for at least 5,000 years', difficulty: 'medium' },
      { text: 'This city\'s ancient cemetery, Kerameikos, was discovered during excavations for the metro system', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has more theatrical stages than any other European city', isFunny: false },
      { text: 'This city was the first European Capital of Culture, designated in 1985', isFunny: false },
      { text: 'Ancient laws in this city were so strict that even buildings could be put on trial and punished, with one temple allegedly being exiled because a man committed suicide by jumping from it', isFunny: true },
    ],
  },
  {
    name: 'Warsaw',
    country: 'Poland',
    continent: 'Europe',
    clues: [
      { text: 'This city was almost completely rebuilt after being destroyed in World War II', difficulty: 'easy' },
      { text: 'This city\'s historic center is a UNESCO World Heritage Site despite being largely reconstructed', difficulty: 'medium' },
      { text: 'This city has a mermaid as its official symbol', difficulty: 'medium' },
      { text: 'This city\'s name comes from a phrase meaning "belonging to Warsz," a fisherman from local legends', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city\'s meticulous post-war reconstruction was based on paintings by the Italian artist Bernardo Bellotto', isFunny: false },
      { text: 'This city has the tallest building in the European Union, the 310-meter Palace of Culture and Science', isFunny: false },
      { text: 'Locals joke that the best view of this city is from its controversial Palace of Culture because it\'s the only place from where you can\'t see the building itself', isFunny: true },
    ],
  },
  {
    name: 'Prague',
    country: 'Czech Republic',
    continent: 'Europe',
    clues: [
      { text: 'This city is known as the "City of a Hundred Spires"', difficulty: 'easy' },
      { text: 'This city has the largest ancient castle in the world', difficulty: 'medium' },
      { text: 'This city has a famous astronomical clock installed in 1410', difficulty: 'medium' },
      { text: 'This city\'s Charles Bridge is adorned with 30 baroque statues', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city was largely undamaged during World War II, preserving its medieval architecture', isFunny: false },
      { text: 'This city\'s castle complex covers an area larger than seven football fields', isFunny: false },
      { text: 'The astronomical clock in this city was allegedly cursed by its creator who was blinded after completing it, so that he could never create anything more beautiful', isFunny: true },
    ],
  },
  {
    name: 'Budapest',
    country: 'Hungary',
    continent: 'Europe',
    clues: [
      { text: 'This city was formed in 1873 by merging three towns across a river', difficulty: 'medium' },
      { text: 'This city is famous for its thermal baths, with some dating back to Turkish occupation', difficulty: 'easy' },
      { text: 'This city\'s parliament building is the third-largest in the world', difficulty: 'medium' },
      { text: 'This city has the oldest underground metro line in continental Europe', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has more thermal springs than any other capital city in the world', isFunny: false },
      { text: 'This city\'s Chain Bridge was considered one of the engineering wonders of the world when completed in 1849', isFunny: false },
      { text: 'The tradition of clinking beer glasses was banned in this city for 150 years after Austrian generals clinked glasses while executing Hungarian revolutionaries', isFunny: true },
    ],
  },
  {
    name: 'Bucharest',
    country: 'Romania',
    continent: 'Europe',
    clues: [
      { text: 'This city was once known as "Little Paris" for its architecture', difficulty: 'medium' },
      { text: 'This city is home to the world\'s heaviest building and second-largest administrative building', difficulty: 'easy' },
      { text: 'This city has a triumphal arch modeled after the one in Paris', difficulty: 'medium' },
      { text: 'This city\'s name may derive from the word "bucurie," meaning joy', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city\'s Palace of the Parliament contains 3,500 tons of crystal, 480 chandeliers, and 1,409 ceiling lights', isFunny: false },
      { text: 'This city has an exact replica of Moldova\'s Curtea de Argeș Monastery in the Bellu Cemetery', isFunny: false },
      { text: 'The Palace of the Parliament in this city is so massive that it has a measurable effect on the city\'s weather patterns and requires its own microclimate control systems', isFunny: true },
    ],
  },
  {
    name: 'Sofia',
    country: 'Bulgaria',
    continent: 'Europe',
    clues: [
      { text: 'This city sits at the foot of Vitosha Mountain, a popular ski destination', difficulty: 'easy' },
      { text: 'This city has been settled for at least 7,000 years, making it one of Europe\'s oldest cities', difficulty: 'medium' },
      { text: 'This city is home to one of the largest Eastern Orthodox cathedrals in the world', difficulty: 'medium' },
      { text: 'This city was originally called Serdica by the Romans', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has the second-largest gold-domed cathedral in the Balkans, inspired by Istanbul\'s Hagia Sophia', isFunny: false },
      { text: 'This city has natural mineral springs in its center that locals use to fill bottles for drinking water', isFunny: false },
      { text: 'In this city, nodding means "no" and shaking your head means "yes," confusing countless tourists who think they\'ve just agreed to buy an expensive souvenir', isFunny: true },
    ],
  },
  {
    name: 'Tallinn',
    country: 'Estonia',
    continent: 'Europe',
    clues: [
      { text: 'This city has one of the best-preserved medieval old towns in Europe', difficulty: 'easy' },
      { text: 'This city was a major trade hub in the Hanseatic League', difficulty: 'medium' },
      { text: 'This city has a 159-meter church spire that was the tallest building in the world from 1549 to 1625', difficulty: 'hard' },
      { text: 'This city\'s name is believed to derive from "Taani-linn," meaning "Danish castle"', difficulty: 'medium' },
    ],
    facts: [
      { text: 'This city was the first capital in the world to provide free public transportation to all its residents', isFunny: false },
      { text: 'This city\'s Old Town is a UNESCO World Heritage site with 1.9 kilometers of its original city wall still standing', isFunny: false },
      { text: 'This city is so technologically advanced that locals joke they only use paper for toilet purposes and origami', isFunny: true },
    ],
  },
  {
    name: 'Riga',
    country: 'Latvia',
    continent: 'Europe',
    clues: [
      { text: 'This city is famous for its extensive Art Nouveau architecture', difficulty: 'easy' },
      { text: 'This city\'s old town is a UNESCO World Heritage site known for its medieval buildings', difficulty: 'medium' },
      { text: 'This city was founded in 1201 and served as a key trading post between East and West', difficulty: 'medium' },
      { text: 'This city\'s Freedom Monument stands 42 meters tall and survived both Soviet and Nazi occupations', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has around 700 Art Nouveau buildings, more than any other city in the world', isFunny: false },
      { text: 'This city claims to be the home of the first decorated Christmas tree in 1510', isFunny: false },
      { text: 'The spires of this city\'s churches traditionally have roosters rather than crosses, with locals joking that roosters were chosen because they wake up earlier than Jesus did', isFunny: true },
    ],
  },
  {
    name: 'Vilnius',
    country: 'Lithuania',
    continent: 'Europe',
    clues: [
      { text: 'This city\'s old town is one of the largest surviving medieval towns in Northern Europe', difficulty: 'medium' },
      { text: 'This city has a self-declared "independent republic" neighborhood known for its bohemian atmosphere', difficulty: 'easy' },
      { text: 'This city is located at the confluence of two rivers, the Neris and the Vilnia', difficulty: 'medium' },
      { text: 'This city was once known as the "Jerusalem of the North" for its significant Jewish influence', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city\'s old town contains over 1,200 medieval buildings spread across 3.6 square kilometers', isFunny: false },
      { text: 'This city has a statue of Frank Zappa despite the musician never having visited the country', isFunny: false },
      { text: 'The "Republic of Užupis" in this city has its own constitution, which includes articles like "A dog has the right to be a dog" and "Everyone has the right to be idle"', isFunny: true },
    ],
  },
  {
    name: 'Zagreb',
    country: 'Croatia',
    continent: 'Europe',
    clues: [
      { text: 'This city has a unique museum dedicated to failed relationships', difficulty: 'medium' },
      { text: 'This city grew from two medieval settlements on neighboring hills', difficulty: 'easy' },
      { text: 'This city has the world\'s shortest funicular railway in public transport', difficulty: 'medium' },
      { text: 'This city\'s name likely comes from "za breg" meaning "beyond the hill"', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city features a unique Museum of Broken Relationships displaying personal objects from failed romantic relationships', isFunny: false },
      { text: 'This city\'s St. Mark\'s Church has a colorful tiled roof featuring the medieval coat of arms of Croatia', isFunny: false },
      { text: 'This city\'s funicular is so short (only 66 meters) that locals joke it\'s faster to walk alongside it than to ride, but they ride anyway out of respect for its efforts', isFunny: true },
    ],
  },
  {
    name: 'Belgrade',
    country: 'Serbia',
    continent: 'Europe',
    clues: [
      { text: 'This city sits at the strategic confluence of two major European rivers', difficulty: 'easy' },
      { text: 'This city has been destroyed and rebuilt over 40 times throughout its history', difficulty: 'medium' },
      { text: 'This city has an ancient fortress that has been used by Celts, Romans, Byzantines, Ottomans, and Austrians', difficulty: 'medium' },
      { text: 'This city\'s name means "White City" in Slavic languages', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has the world\'s largest Orthodox church building, St. Sava Temple', isFunny: false },
      { text: 'This city\'s clock tower in Kalemegdan Fortress shows "Turkish time," with hour marks adjusted to sunset rather than midnight', isFunny: false },
      { text: 'This city is so renowned for its nightlife that locals joke they invented the concept of partying, with clubs that operate on a "27/8" schedule (27 hours a day, 8 days a week)', isFunny: true },
    ],
  },
  {
    name: 'Sarajevo',
    country: 'Bosnia and Herzegovina',
    continent: 'Europe',
    clues: [
      { text: 'This city is often called the "Jerusalem of Europe" for its religious diversity', difficulty: 'medium' },
      { text: 'This city hosted the 1984 Winter Olympics', difficulty: 'easy' },
      { text: 'This city has a street where you can stand in a spot that allows you to see a Catholic cathedral, Orthodox church, mosque, and synagogue', difficulty: 'medium' },
      { text: 'This city was the site of an assassination that triggered World War I', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has a spot marked on the pavement where the assassination that sparked World War I took place', isFunny: false },
      { text: 'This city\'s Tunnel of Hope was a lifeline for supplies during the 1990s siege, which lasted longer than the Siege of Leningrad in WWII', isFunny: false },
      { text: 'This city is one of the few places where you can drink Bosnian, Serbian, and Croatian coffee, which are identical but locals insist they taste completely different', isFunny: true },
    ],
  },
  {
    name: 'Skopje',
    country: 'North Macedonia',
    continent: 'Europe',
    clues: [
      { text: 'This city underwent a massive architectural transformation with hundreds of statues added in the 2010s', difficulty: 'easy' },
      { text: 'This city was devastated by an earthquake in 1963 and subsequently rebuilt', difficulty: 'medium' },
      { text: 'This city is divided by the Vardar River into Macedonian and Albanian sections', difficulty: 'medium' },
      { text: 'This city is the birthplace of Mother Teresa', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has more than 300 statues as part of a controversial urban renewal project called "Skopje 2014"', isFunny: false },
      { text: 'This city\'s Stone Bridge has connected the old and new parts of the city since the 15th century', isFunny: false },
      { text: 'This city has so many statues that residents give directions by referring to them, such as "turn left at the warrior on the horse" rather than using street names', isFunny: true },
    ],
  },
  {
    name: 'Tirana',
    country: 'Albania',
    continent: 'Europe',
    clues: [
      { text: 'This city\'s buildings were painted in bright colors after the fall of communism', difficulty: 'easy' },
      { text: 'This city has a pyramid-shaped building that was originally a museum for a dictator', difficulty: 'medium' },
      { text: 'This city is surrounded by mountains on all sides except to the northwest', difficulty: 'medium' },
      { text: 'This city\'s name may have come from the phrase "Tehran-Ana" given by invading Ottomans who compared it to the Persian capital', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city\'s former mayor became famous for his initiative to paint dull communist-era buildings in bright colors and patterns', isFunny: false },
      { text: 'This city banned private cars from its center on certain days, creating pedestrian-only zones', isFunny: false },
      { text: 'This city has a neighborhood nicknamed "The Block" that was once reserved for communist party officials but is now filled with trendy bars where locals joke about drinking "capitalist cocktails in communist living rooms"', isFunny: true },
    ],
  },
  {
    name: 'Podgorica',
    country: 'Montenegro',
    continent: 'Europe',
    clues: [
      { text: 'This city is situated at the confluence of two rivers and at the edge of a large plain', difficulty: 'medium' },
      { text: 'This city was previously named Titograd between 1946 and 1992', difficulty: 'easy' },
      { text: 'This city has been settled since Illyrian and Roman times, known then as Birziminium', difficulty: 'hard' },
      { text: 'This city\'s name means "Under the Little Hill" in the local language', difficulty: 'medium' },
    ],
    facts: [
      { text: 'This city was almost completely destroyed in World War II, being bombed over 70 times', isFunny: false },
      { text: 'This city has the unusual Millennium Bridge, which resembles a sail or harp rising above the Morača River', isFunny: false },
      { text: 'This city is so relaxed that locals joke their official sport is "promaja-dodging" – avoiding the dreaded crosswind that Montenegrins believe can cause all manner of illnesses', isFunny: true },
    ],
  },
  {
    name: 'Chisinau',
    country: 'Moldova',
    continent: 'Europe',
    clues: [
      { text: 'This city\'s name derives from a Romanian word for "new spring"', difficulty: 'hard' },
      { text: 'This city is famous for its numerous parks and green spaces', difficulty: 'medium' },
      { text: 'This city is located on the Bâc River in the center of the country', difficulty: 'medium' },
      { text: 'This city is home to the world\'s largest wine cellar complex, located nearby', difficulty: 'easy' },
    ],
    facts: [
      { text: 'This city is near the Milestii Mici winery which holds the Guinness World Record for the largest wine collection', isFunny: false },
      { text: 'This city was almost completely destroyed by an earthquake in 1940 and again severely damaged in WWII', isFunny: false },
      { text: 'This city is one of the greenest capitals in Europe, with locals joking that trees have more rights than people when it comes to urban planning decisions', isFunny: true },
    ],
  },
  {
    name: 'Minsk',
    country: 'Belarus',
    continent: 'Europe',
    clues: [
      { text: 'This city was almost completely rebuilt after World War II in a grand Soviet style', difficulty: 'easy' },
      { text: 'This city has one of the world\'s largest networks of public transport trolleybuses', difficulty: 'medium' },
      { text: 'This city sits on the banks of the Svislač and Niamiha rivers', difficulty: 'medium' },
      { text: 'This city\'s name may derive from the word "mjenisk," meaning "place of trade"', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city\'s metro system is one of the cleanest in the world, with chandeliers hanging in some stations', isFunny: false },
      { text: 'This city was almost completely destroyed during WWII, with only 19 buildings remaining intact', isFunny: false },
      { text: 'The streets in this city are so wide and the buildings so grand that locals joke you need to notify your friends a day in advance when planning to cross the main avenue', isFunny: true },
    ],
  },
  {
    name: 'Kyiv',
    country: 'Ukraine',
    continent: 'Europe',
    clues: [
      { text: 'This city is known as the "mother of Slavic cities" for its historical importance', difficulty: 'medium' },
      { text: 'This city has the deepest metro station in the world at 105.5 meters below ground', difficulty: 'hard' },
      { text: 'This city is home to a massive titanium statue of a woman holding a sword and shield', difficulty: 'easy' },
      { text: 'This city was founded by three brothers and their sister according to legend', difficulty: 'medium' },
    ],
    facts: [
      { text: 'This city has one of the subway stations in the world deepest below ground at 105.5 meters', isFunny: false },
      { text: 'This city is home to Kyiv-Pechersk Lavra, a 1000-year-old monastery complex with underground caves', isFunny: false },
      { text: 'This city loves chestnuts so much that locals joke they can tell which district you\'re from by how you pronounce the word for chestnut tree', isFunny: true },
    ],
  },
  {
    name: 'Andorra la Vella',
    country: 'Andorra',
    continent: 'Europe',
    clues: [
      { text: 'This city is the highest capital in Europe at 1,023 meters above sea level', difficulty: 'medium' },
      { text: 'This city is located in a microstate between France and Spain', difficulty: 'easy' },
      { text: 'This city sits in a valley surrounded by mountains of the Pyrenees', difficulty: 'medium' },
      { text: 'This city\'s name literally means "Andorra the Old" in Catalan', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city is the capital of one of the few countries in the world with two heads of state, including the President of France', isFunny: false },
      { text: 'This city has duty-free status, making it a major shopping destination', isFunny: false },
      { text: 'This city is so small that locals joke the entire country could fit into a large shopping mall, which is why they built so many shopping centers', isFunny: true },
    ],
  },
  {
    name: 'San Marino',
    country: 'San Marino',
    continent: 'Europe',
    clues: [
      { text: 'This city sits atop Mount Titano and offers views of the surrounding countryside and Adriatic Sea', difficulty: 'medium' },
      { text: 'This city is the capital of one of the world\'s oldest republics, founded in 301 CE', difficulty: 'easy' },
      { text: 'This city has three defensive towers that appear on the national flag', difficulty: 'medium' },
      { text: 'This city is named after a stonemason who founded the republic', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city is the capital of the world\'s oldest republic still in existence', isFunny: false },
      { text: 'This city has more vehicles than people and is completely surrounded by Italy', isFunny: false },
      { text: 'This city\'s police wear such colorful and elaborate uniforms that tourists often mistake them for ceremonial guards and try to pose for photos while being ticketed', isFunny: true },
    ],
  },
  {
    name: 'Monaco',
    country: 'Monaco',
    continent: 'Europe',
    clues: [
      { text: 'This city-state hosts a famous annual Formula 1 Grand Prix on its streets', difficulty: 'easy' },
      { text: 'This city is home to a world-famous casino and oceanographic museum', difficulty: 'medium' },
      { text: 'This city is the second-smallest sovereign state in the world after Vatican City', difficulty: 'medium' },
      { text: 'This city\'s name comes from a nearby 6th-century Greek colony', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city-state is smaller than New York\'s Central Park but has the highest number of millionaires and billionaires per capita', isFunny: false },
      { text: 'This city has the world\'s lowest poverty rate and highest life expectancy at nearly 90 years', isFunny: false },
      { text: 'This city is so dense that locals joke the national sport is "elevator conversation" and real estate is so expensive that people refer to apartment sizes in shoe sizes rather than square meters', isFunny: true },
    ],
  },
  {
    name: 'Vaduz',
    country: 'Liechtenstein',
    continent: 'Europe',
    clues: [
      { text: 'This city sits on the Rhine River with a castle overlooking it from a hillside', difficulty: 'medium' },
      { text: 'This city is the capital of a principality located between Switzerland and Austria', difficulty: 'easy' },
      { text: 'This city has no airport or train station despite being a national capital', difficulty: 'medium' },
      { text: 'This city is home to the Prince\'s wine cellars, producing wines from the monarch\'s private vineyards', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city\'s national museum contains the world\'s most expensive postage stamp', isFunny: false },
      { text: 'This city is home to more registered companies than citizens due to favorable tax laws', isFunny: false },
      { text: 'This city is so small that locals joke their rush hour traffic consists of three cars and a tractor, all driven by people who know each other by name', isFunny: true },
    ],
  },
  {
    name: 'Valletta',
    country: 'Malta',
    continent: 'Europe',
    clues: [
      { text: 'This city was built by the Knights of St. John after the Great Siege of 1565', difficulty: 'medium' },
      { text: 'This city is one of the smallest capital cities in Europe at just 0.8 square kilometers', difficulty: 'easy' },
      { text: 'This city is named after a French nobleman who led the successful defense against Ottoman forces', difficulty: 'hard' },
      { text: 'This city is built on a peninsula with harbors on both sides', difficulty: 'medium' },
    ],
    facts: [
      { text: 'This city has 320 monuments within its small area, making it one of the most concentrated historic areas in the world', isFunny: false },
      { text: 'This city was the first planned city in Europe, designed on a grid system in the 16th century', isFunny: false },
      { text: 'This city has so many stairs due to its hilly terrain that locals joke they don\'t need gym memberships, just a regular commute to work', isFunny: true },
    ],
  },
  {
    name: 'Nicosia',
    country: 'Cyprus',
    continent: 'Europe',
    clues: [
      { text: 'This city is the world\'s last divided capital, split by a UN buffer zone', difficulty: 'easy' },
      { text: 'This city is surrounded by Venetian walls shaped like a star with eleven bastions', difficulty: 'medium' },
      { text: 'This city has been continuously inhabited for over 4,500 years', difficulty: 'medium' },
      { text: 'This city\'s name may derive from the Greek word for "city of victory"', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city\'s walls form a perfect circle that can be clearly seen from aerial views', isFunny: false },
      { text: 'This city has the dubious distinction of being the world\'s last divided capital city', isFunny: false },
      { text: 'This city is so perfectly divided that locals joke you can have breakfast in Europe, lunch in Asia, and be back for dinner in Europe without using an airplane', isFunny: true },
    ],
  },
  {
    name: 'Buenos Aires',
    country: 'Argentina',
    continent: 'South America',
    clues: [
      { text: 'This city is known as the "Paris of South America" for its architecture', difficulty: 'easy' },
      { text: 'This city has the widest avenue in the world, with 16 lanes', difficulty: 'medium' },
      { text: 'This city is the birthplace of tango music and dance', difficulty: 'medium' },
      { text: 'This city\'s name means "good airs" or "fair winds" in Spanish', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has the highest concentration of theaters in the world, with over 300', isFunny: false },
      { text: 'This city has a neighborhood called La Boca with brightly painted buildings originally colored with leftover paint from ships', isFunny: false },
      { text: 'People in this city typically eat dinner around 10 PM or later, leading locals to joke that children\'s bedtime is sometime after midnight', isFunny: true },
    ],
  },
  {
    name: 'La Paz',
    country: 'Bolivia',
    continent: 'South America',
    clues: [
      { text: 'This city is the highest administrative capital in the world at over 3,600 meters', difficulty: 'easy' },
      { text: 'This city has an urban cable car system that serves as a primary means of public transportation', difficulty: 'medium' },
      { text: 'This city is built in a canyon created by a river', difficulty: 'medium' },
      { text: 'This city\'s full name includes "de Nuestra Señora de La Paz" honoring the Virgin Mary', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city\'s airport was once the highest international airport in the world', isFunny: false },
      { text: 'This city has unusual topography where the wealthy live in the lower parts of the city because the air is thicker and warmer', isFunny: false },
      { text: 'Soccer matches in this city cause visiting teams to literally gasp for air, leading locals to joke they win games by simply waiting for opponents to pass out', isFunny: true },
    ],
  },
  {
    name: 'Brasília',
    country: 'Brazil',
    continent: 'South America',
    clues: [
      { text: 'This city was purpose-built as a capital in the 1950s', difficulty: 'easy' },
      { text: 'This city\'s airplane-shaped urban plan was designed by urban planner Lúcio Costa', difficulty: 'medium' },
      { text: 'This city is a UNESCO World Heritage site for its modernist architecture', difficulty: 'medium' },
      { text: 'This city was constructed in just 41 months, from 1956 to 1960', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city is located in the geographic center of the country to help develop its interior', isFunny: false },
      { text: 'This city\'s Cathedral has suspended angels that appear to float from the ceiling', isFunny: false },
      { text: 'The city was built so quickly that workers joked they were constructing buildings during the day and designing them at night', isFunny: true },
    ],
  },
  {
    name: 'Santiago',
    country: 'Chile',
    continent: 'South America',
    clues: [
      { text: 'This city is situated in a valley surrounded by snow-capped Andes mountains', difficulty: 'easy' },
      { text: 'This city has South America\'s tallest skyscraper, the Gran Torre', difficulty: 'medium' },
      { text: 'This city\'s subway system is the second largest in Latin America', difficulty: 'medium' },
      { text: 'This city was founded by Spanish conquistador Pedro de Valdivia in 1541', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city is one of the few major cities where you can ski in the mountains and surf at the beach on the same day', isFunny: false },
      { text: 'This city has the largest swimming pool in the world at a nearby resort, covering over 20 acres', isFunny: false },
      { text: 'This city has a unique weather pattern where pollution gets trapped by mountains, leading locals to joke they have "smog seasons" instead of normal seasons', isFunny: true },
    ],
  },
  {
    name: 'Bogotá',
    country: 'Colombia',
    continent: 'South America',
    clues: [
      { text: 'This city is located on a high plateau in the Andes at 2,640 meters above sea level', difficulty: 'medium' },
      { text: 'This city has the largest network of bicycle paths in Latin America', difficulty: 'easy' },
      { text: 'This city\'s Gold Museum houses the world\'s largest collection of pre-Hispanic gold work', difficulty: 'medium' },
      { text: 'This city was originally called "Santa Fe de Bacatá" by Spanish conquistadors', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city closes over 120 kilometers of roads to cars every Sunday for cyclists, a tradition since 1974', isFunny: false },
      { text: 'This city has one of the largest urban wetland systems in Latin America', isFunny: false },
      { text: 'The weather in this city is so consistently mild that locals say they only have two seasons: the rainy season and the season when it\'s about to rain', isFunny: true },
    ],
  },
  {
    name: 'Quito',
    country: 'Ecuador',
    continent: 'South America',
    clues: [
      { text: 'This city is the second-highest official capital city in the world', difficulty: 'medium' },
      { text: 'This city sits on the slopes of an active volcano', difficulty: 'medium' },
      { text: 'This city\'s historic center was one of the first World Cultural Heritage Sites declared by UNESCO', difficulty: 'easy' },
      { text: 'This city lies just 25 kilometers from the equator', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has a monument marking the Middle of the World, though modern GPS shows it\'s actually about 240 meters off', isFunny: false },
      { text: 'This city\'s airport runway is one of the longest in Latin America due to the thin air at high altitude', isFunny: false },
      { text: 'This city is so close to the equator that locals joke about being able to stand with one foot in each hemisphere and being perfectly balanced', isFunny: true },
    ],
  },
  {
    name: 'Georgetown',
    country: 'Guyana',
    continent: 'South America',
    clues: [
      { text: 'This city is known as the "Garden City of the Caribbean" despite being in South America', difficulty: 'medium' },
      { text: 'This city is built below sea level and relies on a system of canals and seawalls for protection', difficulty: 'easy' },
      { text: 'This city features distinctive colonial wooden architecture', difficulty: 'medium' },
      { text: 'This city was originally called Longchamps when founded by the French', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city\'s St. George\'s Cathedral is one of the tallest wooden buildings in the world', isFunny: false },
      { text: 'This city was named after King George III when the British took it from the Dutch', isFunny: false },
      { text: 'The city\'s famous Stabroek Market clock is so consistently inaccurate that locals use it as an excuse for being late, saying "I\'m on Stabroek time"', isFunny: true },
    ],
  },
  {
    name: 'Asunción',
    country: 'Paraguay',
    continent: 'South America',
    clues: [
      { text: 'This city is one of the oldest cities in South America, founded in 1537', difficulty: 'medium' },
      { text: 'This city sits on the banks of the Paraguay River', difficulty: 'easy' },
      { text: 'This city is known as the "Mother of Cities" because expeditions departed from here to found other cities', difficulty: 'medium' },
      { text: 'This city\'s name means "Assumption" in Spanish, referring to the Assumption of Mary', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city is one of the few capital cities where Guaraní, an indigenous language, is widely spoken alongside Spanish', isFunny: false },
      { text: 'This city has one of the lowest costs of living of any capital city in the Americas', isFunny: false },
      { text: 'The city gets so hot that locals joke about having only two seasons: "hot" and "hell with humidity"', isFunny: true },
    ],
  },
  {
    name: 'Lima',
    country: 'Peru',
    continent: 'South America',
    clues: [
      { text: 'This city is the second-largest desert city in the world after Cairo', difficulty: 'medium' },
      { text: 'This city rarely sees rainfall despite being extremely humid', difficulty: 'medium' },
      { text: 'This city was the capital of the Viceroyalty of Peru for three centuries', difficulty: 'easy' },
      { text: 'This city\'s name may derive from an indigenous word for "talker" or from the Rimac River', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city is considered the gastronomic capital of the Americas with three of the world\'s 50 best restaurants', isFunny: false },
      { text: 'This city has pre-Inca ruins that are over 5,000 years old within its metropolitan area', isFunny: false },
      { text: 'The fog in this city is so persistent that locals call it "donkey\'s belly" and joke about not seeing the sun for months at a time', isFunny: true },
    ],
  },
  {
    name: 'Paramaribo',
    country: 'Suriname',
    continent: 'South America',
    clues: [
      { text: 'This city\'s historic center is a UNESCO World Heritage site with distinctive Dutch colonial architecture', difficulty: 'medium' },
      { text: 'This city has a mosque and a synagogue standing peacefully side by side', difficulty: 'easy' },
      { text: 'This city\'s name comes from the indigenous Tupi people, possibly meaning "inhabitants of the big river"', difficulty: 'hard' },
      { text: 'This city is located on the Suriname River, 15 kilometers from the Atlantic Ocean', difficulty: 'medium' },
    ],
    facts: [
      { text: 'This city is one of the most ethnically diverse in South America, with significant populations of Indian, Indonesian, Chinese, European, and African descent', isFunny: false },
      { text: 'This city\'s Fort Zeelandia was built in the 17th century and served as the first settlement in the colony', isFunny: false },
      { text: 'The city is so multilingual that taxi drivers are known to switch between five languages in a single conversation, sometimes mid-sentence', isFunny: true },
    ],
  },
  {
    name: 'Montevideo',
    country: 'Uruguay',
    continent: 'South America',
    clues: [
      { text: 'This city is the southernmost capital city in the Americas', difficulty: 'medium' },
      { text: 'This city\'s old town has many art deco and colonial buildings', difficulty: 'easy' },
      { text: 'This city hosts the world\'s longest carnival celebration, lasting over 40 days', difficulty: 'medium' },
      { text: 'This city\'s name likely comes from "Monte vide eu" meaning "I saw a mount" in Portuguese', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city has the longest continuous waterfront promenade in the world, stretching over 22 kilometers', isFunny: false },
      { text: 'This city was founded by the Spanish to counter Portuguese settlement in the region', isFunny: false },
      { text: 'The city is so obsessed with mate tea that locals carry special thermoses, cups, and bombillas (metal straws) everywhere, even to the beach, leading visitors to think they\'re all scientists conducting experiments', isFunny: true },
    ],
  },
  {
    name: 'Caracas',
    country: 'Venezuela',
    continent: 'South America',
    clues: [
      { text: 'This city sits in a valley surrounded by mountains, with a famous mountain peak to the north', difficulty: 'easy' },
      { text: 'This city was founded in 1567 and has colonial-era buildings alongside modern skyscrapers', difficulty: 'medium' },
      { text: 'This city has the world\'s highest cable car, reaching an altitude of 4,765 meters', difficulty: 'medium' },
      { text: 'This city\'s full original name was Santiago de León de Caracas', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city enjoys spring-like weather year-round due to its elevation, despite being near the equator', isFunny: false },
      { text: 'This city is the birthplace of Simón Bolívar, who liberated six South American countries from Spanish rule', isFunny: false },
      { text: 'Traffic in this city is so unpredictable that locals schedule meetings with three possible times: optimistic, realistic, and "if the gods are with us"', isFunny: true },
    ],
  },
  {
    name: 'Cayenne',
    country: 'French Guiana',
    continent: 'South America',
    clues: [
      { text: 'This city is the capital of a region that is technically part of France despite being in South America', difficulty: 'easy' },
      { text: 'This city has a distinctive Creole character with colorful colonial houses', difficulty: 'medium' },
      { text: 'This city is named after an extinct indigenous tribe', difficulty: 'hard' },
      { text: 'This city is located on a former island that is now connected to the mainland', difficulty: 'medium' },
    ],
    facts: [
      { text: 'This city is home to the Guiana Space Centre, Europe\'s main spaceport', isFunny: false },
      { text: 'This city shares its name with a famous hot pepper', isFunny: false },
      { text: 'This city is technically part of the European Union despite being surrounded by rainforest, leading locals to joke that they live in the "jungle of Europe"', isFunny: true },
    ],
  },
  {
    name: 'Sucre',
    country: 'Bolivia',
    continent: 'South America',
    clues: [
      { text: 'This city is the constitutional capital of its country, though not the seat of government', difficulty: 'easy' },
      { text: 'This city is known as the "White City" for its well-preserved whitewashed colonial buildings', difficulty: 'medium' },
      { text: 'This city is a UNESCO World Heritage site with a wealth of colonial architecture', difficulty: 'medium' },
      { text: 'This city was formerly called "La Plata" and was renamed after a revolutionary hero', difficulty: 'hard' },
    ],
    facts: [
      { text: 'This city sits at an elevation of 2,810 meters above sea level', isFunny: false },
      { text: 'This city has the oldest university in its country, founded in 1624', isFunny: false },
      { text: 'This city\'s streets are so consistently clean that locals joke about having to apply for a special permit to drop even a candy wrapper', isFunny: true },
    ],
  },
];

async function main() {
  console.log('Cleaning up existing data...');
  await Promise.all([
    prisma.clue.deleteMany(),
    prisma.fact.deleteMany(),
    prisma.destination.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log('Starting to seed database...');
  console.log(`Seeding ${destinations.length} destinations`);
  
  try {
    // When using Supabase with pgBouncer, transactions might be problematic
    // Bulk create destinations first
    console.log('Bulk creating all destinations...');
    const destinationData = destinations.map(({ clues, facts, ...destinationData }) => destinationData);
    await prisma.destination.createMany({
      data: destinationData,
    });
    
    // Fetch created destinations to get their IDs
    const createdDestinations = await prisma.destination.findMany({
      select: { id: true, name: true },
    });
    
    // Create map of destination name to ID for easy lookup
    const destinationMap = new Map(
      createdDestinations.map(dest => [dest.name, dest.id])
    );
    
    // Process clues and facts for each destination
    for (const destination of destinations) {
      try {
        const destinationId = destinationMap.get(destination.name);
        if (!destinationId) {
          console.error(`Couldn't find ID for destination: ${destination.name}`);
          continue;
        }
        
        const { clues, facts } = destination;
        
        // Create related clues in batches to avoid transaction issues
        if (clues && clues.length > 0) {
          // Process clues in smaller batches to avoid transaction timeouts
          const batchSize = 20;
          for (let i = 0; i < clues.length; i += batchSize) {
            const batch = clues.slice(i, i + batchSize);
            await prisma.clue.createMany({
              data: batch.map(clue => ({
                ...clue,
                destinationId,
              })),
            });
          }
        }
        
        // Create related facts in batches
        if (facts && facts.length > 0) {
          // Process facts in smaller batches
          const batchSize = 20;
          for (let i = 0; i < facts.length; i += batchSize) {
            const batch = facts.slice(i, i + batchSize);
            await prisma.fact.createMany({
              data: batch.map(fact => ({
                ...fact,
                destinationId,
              })),
            });
          }
        }
      } catch (error) {
        console.error(`Error processing clues/facts for destination: ${destination.name}`, error);
        // Continue with next destination instead of failing completely
      }
    }
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });