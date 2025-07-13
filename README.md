
# 🏷️ GitHub Auto-Label Issues & Templates Action

> **The most comprehensive GitHub Action for automatic issue labeling, story point detection, and professional issue templates**

[![GitHub Actions](https://img.shields.io/badge/GitHub-Actions-blue?logo=github)](https://github.com/features/actions)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Stars](https://img.shields.io/github/stars/Devlander-Software/issue-labler?style=social)](https://github.com/Devlander-Software/issue-labler)
[![Downloads](https://img.shields.io/github/downloads/Devlander-Software/issue-labler/total)](https://github.com/Devlander-Software/issue-labler/releases)

## 🎯 Overview

**The Ultimate GitHub Issue Management Solution** - A GitHub Action that automatically creates professional issue templates, detects story points, and applies intelligent labels based on content and file changes. Perfect for **mobile development teams**, **agile projects**, and **organizations** that need consistent issue management across multiple repositories.

### 🚀 Key Features
- **🎯 Smart Story Point Detection**: Automatically detects and labels story points (1, 2-3, 5, 8, 13, 20+)
- **📁 File-Based Labeling**: Labels PRs based on changed files (JavaScript, Python, iOS, Android, etc.)
- **📱 Mobile Development Focus**: iOS/Android specific labels and templates
- **🏷️ 50+ Professional Labels**: Comprehensive label set for all development areas
- **📝 Professional Templates**: Structured templates for features, bugs, and performance issues
- **🔧 No External Dependencies**: Self-contained GitHub Action
- **⚙️ Organization Ready**: Perfect for enterprise and multi-repo setups

## ✨ Key Features

- **🎯 Smart Auto-Labeling**: Automatically detects and applies labels based on issue content and keywords
- **📝 Professional Templates**: Comprehensive, structured issue templates with guided sections
- **🏷️ 40+ Predefined Labels**: Categorized labels for story points, difficulty, priority, and development areas
- **🔧 No External Dependencies**: Self-contained GitHub Action using GitHub CLI
- **📊 Detailed Logging**: Comprehensive error handling and progress reporting
- **⚙️ Configurable**: Easy to customize via repository variables
- **🔄 Intelligent Detection**: Analyzes both issue title and body for better accuracy

---

## 🚀 Quick Installation

### Method 1: One-Line Install (Recommended)

```bash
# Run this in your repository root
curl -sSL https://raw.githubusercontent.com/Devlander-Software/issue-labler/production/install.sh | bash
```

This installs a GitHub Actions workflow that runs automatically when issues or pull requests are created.

### Method 2: Manual Installation

```bash
# 1. Create workflows directory
mkdir -p .github/workflows

# 2. Download the workflow file
curl -o .github/workflows/auto-label-issues.yml \
  https://raw.githubusercontent.com/Devlander-Software/issue-labler/production/.github/workflows/auto-label-issues.yml

# 3. Commit and push
git add .github/workflows/auto-label-issues.yml
git commit -m "Add auto-label issues workflow"
git push
```

### Method 3: GitHub Marketplace (Coming Soon)

Once published to GitHub Marketplace, you can use it as a reusable action:

```yaml
# .github/workflows/auto-label-issues.yml
name: Auto Label Issues

on:
  issues:
    types: [opened, edited]
  pull_request:
    types: [opened, edited, synchronize]

jobs:
  auto-label:
    runs-on: ubuntu-latest
    steps:
      - name: Use Auto-Label Issues Action
        uses: Devlander-Software/issue-labler@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

## 🧪 Test Your Installation

After installation, test it by creating an issue with:

```
Title: "Test auto-labeling - Story Points: 5"

Body:
## Story Points
- [x] **Story Points: 5**

## Difficulty
- [x] **Difficulty: Easy**

## Priority
- [x] **Priority: Medium**
```

The GitHub Action will automatically run and apply labels based on your selections!

📖 **[Complete Usage Guide](USAGE_GUIDE.md)** - Everything you need to know about installation, configuration, and advanced usage

🚀 **[Quick Reference](QUICK_REFERENCE.md)** - Fast reference card for common usage patterns

---

## Benefits of Using This GitHub Action

1. **Consistency Across Teams**: Whether you're working on a single project or across multiple repositories in an organization, having consistent labels and issue templates makes it easier to manage issues.
   
2. **Better Organization**: The predefined labels help categorize and prioritize issues in a clear, structured way, so team members and product managers can easily understand the state of the project.

3. **Easier Client Collaboration**: Clients and customers can use familiar templates to submit feature requests or bug reports, ensuring that all communication follows a similar format. This reduces confusion and ensures requests are handled efficiently.

4. **Visual Clarity with Emojis**: The emoji-enhanced labels make the issue list visually appealing and easier to scan. Non-technical stakeholders will appreciate the intuitive visual cues that emojis provide.

5. **Simplified Setup**: This action automatically sets up everything you need to manage issues—issue templates and labels—so you don't have to manually create them for every new project.

6. **📊 Data-Driven Analysis**: **NEW!** Advanced data analysis and organization capabilities with structured labels, team insights, and export-ready data for external tools.

---

## 🆕 Data Analysis & Organization

The Issue Labler now includes **advanced data analysis capabilities** that transform your issue management into a data-driven system:

### 🎯 Key Analysis Features
- **📊 Structured Labels**: Each label includes metadata (team, skills, complexity, hours)
- **👥 Team Insights**: Automatic team capacity and workload analysis
- **📈 Sprint Planning**: Story points with hour estimates for capacity planning
- **🔍 Smart Filtering**: Pre-built GitHub search filters for common use cases
- **📤 Export Ready**: JSON and CSV exports for external tools (Jira, Power BI, etc.)

### 🚀 Quick Analysis Commands
```bash
# Generate templates and analysis data
npm run generate:all

# Get insights and recommendations
npm run analyze

# Export data for external tools
npm run generate:analysis
```

### 📋 Sample GitHub Filters
```bash
# Quick wins (high impact, low effort)
label:"⏳ Story Points: 1" label:"🚨 Priority: High"

# Frontend team tasks
label:"🎨 Client Side" OR label:"👩‍💻 Component/UI"

# Technical debt
label:"📉 Technical Debt"
```

📖 **For detailed analysis guidance, see [DATA_ANALYSIS.md](./DATA_ANALYSIS.md)**

