#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const publicDir = path.join(__dirname, 'public');
const inputFile = path.join(publicDir, 'x4.jpg');
const outputDir = publicDir;

async function optimizeImages() {
  try {
    console.log('🖼️  Starting image optimization...\n');

    // Check if source file exists
    if (!fs.existsSync(inputFile)) {
      console.error(`❌ Source file not found: ${inputFile}`);
      process.exit(1);
    }

    // Get original file size
    const originalSize = fs.statSync(inputFile).size;
    console.log(`📦 Original x4.jpg: ${(originalSize / 1024).toFixed(2)} KB`);

    // Optimize JPEG
    console.log('\n🔧 Optimizing JPEG...');
    const jpegPath = path.join(outputDir, 'x4.jpg');
    await sharp(inputFile)
      .jpeg({ quality: 80, progressive: true })
      .toFile(`${jpegPath.replace('.jpg', '-optimized.jpg')}`);

    // Create WebP version (modern format)
    console.log('🔧 Creating WebP version...');
    const webpPath = path.join(outputDir, 'x4.webp');
    await sharp(inputFile)
      .webp({ quality: 80 })
      .toFile(webpPath);

    // Create smaller variant for thumbnails (if needed)
    console.log('🔧 Creating thumbnail variant...');
    const thumbPath = path.join(outputDir, 'x4-thumb.webp');
    await sharp(inputFile)
      .webp({ quality: 70 })
      .resize(200, 200, { fit: 'contain', background: { r: 15, g: 23, b: 42, alpha: 1 } })
      .toFile(thumbPath);

    // Get optimized file sizes
    const jpegOptSize = fs.statSync(`${jpegPath.replace('.jpg', '-optimized.jpg')}`).size;
    const webpSize = fs.statSync(webpPath).size;
    const thumbSize = fs.statSync(thumbPath).size;

    console.log('\n📊 Optimization Results:');
    console.log(`   Original JPEG:     ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`   Optimized JPEG:    ${(jpegOptSize / 1024).toFixed(2)} KB (-${((1 - jpegOptSize / originalSize) * 100).toFixed(1)}%)`);
    console.log(`   WebP version:      ${(webpSize / 1024).toFixed(2)} KB (-${((1 - webpSize / originalSize) * 100).toFixed(1)}%)`);
    console.log(`   Thumbnail WebP:    ${(thumbSize / 1024).toFixed(2)} KB`);

    // Replace original with optimized version
    console.log('\n✅ Replacing original with optimized version...');
    fs.renameSync(`${jpegPath.replace('.jpg', '-optimized.jpg')}`, jpegPath);

    console.log('\n✨ Image optimization complete!');
    console.log(`   📍 /public/x4.jpg (optimized JPEG)`);
    console.log(`   📍 /public/x4.webp (modern WebP format)`);
    console.log(`   📍 /public/x4-thumb.webp (thumbnail)`);

  } catch (error) {
    console.error('❌ Error during optimization:', error);
    process.exit(1);
  }
}

optimizeImages();
