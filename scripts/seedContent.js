import dotenv from 'dotenv';
dotenv.config();

import { query } from '../server/db.js';
import { contentLibrary } from '../src/aiLearningData.js';

const seedContent = async () => {
  try {
    console.log('🌱 Starting content seeding...');

    // Clear existing content
    await query('DELETE FROM content');
    console.log('✅ Cleared existing content');

    // Insert content from MVP data
    for (const item of contentLibrary) {
      const { id, type, title, description, roles, industries, tags, difficulty, estimatedTime, prompt, tips, steps, challenge, solution, results, keyTakeaway } = item;

      // Build content object based on type
      let contentObj;
      if (type === 'prompt') {
        contentObj = {
          prompt,
          tips,
        };
      } else if (type === 'tutorial') {
        contentObj = {
          steps,
        };
      } else if (type === 'caseStudy') {
        contentObj = {
          challenge,
          solution,
          results,
          keyTakeaway,
        };
      }

      try {
        await query(
          `INSERT INTO content (type, title, description, roles, industries, difficulty, estimated_time, content, tags)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            type,
            title,
            description,
            JSON.stringify(roles || []),
            JSON.stringify(industries || []),
            difficulty || 'beginner',
            estimatedTime || '5 min',
            JSON.stringify(contentObj),
            JSON.stringify(tags || []),
          ]
        );
        console.log(`✅ Seeded: ${title}`);
      } catch (error) {
        console.error(`❌ Error seeding "${title}":`, error.message);
      }
    }

    console.log('✅ Content seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seed
seedContent();
