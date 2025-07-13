#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Auto-label issues based on content
 */
async function autoLabelIssues() {
  try {
    console.log('🏷️ Auto-labeling issues...');
    
    // Check if we're in a GitHub Actions environment
    const issueNumber = process.env.GITHUB_EVENT_ISSUE_NUMBER || process.env.ISSUE_NUMBER;
    if (!issueNumber) {
      console.log('ℹ️ No issue number found, skipping auto-labeling');
      return;
    }
    
    // Get issue content using GitHub CLI
    const issueData = JSON.parse(execSync(`gh api repos/:owner/:repo/issues/${issueNumber}`, { encoding: 'utf8' }));
    const issueContent = {
      title: issueData.title,
      body: issueData.body || ''
    };
    
    console.log(`📝 Analyzing issue #${issueNumber}: ${issueContent.title}`);
    
    // Import the TypeScript label detection functions
    const { detectLabels } = require('../dist/label-detector');
    
    // Detect labels
    const result = detectLabels(issueContent);
    
    if (result.labels.length === 0) {
      console.log('ℹ️ No labels detected');
      return;
    }
    
    console.log(`🏷️ Detected labels: ${result.labels.join(', ')}`);
    console.log(`📊 Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    
    // Apply labels
    for (const label of result.labels) {
      try {
        execSync(`gh issue edit ${issueNumber} --add-label "${label}"`, { stdio: 'pipe' });
        console.log(`✅ Applied label: ${label}`);
      } catch (error) {
        console.error(`❌ Failed to apply label ${label}:`, error.message);
      }
    }
    
    console.log('🎉 Auto-labeling completed!');
  } catch (error) {
    console.error('❌ Error auto-labeling issues:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  autoLabelIssues();
}

module.exports = { autoLabelIssues }; 