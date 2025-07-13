# Stable IDs for Labels

## Overview

The Issue Labler now supports **stable IDs** for all labels, ensuring that your automation, scripts, and external integrations continue to work even when you change display names or remove emojis.

## How It Works

### Before (Display Name Only)
```yaml
# Old way - display name was the identifier
- name: "⏳ Story Points: 1"
  color: "6f42c1"
  description: "Estimated effort: 1-2 hours"
```

**Problem:** If you change the display name to remove emojis or rebrand, all your automation breaks.

### After (Stable ID + Display Name)
```yaml
# New way - stable ID + display name
- id: "story-points-1"
  name: "⏳ Story Points: 1"
  color: "6f42c1"
  description: "Estimated effort: 1-2 hours"
```

**Solution:** The ID stays the same even if you change the display name.

## Benefits

### 1. **Automation Stability**
```bash
# This keeps working even if you change the display name
gh issue list --label "story-points-1"

# Instead of breaking when you change to:
# name: "Story Points: 1" (no emoji)
```

### 2. **External Integrations**
- **Jira sync** - Your mapping stays consistent
- **Project management tools** - No broken references
- **Analytics/Reporting** - Historical data remains valid
- **CI/CD pipelines** - Automation doesn't break

### 3. **Label Evolution**
```yaml
# Version 1: With emojis
- id: "story-points-1"
  name: "⏳ Story Points: 1"

# Version 2: Cleaner look
- id: "story-points-1"  # Same ID!
  name: "Story Points: 1"

# Version 3: Different format
- id: "story-points-1"  # Still same ID!
  name: "SP-1"
```

### 4. **Multi-Repo Consistency**
- Same IDs across all repos in your org
- Easy to sync and maintain
- No confusion when labels look different but mean the same thing

## Available Stable IDs

### Story Points
- `story-points-1` → "⏳ Story Points: 1"
- `story-points-2-3` → "⏳ Story Points: 2-3"
- `story-points-5` → "⏳ Story Points: 5"
- `story-points-8` → "⏳ Story Points: 8"
- `story-points-13` → "⏳ Story Points: 13"
- `story-points-20-plus` → "⏳ Story Points: 20+"

### Difficulty Levels
- `difficulty-simple` → "🌱 Difficulty: Simple"
- `difficulty-easy` → "👍 Difficulty: Easy"
- `difficulty-moderate` → "🛠️ Difficulty: Moderate"
- `difficulty-hard` → "🔥 Difficulty: Hard"
- `difficulty-very-hard` → "🧠 Difficulty: Very Hard"
- `difficulty-epic` → "⚫ Difficulty: Epic"

### Priority Levels
- `priority-critical` → "🚨 Priority: Critical"
- `priority-high` → "🚨 Priority: High"
- `priority-medium` → "🚨 Priority: Medium"
- `priority-low` → "🚨 Priority: Low"

### Development Areas
- `dev-frontend` → "🎨 Client Side"
- `dev-backend` → "🖥️ Backend"
- `dev-infrastructure` → "☁️ Cloud Infrastructure"
- `dev-devops` → "⚙️ DevOps"
- `dev-ui-components` → "👩‍💻 Component/UI"
- `dev-business-logic` → "🧠 Logic/Functions"

### Platforms
- `platform-ios` → "🍎 Platform-Specific: iOS"
- `platform-android` → "🤖 Platform-Specific: Android"

### Testing
- `testing-unit` → "🔬 Testing: Unit"
- `testing-integration` → "🧩 Testing: Integration"
- `testing-e2e` → "🌐 Testing: End-to-End"
- `testing-qa` → "🔬 QA/Automation"

### Documentation
- `docs-updates` → "📚 Documentation: Updates"
- `docs-new` → "📝 Documentation: New"

### Maintenance
- `maintenance-dependencies` → "🔄 Maintenance: Dependency Update"
- `maintenance-chore` → "🧹 Maintenance: Chore"

### Deployment
- `deploy-testflight` → "🚀 Deployment: TestFlight Release"
- `deploy-app-store` → "🏬 Deployment: App Store Release"
- `deploy-google-play` → "📱 Deployment: Google Play Release"

### Validation
- `validation-testflight` → "🧪 Validation: TestFlight"
- `validation-platform` → "📱 Validation: Platform-Specific"

### Issue Types
- `issue-bug` → "🪲 Bug"
- `issue-feature` → "✨ Feature"
- `issue-performance` → "🚀 Performance"
- `issue-tech-debt` → "📉 Technical Debt"

### Programming Languages
- `lang-javascript` → "JavaScript"
- `lang-python` → "Python"
- `lang-java` → "Java"
- `lang-swift` → "Swift"
- `lang-kotlin` → "Kotlin"
- `lang-go` → "Go"
- `lang-rust` → "Rust"
- `lang-php` → "PHP"
- `lang-ruby` → "Ruby"
- `lang-csharp` → "C#"

### Release Phases
- `release-prelease` → "1️⃣ Prelease"
- `release-mvp` → "2️⃣ MVP"
- `release-post` → "3️⃣ Post Release"

## Usage Examples

### GitHub Search Filters
```bash
# Quick wins (high impact, low effort)
label:story-points-1 label:priority-high

# Frontend team tasks
label:dev-frontend OR label:dev-ui-components

# Backend team tasks
label:dev-backend OR label:dev-business-logic

# High-priority bugs
label:issue-bug label:priority-critical

# Technical debt
label:issue-tech-debt

# iOS-specific issues
label:platform-ios

# Testing tasks
label:testing-unit OR label:testing-integration OR label:testing-e2e

# Documentation
label:docs-updates OR label:docs-new
```

### GitHub CLI Commands
```bash
# List all high-priority issues
gh issue list --label "priority-high"

# List frontend tasks
gh issue list --label "dev-frontend"

# List quick wins
gh issue list --label "story-points-1" --label "priority-high"

# List bugs
gh issue list --label "issue-bug"
```

### Project Boards
Create project boards with these columns:
- **To Do** - No labels
- **Quick Wins** - `story-points-1` OR `story-points-2-3`
- **In Progress** - Assigned issues
- **Review** - `testing-unit` OR `testing-integration`
- **Done** - Closed issues

### External Integrations
```javascript
// Jira sync example
const labelMappings = {
  'story-points-1': 'Story Points: 1',
  'priority-high': 'High Priority',
  'dev-frontend': 'Frontend',
  'issue-bug': 'Bug'
};

// This mapping stays consistent even if GitHub display names change
```

## Migration Guide

### For Existing Repositories

1. **Update your config.yml** to include stable IDs:
   ```yaml
   labels:
     story_points:
       - id: "story-points-1"
         name: "⏳ Story Points: 1"
         # ... other properties
   ```

2. **Run the label creation script** to update existing labels:
   ```bash
   ./scripts/create-labels-with-ids.sh
   ```

3. **Update your automation scripts** to use stable IDs:
   ```bash
   # Old way
   gh issue list --label "⏳ Story Points: 1"
   
   # New way
   gh issue list --label "story-points-1"
   ```

### For New Repositories

1. **Use the stable ID system from the start** - it's the default now
2. **Reference the ID mapping** in `scripts/label-id-mapping.json`
3. **Use stable IDs in all automation** and external integrations

## Configuration

### Custom Labels with Stable IDs
```yaml
labels:
  custom_category:
    - id: "custom-label-1"
      name: "Custom Label"
      color: "ff0000"
      description: "Custom description"
      category: "custom"
      value: "custom_value"
```

### Label Categories
```yaml
# You can organize labels by category
categories:
  story_points: ["story-points-1", "story-points-2-3", "story-points-5"]
  difficulty: ["difficulty-simple", "difficulty-easy", "difficulty-moderate"]
  priority: ["priority-critical", "priority-high", "priority-medium", "priority-low"]
```

## Best Practices

1. **Always use stable IDs** in automation and external integrations
2. **Keep display names user-friendly** - they're what users see
3. **Document your ID mappings** for team reference
4. **Use consistent naming patterns** for your custom IDs
5. **Test your automation** after changing display names

## Troubleshooting

### ID Already Exists
If you get an error about an ID already existing:
1. Check if the label already exists in your repo
2. Use a different ID or update the existing label
3. The script will skip existing labels automatically

### Display Name Changes
When you change a display name:
1. The stable ID remains the same
2. Update your documentation if needed
3. Test your automation to ensure it still works

### Migration Issues
If you're migrating from the old system:
1. Backup your current labels
2. Update your config.yml with stable IDs
3. Run the migration script
4. Test all your automation

## Support

For questions about stable IDs:
- Check the [label mapping file](scripts/label-id-mapping.json)
- Review the [usage examples](USAGE_GUIDE.md)
- Open an issue in the repository 