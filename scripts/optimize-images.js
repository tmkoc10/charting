#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🖼️ Starting advanced image optimization...');

// Function to check if sharp is available
function checkSharpAvailability() {
  try {
    require.resolve('sharp');
    return true;
  } catch (error) {
    return false;
  }
}

// Function to optimize images using sharp (if available)
async function optimizeWithSharp() {
  try {
    const sharp = require('sharp');
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    
    if (!fs.existsSync(imagesDir)) {
      console.log('❌ Images directory not found');
      return;
    }
    
    const images = fs.readdirSync(imagesDir).filter(file => 
      file.match(/\.(jpg|jpeg|png)$/i)
    );
    
    console.log(`📊 Found ${images.length} images to optimize`);
    
    for (const image of images) {
      const inputPath = path.join(imagesDir, image);
      const baseName = path.parse(image).name;
      
      console.log(`🔄 Processing ${image}...`);
      
      // Get original size
      const originalStats = fs.statSync(inputPath);
      const originalSizeKB = originalStats.size / 1024;
      
      // Generate WebP version
      const webpPath = path.join(imagesDir, `${baseName}.webp`);
      await sharp(inputPath)
        .webp({ quality: 85, effort: 6 })
        .toFile(webpPath);
      
      // Generate AVIF version (better compression)
      const avifPath = path.join(imagesDir, `${baseName}.avif`);
      await sharp(inputPath)
        .avif({ quality: 80, effort: 9 })
        .toFile(avifPath);
      
      // Get optimized sizes
      const webpStats = fs.statSync(webpPath);
      const avifStats = fs.statSync(avifPath);
      
      const webpSizeKB = webpStats.size / 1024;
      const avifSizeKB = avifStats.size / 1024;
      
      console.log(`   Original: ${originalSizeKB.toFixed(2)}KB`);
      console.log(`   WebP: ${webpSizeKB.toFixed(2)}KB (${((1 - webpSizeKB/originalSizeKB) * 100).toFixed(1)}% smaller)`);
      console.log(`   AVIF: ${avifSizeKB.toFixed(2)}KB (${((1 - avifSizeKB/originalSizeKB) * 100).toFixed(1)}% smaller)`);
    }
    
    console.log('✅ Image optimization completed with Sharp');
    
  } catch (error) {
    console.log('❌ Error optimizing images with Sharp:', error.message);
  }
}

// Function to create responsive image sizes
async function createResponsiveSizes() {
  try {
    const sharp = require('sharp');
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    const heroImagePath = path.join(imagesDir, 'hero-viewmarket-charts.png');
    
    if (!fs.existsSync(heroImagePath)) {
      console.log('❌ Hero image not found');
      return;
    }
    
    console.log('📱 Creating responsive image sizes...');
    
    const sizes = [
      { width: 640, suffix: '-sm' },
      { width: 768, suffix: '-md' },
      { width: 1024, suffix: '-lg' },
      { width: 1200, suffix: '-xl' },
      { width: 1600, suffix: '-2xl' }
    ];
    
    const baseName = 'hero-viewmarket-charts';
    
    for (const size of sizes) {
      // Create WebP versions
      const webpPath = path.join(imagesDir, `${baseName}${size.suffix}.webp`);
      await sharp(heroImagePath)
        .resize(size.width, null, { withoutEnlargement: true })
        .webp({ quality: 85, effort: 6 })
        .toFile(webpPath);
      
      // Create AVIF versions
      const avifPath = path.join(imagesDir, `${baseName}${size.suffix}.avif`);
      await sharp(heroImagePath)
        .resize(size.width, null, { withoutEnlargement: true })
        .avif({ quality: 80, effort: 9 })
        .toFile(avifPath);
      
      console.log(`   Created ${size.width}px versions`);
    }
    
    console.log('✅ Responsive images created');
    
  } catch (error) {
    console.log('❌ Error creating responsive images:', error.message);
  }
}

// Function to generate blur placeholders
async function generateBlurPlaceholders() {
  try {
    const sharp = require('sharp');
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    
    const images = fs.readdirSync(imagesDir).filter(file => 
      file.match(/\.(jpg|jpeg|png)$/i)
    );
    
    console.log('🌫️ Generating blur placeholders...');
    
    const placeholders = {};
    
    for (const image of images) {
      const inputPath = path.join(imagesDir, image);
      const baseName = path.parse(image).name;
      
      // Generate tiny blur placeholder
      const buffer = await sharp(inputPath)
        .resize(10, 10, { fit: 'inside' })
        .blur(1)
        .jpeg({ quality: 20 })
        .toBuffer();
      
      const base64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
      placeholders[baseName] = base64;
      
      console.log(`   Generated placeholder for ${image}`);
    }
    
    // Save placeholders to a JSON file
    const placeholdersPath = path.join(process.cwd(), 'lib', 'image-placeholders.json');
    fs.writeFileSync(placeholdersPath, JSON.stringify(placeholders, null, 2));
    
    console.log('✅ Blur placeholders generated');
    
  } catch (error) {
    console.log('❌ Error generating blur placeholders:', error.message);
  }
}

// Function to install sharp if not available
function installSharp() {
  console.log('📦 Installing Sharp for image optimization...');
  try {
    execSync('npm install sharp --save-dev', { stdio: 'inherit' });
    console.log('✅ Sharp installed successfully');
    return true;
  } catch (error) {
    console.log('❌ Failed to install Sharp:', error.message);
    return false;
  }
}

// Function to analyze current images
function analyzeCurrentImages() {
  const imagesDir = path.join(process.cwd(), 'public', 'images');
  
  if (!fs.existsSync(imagesDir)) {
    console.log('❌ Images directory not found');
    return;
  }
  
  const images = fs.readdirSync(imagesDir);
  const analysis = {
    totalImages: images.length,
    totalSize: 0,
    formats: {},
    largeImages: []
  };
  
  console.log('📊 Analyzing current images...');
  
  images.forEach(image => {
    const imagePath = path.join(imagesDir, image);
    const stats = fs.statSync(imagePath);
    const sizeKB = stats.size / 1024;
    const ext = path.extname(image).toLowerCase();
    
    analysis.totalSize += sizeKB;
    analysis.formats[ext] = (analysis.formats[ext] || 0) + 1;
    
    if (sizeKB > 100) {
      analysis.largeImages.push({
        name: image,
        size: sizeKB
      });
    }
  });
  
  console.log(`   Total images: ${analysis.totalImages}`);
  console.log(`   Total size: ${analysis.totalSize.toFixed(2)}KB`);
  console.log(`   Formats: ${JSON.stringify(analysis.formats)}`);
  
  if (analysis.largeImages.length > 0) {
    console.log(`   Large images (>100KB):`);
    analysis.largeImages.forEach(img => {
      console.log(`     ${img.name}: ${img.size.toFixed(2)}KB`);
    });
  }
  
  return analysis;
}

// Main function
async function main() {
  console.log('🚀 Starting image optimization process...\n');
  
  // Analyze current images
  const analysis = analyzeCurrentImages();
  
  if (!analysis || analysis.totalImages === 0) {
    console.log('ℹ️ No images found to optimize');
    return;
  }
  
  // Check if Sharp is available
  let sharpAvailable = checkSharpAvailability();
  
  if (!sharpAvailable) {
    console.log('⚠️ Sharp not found. Installing...');
    sharpAvailable = installSharp();
  }
  
  if (sharpAvailable) {
    // Optimize images with Sharp
    await optimizeWithSharp();
    
    // Create responsive sizes
    await createResponsiveSizes();
    
    // Generate blur placeholders
    await generateBlurPlaceholders();
    
    console.log('\n🎉 Image optimization completed!');
    console.log('💡 Next steps:');
    console.log('   1. Update your Image components to use the new formats');
    console.log('   2. Use the generated blur placeholders');
    console.log('   3. Test the optimized images in your application');
    
  } else {
    console.log('❌ Could not install Sharp. Image optimization skipped.');
    console.log('💡 You can manually install Sharp with: npm install sharp --save-dev');
  }
}

// Run the optimization
main().catch(console.error);
