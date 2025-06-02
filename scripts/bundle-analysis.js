#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📊 Starting detailed bundle analysis...');

// Function to analyze build output
function analyzeBuildOutput() {
  const buildDir = '.next';
  if (!fs.existsSync(buildDir)) {
    console.log('❌ No build found. Run npm run build first.');
    return null;
  }

  const staticDir = path.join(buildDir, 'static');
  const chunksDir = path.join(staticDir, 'chunks');
  
  const analysis = {
    totalSize: 0,
    chunks: [],
    pages: [],
    assets: []
  };

  // Analyze chunks
  if (fs.existsSync(chunksDir)) {
    const chunkFiles = fs.readdirSync(chunksDir).filter(file => file.endsWith('.js'));
    
    chunkFiles.forEach(file => {
      const filePath = path.join(chunksDir, file);
      const stats = fs.statSync(filePath);
      const sizeKB = stats.size / 1024;
      
      analysis.chunks.push({
        name: file,
        size: sizeKB,
        type: getChunkType(file)
      });
      
      analysis.totalSize += sizeKB;
    });
  }

  // Analyze pages
  const pagesDir = path.join(buildDir, 'static', 'chunks', 'pages');
  if (fs.existsSync(pagesDir)) {
    const pageFiles = fs.readdirSync(pagesDir, { recursive: true })
      .filter(file => file.endsWith('.js'));
    
    pageFiles.forEach(file => {
      const filePath = path.join(pagesDir, file);
      const stats = fs.statSync(filePath);
      const sizeKB = stats.size / 1024;
      
      analysis.pages.push({
        name: file,
        size: sizeKB
      });
    });
  }

  return analysis;
}

function getChunkType(filename) {
  if (filename.includes('framework')) return 'Framework';
  if (filename.includes('main')) return 'Main';
  if (filename.includes('webpack')) return 'Webpack Runtime';
  if (filename.includes('vendor') || filename.includes('node_modules')) return 'Vendor';
  if (filename.match(/^\d+/)) return 'Dynamic Import';
  return 'Other';
}

// Function to identify large dependencies
function identifyLargeDependencies() {
  console.log('🔍 Identifying large dependencies...');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dependencies = packageJson.dependencies || {};
  
  const largeDeps = [
    'framer-motion',
    '@codemirror/autocomplete',
    '@codemirror/commands',
    '@codemirror/lang-javascript',
    '@codemirror/language',
    '@codemirror/state',
    '@codemirror/theme-one-dark',
    '@codemirror/view',
    'lightweight-charts',
    'html2canvas',
    '@tanstack/react-query',
    'react',
    'react-dom',
    'next'
  ];

  const foundLargeDeps = largeDeps.filter(dep => dependencies[dep]);
  
  return foundLargeDeps.map(dep => ({
    name: dep,
    version: dependencies[dep],
    optimized: isOptimized(dep)
  }));
}

function isOptimized(depName) {
  // Check if dependency is in optimizePackageImports
  const nextConfig = fs.readFileSync('next.config.ts', 'utf8');
  return nextConfig.includes(depName);
}

// Function to analyze CSS
function analyzeCSS() {
  console.log('🎨 Analyzing CSS...');
  
  const cssDir = path.join('.next', 'static', 'css');
  const cssAnalysis = {
    totalSize: 0,
    files: []
  };

  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));
    
    cssFiles.forEach(file => {
      const filePath = path.join(cssDir, file);
      const stats = fs.statSync(filePath);
      const sizeKB = stats.size / 1024;
      
      cssAnalysis.files.push({
        name: file,
        size: sizeKB
      });
      
      cssAnalysis.totalSize += sizeKB;
    });
  }

  return cssAnalysis;
}

// Function to check for unused dependencies
function checkUnusedDependencies() {
  console.log('🧹 Checking for potentially unused dependencies...');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dependencies = Object.keys(packageJson.dependencies || {});
  
  // Simple check - look for imports in source files
  const sourceFiles = [];
  
  function findSourceFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        findSourceFiles(filePath);
      } else if (file.match(/\.(js|jsx|ts|tsx)$/)) {
        sourceFiles.push(filePath);
      }
    });
  }
  
  findSourceFiles('.');
  
  const usedDeps = new Set();
  
  sourceFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      dependencies.forEach(dep => {
        if (content.includes(dep) || content.includes(`from '${dep}'`) || content.includes(`from "${dep}"`)) {
          usedDeps.add(dep);
        }
      });
    } catch (error) {
      // Skip files that can't be read
    }
  });
  
  const potentiallyUnused = dependencies.filter(dep => !usedDeps.has(dep));
  
  return potentiallyUnused;
}

// Main analysis function
function runAnalysis() {
  console.log('📊 Running comprehensive bundle analysis...\n');
  
  const buildAnalysis = analyzeBuildOutput();
  const largeDeps = identifyLargeDependencies();
  const cssAnalysis = analyzeCSS();
  const unusedDeps = checkUnusedDependencies();
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalBundleSize: buildAnalysis ? `${buildAnalysis.totalSize.toFixed(2)}KB` : 'N/A',
      totalCSSSize: `${cssAnalysis.totalSize.toFixed(2)}KB`,
      chunksCount: buildAnalysis ? buildAnalysis.chunks.length : 0,
      pagesCount: buildAnalysis ? buildAnalysis.pages.length : 0
    },
    chunks: buildAnalysis ? buildAnalysis.chunks.sort((a, b) => b.size - a.size) : [],
    largeDependencies: largeDeps,
    cssFiles: cssAnalysis.files.sort((a, b) => b.size - a.size),
    potentiallyUnusedDependencies: unusedDeps,
    recommendations: []
  };
  
  // Generate recommendations
  if (buildAnalysis && buildAnalysis.totalSize > 500) {
    report.recommendations.push('Bundle size is large. Consider more aggressive code splitting.');
  }
  
  if (cssAnalysis.totalSize > 50) {
    report.recommendations.push('CSS size is large. Consider critical CSS extraction.');
  }
  
  if (unusedDeps.length > 0) {
    report.recommendations.push(`Found ${unusedDeps.length} potentially unused dependencies.`);
  }
  
  const unoptimizedDeps = largeDeps.filter(dep => !dep.optimized);
  if (unoptimizedDeps.length > 0) {
    report.recommendations.push(`${unoptimizedDeps.length} large dependencies are not optimized.`);
  }
  
  // Save report
  fs.writeFileSync('bundle-analysis-report.json', JSON.stringify(report, null, 2));
  
  // Display summary
  console.log('📊 Bundle Analysis Summary:');
  console.log(`   Total Bundle Size: ${report.summary.totalBundleSize}`);
  console.log(`   Total CSS Size: ${report.summary.totalCSSSize}`);
  console.log(`   Chunks: ${report.summary.chunksCount}`);
  console.log(`   Pages: ${report.summary.pagesCount}`);
  
  if (report.chunks.length > 0) {
    console.log('\n📦 Largest Chunks:');
    report.chunks.slice(0, 5).forEach(chunk => {
      console.log(`   ${chunk.name}: ${chunk.size.toFixed(2)}KB (${chunk.type})`);
    });
  }
  
  if (report.largeDependencies.length > 0) {
    console.log('\n📚 Large Dependencies:');
    report.largeDependencies.forEach(dep => {
      const status = dep.optimized ? '✅ Optimized' : '⚠️ Not optimized';
      console.log(`   ${dep.name}: ${status}`);
    });
  }
  
  if (report.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    report.recommendations.forEach(rec => {
      console.log(`   - ${rec}`);
    });
  }
  
  console.log('\n✅ Detailed report saved to bundle-analysis-report.json');
}

// Run the analysis
runAnalysis();
