// Test script to verify indicator implementations
const { calculateSMA, calculateSuperTrend, calculateWMA, calculateHMA, calculateADX } = require('./lib/indicators.ts');

// Sample OHLC data for testing
const sampleData = [
  { open: 100, high: 105, low: 98, close: 103, timestamp: 1000 },
  { open: 103, high: 107, low: 101, close: 106, timestamp: 2000 },
  { open: 106, high: 110, low: 104, close: 108, timestamp: 3000 },
  { open: 108, high: 112, low: 106, close: 109, timestamp: 4000 },
  { open: 109, high: 113, low: 107, close: 111, timestamp: 5000 },
  { open: 111, high: 115, low: 109, close: 114, timestamp: 6000 },
  { open: 114, high: 118, low: 112, close: 116, timestamp: 7000 },
  { open: 116, high: 120, low: 114, close: 118, timestamp: 8000 },
  { open: 118, high: 122, low: 116, close: 120, timestamp: 9000 },
  { open: 120, high: 124, low: 118, close: 122, timestamp: 10000 },
  { open: 122, high: 126, low: 120, close: 124, timestamp: 11000 },
  { open: 124, high: 128, low: 122, close: 126, timestamp: 12000 },
  { open: 126, high: 130, low: 124, close: 128, timestamp: 13000 },
  { open: 128, high: 132, low: 126, close: 130, timestamp: 14000 },
  { open: 130, high: 134, low: 128, close: 132, timestamp: 15000 },
];

console.log('Testing Indicator Implementations...\n');

// Test SMA (should work)
console.log('=== Testing SMA (Working Indicator) ===');
try {
  const smaResults = calculateSMA(sampleData, 5);
  console.log('SMA Results:', smaResults.length > 0 ? 'SUCCESS' : 'FAILED');
  console.log('Sample SMA values:', smaResults.slice(0, 3).map(r => r.value));
} catch (error) {
  console.log('SMA Error:', error.message);
}

// Test SuperTrend (should now work)
console.log('\n=== Testing SuperTrend (Previously Broken) ===');
try {
  const supertrendResults = calculateSuperTrend(sampleData, 5, 2);
  console.log('SuperTrend Results:', supertrendResults.length > 0 ? 'SUCCESS' : 'FAILED');
  console.log('Sample SuperTrend values:', supertrendResults.slice(0, 3).map(r => r.value));
} catch (error) {
  console.log('SuperTrend Error:', error.message);
}

// Test WMA (newly implemented)
console.log('\n=== Testing WMA (Newly Implemented) ===');
try {
  const wmaResults = calculateWMA(sampleData, 5);
  console.log('WMA Results:', wmaResults.length > 0 ? 'SUCCESS' : 'FAILED');
  console.log('Sample WMA values:', wmaResults.slice(0, 3).map(r => r.value));
} catch (error) {
  console.log('WMA Error:', error.message);
}

// Test HMA (newly implemented)
console.log('\n=== Testing HMA (Newly Implemented) ===');
try {
  const hmaResults = calculateHMA(sampleData, 5);
  console.log('HMA Results:', hmaResults.length > 0 ? 'SUCCESS' : 'FAILED');
  console.log('Sample HMA values:', hmaResults.slice(0, 3).map(r => r.value));
} catch (error) {
  console.log('HMA Error:', error.message);
}

// Test ADX (newly implemented)
console.log('\n=== Testing ADX (Newly Implemented) ===');
try {
  const adxResults = calculateADX(sampleData, 5);
  console.log('ADX Results:', adxResults.length > 0 ? 'SUCCESS' : 'FAILED');
  console.log('Sample ADX values:', adxResults.slice(0, 3).map(r => r.value));
} catch (error) {
  console.log('ADX Error:', error.message);
}

console.log('\n=== Test Complete ===');
