
# GitHub Action: Auto-Label Issues & Create Issue Templates

## Overview

This GitHub Action is designed to ensure consistency across repositories by automatically creating **issue templates** and **GitHub labels**. It helps teams maintain uniformity when working with **clients**, **customers**, or **product teams** by providing standard templates for **feature requests**, **general bug reports**, and **performance bug reports**.

In addition to creating issue templates, this action also sets up a set of predefined, **emoji-based labels** that make it easy to distinguish tasks in a list. The labels come with simple, clear descriptions that are easy for anyone to understand, including non-technical stakeholders like product managers.

---

## Installation Instructions

To use this action in your repository, you don’t need to manually copy any YAML files. Follow these simple steps to integrate this action into your project:

### Step 1: Create a Workflow File

In your project, navigate to or create the following directory:

```
.github/workflows
```

Inside this directory, create a new workflow file. For example, you could name it `auto-label-issues.yml`:

```bash
.github/workflows/auto-label-issues.yml
```

### Step 2: Add the Workflow

In your newly created workflow file, reference the action you published in GitHub Marketplace. Here’s an example of what your workflow file should look like:

```yaml
name: Setup Issue Templates and Labels

on:
  issues:
    types: [opened, edited]
  repository_dispatch:
    types: [create_labels]

jobs:
  setup_issue_templates_and_labels:
    runs-on: ubuntu-latest
    steps:
      - name: Use Auto-Label Issues Action
        uses: Devlander-Software/issue-labler@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

Replace `Devlander-Software/issue-labler@v1` with the actual path and version of the action once it’s published.

### Step 3: Commit and Push the Workflow

Once you've added the workflow file, commit and push the changes to your repository:

```bash
git add .github/workflows/auto-label-issues.yml
git commit -m "Add auto-label issues workflow"
git push
```

### What Happens Next?

After setting up this workflow:
1. The action will automatically create issue templates for:
   - Feature requests
   - General bug reports
   - Performance bug reports
2. It will also set up emoji-based labels that make it easy to categorize and prioritize issues.

Whenever an issue is created or edited in your repository, the action will run and apply the appropriate labels based on the content of the issue.

---

## Benefits of Using This GitHub Action

1. **Consistency Across Teams**: Whether you’re working on a single project or across multiple repositories in an organization, having consistent labels and issue templates makes it easier to manage issues.
   
2. **Better Organization**: The predefined labels help categorize and prioritize issues in a clear, structured way, so team members and product managers can easily understand the state of the project.

3. **Easier Client Collaboration**: Clients and customers can use familiar templates to submit feature requests or bug reports, ensuring that all communication follows a similar format. This reduces confusion and ensures requests are handled efficiently.

4. **Visual Clarity with Emojis**: The emoji-enhanced labels make the issue list visually appealing and easier to scan. Non-technical stakeholders will appreciate the intuitive visual cues that emojis provide.

5. **Simplified Setup**: This action automatically sets up everything you need to manage issues—issue templates and labels—so you don’t have to manually create them for every new project.

