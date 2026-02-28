/**
 * sanitizeFilenames.js
 *
 * Renames uploaded files that contain spaces or special characters,
 * then updates the corresponding MongoDB records.
 *
 * Run once on the server:  node backend/scripts/sanitizeFilenames.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Collection = require('../models/Collection');
const Category   = require('../models/Category');
const Product    = require('../models/Product');
const Banner     = require('../models/Banner');
const Testimonial = require('../models/Testimonial');

const UPLOADS_DIR = path.join(__dirname, '../uploads');

/**
 * Sanitize a filename: lowercase, replace accented chars, replace
 * anything that isn't alphanumeric / dash / dot / underscore with _.
 */
function sanitizeName(filename) {
  const ext   = path.extname(filename);
  const base  = path.basename(filename, ext);
  const clean = base
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // strip accent marks
    .replace(/[^a-zA-Z0-9._-]/g, '_')  // replace bad chars with _
    .replace(/_+/g, '_')               // collapse multiple underscores
    .replace(/^_|_$/g, '');            // trim leading/trailing _
  return clean + ext;
}

/**
 * Walk through a uploads sub-directory, rename any file whose name
 * contains spaces or non-ASCII characters, and return a map of
 * old relative path → new relative path.
 */
function renameFilesInDir(subdir) {
  const dirPath = path.join(UPLOADS_DIR, subdir);
  const renames = {}; // oldRelPath → newRelPath

  if (!fs.existsSync(dirPath)) return renames;

  fs.readdirSync(dirPath).forEach(filename => {
    const needsRename = /[^\x21-\x7E]|\s/.test(filename); // non-printable or whitespace
    if (!needsRename) return;

    const sanitized = sanitizeName(filename);
    const oldPath   = path.join(dirPath, filename);
    let   newPath   = path.join(dirPath, sanitized);

    // Avoid collision
    if (fs.existsSync(newPath) && oldPath !== newPath) {
      newPath = path.join(dirPath, `${Date.now()}_${sanitized}`);
    }

    fs.renameSync(oldPath, newPath);
    const newFilename = path.basename(newPath);
    console.log(`  renamed: ${filename} → ${newFilename}`);

    renames[`/uploads/${subdir}/${filename}`] = `/uploads/${subdir}/${newFilename}`;
  });

  return renames;
}

/**
 * Replace image path in a Mongoose model's documents.
 */
async function fixModel(Model, field, renames) {
  if (Object.keys(renames).length === 0) return;

  const docs = await Model.find({});
  let updated = 0;

  for (const doc of docs) {
    const current = doc[field];
    if (!current) continue;

    // Handle both string and array (products.images)
    if (Array.isArray(current)) {
      let changed = false;
      const newArr = current.map(p => {
        if (renames[p]) { changed = true; return renames[p]; }
        return p;
      });
      if (changed) {
        doc[field] = newArr;
        await doc.save();
        updated++;
      }
    } else {
      if (renames[current]) {
        doc[field] = renames[current];
        await doc.save();
        updated++;
      }
    }
  }

  if (updated > 0) console.log(`  ${Model.modelName}: updated ${updated} record(s)`);
}

async function run() {
  console.log('🔗 Connecting to MongoDB…');
  await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
  console.log('✅ Connected\n');

  const subdirs = ['collections', 'categories', 'products', 'banners', 'testimonials'];

  for (const subdir of subdirs) {
    console.log(`📂 Processing uploads/${subdir}/`);
    const renames = renameFilesInDir(subdir);

    if (Object.keys(renames).length === 0) {
      console.log('  No files needed renaming.\n');
      continue;
    }

    // Update DB for each model
    await fixModel(Collection,  'image',  renames);
    await fixModel(Category,    'image',  renames);
    await fixModel(Product,     'images', renames);
    await fixModel(Product,     'image',  renames);
    await fixModel(Banner,      'image',  renames);
    await fixModel(Testimonial, 'avatar', renames);
    console.log('');
  }

  console.log('✅ Done.');
  await mongoose.connection.close();
}

run().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
