# Issue Labler Demo Repository

This is a demo repository showcasing the **GitHub Auto-Label Issues & Templates Action**.

## Quick Start

### Setup the Action

Add this workflow to `.github/workflows/issue-labeling.yml`:

```yaml
name: Issue Labeling & Templates

on:
  issues:
    types: [opened, edited]
  pull_request:
    types: [opened, edited, synchronize]

jobs:
  auto-label:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: Devlander-Software/issue-labler@v1
        with:
          create_templates: 'true'
          create_labels: 'true'
          auto_label_issues: 'true'
```

That's it! The action will automatically set up everything you need.

### 2. Create Issues

Try creating these types of issues to see automatic labeling in action:

#### Bug Report
```
Title: Login button not working on iOS
Body: The login button crashes the app when tapped on iPhone 14 Pro
```

**Expected Labels**: `Bug`, `Platform-Specific: iOS`, `Client Side`

#### Feature Request
```
Title: Add dark mode support
Body: Users want a dark theme option for better accessibility
```

**Expected Labels**: `Feature`, `Client Side`, `Component/UI`

#### Performance Issue
```
Title: App is slow to load on Android
Body: The app takes 10+ seconds to load on Samsung Galaxy devices
```

**Expected Labels**: `Performance`, `Platform-Specific: Android`

### 3. Test File-Based Labeling

Create a pull request that modifies:
- `frontend/components/Button.tsx` → `Client Side`, `JavaScript`
- `backend/api/auth.js` → `Backend`, `JavaScript`
- `ios/LoginViewController.swift` → `Platform-Specific: iOS`, `Swift`

## Data Analysis

After creating issues, run the analysis:

```bash
# Generate analysis data
npm run generate:analysis

# View insights
npm run analyze
```

## Expected Results

### Labels Created
- **Story Points**: 1, 2-3, 5, 8, 13, 20+
- **Difficulty**: Simple, Easy, Moderate, Hard, Very Hard, Epic
- **Priority**: Critical, High, Medium, Low
- **Development Areas**: Client Side, Backend, DevOps, Cloud Infrastructure
- **Platforms**: iOS, Android
- **Testing**: Unit, Integration, End-to-End

### Templates Generated
- Feature Request
- Bug Report
- Performance Bug
- Documentation Request
- Technical Debt
- Maintenance Task

## Testing the Action

1. **Create an issue** with keywords like "bug", "iOS", "frontend"
2. **Check the labels** - they should be applied automatically
3. **Create a PR** with file changes
4. **Verify file-based labeling** works correctly

## Analysis Examples

### Team Capacity
```bash
# Filter by team
label:"Client Side" OR label:"Component/UI"

# Filter by story points
label:"Story Points: 1" OR label:"Story Points: 2-3"
```

### Sprint Planning
```bash
# Quick wins
label:"Story Points: 1" label:"Difficulty: Simple"

# High priority
label:"Priority: Critical" OR label:"Priority: High"
```

## Success!

You should now have:
- Professional issue templates
- Automatic label detection
- File-based PR labeling
- Data analysis capabilities
- Team insights and filtering

This demonstrates the full power of the Issue Labler action! 