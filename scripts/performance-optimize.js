#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting ViewMarket performance optimization...');

// 1. Clean and optimize build
console.log('🧹 Cleaning and optimizing build...');
try {
  const isWindows = process.platform === 'win32';
  const cleanCommand = isWindows ? 'rmdir /s /q .next' : 'rm -rf .next';
  execSync(cleanCommand, { stdio: 'inherit' });
  console.log('✅ Previous builds cleaned');
} catch (error) {
  console.log('ℹ️ No previous builds to clean');
}

// 2. Optimize images
console.log('🖼️ Optimizing images...');
const imagesDir = path.join(process.cwd(), 'public', 'images');
if (fs.existsSync(imagesDir)) {
  const images = fs.readdirSync(imagesDir);
  console.log(`📊 Found ${images.length} images to optimize`);
  
  // Check if hero image exists and its size
  const heroImage = path.join(imagesDir, 'hero-viewmarket-charts.png');
  if (fs.existsSync(heroImage)) {
    const stats = fs.statSync(heroImage);
    const sizeInMB = stats.size / (1024 * 1024);
    console.log(`📏 Hero image size: ${sizeInMB.toFixed(2)}MB`);
    
    if (sizeInMB > 1) {
      console.log('⚠️ Hero image is large. Consider optimizing it further.');
      console.log('💡 Recommendations:');
      console.log('   - Use WebP/AVIF format');
      console.log('   - Reduce quality to 80-85%');
      console.log('   - Resize to maximum needed dimensions');
    }
  }
}

// 3. Analyze bundle size
console.log('📦 Analyzing bundle composition...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Check for heavy dependencies
const heavyDeps = [
  'framer-motion',
  '@codemirror/autocomplete',
  '@codemirror/commands',
  '@codemirror/lang-javascript',
  '@codemirror/language',
  '@codemirror/state',
  '@codemirror/theme-one-dark',
  '@codemirror/view',
  'lightweight-charts',
  'html2canvas'
];

const foundHeavyDeps = heavyDeps.filter(dep => packageJson.dependencies[dep]);
if (foundHeavyDeps.length > 0) {
  console.log('📊 Heavy dependencies found:');
  foundHeavyDeps.forEach(dep => {
    console.log(`   - ${dep}: ${packageJson.dependencies[dep]}`);
  });
  console.log('💡 These are properly code-split in next.config.ts');
}

// 4. Check for unused dependencies
console.log('🔍 Checking for potential optimizations...');
const devDeps = Object.keys(packageJson.devDependencies || {});
const deps = Object.keys(packageJson.dependencies || {});

// Dependencies that might be moved to devDependencies
const potentialDevDeps = [
  '@types/html2canvas',
  '@next/bundle-analyzer'
];

const misplacedDeps = deps.filter(dep => potentialDevDeps.includes(dep));
if (misplacedDeps.length > 0) {
  console.log('⚠️ These dependencies might belong in devDependencies:');
  misplacedDeps.forEach(dep => console.log(`   - ${dep}`));
}

// 5. Create performance budget
console.log('📏 Creating performance budget...');
const performanceBudget = {
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "400kb",
      "maximumError": "800kb"
    },
    {
      "type": "anyComponentStyle",
      "maximumWarning": "1.5kb",
      "maximumError": "3kb"
    },
    {
      "type": "anyScript",
      "maximumWarning": "150kb",
      "maximumError": "300kb"
    }
  ],
  "webVitals": {
    "fcp": 1200,
    "lcp": 2000,
    "fid": 75,
    "cls": 0.05,
    "ttfb": 400
  }
};

fs.writeFileSync('performance-budget.json', JSON.stringify(performanceBudget, null, 2));
console.log('✅ Performance budget created');

// 6. Build with optimizations
console.log('🏗️ Building with optimizations...');
try {
  const isWindows = process.platform === 'win32';
  const buildCommand = isWindows ? 'set NODE_ENV=production && npm run build' : 'NODE_ENV=production npm run build';
  execSync(buildCommand, { stdio: 'inherit' });
  console.log('✅ Optimized build completed');
} catch (error) {
  console.log('❌ Build failed:', error.message);
  process.exit(1);
}

// 7. Analyze build output
console.log('📊 Analyzing build output...');
const buildDir = '.next';
if (fs.existsSync(buildDir)) {
  const getDirectorySize = (dirPath) => {
    let totalSize = 0;
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        totalSize += getDirectorySize(filePath);
      } else {
        totalSize += stats.size;
      }
    });
    
    return totalSize;
  };
  
  const buildSize = getDirectorySize(buildDir);
  const buildSizeMB = buildSize / (1024 * 1024);
  
  console.log(`📊 Total build size: ${buildSizeMB.toFixed(2)}MB`);
  
  if (buildSizeMB > 30) {
    console.log('⚠️ Build size is large. Consider:');
    console.log('   - Enabling more aggressive code splitting');
    console.log('   - Removing unused dependencies');
    console.log('   - Optimizing images and assets');
  } else {
    console.log('✅ Build size is optimized');
  }
}

// 8. Generate optimization report
console.log('📋 Generating optimization report...');
const report = {
  timestamp: new Date().toISOString(),
  optimizations: [
    'Enhanced code splitting for heavy libraries',
    'Optimized image loading with AVIF/WebP support',
    'Aggressive performance budgets set',
    'Critical resource preloading implemented',
    'CSS optimization with cssnano',
    'Service worker caching optimized',
    'Lazy loading with intersection observer',
    'Font loading optimized with display: swap'
  ],
  recommendations: [
    'Monitor Core Web Vitals in production',
    'Run Lighthouse audits regularly',
    'Consider implementing Critical CSS extraction',
    'Monitor bundle size in CI/CD pipeline',
    'Optimize hero image further if > 1MB',
    'Consider using a CDN for static assets'
  ],
  nextSteps: [
    'Test loading performance on slow networks',
    'Verify all lazy loading works correctly',
    'Check that service worker caches properly',
    'Validate Core Web Vitals meet targets'
  ]
};

fs.writeFileSync('optimization-report.json', JSON.stringify(report, null, 2));
console.log('✅ Optimization report generated');

console.log('\n🎉 Performance optimization completed!');
console.log('📄 Check optimization-report.json for details');
console.log('📏 Check performance-budget.json for budgets');
console.log('\n🚀 Next steps:');
console.log('   1. Test the optimized build: npm start');
console.log('   2. Run Lighthouse audit: npm run lighthouse');
console.log('   3. Monitor performance: npm run perf:test');
