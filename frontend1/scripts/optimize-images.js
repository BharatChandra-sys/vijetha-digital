#!/usr/bin/env node
/**
 * Image Optimization Script for Vijetha Digital
 * 
 * This script optimizes JPG images to WebP and AVIF formats for better performance.
 * Run: node scripts/optimize-images.js
 * 
 * Prerequisites:
 * npm install sharp --save-dev
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '../public/images');
const QUALITY_WEBP = 82;
const QUALITY_AVIF = 75;

// Images to optimize with target dimensions
const IMAGES_TO_OPTIMIZE = [
  {
    input: 'about-printing.jpg',
    dimensions: { width: 1200, height: 900 }, // From 3512x2637
    alt: 'Vijetha Digital printing facility — Hyderabad'
  },
  {
    input: 'project-booklets.jpg',
    dimensions: { width: 1200, height: 1500 }, // From 4974x3113
    alt: 'BOOKLETS & CATALOGUES'
  },
  {
    input: 'hero-banner-hq.jpg',
    dimensions: { width: 1920, height: 1080 }, // Hero needs to be larger
    alt: 'Commercial Printing Hyderabad'
  },
  {
    input: 'project-cards.jpg',
    dimensions: { width: 1200, height: 800 }, // From 4500x2814
    alt: 'VISITING CARDS'
  }
];

async function optimizeImage(imageConfig) {
  const inputPath = path.join(IMAGES_DIR, imageConfig.input);
  const baseName = path.basename(imageConfig.input, path.extname(imageConfig.input));
  
  console.log(`\n🖼️  Optimizing ${imageConfig.input}...`);
  
  try {
    const imageBuffer = await fs.readFile(inputPath);
    const metadata = await sharp(imageBuffer).metadata();
    
    console.log(`   Original: ${metadata.width}x${metadata.height}, ${(metadata.size / 1024 / 1024).toFixed(2)} MB`);
    
    // Resize and optimize to WebP
    const webpBuffer = await sharp(imageBuffer)
      .resize(imageConfig.dimensions.width, imageConfig.dimensions.height, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: QUALITY_WEBP })
      .toBuffer();
    
    const webpPath = path.join(IMAGES_DIR, `${baseName}.webp`);
    await fs.writeFile(webpPath, webpBuffer);
    console.log(`   ✅ WebP: ${imageConfig.dimensions.width}x${imageConfig.dimensions.height}, ${(webpBuffer.length / 1024 / 1024).toFixed(2)} MB`);
    
    // Resize and optimize to AVIF
    const avifBuffer = await sharp(imageBuffer)
      .resize(imageConfig.dimensions.width, imageConfig.dimensions.height, {
        fit: 'cover',
        position: 'center'
      })
      .avif({ quality: QUALITY_AVIF })
      .toBuffer();
    
    const avifPath = path.join(IMAGES_DIR, `${baseName}.avif`);
    await fs.writeFile(avifPath, avifBuffer);
    console.log(`   ✅ AVIF: ${imageConfig.dimensions.width}x${imageConfig.dimensions.height}, ${(avifBuffer.length / 1024 / 1024).toFixed(2)} MB`);
    
    const savings = metadata.size - Math.min(webpBuffer.length, avifBuffer.length);
    console.log(`   💰 Savings: ${(savings / 1024 / 1024).toFixed(2)} MB (${((savings / metadata.size) * 100).toFixed(1)}%)`);
    
  } catch (error) {
    console.error(`   ❌ Error optimizing ${imageConfig.input}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Starting image optimization for Vijetha Digital...\n');
  console.log(`📁 Images directory: ${IMAGES_DIR}`);
  
  for (const imageConfig of IMAGES_TO_OPTIMIZE) {
    await optimizeImage(imageConfig);
  }
  
  console.log('\n✨ Image optimization complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Update image references to use Next.js Image component');
  console.log('   2. Specify width and height props to prevent layout shift');
  console.log('   3. Deploy and test PageSpeed score improvement');
}

main().catch(console.error);
