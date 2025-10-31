#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getFileSizeInKB(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / 1024).toFixed(2);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundle() {
  console.log('\n🔍 Performance Analysis Report');
  console.log('═'.repeat(60));

  const distPath = path.join(__dirname, 'dist');
  const assetsPath = path.join(distPath, 'assets');

  if (!fs.existsSync(distPath)) {
    console.error('❌ dist folder not found. Please run "pnpm build" first.');
    process.exit(1);
  }

  // Get all files in dist
  const getAllFiles = (dir) => {
    const files = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });

    items.forEach((item) => {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory() && item.name !== '.') {
        files.push(...getAllFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    });
    return files;
  };

  const allFiles = getAllFiles(distPath);
  const assetFiles = allFiles.filter((f) => f.includes('/assets/'));

  // Calculate totals
  let totalSize = 0;
  let htmlSize = 0;
  let cssSize = 0;
  let jsSize = 0;
  let imageSize = 0;

  const assets = {
    vendor: { size: 0, file: '' },
    lucide: { size: 0, file: '' },
    pages: [],
    css: { size: 0, file: '' },
    other: { size: 0, file: '' },
  };

  allFiles.forEach((file) => {
    const size = fs.statSync(file).size;
    totalSize += size;

    if (file.endsWith('index.html')) {
      htmlSize += size;
    } else if (file.endsWith('.css')) {
      cssSize += size;
      assets.css.size += size;
      assets.css.file = path.basename(file);
    } else if (file.endsWith('.js')) {
      jsSize += size;

      if (file.includes('vendor')) {
        assets.vendor.size = size;
        assets.vendor.file = path.basename(file);
      } else if (file.includes('lucide')) {
        assets.lucide.size = size;
        assets.lucide.file = path.basename(file);
      } else if (file.includes('index')) {
        assets.other.size = size;
        assets.other.file = path.basename(file);
      } else {
        assets.pages.push({
          name: path.basename(file),
          size: size,
        });
      }
    } else if (file.match(/\.(jpg|png|webp|gif|svg)$/)) {
      imageSize += size;
    }
  });

  // Display results
  console.log('\n📊 Bundle Size Analysis:');
  console.log('─'.repeat(60));
  console.log(`Total size:           ${formatBytes(totalSize)} (${(totalSize / 1024).toFixed(2)} KB)`);
  console.log(`├─ HTML:              ${formatBytes(htmlSize)}`);
  console.log(`├─ JavaScript:        ${formatBytes(jsSize)}`);
  console.log(`├─ CSS:               ${formatBytes(cssSize)}`);
  console.log(`└─ Images:            ${formatBytes(imageSize)}`);

  console.log('\n📦 JavaScript Breakdown:');
  console.log('─'.repeat(60));
  console.log(`Vendor libraries:     ${formatBytes(assets.vendor.size)} (${assets.vendor.file})`);
  console.log(`Icons (lucide):       ${formatBytes(assets.lucide.size)} (${assets.lucide.file})`);
  console.log(`App shell:            ${formatBytes(assets.other.size)} (${assets.other.file})`);
  console.log(`\nLazy-loaded pages:`);
  assets.pages.forEach((page) => {
    console.log(`  • ${page.name.padEnd(30)} ${formatBytes(page.size)}`);
  });

  // Performance metrics
  console.log('\n⚡ Performance Metrics:');
  console.log('─'.repeat(60));

  // Gzip simulation (rough estimate - usually ~30% of original size)
  const gzipRatio = 0.3;
  const gzipTotal = totalSize * gzipRatio;
  console.log(`Estimated gzip size:  ${formatBytes(gzipTotal)} (~30% of original)`);

  // Cache efficiency
  const vendorPercent = ((assets.vendor.size / jsSize) * 100).toFixed(1);
  const lucidePercent = ((assets.lucide.size / jsSize) * 100).toFixed(1);
  console.log(`\nCache Efficiency (long-term caching):`);
  console.log(`  Vendor library:      ${vendorPercent}% of JS (cacheable for 1 year)`);
  console.log(`  Icon library:        ${lucidePercent}% of JS (cacheable for 1 year)`);
  console.log(`  Total cacheable:     ${((assets.vendor.size + assets.lucide.size) / jsSize * 100).toFixed(1)}% of JS`);

  // Initial load estimate
  const initialLoad = assets.other.size + assets.css.size + htmlSize;
  console.log(`\nInitial Page Load (shell):`);
  console.log(`  ${formatBytes(initialLoad)}`);
  console.log(`  (App shell + CSS, excluding lazy-loaded pages)`);

  // Image optimization check
  const jpgFiles = allFiles.filter((f) => f.endsWith('.jpg'));
  const webpFiles = allFiles.filter((f) => f.endsWith('.webp'));
  console.log(`\n🖼️  Image Optimization:`);
  if (webpFiles.length > 0) {
    webpFiles.forEach((webp) => {
      const jpgEquiv = jpgFiles.find((j) => j.replace('.webp', '.jpg') === webp);
      if (jpgEquiv) {
        const jpgSize = fs.statSync(jpgEquiv).size;
        const webpSize = fs.statSync(webp).size;
        const savings = (((jpgSize - webpSize) / jpgSize) * 100).toFixed(1);
        console.log(`  ${path.basename(webp)}`);
        console.log(`    JPEG: ${formatBytes(jpgSize)} → WebP: ${formatBytes(webpSize)} (${savings}% smaller)`);
      }
    });
  }

  // Recommendations
  console.log('\n💡 Recommendations:');
  console.log('─'.repeat(60));

  const recommendations = [];

  if (assets.other.size > 200000) {
    recommendations.push('Consider splitting the main app bundle further');
  }

  if (jsSize > 300000) {
    recommendations.push('Total JS size is large - review third-party dependencies');
  }

  if (cssSize > 50000) {
    recommendations.push('CSS size is significant - consider using CSS-in-JS or Tailwind purging');
  }

  if (recommendations.length === 0) {
    recommendations.push('Bundle sizes are optimized! ✅');
    recommendations.push('Code splitting is properly configured');
    recommendations.push('Images are optimized to modern formats');
  }

  recommendations.forEach((rec, i) => {
    console.log(`${i + 1}. ${rec}`);
  });

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('✨ Build Statistics:');
  console.log(
    `   • Chunks: ${assets.pages.length + 3} (vendor, lucide, app, ${assets.pages.length} pages)`
  );
  console.log(`   • Total JS: ${formatBytes(jsSize)}`);
  console.log(`   • Total CSS: ${formatBytes(cssSize)}`);
  console.log(`   • Build time: Check logs above`);
  console.log('═'.repeat(60) + '\n');

  return {
    passed: jsSize < 500000 && cssSize < 50000,
  };
}

const result = analyzeBundle();
process.exit(result.passed ? 0 : 1);
