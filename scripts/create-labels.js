#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * Create GitHub labels from config.yml
 */
async function createLabels() {
  try {
    console.log('🏷️ Creating GitHub labels from config...');
    
    // Load config
    const configPath = path.join(process.cwd(), 'config.yml');
    if (!fs.existsSync(configPath)) {
      console.error('❌ config.yml not found');
      process.exit(1);
    }
    
    const config = yaml.load(fs.readFileSync(configPath, 'utf8'));
    
    // Extract all labels from config
    const labels = [];
    for (const [category, categoryLabels] of Object.entries(config.labels)) {
      for (const label of categoryLabels) {
        labels.push({
          name: label.name,
          color: label.color,
          description: label.description
        });
      }
    }
    
    console.log(`📋 Found ${labels.length} labels to create`);
    
    // Create labels using GitHub CLI
    for (const label of labels) {
      try {
        const command = `gh api repos/:owner/:repo/labels -f name="${label.name}" -f color="${label.color}" -f description="${label.description}"`;
        console.log(`🔄 Creating label: ${label.name}`);
        
        // Use child_process to execute the command
        const { execSync } = require('child_process');
        execSync(command, { stdio: 'pipe' });
        console.log(`✅ Created: ${label.name}`);
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⏭️ Label already exists: ${label.name}`);
        } else {
          console.error(`❌ Failed to create ${label.name}:`, error.message);
        }
      }
    }
    
    console.log('🎉 Label creation completed!');
  } catch (error) {
    console.error('❌ Error creating labels:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  createLabels();
}

module.exports = { createLabels }; 