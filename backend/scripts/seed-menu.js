require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const MenuItem = require('../Schemas/MenuItem');
const items = require('./menu-items.json');

async function main() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not configured');
  await mongoose.connect(process.env.MONGO_URI);
  try {
    const results = await MenuItem.bulkWrite(items.map((item) => ({
      updateOne: {
        filter: { name: item.name, category: item.category },
        update: { $setOnInsert: item },
        upsert: true,
      },
    })));
    console.log(`Added ${results.upsertedCount} menu items; ${items.length - results.upsertedCount} already existed.`);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error('Menu seed failed:', error);
  process.exitCode = 1;
});
