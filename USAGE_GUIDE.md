# 📖 Complete Usage Guide

> **Everything you need to know about using the GitHub Auto-Label Issues & Templates Action**

## 🎯 Table of Contents

1. [Quick Start](#-quick-start)
2. [Installation Methods](#-installation-methods)
3. [Basic Usage](#-basic-usage)
4. [Advanced Configuration](#-advanced-configuration)
5. [Issue Templates](#-issue-templates)
6. [Label System](#-label-system)
7. [Testing & Validation](#-testing--validation)
8. [Troubleshooting](#-troubleshooting)
9. [Best Practices](#-best-practices)

---

## 🚀 Quick Start

### For New Repositories

1. **One-line installation:**
   ```bash
   curl -sSL https://raw.githubusercontent.com/Devlander-Software/issue-labler/production/install.sh | bash
   ```

2. **Create a test issue** with story points and difficulty
3. **Watch the GitHub Action run** and apply labels automatically!

### For Existing Repositories

1. **Install the GitHub Actions workflow** (see installation methods below)
2. **Configure your preferences** in repository variables
3. **Test with existing issues** or create new ones

**Important:** This is a GitHub Action that only runs in the GitHub Actions environment when issues or pull requests are created/edited.

---

## 📥 Installation Methods

### Method 1: One-Line Install Script (Recommended)

```bash
# Run in your repository root
curl -sSL https://raw.githubusercontent.com/Devlander-Software/issue-labler/production/install.sh | bash
```

**What this does:**
- Downloads the GitHub Actions workflow file
- Creates necessary `.github/workflows/` directory
- Commits and pushes the workflow to your repository
- The action will run automatically when issues/PRs are created

### Method 2: Manual Download

```bash
# 1. Create workflows directory
mkdir -p .github/workflows

# 2. Download the workflow
curl -o .github/workflows/auto-label-issues.yml \
  https://raw.githubusercontent.com/Devlander-Software/issue-labler/production/.github/workflows/auto-label-issues.yml

# 3. Commit and push
git add .github/workflows/auto-label-issues.yml
git commit -m "Add auto-label issues workflow"
git push
```

### Method 3: GitHub Marketplace (Future)

Once published to GitHub Marketplace, use as a reusable action:

```yaml
name: Auto Label Issues
on:
  issues: [opened, edited]
  pull_request: [opened, edited, synchronize]

jobs:
  auto-label:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: Devlander-Software/issue-labler@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

**Note:** This is a GitHub Action that runs in the GitHub Actions environment. It cannot be run locally or as a standalone script.

---

## 🎯 Basic Usage

### Creating Issues with Auto-Labeling

#### Option 1: Using Checkboxes (Recommended)

Create an issue with this format:

```markdown
## Story Points
- [x] **Story Points: 5**

## Difficulty
- [x] **Difficulty: Easy**

## Priority
- [x] **Priority: Medium**

## Development Area
- [x] **🎨 Client Side**

## Description
This is my issue description...
```

#### Option 2: Using Keywords

Simply mention in your issue:

```markdown
Title: "Add user authentication - Story Points: 8, Difficulty: Hard"

Body: This feature requires backend API changes and frontend components.
```

### Expected Behavior

The action will automatically:
- ✅ Apply story point labels (⏳ Story Points: 5)
- ✅ Apply difficulty labels (👍 Difficulty: Easy)
- ✅ Apply priority labels (🚨 Priority: Medium)
- ✅ Apply development area labels (🎨 Client Side)
- ✅ Apply additional labels based on content analysis

---

## ⚙️ Advanced Configuration

### Repository Variables

Configure the action behavior in your repository settings:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add these variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `CREATE_TEMPLATES` | `true` | Create issue templates |
| `CREATE_LABELS` | `true` | Create labels |
| `AUTO_LABEL_ISSUES` | `true` | Auto-label issues |
| `RATE_LIMIT_DELAY` | `0.5` | Delay between API calls (seconds) |
| `MAX_RETRIES` | `3` | Max retries for failed operations |

### Custom Configuration File

Create a `config.yml` file for custom labels and templates:

```yaml
labels:
  - name: "Custom Label"
    color: "ff0000"
    description: "Custom description"
    category: "custom"
    metadata:
      team: "frontend"
      skills: ["react", "typescript"]
      complexity: "medium"
      hours: 4

templates:
  - name: "custom-template.md"
    content: |
      # Custom Template
      ## Description
      [Your content here]
```

### Environment-Specific Setup

#### For Organizations

```bash
# Clone the action repo
git clone https://github.com/Devlander-Software/issue-labler.git
cd issue-labler

# Generate organization-specific config
npm run generate:org -- --org "your-org-name"

# Copy to your repositories
./scripts/deploy-to-org.sh "your-org-name"
```

#### For Multiple Repositories

```bash
# Deploy to multiple repos
./scripts/deploy-multi-repo.sh \
  "repo1,repo2,repo3" \
  "your-org-name"
```

---

## 📝 Issue Templates

### Available Templates

The action creates these professional templates:

1. **Feature Request** - For new features and enhancements
2. **Bug Report** - For bugs and issues
3. **Performance Issue** - For performance-related problems
4. **Documentation** - For documentation updates
5. **Technical Debt** - For refactoring and cleanup

### Template Structure

Each template includes:

```markdown
## Story Points
- [ ] **Story Points: 1**
- [ ] **Story Points: 2-3**
- [ ] **Story Points: 5**
- [ ] **Story Points: 8**
- [ ] **Story Points: 13**
- [ ] **Story Points: 20+**

## Difficulty
- [ ] **Difficulty: Simple**
- [ ] **Difficulty: Easy**
- [ ] **Difficulty: Moderate**
- [ ] **Difficulty: Hard**
- [ ] **Difficulty: Very Hard**
- [ ] **Difficulty: Epic**

## Priority
- [ ] **Priority: Critical**
- [ ] **Priority: High**
- [ ] **Priority: Medium**
- [ ] **Priority: Low**

## Development Area
- [ ] **🎨 Client Side**
- [ ] **🖥️ Backend**
- [ ] **☁️ Cloud Infrastructure**
- [ ] **⚙️ DevOps**
- [ ] **👩‍💻 Component/UI**
- [ ] **🧠 Logic/Functions**
```

### Custom Templates

Create custom templates by adding files to `.github/ISSUE_TEMPLATE/`:

```bash
# Generate custom templates
npm run generate:templates -- --custom

# Or manually create
touch .github/ISSUE_TEMPLATE/custom-template.md
```

---

## 🏷️ Label System

### Label Categories

#### Story Points
- `⏳ Story Points: 1` (1-2 hours)
- `⏳ Story Points: 2-3` (2-4 hours)
- `⏳ Story Points: 5` (5-8 hours)
- `⏳ Story Points: 8` (10-16 hours)
- `⏳ Story Points: 13` (16+ hours)
- `⏳ Story Points: 20+` (40+ hours)

#### Difficulty Levels
- `🌱 Difficulty: Simple` (Basic tasks)
- `👍 Difficulty: Easy` (Low complexity)
- `🛠️ Difficulty: Moderate` (Medium complexity)
- `🔥 Difficulty: Hard` (High complexity)
- `🧠 Difficulty: Very Hard` (Advanced tasks)
- `⚫ Difficulty: Epic` (Multi-phase projects)

#### Priority Levels
- `🚨 Priority: Critical` (Urgent)
- `🚨 Priority: High` (Important)
- `🚨 Priority: Medium` (Normal)
- `🚨 Priority: Low` (Low impact)

#### Development Areas
- `🎨 Client Side` (Frontend)
- `🖥️ Backend` (Server-side)
- `☁️ Cloud Infrastructure` (AWS, etc.)
- `⚙️ DevOps` (CI/CD, automation)
- `👩‍💻 Component/UI` (UI components)
- `🧠 Logic/Functions` (Business logic)

#### Platform Specific
- `🍎 Platform-Specific: iOS` (iOS development)
- `🤖 Platform-Specific: Android` (Android development)

#### Testing & Quality
- `🔬 Testing: Unit` (Unit tests)
- `🧩 Testing: Integration` (Integration tests)
- `🌐 Testing: End-to-End` (E2E tests)
- `🔬 QA/Automation` (Quality assurance)

#### Documentation & Maintenance
- `📚 Documentation: Updates` (Doc updates)
- `📝 Documentation: New` (New docs)
- `🔄 Maintenance: Dependency Update` (Dependency updates)
- `🧹 Maintenance: Chore` (Routine tasks)

### Using Labels for Filtering

#### GitHub Search Filters

```bash
# Quick wins (high impact, low effort)
label:"⏳ Story Points: 1" label:"🚨 Priority: High"

# Frontend team tasks
label:"🎨 Client Side" OR label:"👩‍💻 Component/UI"

# Technical debt
label:"📉 Technical Debt"

# iOS-specific issues
label:"🍎 Platform-Specific: iOS"

# High-priority bugs
label:"🪲 Bug" label:"🚨 Priority: Critical"
```

#### Project Boards

Create project boards with these columns:
- **To Do** - No labels
- **Quick Wins** - `⏳ Story Points: 1` OR `⏳ Story Points: 2-3`
- **In Progress** - Assigned issues
- **Review** - `🔬 Testing: Unit` OR `🔬 Testing: Integration`
- **Done** - Closed issues

---

## 🧪 Testing & Validation

### Test Your Installation

1. **Create a test issue:**
   ```markdown
   Title: "Test auto-labeling - Story Points: 5"
   
   Body:
   ## Story Points
   - [x] **Story Points: 5**
   
   ## Difficulty
   - [x] **Difficulty: Easy**
   
   ## Priority
   - [x] **Priority: Medium**
   ```

2. **Check the workflow run:**
   - Go to **Actions** tab
   - Look for "Setup Issue Templates and Labels"
   - Verify it completed successfully

3. **Verify labels were applied:**
   - Check your test issue
   - Should have labels: `⏳ Story Points: 5`, `👍 Difficulty: Easy`, `🚨 Priority: Medium`

### Manual Testing

```bash
# Test the workflow manually
gh workflow run "Setup Issue Templates and Labels" \
  --field event_type=repository_dispatch \
  --field client_payload='{"action":"create_labels"}'
```

### Validation Commands

```bash
# Check if labels exist
gh api repos/:owner/:repo/labels --jq '.[].name'

# Check if templates exist
ls -la .github/ISSUE_TEMPLATE/

# Test label creation
gh api repos/:owner/:repo/labels -f name="Test Label" -f color="ff0000" -f description="Test"
```

---

## 🔧 Troubleshooting

### Common Issues

#### Issue 1: Labels Not Being Applied

**Symptoms:** Issues created but no labels applied

**Solutions:**
1. Check workflow permissions:
   ```yaml
   permissions:
     issues: write
     pull-requests: write
   ```

2. Verify repository variables:
   - `AUTO_LABEL_ISSUES` should be `true`
   - `CREATE_LABELS` should be `true`

3. Check workflow logs for errors

#### Issue 2: Templates Not Created

**Symptoms:** No issue templates in `.github/ISSUE_TEMPLATE/`

**Solutions:**
1. Check `CREATE_TEMPLATES` variable
2. Verify Node.js setup in workflow
3. Check for template generation errors

#### Issue 3: Rate Limiting

**Symptoms:** Workflow fails with rate limit errors

**Solutions:**
1. Increase `RATE_LIMIT_DELAY` to `1.0` or higher
2. Check GitHub API rate limits
3. Use GitHub App instead of personal token

#### Issue 4: Permission Denied

**Symptoms:** Workflow fails with permission errors

**Solutions:**
1. Check repository settings → Actions → General
2. Ensure "Allow GitHub Actions to create and approve pull requests" is enabled
3. Verify token permissions

### Debug Mode

Enable debug logging:

```yaml
env:
  DEBUG: "true"
  RATE_LIMIT_DELAY: "1.0"
```

### Getting Help

1. **Check the logs:** Go to Actions → Workflow runs → View logs
2. **Review configuration:** Verify all variables and settings
3. **Test manually:** Use the manual trigger option
4. **Open an issue:** Report bugs on the action repository

---

## 💡 Best Practices

### For Teams

1. **Standardize Issue Creation:**
   - Always use templates
   - Require story points and difficulty
   - Use consistent terminology

2. **Regular Reviews:**
   - Review label usage monthly
   - Update templates based on feedback
   - Clean up unused labels

3. **Team Training:**
   - Document your labeling conventions
   - Train new team members
   - Create quick reference guides

### For Organizations

1. **Consistent Setup:**
   - Use the same configuration across repos
   - Standardize template formats
   - Maintain label consistency

2. **Automation:**
   - Set up organization-wide deployment
   - Use repository templates
   - Automate configuration updates

3. **Monitoring:**
   - Track label usage analytics
   - Monitor workflow performance
   - Regular health checks

### For Individual Projects

1. **Start Simple:**
   - Begin with basic templates
   - Add complexity gradually
   - Test thoroughly before scaling

2. **Customize Thoughtfully:**
   - Only add labels you'll actually use
   - Keep templates concise
   - Focus on your specific needs

3. **Maintain Regularly:**
   - Update outdated labels
   - Remove unused templates
   - Keep documentation current

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Labels API](https://docs.github.com/en/rest/reference/issues#labels)
- [Issue Templates Guide](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests)
- [Project Management with GitHub](https://docs.github.com/en/issues/organizing-your-work-with-project-boards)

---

## 🤝 Support & Contributing

- **Issues:** [Report bugs or request features](https://github.com/Devlander-Software/issue-labler/issues)
- **Discussions:** [Ask questions and share ideas](https://github.com/Devlander-Software/issue-labler/discussions)
- **Contributing:** [Help improve the action](CONTRIBUTING.md)
- **Sponsoring:** [Support development](https://github.com/sponsors/Devlander-Software)

---

*This guide covers the most common use cases. For advanced scenarios or specific requirements, please open an issue or discussion.* 