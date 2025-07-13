# 🚀 Quick Reference Card

> **Fast reference for the GitHub Auto-Label Issues & Templates Action**

## 📥 Installation

```bash
# One-line install (recommended)
curl -sSL https://raw.githubusercontent.com/Devlander-Software/issue-labler/production/install.sh | bash
```

**Note:** This installs a GitHub Actions workflow that runs automatically when issues/PRs are created.

## 🎯 Basic Usage

### Create Issue with Auto-Labeling

```markdown
Title: "Add user authentication - Story Points: 8"

Body:
## Story Points
- [x] **Story Points: 8**

## Difficulty
- [x] **Difficulty: Hard**

## Priority
- [x] **Priority: High**

## Development Area
- [x] **🖥️ Backend**
- [x] **🎨 Client Side**

## Description
Implement user authentication with JWT tokens...
```

### Keywords for Auto-Detection

```markdown
Title: "Fix login bug - Story Points: 2-3, Difficulty: Easy"

Body: The login form crashes when users enter invalid credentials.
```

## 🏷️ Label Categories

### Story Points
- `⏳ Story Points: 1` (1-2 hours)
- `⏳ Story Points: 2-3` (2-4 hours)
- `⏳ Story Points: 5` (5-8 hours)
- `⏳ Story Points: 8` (10-16 hours)
- `⏳ Story Points: 13` (16+ hours)
- `⏳ Story Points: 20+` (40+ hours)

### Difficulty
- `🌱 Difficulty: Simple`
- `👍 Difficulty: Easy`
- `🛠️ Difficulty: Moderate`
- `🔥 Difficulty: Hard`
- `🧠 Difficulty: Very Hard`
- `⚫ Difficulty: Epic`

### Priority
- `🚨 Priority: Critical`
- `🚨 Priority: High`
- `🚨 Priority: Medium`
- `🚨 Priority: Low`

### Development Areas
- `🎨 Client Side` (Frontend)
- `🖥️ Backend` (Server-side)
- `☁️ Cloud Infrastructure` (AWS, etc.)
- `⚙️ DevOps` (CI/CD, automation)
- `👩‍💻 Component/UI` (UI components)
- `🧠 Logic/Functions` (Business logic)

## 🔍 GitHub Search Filters

```bash
# Quick wins (high impact, low effort)
label:"⏳ Story Points: 1" label:"🚨 Priority: High"

# Frontend team tasks
label:"🎨 Client Side" OR label:"👩‍💻 Component/UI"

# Backend team tasks
label:"🖥️ Backend" OR label:"🧠 Logic/Functions"

# Technical debt
label:"📉 Technical Debt"

# iOS-specific issues
label:"🍎 Platform-Specific: iOS"

# High-priority bugs
label:"🪲 Bug" label:"🚨 Priority: Critical"

# Testing tasks
label:"🔬 Testing: Unit" OR label:"🧩 Testing: Integration"

# Documentation
label:"📚 Documentation: Updates" OR label:"📝 Documentation: New"
```

## ⚙️ Configuration Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CREATE_TEMPLATES` | `true` | Create issue templates |
| `CREATE_LABELS` | `true` | Create labels |
| `AUTO_LABEL_ISSUES` | `true` | Auto-label issues |
| `RATE_LIMIT_DELAY` | `0.5` | API call delay (seconds) |
| `MAX_RETRIES` | `3` | Max retries |

## 🧪 Testing Commands

```bash
# Test workflow manually
gh workflow run "Setup Issue Templates and Labels" \
  --field event_type=repository_dispatch \
  --field client_payload='{"action":"create_labels"}'

# Check existing labels
gh api repos/:owner/:repo/labels --jq '.[].name'

# Check templates
ls -la .github/ISSUE_TEMPLATE/
```

## 🔧 Troubleshooting

### Labels Not Applied?
1. Check `AUTO_LABEL_ISSUES` variable is `true`
2. Verify workflow permissions
3. Check Actions tab for errors

### Templates Not Created?
1. Check `CREATE_TEMPLATES` variable is `true`
2. Verify Node.js setup in workflow
3. Check for generation errors

### Rate Limiting?
1. Increase `RATE_LIMIT_DELAY` to `1.0`
2. Check GitHub API limits
3. Use GitHub App token

## 📱 Mobile Development

### iOS-Specific Labels
- `🍎 Platform-Specific: iOS`
- `🚀 Deployment: TestFlight Release`
- `🏬 Deployment: App Store Release`
- `🧪 Validation: TestFlight`

### Android-Specific Labels
- `🤖 Platform-Specific: Android`
- `📱 Deployment: Google Play Release`
- `📱 App Store / Google Play Store`

## 🎯 Project Management

### Sprint Planning
```bash
# This sprint's capacity
label:"⏳ Story Points: 1" OR label:"⏳ Story Points: 2-3" OR label:"⏳ Story Points: 5"

# High-priority items
label:"🚨 Priority: High" OR label:"🚨 Priority: Critical"

# Quick wins for demo
label:"⏳ Story Points: 1" label:"🚨 Priority: High"
```

### Team Assignment
```bash
# Frontend team
label:"🎨 Client Side" OR label:"👩‍💻 Component/UI"

# Backend team
label:"🖥️ Backend" OR label:"🧠 Logic/Functions"

# DevOps team
label:"⚙️ DevOps" OR label:"☁️ Cloud Infrastructure"
```

## 📊 Data Analysis

```bash
# Generate analysis data
npm run generate:analysis

# Get team insights
npm run analyze

# Export for external tools
npm run export:csv
```

## 🆘 Getting Help

- **📖 [Complete Usage Guide](USAGE_GUIDE.md)** - Detailed documentation
- **🐛 [Report Issues](https://github.com/Devlander-Software/issue-labler/issues)** - Bug reports
- **💬 [Discussions](https://github.com/Devlander-Software/issue-labler/discussions)** - Questions & ideas
- **🤝 [Contributing](CONTRIBUTING.md)** - Help improve the action

---

*Need more details? Check the [Complete Usage Guide](USAGE_GUIDE.md) for comprehensive documentation.* 