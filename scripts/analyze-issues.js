#!/usr/bin/env node

/**
 * Issue Analysis Tool for Issue Labler
 * 
 * This script analyzes issues and provides insights for project management,
 * team allocation, and resource planning based on the structured label data.
 */

const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

/**
 * Load configuration and analysis data
 */
async function loadData() {
  try {
    const configPath = path.join(process.cwd(), 'config.yml');
    const analysisPath = path.join(process.cwd(), 'analysis', 'labels-analysis.json');
    
    const configContent = await fs.readFile(configPath, 'utf8');
    const config = yaml.load(configContent);
    
    let analysisData = null;
    try {
      const analysisContent = await fs.readFile(analysisPath, 'utf8');
      analysisData = JSON.parse(analysisContent);
    } catch (error) {
      console.log('⚠️ No analysis data found. Run "npm run generate:analysis" first.');
    }
    
    return { config, analysisData };
  } catch (error) {
    console.error('❌ Error loading data:', error.message);
    process.exit(1);
  }
}

/**
 * Generate team capacity analysis
 */
function analyzeTeamCapacity(config) {
  console.log('\n👥 Team Capacity Analysis');
  console.log('========================');
  
  const teamData = {};
  
  // Collect all labels by team
  for (const [category, labels] of Object.entries(config.labels)) {
    for (const label of labels) {
      if (label.team) {
        if (!teamData[label.team]) {
          teamData[label.team] = {
            labels: [],
            skillAreas: new Set(),
            complexityRange: { min: Infinity, max: 0 },
            priorityDistribution: { critical: 0, high: 0, medium: 0, low: 0 }
          };
        }
        
        teamData[label.team].labels.push(label);
        if (label.skills) {
          label.skills.forEach(skill => teamData[label.team].skillAreas.add(skill));
        }
        
        if (label.complexity_score) {
          teamData[label.team].complexityRange.min = Math.min(teamData[label.team].complexityRange.min, label.complexity_score);
          teamData[label.team].complexityRange.max = Math.max(teamData[label.team].complexityRange.max, label.complexity_score);
        }
      }
    }
  }
  
  // Display team analysis
  for (const [team, data] of Object.entries(teamData)) {
    console.log(`\n🏢 ${team.toUpperCase()} Team:`);
    console.log(`   📊 Total Label Categories: ${data.labels.length}`);
    console.log(`   🛠️ Skill Areas: ${Array.from(data.skillAreas).join(', ')}`);
    console.log(`   🎯 Complexity Range: ${data.complexityRange.min}-${data.complexityRange.max}`);
    console.log(`   📋 Label Categories:`);
    
    // Group labels by category
    const byCategory = {};
    for (const label of data.labels) {
      if (!byCategory[label.category]) {
        byCategory[label.category] = [];
      }
      byCategory[label.category].push(label.name);
    }
    
    for (const [category, labels] of Object.entries(byCategory)) {
      console.log(`      • ${category}: ${labels.join(', ')}`);
    }
  }
}

/**
 * Generate story point analysis
 */
function analyzeStoryPoints(config) {
  console.log('\n📊 Story Points Analysis');
  console.log('=======================');
  
  const storyPoints = config.labels.story_points;
  
  console.log('\n📈 Effort Distribution:');
  for (const sp of storyPoints) {
    const hoursRange = `${sp.hours_min}-${sp.hours_max}`;
    const percentage = ((sp.hours_max - sp.hours_min + 1) / 40 * 100).toFixed(1);
    console.log(`   ${sp.name}: ${hoursRange} hours (${percentage}% of sprint capacity)`);
  }
  
  console.log('\n🎯 Sprint Planning Insights:');
  const totalHours = storyPoints.reduce((sum, sp) => sum + sp.hours_max, 0);
  const avgHours = totalHours / storyPoints.length;
  console.log(`   📊 Average story point: ${avgHours.toFixed(1)} hours`);
  console.log(`   📈 Total range: ${storyPoints[0].hours_min}-${storyPoints[storyPoints.length - 1].hours_max} hours`);
  
  // Sprint capacity recommendations
  console.log('\n📋 Sprint Capacity Recommendations:');
  const sprintCapacities = [40, 80, 120, 160];
  for (const capacity of sprintCapacities) {
    const stories = storyPoints.filter(sp => sp.hours_max <= capacity).length;
    console.log(`   ${capacity}h sprint: ${stories} story point options available`);
  }
}

/**
 * Generate difficulty analysis
 */
function analyzeDifficulty(config) {
  console.log('\n🎯 Difficulty Analysis');
  console.log('=====================');
  
  const difficulties = config.labels.difficulty;
  
  console.log('\n👥 Skill Level Requirements:');
  const bySkillLevel = {};
  for (const diff of difficulties) {
    if (!bySkillLevel[diff.skill_level]) {
      bySkillLevel[diff.skill_level] = [];
    }
    bySkillLevel[diff.skill_level].push(diff.name);
  }
  
  for (const [level, labels] of Object.entries(bySkillLevel)) {
    console.log(`   ${level.toUpperCase()}: ${labels.join(', ')}`);
  }
  
  console.log('\n📊 Complexity Distribution:');
  for (const diff of difficulties) {
    const complexityBar = '█'.repeat(diff.complexity_score);
    console.log(`   ${diff.name}: ${complexityBar} (${diff.complexity_score}/6)`);
  }
  
  console.log('\n🎯 Resource Allocation Insights:');
  const juniorTasks = difficulties.filter(d => d.skill_level === 'junior').length;
  const midTasks = difficulties.filter(d => d.skill_level === 'mid').length;
  const seniorTasks = difficulties.filter(d => d.skill_level === 'senior').length;
  const architectTasks = difficulties.filter(d => d.skill_level === 'architect').length;
  
  console.log(`   👶 Junior-friendly tasks: ${juniorTasks}`);
  console.log(`   👨‍💻 Mid-level tasks: ${midTasks}`);
  console.log(`   👨‍💼 Senior-level tasks: ${seniorTasks}`);
  console.log(`   🏗️ Architect-level tasks: ${architectTasks}`);
}

/**
 * Generate priority analysis
 */
function analyzePriority(config) {
  console.log('\n🚨 Priority Analysis');
  console.log('===================');
  
  const priorities = config.labels.priority;
  
  console.log('\n📊 Priority Distribution:');
  for (const priority of priorities) {
    const urgencyBar = '🚨'.repeat(priority.urgency_score);
    console.log(`   ${priority.name}: ${urgencyBar} (${priority.urgency_score}/4) - ${priority.business_impact} impact`);
  }
  
  console.log('\n⚡ Response Time Recommendations:');
  const responseTimes = {
    critical: 'Immediate (within 2 hours)',
    high: 'Same day (within 8 hours)',
    medium: 'Within 48 hours',
    low: 'Within 1 week'
  };
  
  for (const [level, time] of Object.entries(responseTimes)) {
    const priority = priorities.find(p => p.value === level);
    if (priority) {
      console.log(`   ${priority.name}: ${time}`);
    }
  }
}

/**
 * Generate development area analysis
 */
function analyzeDevelopmentAreas(config) {
  console.log('\n🛠️ Development Areas Analysis');
  console.log('============================');
  
  const devAreas = config.labels.development_areas;
  
  console.log('\n🏢 Team Distribution:');
  const byTeam = {};
  for (const area of devAreas) {
    if (!byTeam[area.team]) {
      byTeam[area.team] = [];
    }
    byTeam[area.team].push(area.name);
  }
  
  for (const [team, areas] of Object.entries(byTeam)) {
    console.log(`   ${team.toUpperCase()}: ${areas.join(', ')}`);
  }
  
  console.log('\n🛠️ Skill Requirements:');
  const allSkills = new Set();
  for (const area of devAreas) {
    if (area.skills) {
      area.skills.forEach(skill => allSkills.add(skill));
    }
  }
  
  console.log(`   Required Skills: ${Array.from(allSkills).join(', ')}`);
  
  console.log('\n📊 Area Distribution:');
  for (const area of devAreas) {
    const skillCount = area.skills ? area.skills.length : 0;
    console.log(`   ${area.name}: ${skillCount} skills required`);
  }
}

/**
 * Generate filtering recommendations
 */
function generateFilteringRecommendations(config) {
  console.log('\n🔍 Filtering & Organization Recommendations');
  console.log('==========================================');
  
  console.log('\n📊 GitHub Issue Filters:');
  console.log('   • Filter by Story Points: `label:"⏳ Story Points: X"`');
  console.log('   • Filter by Difficulty: `label:"🎯 Difficulty: X"`');
  console.log('   • Filter by Priority: `label:"🚨 Priority: X"`');
  console.log('   • Filter by Team: `label:"🎨 Client Side" OR label:"🖥️ Backend"`');
  console.log('   • Filter by Platform: `label:"🍎 Platform-Specific: iOS"`');
  
  console.log('\n📈 Sprint Planning Filters:');
  console.log('   • Quick wins: `label:"⏳ Story Points: 1" label:"🌱 Difficulty: Simple"`');
  console.log('   • High impact: `label:"🚨 Priority: Critical" OR label:"🚨 Priority: High"`');
  console.log('   • Technical debt: `label:"📉 Technical Debt"`');
  console.log('   • Frontend tasks: `label:"🎨 Client Side" OR label:"👩‍💻 Component/UI"`');
  console.log('   • Backend tasks: `label:"🖥️ Backend" OR label:"🧠 Logic/Functions"`');
  
  console.log('\n👥 Team Assignment Filters:');
  for (const [category, labels] of Object.entries(config.labels)) {
    if (category === 'development_areas' || category === 'platforms') {
      const teamLabels = labels.filter(l => l.team);
      if (teamLabels.length > 0) {
        const team = teamLabels[0].team;
        const labelNames = teamLabels.map(l => `"${l.name}"`).join(' OR ');
        console.log(`   • ${team.toUpperCase()} team: ${labelNames}`);
      }
    }
  }
  
  console.log('\n📊 Analytics Queries:');
  console.log('   • Velocity by team: Group by team labels, sum story points');
  console.log('   • Complexity distribution: Count by difficulty labels');
  console.log('   • Priority distribution: Count by priority labels');
  console.log('   • Platform distribution: Count by platform labels');
  console.log('   • Language distribution: Count by language labels');
}

/**
 * Generate export recommendations
 */
function generateExportRecommendations() {
  console.log('\n📤 Data Export Recommendations');
  console.log('=============================');
  
  console.log('\n📊 For Project Management Tools:');
  console.log('   • Export to CSV: Use analysis/labels-analysis.csv');
  console.log('   • Import to Jira: Map labels to Jira fields');
  console.log('   • Import to Asana: Use label names as tags');
  console.log('   • Import to Monday.com: Use label categories as columns');
  
  console.log('\n📈 For Analytics Platforms:');
  console.log('   • Power BI: Import JSON from analysis/labels-analysis.json');
  console.log('   • Tableau: Use CSV export for visualizations');
  console.log('   • Google Data Studio: Connect to CSV export');
  console.log('   • Grafana: Use JSON for dashboard metrics');
  
  console.log('\n🔧 For Development Tools:');
  console.log('   • GitHub Projects: Use label filters for boards');
  console.log('   • Linear: Import labels as custom fields');
  console.log('   • ClickUp: Use labels as custom fields');
  console.log('   • Notion: Import as database properties');
}

/**
 * Generate sorting recommendations
 */
function generateSortingRecommendations(config) {
  console.log('\n📋 Sorting & Organization Strategies');
  console.log('====================================');
  
  console.log('\n🎯 By Priority (Recommended for daily work):');
  console.log('   1. 🚨 Priority: Critical');
  console.log('   2. 🚨 Priority: High');
  console.log('   3. 🚨 Priority: Medium');
  console.log('   4. 🚨 Priority: Low');
  
  console.log('\n📊 By Story Points (Recommended for sprint planning):');
  const storyPoints = config.labels.story_points;
  for (const sp of storyPoints) {
    console.log(`   ${sp.value}. ${sp.name} (${sp.hours_min}-${sp.hours_max} hours)`);
  }
  
  console.log('\n🎯 By Difficulty (Recommended for resource allocation):');
  const difficulties = config.labels.difficulty;
  for (const diff of difficulties) {
    console.log(`   ${diff.complexity_score}. ${diff.name} (${diff.skill_level} level)`);
  }
  
  console.log('\n🏢 By Team (Recommended for team management):');
  const teams = ['frontend', 'backend', 'mobile', 'devops', 'qa'];
  for (const team of teams) {
    console.log(`   • ${team.toUpperCase()} team tasks`);
  }
  
  console.log('\n📱 By Platform (Recommended for mobile development):');
  console.log('   • 🍎 iOS-specific tasks');
  console.log('   • 🤖 Android-specific tasks');
  console.log('   • 🌐 Cross-platform tasks');
}

/**
 * Main analysis function
 */
async function runAnalysis() {
  console.log('🔍 Issue Labler Analysis Tool');
  console.log('============================');
  
  const { config, analysisData } = await loadData();
  
  if (analysisData) {
    console.log(`📊 Analysis data loaded: ${analysisData.metadata.total_labels} total labels`);
    console.log(`📅 Generated: ${new Date(analysisData.metadata.generated_at).toLocaleString()}`);
  }
  
  // Run all analyses
  analyzeTeamCapacity(config);
  analyzeStoryPoints(config);
  analyzeDifficulty(config);
  analyzePriority(config);
  analyzeDevelopmentAreas(config);
  generateFilteringRecommendations(config);
  generateSortingRecommendations(config);
  generateExportRecommendations();
  
  console.log('\n🎉 Analysis complete!');
  console.log('\n💡 Tips for using this data:');
  console.log('   • Use GitHub search filters to organize issues');
  console.log('   • Export data to your preferred project management tool');
  console.log('   • Create custom dashboards for team insights');
  console.log('   • Use labels for automated workflows and assignments');
  console.log('   • Regular analysis helps identify bottlenecks and opportunities');
}

// Run if called directly
if (require.main === module) {
  runAnalysis().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  runAnalysis,
  analyzeTeamCapacity,
  analyzeStoryPoints,
  analyzeDifficulty,
  analyzePriority,
  analyzeDevelopmentAreas
}; 