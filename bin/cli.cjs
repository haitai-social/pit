#!/usr/bin/env node

// This file serves as a bridge to the compiled TypeScript entry point
// For development, use: npm run dev
// For production, use the compiled version from dist/

const path = require('path');
const fs = require('fs');

// Check if compiled version exists
const compiledCli = path.join(__dirname, '../dist/cli.js');
const devMode = process.env.NODE_ENV === 'development' || !fs.existsSync(compiledCli);

if (devMode) {
  // Development mode: use ts-node to run TypeScript directly
  try {
    require('ts-node/register');
    require('../src/cli.ts');
  } catch (error) {
    console.error('❌ TypeScript runtime not available. Please run "npm run build" first, or install ts-node for development.');
    console.error('   npm install -g ts-node  # for global install');
    console.error('   or use: npm run dev      # for development');
    process.exit(1);
  }
} else {
  // Production mode: use compiled JavaScript
  require(compiledCli);
}
