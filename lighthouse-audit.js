#!/usr/bin/env node

import lighthouse from 'lighthouse';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple HTTP server to serve the dist folder
function startServer(port) {
  const distPath = path.join(__dirname, 'dist');

  const server = http.createServer((req, res) => {
    let filePath = path.join(distPath, req.url === '/' ? 'index.html' : req.url);

    // Handle React Router - rewrite to index.html for non-asset routes
    if (!path.extname(filePath) && !filePath.includes('assets')) {
      filePath = path.join(distPath, 'index.html');
    }

    fs.readFile(filePath, 'binary', (err, file) => {
      if (err) {
        res.writeHead(404);
        res.end();
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
      };

      const contentType = mimeTypes[ext] || 'text/plain';
      res.setHeader('Content-Type', contentType);

      // Set cache headers based on content type
      if (ext === '.html') {
        if (filePath.endsWith('index.html')) {
          res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        } else {
          res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
        }
      } else if (ext === '.js' || ext === '.css') {
        res.setHeader('Cache-Control', 'public, max-age=604800, must-revalidate');
      } else if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext)) {
        res.setHeader('Cache-Control', 'public, max-age=2592000, must-revalidate');
      }

      res.write(file, 'binary');
      res.end();
    });
  });

  return new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`🚀 Test server started on http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function runLighthouse(url) {
  console.log(`📊 Running Lighthouse audit on ${url}...\n`);

  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  };

  const runnerResult = await lighthouse(url, options);
  return runnerResult.lhr;
}

async function main() {
  const port = 8888;
  const url = `http://localhost:${port}`;

  // Check if dist folder exists
  const distPath = path.join(__dirname, 'dist');
  if (!fs.existsSync(distPath)) {
    console.error('❌ dist folder not found. Please run "pnpm build" first.');
    process.exit(1);
  }

  let server;
  try {
    // Start test server
    server = await startServer(port);

    // Wait a bit for server to be ready
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Run Lighthouse audit
    const results = await runLighthouse(url);

    // Extract scores
    const scores = {
      performance: Math.round(results.categories.performance.score * 100),
      accessibility: Math.round(results.categories.accessibility.score * 100),
      'best-practices': Math.round(results.categories['best-practices'].score * 100),
      seo: Math.round(results.categories.seo.score * 100),
    };

    // Display results
    console.log('\n📈 Lighthouse Audit Results:');
    console.log('═'.repeat(50));
    console.log(`  ⚡ Performance:      ${scores.performance}/100 ${getScoreEmoji(scores.performance)}`);
    console.log(`  ♿ Accessibility:    ${scores.accessibility}/100 ${getScoreEmoji(scores.accessibility)}`);
    console.log(`  ✅ Best Practices:   ${scores['best-practices']}/100 ${getScoreEmoji(scores['best-practices'])}`);
    console.log(`  🔍 SEO:             ${scores.seo}/100 ${getScoreEmoji(scores.seo)}`);
    console.log('═'.repeat(50));

    // Calculate average
    const avgScore = Math.round(
      (scores.performance + scores.accessibility + scores['best-practices'] + scores.seo) / 4
    );
    console.log(`\n  📊 Average Score: ${avgScore}/100 ${getScoreEmoji(avgScore)}`);

    // Show opportunities and diagnostics if score is low
    if (scores.performance < 90) {
      console.log('\n⚠️  Performance Opportunities:');
      if (results.categories.performance.auditRefs) {
        results.categories.performance.auditRefs
          .filter((audit) => results.audits[audit.id]?.score < 1)
          .slice(0, 5)
          .forEach((audit) => {
            const auditData = results.audits[audit.id];
            console.log(`   • ${auditData.title}`);
          });
      }
    }

    // Save detailed report
    const reportPath = path.join(__dirname, 'lighthouse-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`\n📄 Full report saved to lighthouse-report.json`);

    // Exit with appropriate code
    const minScore = Math.min(...Object.values(scores));
    process.exit(minScore >= 90 ? 0 : 1);
  } catch (error) {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  } finally {
    if (server) {
      server.close();
      console.log('\n✅ Test server closed');
    }
  }
}

function getScoreEmoji(score) {
  if (score >= 90) return '🟢';
  if (score >= 80) return '🟠';
  return '🔴';
}

main();
