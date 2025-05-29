#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Starting comprehensive performance testing...');

// Performance test configuration
const config = {
  urls: [
    'http://localhost:3000',
    'http://localhost:3000/charts',
  ],
  lighthouse: {
    categories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'desktop',
    throttling: 'simulated3G'
  },
  budgets: {
    'first-contentful-paint': 1500,
    'largest-contentful-paint': 2500,
    'first-input-delay': 100,
    'cumulative-layout-shift': 0.1,
    'speed-index': 3000
  }
};

// Check if server is running
function checkServer(url) {
  try {
    execSync(`curl -f ${url} > /dev/null 2>&1`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// Run Lighthouse audit
async function runLighthouseAudit(url, outputPath) {
  console.log(`🔍 Running Lighthouse audit for ${url}...`);
  
  const command = `lighthouse ${url} \
    --output=json \
    --output-path=${outputPath} \
    --form-factor=${config.lighthouse.formFactor} \
    --throttling-method=simulate \
    --throttling.cpuSlowdownMultiplier=1 \
    --throttling.requestLatencyMs=0 \
    --throttling.downloadThroughputKbps=0 \
    --throttling.uploadThroughputKbps=0 \
    --no-enable-error-reporting \
    --quiet`;

  try {
    execSync(command, { stdio: 'pipe' });
    console.log(`✅ Lighthouse audit completed for ${url}`);
    return true;
  } catch (error) {
    console.log(`❌ Lighthouse audit failed for ${url}:`, error.message);
    return false;
  }
}

// Analyze Lighthouse results
function analyzeLighthouseResults(reportPath) {
  if (!fs.existsSync(reportPath)) {
    console.log(`❌ Report not found: ${reportPath}`);
    return null;
  }

  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const audits = report.audits;
  
  const metrics = {
    'first-contentful-paint': audits['first-contentful-paint']?.numericValue,
    'largest-contentful-paint': audits['largest-contentful-paint']?.numericValue,
    'first-input-delay': audits['max-potential-fid']?.numericValue,
    'cumulative-layout-shift': audits['cumulative-layout-shift']?.numericValue,
    'speed-index': audits['speed-index']?.numericValue,
    'total-blocking-time': audits['total-blocking-time']?.numericValue,
    'interactive': audits['interactive']?.numericValue
  };

  const scores = {
    performance: report.categories.performance?.score * 100,
    accessibility: report.categories.accessibility?.score * 100,
    'best-practices': report.categories['best-practices']?.score * 100,
    seo: report.categories.seo?.score * 100
  };

  return { metrics, scores, url: report.finalUrl };
}

// Check performance budgets
function checkPerformanceBudgets(metrics) {
  const violations = [];
  
  Object.entries(config.budgets).forEach(([metric, budget]) => {
    const value = metrics[metric];
    if (value !== undefined && value > budget) {
      violations.push({
        metric,
        value: Math.round(value),
        budget,
        violation: Math.round(value - budget)
      });
    }
  });

  return violations;
}

// Generate performance report
function generatePerformanceReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalUrls: results.length,
      passedBudgets: 0,
      failedBudgets: 0,
      averagePerformanceScore: 0
    },
    results: [],
    recommendations: []
  };

  let totalPerformanceScore = 0;

  results.forEach(result => {
    if (!result) return;

    const violations = checkPerformanceBudgets(result.metrics);
    const passed = violations.length === 0;
    
    if (passed) {
      report.summary.passedBudgets++;
    } else {
      report.summary.failedBudgets++;
    }

    totalPerformanceScore += result.scores.performance || 0;

    report.results.push({
      url: result.url,
      metrics: result.metrics,
      scores: result.scores,
      budgetViolations: violations,
      passedBudgets: passed
    });
  });

  report.summary.averagePerformanceScore = Math.round(
    totalPerformanceScore / results.filter(r => r).length
  );

  // Generate recommendations
  const allViolations = report.results.flatMap(r => r.budgetViolations);
  
  if (allViolations.some(v => v.metric === 'first-contentful-paint')) {
    report.recommendations.push('Optimize First Contentful Paint by reducing server response times and eliminating render-blocking resources');
  }
  
  if (allViolations.some(v => v.metric === 'largest-contentful-paint')) {
    report.recommendations.push('Improve Largest Contentful Paint by optimizing images and preloading critical resources');
  }
  
  if (allViolations.some(v => v.metric === 'cumulative-layout-shift')) {
    report.recommendations.push('Reduce Cumulative Layout Shift by setting dimensions for images and avoiding dynamic content insertion');
  }
  
  if (allViolations.some(v => v.metric === 'first-input-delay')) {
    report.recommendations.push('Minimize First Input Delay by reducing JavaScript execution time and using code splitting');
  }

  return report;
}

// Main execution
async function main() {
  // Check if server is running
  const serverUrl = config.urls[0];
  if (!checkServer(serverUrl)) {
    console.log('❌ Server is not running. Please start the server first:');
    console.log('   npm run dev (for development)');
    console.log('   npm run build && npm run start (for production)');
    process.exit(1);
  }

  console.log('✅ Server is running');

  // Create reports directory
  const reportsDir = 'performance-reports';
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const results = [];

  // Run Lighthouse audits for each URL
  for (const url of config.urls) {
    const reportPath = path.join(reportsDir, `lighthouse-${timestamp}-${url.replace(/[^a-zA-Z0-9]/g, '_')}.json`);
    
    const success = await runLighthouseAudit(url, reportPath);
    if (success) {
      const result = analyzeLighthouseResults(reportPath);
      results.push(result);
    } else {
      results.push(null);
    }
  }

  // Generate comprehensive report
  const performanceReport = generatePerformanceReport(results);
  const reportPath = path.join(reportsDir, `performance-report-${timestamp}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(performanceReport, null, 2));

  // Display results
  console.log('\n📊 Performance Test Results');
  console.log('=' .repeat(50));
  
  console.log(`\n📈 Summary:`);
  console.log(`   Average Performance Score: ${performanceReport.summary.averagePerformanceScore}/100`);
  console.log(`   URLs Passed Budgets: ${performanceReport.summary.passedBudgets}/${performanceReport.summary.totalUrls}`);
  console.log(`   URLs Failed Budgets: ${performanceReport.summary.failedBudgets}/${performanceReport.summary.totalUrls}`);

  performanceReport.results.forEach((result, index) => {
    if (!result) return;
    
    console.log(`\n🔗 ${result.url}:`);
    console.log(`   Performance Score: ${Math.round(result.scores.performance)}/100`);
    console.log(`   Accessibility Score: ${Math.round(result.scores.accessibility)}/100`);
    console.log(`   Best Practices Score: ${Math.round(result.scores['best-practices'])}/100`);
    console.log(`   SEO Score: ${Math.round(result.scores.seo)}/100`);
    
    if (result.budgetViolations.length > 0) {
      console.log(`   ⚠️ Budget Violations:`);
      result.budgetViolations.forEach(violation => {
        console.log(`      ${violation.metric}: ${violation.value}ms (budget: ${violation.budget}ms, over by: ${violation.violation}ms)`);
      });
    } else {
      console.log(`   ✅ All performance budgets passed`);
    }
  });

  if (performanceReport.recommendations.length > 0) {
    console.log(`\n💡 Recommendations:`);
    performanceReport.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });
  }

  console.log(`\n📋 Detailed reports saved to: ${reportsDir}/`);
  console.log(`📋 Performance report: ${reportPath}`);

  // Exit with error code if budgets failed
  if (performanceReport.summary.failedBudgets > 0) {
    console.log('\n❌ Some performance budgets failed. Please optimize before deploying.');
    process.exit(1);
  } else {
    console.log('\n✅ All performance budgets passed! Ready for deployment.');
    process.exit(0);
  }
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});

// Run the tests
main().catch(error => {
  console.error('❌ Performance testing failed:', error);
  process.exit(1);
});
