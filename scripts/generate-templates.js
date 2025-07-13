#!/usr/bin/env node

/**
 * Template Generator for Issue Labler
 * 
 * This script generates issue templates from the centralized config.yml file,
 * eliminating duplication and making templates data-driven and maintainable.
 */

const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

// Template definitions with their specific content
const TEMPLATE_DEFINITIONS = {
  feature_request: {
    name: '✨ Feature Request',
    about: 'Suggest a new feature for this project',
    title: '[FEATURE] ',
    labels: ['✨ Feature'],
    assignees: '',
    sections: [
      {
        title: '🎯 Feature Description',
        content: `**What feature would you like to see implemented?**

A clear and concise description of what the feature should do.`
      },
      {
        title: '🔍 Problem Statement',
        content: `**What problem does this feature solve?**

A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]`
      },
      {
        title: '💡 Proposed Solution',
        content: `**How would you like this feature to work?**

A clear and concise description of what you want to happen.`
      },
      {
        title: '🎨 Alternative Solutions',
        content: `**Have you considered any alternative solutions?**

A clear and concise description of any alternative solutions or features you've considered.`
      },
      {
        title: '📋 Additional Context',
        content: `**Add any other context or screenshots about the feature request here.**`
      }
    ]
  },

  bug_report: {
    name: '🪲 Bug Report',
    about: 'Create a report to help us improve',
    title: '[BUG] ',
    labels: ['🪲 Bug'],
    assignees: '',
    sections: [
      {
        title: '🐛 Bug Description',
        content: `**A clear and concise description of what the bug is.**`
      },
      {
        title: '🔄 Steps to Reproduce',
        content: `**Steps to reproduce the behavior:**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error`
      },
      {
        title: '✅ Expected Behavior',
        content: `**A clear and concise description of what you expected to happen.**`
      },
      {
        title: '📱 Current Behavior',
        content: `**A clear and concise description of what actually happened.**`
      },
      {
        title: '🖼️ Screenshots',
        content: `**If applicable, add screenshots to help explain your problem.**`
      },
      {
        title: '💻 Environment',
        content: `- **OS:** [e.g. iOS, Android, Windows, macOS]
- **Browser:** [e.g. Chrome, Safari, Firefox]
- **Version:** [e.g. 22]
- **Device:** [e.g. iPhone 6, Samsung Galaxy S21]`
      },
      {
        title: '📋 Additional Context',
        content: `**Add any other context about the problem here.**`
      }
    ]
  },

  performance_bug: {
    name: '🚀 Performance Issue',
    about: 'Report a performance problem',
    title: '[PERFORMANCE] ',
    labels: ['🪲 Bug'],
    assignees: '',
    sections: [
      {
        title: '🐌 Performance Issue Description',
        content: `**A clear and concise description of the performance problem.**`
      },
      {
        title: '📊 Current Performance Metrics',
        content: `**What are the current performance metrics?**
- **Load Time:** [e.g. 5 seconds]
- **Response Time:** [e.g. 2 seconds]
- **Memory Usage:** [e.g. 150MB]
- **CPU Usage:** [e.g. 80%]`
      },
      {
        title: '🎯 Expected Performance',
        content: `**What should the performance metrics be?**
- **Load Time:** [e.g. 1 second]
- **Response Time:** [e.g. 200ms]
- **Memory Usage:** [e.g. 50MB]
- **CPU Usage:** [e.g. 20%]`
      },
      {
        title: '🔄 Steps to Reproduce',
        content: `**Steps to reproduce the performance issue:**
1. Go to '...'
2. Click on '....'
3. Wait for '....'
4. Observe slow performance`
      },
      {
        title: '📱 Environment',
        content: `- **OS:** [e.g. iOS, Android, Windows, macOS]
- **Browser:** [e.g. Chrome, Safari, Firefox]
- **Version:** [e.g. 22]
- **Device:** [e.g. iPhone 6, Samsung Galaxy S21]
- **Network:** [e.g. WiFi, 4G, 3G]`
      },
      {
        title: '📈 Performance Profiling',
        content: `**If available, include performance profiling data:**
- Screenshots of performance tools (Chrome DevTools, Xcode Instruments, etc.)
- Stack traces or error logs
- Network waterfall charts`
      }
    ]
  },

  documentation_request: {
    name: '📚 Documentation Request',
    about: 'Request new documentation or updates to existing docs',
    title: '[DOCS] ',
    labels: ['📚 Documentation: Updates'],
    assignees: '',
    sections: [
      {
        title: '📖 Documentation Need',
        content: `**What documentation do you need?**

- [ ] **New documentation** (create from scratch)
- [ ] **Update existing documentation** (modify current docs)
- [ ] **API documentation** (endpoints, parameters, responses)
- [ ] **User guide** (how-to, tutorials, walkthroughs)
- [ ] **Developer guide** (setup, architecture, contributing)
- [ ] **Release notes** (changelog, migration guide)`
      },
      {
        title: '🎯 Purpose',
        content: `**Why is this documentation needed?**

A clear description of what the documentation should accomplish and who the target audience is.`
      },
      {
        title: '📋 Content Requirements',
        content: `**What specific content should be included?**

- Key topics to cover
- Examples needed
- Screenshots or diagrams required
- Code samples needed`
      },
      {
        title: '🔗 Related Resources',
        content: `**Any existing documentation or resources to reference?**

- Links to existing docs
- Related issues or PRs
- External resources`
      }
    ]
  },

  technical_debt: {
    name: '📉 Technical Debt',
    about: 'Report technical debt that needs to be addressed',
    title: '[TECH-DEBT] ',
    labels: ['📉 Technical Debt'],
    assignees: '',
    sections: [
      {
        title: '🏗️ Technical Debt Description',
        content: `**What technical debt needs to be addressed?**

A clear description of the technical debt, including:
- What code/architecture is problematic
- Why it's considered technical debt
- What impact it's having on the project`
      },
      {
        title: '🔍 Root Cause',
        content: `**What led to this technical debt?**

- [ ] **Legacy code** (old patterns, outdated libraries)
- [ ] **Quick fixes** (temporary solutions that became permanent)
- [ ] **Missing abstractions** (repeated code, no shared components)
- [ ] **Performance issues** (slow algorithms, inefficient queries)
- [ ] **Security concerns** (vulnerabilities, outdated dependencies)
- [ ] **Testing gaps** (missing tests, poor coverage)
- [ ] **Documentation debt** (outdated docs, missing examples)`
      },
      {
        title: '📊 Impact Assessment',
        content: `**What is the impact of this technical debt?**

- **Performance impact**: How does it affect speed/resource usage?
- **Maintenance impact**: How hard is it to maintain/modify?
- **Development impact**: How does it slow down development?
- **User impact**: How does it affect user experience?`
      },
      {
        title: '💡 Proposed Solution',
        content: `**How should this technical debt be addressed?**

- [ ] **Refactor existing code** (restructure without changing behavior)
- [ ] **Replace with better solution** (new implementation)
- [ ] **Add missing tests** (improve test coverage)
- [ ] **Update dependencies** (upgrade libraries, frameworks)
- [ ] **Improve documentation** (update docs, add examples)
- [ ] **Performance optimization** (speed up slow operations)`
      },
      {
        title: '🎯 Success Criteria',
        content: `**How will we know when this technical debt is resolved?**

- Specific metrics to measure improvement
- Acceptance criteria for the solution
- How to verify the fix works`
      }
    ]
  },

  mobile_platform_issue: {
    name: '📱 Mobile Platform Issue',
    about: 'Report platform-specific issues for iOS or Android',
    title: '[MOBILE] ',
    labels: ['📱 App Store / Google Play Store'],
    assignees: '',
    sections: [
      {
        title: '📱 Platform Information',
        content: `**Which platform is affected?**

- [ ] **🍎 iOS** (iPhone, iPad, Apple Watch, Apple TV)
- [ ] **🤖 Android** (Phone, Tablet, Wear OS, Android TV)
- [ ] **Both platforms**`
      },
      {
        title: '🎯 Issue Type',
        content: `**What type of issue is this?**

- [ ] **🪲 Bug** (something isn't working)
- [ ] **✨ Feature** (new functionality needed)
- [ ] **🚀 Performance** (slow, crashes, memory issues)
- [ ] **📱 UI/UX** (design, layout, user experience)
- [ ] **🔧 Integration** (third-party services, APIs)
- [ ] **📦 Deployment** (App Store, Google Play, TestFlight)
- [ ] **🔒 Security** (vulnerabilities, permissions)`
      },
      {
        title: '📋 Issue Details',
        content: `**Describe the issue in detail:**

### For Bugs:
- **Steps to reproduce**: What actions cause the issue?
- **Expected behavior**: What should happen?
- **Actual behavior**: What actually happens?
- **Frequency**: How often does this occur?

### For Features:
- **Feature description**: What functionality is needed?
- **User benefit**: How does this help users?
- **Acceptance criteria**: What defines success?`
      },
      {
        title: '📱 Device Information',
        content: `**What devices are affected?**

### iOS:
- [ ] **iPhone** (which models?)
- [ ] **iPad** (which models?)
- [ ] **Apple Watch**
- [ ] **Apple TV**
- **iOS Version**: [e.g., 15.0, 16.0, 17.0]

### Android:
- [ ] **Phone** (which brands/models?)
- [ ] **Tablet** (which brands/models?)
- [ ] **Wear OS**
- [ ] **Android TV**
- **Android Version**: [e.g., 12, 13, 14]
- **API Level**: [e.g., 30, 33, 34]`
      },
      {
        title: '🔧 Technical Details',
        content: `**Additional technical information:**

- **App version**: [e.g., 1.2.3]
- **Build number**: [e.g., 123]
- **Network conditions**: [WiFi, 4G, 5G, offline]
- **Third-party integrations**: [if relevant]
- **Screenshots/videos**: [attach if available]`
      },
      {
        title: '🚨 Severity',
        content: `**How critical is this issue?**

- [ ] **Critical** (app crashes, data loss, security vulnerability)
- [ ] **High** (major functionality broken, poor user experience)
- [ ] **Medium** (minor functionality affected, workaround available)
- [ ] **Low** (cosmetic issue, nice-to-have feature)`
      }
    ]
  },

  maintenance_task: {
    name: '🔧 Maintenance Task',
    about: 'Routine maintenance, updates, and housekeeping tasks',
    title: '[MAINTENANCE] ',
    labels: ['🧹 Maintenance: Chore'],
    assignees: '',
    sections: [
      {
        title: '🔧 Maintenance Type',
        content: `**What type of maintenance is needed?**

- [ ] **🔄 Dependency Update** (npm, pip, gradle, cocoapods)
- [ ] **🔒 Security Update** (patches, vulnerability fixes)
- [ ] **📚 Documentation Update** (outdated docs, missing examples)
- [ ] **🧪 Test Maintenance** (broken tests, coverage improvements)
- [ ] **⚙️ Configuration Update** (environment variables, settings)
- [ ] **🗂️ Code Cleanup** (unused code, formatting, linting)
- [ ] **📊 Monitoring Setup** (logging, metrics, alerts)
- [ ] **🔍 Code Review** (technical debt, refactoring)`
      },
      {
        title: '📋 Task Description',
        content: `**What specific maintenance work needs to be done?**

A clear description of the maintenance task, including:
- What needs to be updated/fixed
- Why this maintenance is important
- What the current state is vs. desired state`
      },
      {
        title: '🔍 Current State',
        content: `**What is the current situation?**

- **Current version**: [e.g., React 17.0.2]
- **Target version**: [e.g., React 18.2.0]
- **Issues**: [any known problems or limitations]
- **Dependencies**: [affected packages, libraries, tools]`
      },
      {
        title: '🎯 Desired Outcome',
        content: `**What should the result be?**

- **Expected improvements**: [performance, security, stability]
- **Acceptance criteria**: [how to verify the maintenance is complete]
- **Testing requirements**: [what needs to be tested after changes]`
      },
      {
        title: '⚠️ Potential Risks',
        content: `**What could go wrong during this maintenance?**

- **Breaking changes**: [API changes, behavior changes]
- **Dependencies**: [other systems that might be affected]
- **Downtime**: [if any service interruption is expected]
- **Rollback plan**: [how to revert if issues occur]`
      },
      {
        title: '📅 Timeline',
        content: `**When should this maintenance be completed?**

- [ ] **Urgent** (security vulnerability, critical issue)
- [ ] **High priority** (affecting development, performance)
- [ ] **Medium priority** (should be done soon)
- [ ] **Low priority** (nice to have, can wait)`
      }
    ]
  }
};

/**
 * Load and parse the config.yml file
 */
async function loadConfig() {
  try {
    const configPath = path.join(process.cwd(), 'config.yml');
    const configContent = await fs.readFile(configPath, 'utf8');
    return yaml.load(configContent);
  } catch (error) {
    console.error('❌ Error loading config.yml:', error.message);
    process.exit(1);
  }
}

/**
 * Generate the common sections from config
 */
function generateCommonSections(config) {
  const sections = {};
  
  // Generate story points section
  const storyPoints = config.labels.story_points;
  sections.story_points_section = `## 📊 Effort Estimation
**Select the estimated effort for this task:**

${storyPoints.map(sp => `- [ ] **${sp.name}** (${sp.hours_min}-${sp.hours_max} hours)`).join('\n')}`;

  // Generate difficulty section
  const difficulties = config.labels.difficulty;
  sections.difficulty_section = `## 🎯 Complexity Assessment
**Select the complexity level:**

${difficulties.map(d => `- [ ] **${d.name}** (${d.description})`).join('\n')}`;

  // Generate priority section
  const priorities = config.labels.priority;
  sections.priority_section = `## 🚨 Priority Level
**Select the priority level:**

${priorities.map(p => `- [ ] **${p.name}** (${p.description})`).join('\n')}`;

  // Generate development areas section
  const devAreas = config.labels.development_areas;
  sections.development_areas_section = `## 🛠️ Development Areas
**Select the areas this task affects:**

${devAreas.map(area => `- [ ] **${area.name}** (${area.description})`).join('\n')}`;

  // Generate testing section
  const testing = config.labels.testing;
  sections.testing_section = `## 🧪 Testing Requirements
**Select the testing types needed:**

${testing.map(t => `- [ ] **${t.name}** (${t.description})`).join('\n')}`;

  // Generate platform section
  const platforms = config.labels.platforms;
  sections.platform_section = `## 📱 Platform Specific
**Select the affected platforms:**

${platforms.map(p => `- [ ] **${p.name}** (${p.description})`).join('\n')}`;

  // Generate deployment section
  const deployment = config.labels.deployment;
  const validation = config.labels.validation;
  sections.deployment_section = `## 🚀 Deployment & Validation
**Select deployment and validation needs:**

${[...deployment, ...validation].map(d => `- [ ] **${d.name}** (${d.description})`).join('\n')}`;

  return sections;
}

/**
 * Generate a complete template
 */
function generateTemplate(templateKey, templateDef, commonSections, config) {
  const sections = config.templates.template_sections[templateKey] || [];
  
  // Build the template content
  let content = `---
name: ${templateDef.name}
about: ${templateDef.about}
title: "${templateDef.title}"
labels: ${JSON.stringify(templateDef.labels)}
assignees: "${templateDef.assignees}"
---

`;

  // Add template-specific sections
  for (const section of templateDef.sections) {
    content += `## ${section.title}
${section.content}

`;
  }

  // Add common sections based on config
  for (const sectionKey of sections) {
    if (commonSections[sectionKey]) {
      content += `${commonSections[sectionKey]}

`;
    }
  }

  return content;
}

/**
 * Generate all templates
 */
async function generateAllTemplates() {
  console.log('🚀 Starting template generation...');
  
  const config = await loadConfig();
  const commonSections = generateCommonSections(config);
  
  // Ensure the templates directory exists
  const templatesDir = path.join(process.cwd(), '.github', 'ISSUE_TEMPLATE');
  await fs.mkdir(templatesDir, { recursive: true });
  
  let generatedCount = 0;
  
  // Generate each template
  for (const [templateKey, templateDef] of Object.entries(TEMPLATE_DEFINITIONS)) {
    try {
      const content = generateTemplate(templateKey, templateDef, commonSections, config);
      const filename = `${templateKey}.md`;
      const filepath = path.join(templatesDir, filename);
      
      await fs.writeFile(filepath, content, 'utf8');
      console.log(`✅ Generated: ${filename}`);
      generatedCount++;
    } catch (error) {
      console.error(`❌ Error generating ${templateKey}:`, error.message);
    }
  }
  
  console.log(`\n🎉 Template generation complete! Generated ${generatedCount} templates.`);
  console.log(`📁 Templates saved to: ${templatesDir}`);
  
  // Generate a summary of the configuration
  console.log('\n📊 Configuration Summary:');
  console.log(`- Story Points: ${config.labels.story_points.length} options`);
  console.log(`- Difficulty Levels: ${config.labels.difficulty.length} options`);
  console.log(`- Priority Levels: ${config.labels.priority.length} options`);
  console.log(`- Development Areas: ${config.labels.development_areas.length} options`);
  console.log(`- Testing Types: ${config.labels.testing.length} options`);
  console.log(`- Platforms: ${config.labels.platforms.length} options`);
  console.log(`- Languages: ${config.labels.languages.length} options`);
}

/**
 * Export configuration for analysis tools
 */
async function exportConfigForAnalysis() {
  const config = await loadConfig();
  
  // Create analysis directory
  const analysisDir = path.join(process.cwd(), 'analysis');
  await fs.mkdir(analysisDir, { recursive: true });
  
  // Export labels for analysis
  const labelsForAnalysis = {
    metadata: {
      generated_at: new Date().toISOString(),
      version: '1.0.0',
      total_labels: Object.values(config.labels).flat().length
    },
    categories: {}
  };
  
  // Organize labels by category for easy analysis
  for (const [category, labels] of Object.entries(config.labels)) {
    labelsForAnalysis.categories[category] = labels.map(label => ({
      name: label.name,
      category: label.category,
      value: label.value,
      color: label.color,
      description: label.description,
      // Include additional metadata for analysis
      ...(label.hours_min && { hours_min: label.hours_min, hours_max: label.hours_max }),
      ...(label.skill_level && { skill_level: label.skill_level, complexity_score: label.complexity_score }),
      ...(label.urgency_score && { urgency_score: label.urgency_score, business_impact: label.business_impact }),
      ...(label.team && { team: label.team, skills: label.skills }),
      ...(label.file_extensions && { file_extensions: label.file_extensions })
    }));
  }
  
  // Save analysis data
  const analysisFile = path.join(analysisDir, 'labels-analysis.json');
  await fs.writeFile(analysisFile, JSON.stringify(labelsForAnalysis, null, 2));
  
  console.log(`📊 Analysis data exported to: ${analysisFile}`);
  
  // Generate CSV for spreadsheet analysis
  const csvRows = ['Name,Category,Value,Color,Description,Team,Skills,Complexity Score,Urgency Score,Business Impact'];
  
  for (const [category, labels] of Object.entries(config.labels)) {
    for (const label of labels) {
      const row = [
        `"${label.name}"`,
        `"${label.category || category}"`,
        `"${label.value || ''}"`,
        `"${label.color}"`,
        `"${label.description}"`,
        `"${label.team || ''}"`,
        `"${(label.skills || []).join('; ')}"`,
        label.complexity_score || '',
        label.urgency_score || '',
        `"${label.business_impact || ''}"`
      ];
      csvRows.push(row.join(','));
    }
  }
  
  const csvFile = path.join(analysisDir, 'labels-analysis.csv');
  await fs.writeFile(csvFile, csvRows.join('\n'));
  
  console.log(`📊 CSV data exported to: ${csvFile}`);
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--analysis') || args.includes('-a')) {
    await exportConfigForAnalysis();
  } else {
    await generateAllTemplates();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  generateAllTemplates,
  exportConfigForAnalysis,
  loadConfig,
  generateCommonSections
}; 