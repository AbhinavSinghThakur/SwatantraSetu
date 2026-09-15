import dotenv from 'dotenv';
import { seedDatabase } from './seedLib.js';

dotenv.config();
seedDatabase().then(() => process.exit(0));
