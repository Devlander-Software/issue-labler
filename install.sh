#!/bin/bash

# Auto-Label Issues Workflow Installer
# Usage: curl -sSL https://raw.githubusercontent.com/Devlander-Software/issue-labler/production/install.sh | bash

set -e

echo "🚀 Installing Auto-Label Issues Workflow..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository. Please run this from your repository root."
    exit 1
fi

# Create workflows directory
mkdir -p .github/workflows

# Download the workflow file
echo "📥 Downloading workflow file..."
curl -sSL -o .github/workflows/auto-label-issues.yml \
    https://raw.githubusercontent.com/Devlander-Software/issue-labler/production/.github/workflows/auto-label-issues.yml

# Check if download was successful
if [ ! -f ".github/workflows/auto-label-issues.yml" ]; then
    echo "❌ Error: Failed to download workflow file."
    exit 1
fi

echo "✅ Workflow file downloaded successfully!"

# Ask user if they want to commit and push
read -p "🤔 Do you want to commit and push this workflow? (y/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📝 Committing workflow file..."
    git add .github/workflows/auto-label-issues.yml
    git commit -m "Add auto-label issues workflow"
    
    echo "🚀 Pushing to repository..."
    git push
    
    echo "🎉 Installation complete!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Go to your repository on GitHub"
    echo "2. Create a new issue to test the auto-labeling"
    echo "3. Check the Actions tab to see the workflow run"
    echo "4. Verify that labels are applied to your issue"
    echo ""
    echo "💡 Example test issue:"
    echo "Title: 'Test auto-labeling - Story Points: 5'"
    echo "Body: '## Story Points\n- [x] **Story Points: 5**'"
else
    echo "📝 Workflow file added but not committed."
    echo "💡 Run 'git add .github/workflows/auto-label-issues.yml && git commit -m \"Add auto-label workflow\" && git push' to complete installation."
fi 