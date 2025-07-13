#!/bin/bash

# Release script for GitHub Auto-Label Issues & Templates Action
# Usage: ./scripts/release.sh [patch|minor|major]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the repository root."
    exit 1
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
print_status "Current version: $CURRENT_VERSION"

# Determine version bump type
BUMP_TYPE=${1:-patch}
if [[ ! "$BUMP_TYPE" =~ ^(patch|minor|major)$ ]]; then
    print_error "Invalid bump type. Use: patch, minor, or major"
    exit 1
fi

print_status "Bumping version: $BUMP_TYPE"

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes. Please commit or stash them first."
    git status --short
    exit 1
fi

# Check if we're on the production branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "production" ]; then
    print_warning "You're not on the production branch. Current branch: $CURRENT_BRANCH"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Bump version
print_status "Bumping version in package.json..."
NEW_VERSION=$(npm version $BUMP_TYPE --no-git-tag-version)
NEW_VERSION=${NEW_VERSION#v}  # Remove 'v' prefix

print_success "Version bumped to: $NEW_VERSION"

# Update CHANGELOG.md
print_status "Updating changelog..."
npx conventional-changelog -p angular -i CHANGELOG.md -s -r 0

# Commit changes
print_status "Committing changes..."
git add package.json CHANGELOG.md
git commit -m "chore(release): bump version to $NEW_VERSION"

# Create and push tag
print_status "Creating tag v$NEW_VERSION..."
git tag -a "v$NEW_VERSION" -m "chore(release): release version $NEW_VERSION"

# Push changes
print_status "Pushing changes and tag..."
git push origin production
git push origin "v$NEW_VERSION"

print_success "Release v$NEW_VERSION created successfully!"
print_status "GitHub Actions will now:"
print_status "1. Update package.json version to $NEW_VERSION"
print_status "2. Generate changelog from conventional commits"
print_status "3. Create GitHub release with changelog"
print_status "4. Update release notes"

print_status "You can monitor the release at:"
print_status "https://github.com/Devlander-Software/issue-labler/releases/tag/v$NEW_VERSION" 