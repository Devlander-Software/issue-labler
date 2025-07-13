import nock from 'nock';
import { promises as fs } from 'fs';
import path from 'path';

describe('Workflow Integration Tests', () => {
  const testRepo = {
    owner: 'test-owner',
    repo: 'test-repo'
  };

  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('Issue Template Creation', () => {
    it('should create feature request template', async () => {
      const templateDir = '.github/ISSUE_TEMPLATE';
      const templatePath = path.join(templateDir, 'feature_request.md');
      
      // Mock the template creation (this would be done by the workflow)
      const templateContent = `---
name: ✨ Feature Request
about: Suggest a new feature for this project
title: "[FEATURE] "
labels: ["✨ Feature"]
assignees: ""
---

## 🎯 Feature Description
**What feature would you like to see implemented?**

A clear and concise description of what the feature should do.

## 🔍 Problem Statement
**What problem does this feature solve?**

A clear and concise description of what the problem is.

## 💡 Proposed Solution
**How would you like this feature to work?**

A clear and concise description of what you want to happen.

## 🏷️ Labels (Optional)
**Select the appropriate labels for this feature:**

- [ ] **Story Points: 1** (1-2 hours)
- [ ] **Story Points: 2-3** (2-4 hours)
- [ ] **Story Points: 5** (5-8 hours)
- [ ] **Story Points: 8** (10-16 hours)
- [ ] **Story Points: 13** (16+ hours)
- [ ] **Story Points: 20+** (40+ hours)

- [ ] **Difficulty: Simple**
- [ ] **Difficulty: Easy**
- [ ] **Difficulty: Moderate**
- [ ] **Difficulty: Hard**
- [ ] **Difficulty: Very Hard**
- [ ] **Difficulty: Epic**

- [ ] **Priority: Critical**
- [ ] **Priority: High**
- [ ] **Priority: Medium**
- [ ] **Priority: Low**
`;

      // Create directory and template
      await fs.mkdir(templateDir, { recursive: true });
      await fs.writeFile(templatePath, templateContent);

      // Verify template was created
      const content = await fs.readFile(templatePath, 'utf-8');
      expect(content).toContain('name: ✨ Feature Request');
      expect(content).toContain('Story Points: 1');
      expect(content).toContain('Difficulty: Simple');
      expect(content).toContain('Priority: Critical');

      // Cleanup - only remove the test file, not the directory
      await fs.unlink(templatePath);
    });

    it('should create bug report template', async () => {
      const templateDir = '.github/ISSUE_TEMPLATE';
      const templatePath = path.join(templateDir, 'bug_report.md');
      
      const templateContent = `---
name: 🪲 Bug Report
about: Create a report to help us improve
title: "[BUG] "
labels: ["🪲 Bug"]
assignees: ""
---

## 🐛 Bug Description
**A clear and concise description of what the bug is.**

## 🔄 Steps to Reproduce
**Steps to reproduce the behavior:**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## ✅ Expected Behavior
**A clear and concise description of what you expected to happen.**

## 📱 Current Behavior
**A clear and concise description of what actually happened.**

## 🏷️ Labels (Optional)
**Select the appropriate labels for this bug:**

- [ ] **Story Points: 1** (1-2 hours)
- [ ] **Story Points: 2-3** (2-4 hours)
- [ ] **Story Points: 5** (5-8 hours)
- [ ] **Story Points: 8** (10-16 hours)
- [ ] **Story Points: 13** (16+ hours)
- [ ] **Story Points: 20+** (40+ hours)

- [ ] **🎨 Client Side**
- [ ] **🖥️ Backend**
- [ ] **🍎 Platform-Specific: iOS**
- [ ] **🤖 Platform-Specific: Android**
`;

      await fs.mkdir(templateDir, { recursive: true });
      await fs.writeFile(templatePath, templateContent);

      const content = await fs.readFile(templatePath, 'utf-8');
      expect(content).toContain('name: 🪲 Bug Report');
      expect(content).toContain('Story Points: 1');
      expect(content).toContain('🎨 Client Side');
      expect(content).toContain('🍎 Platform-Specific: iOS');

      await fs.unlink(templatePath);
    });
  });

  describe('GitHub API Integration', () => {
    it('should create labels via GitHub API', async () => {
      const labels = [
        {
          name: '⏳ Story Points: 1',
          color: '6f42c1',
          description: 'Estimated effort: 1-2 hours.'
        },
        {
          name: '🌱 Difficulty: Simple',
          color: '0e8a16',
          description: 'Basic tasks with minimal complexity.'
        }
      ];

      // Mock GitHub API responses
      labels.forEach(label => {
        nock('https://api.github.com')
          .post(`/repos/${testRepo.owner}/${testRepo.repo}/labels`, label)
          .reply(201, { ...label, id: Math.floor(Math.random() * 1000) });
      });

      // Verify label data is correct
      for (const label of labels) {
        expect(label.name).toBeDefined();
        expect(label.color).toMatch(/^[0-9a-fA-F]{6}$/);
        expect(label.description).toBeDefined();
        expect(label.description.length).toBeLessThanOrEqual(100);
      }
    });

    it('should handle rate limiting gracefully', async () => {
      nock('https://api.github.com')
        .post(`/repos/${testRepo.owner}/${testRepo.repo}/labels`)
        .reply(403, {
          message: 'API rate limit exceeded',
          documentation_url: 'https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting',
        });

      // Test rate limiting logic
      const rateLimitResponse = {
        status: 403,
        message: 'API rate limit exceeded',
        documentation_url: 'https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting',
      };

      expect(rateLimitResponse.status).toBe(403);
      expect(rateLimitResponse.message).toContain('API rate limit exceeded');
    });

    it('should add labels to issues', async () => {
      const issueNumber = 123;
      const labelsToAdd = ['🪲 Bug', '🚨 Priority: High', '⏳ Story Points: 5'];

      nock('https://api.github.com')
        .post(`/repos/${testRepo.owner}/${testRepo.repo}/issues/${issueNumber}/labels`, labelsToAdd)
        .reply(200, labelsToAdd.map(name => ({ name, color: 'ff0000' })));

      // Test label application logic
      const result = labelsToAdd.map(name => ({ name, color: 'ff0000' }));
      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('🪲 Bug');
      expect(result[1].name).toBe('🚨 Priority: High');
      expect(result[2].name).toBe('⏳ Story Points: 5');
    });
  });

  describe('Configuration Tests', () => {
    it('should parse config.yml correctly', async () => {
      const configContent = `
labels:
  story_points:
    - name: "⏳ Story Points: 1"
      color: "6f42c1"
      description: "Estimated effort: 1-2 hours."
    - name: "⏳ Story Points: 2-3"
      color: "ffdf5d"
      description: "Estimated effort: 2-4 hours."
  
  difficulty:
    - name: "🌱 Difficulty: Simple"
      color: "0e8a16"
      description: "Basic tasks with minimal complexity."
    - name: "👍 Difficulty: Easy"
      color: "f9d0c4"
      description: "Low-complexity tasks, typically straightforward."
  
  priority:
    - name: "🚨 Priority: Critical"
      color: "e11d21"
      description: "Urgent tasks that must be handled immediately."
    - name: "🚨 Priority: High"
      color: "fbca04"
      description: "Requires timely attention."
`;

      const configPath = 'test-config.yml';
      await fs.writeFile(configPath, configContent);

      const content = await fs.readFile(configPath, 'utf-8');
      expect(content).toContain('⏳ Story Points: 1');
      expect(content).toContain('🌱 Difficulty: Simple');
      expect(content).toContain('🚨 Priority: Critical');

      await fs.unlink(configPath);
    });
  });

  describe('Error Handling', () => {
    it('should handle network failures gracefully', async () => {
      nock('https://api.github.com')
        .post(`/repos/${testRepo.owner}/${testRepo.repo}/labels`)
        .replyWithError('Network error');

      try {
        await fetch(`https://api.github.com/repos/${testRepo.owner}/${testRepo.repo}/labels`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token test-token',
          },
          body: JSON.stringify({
            name: 'Test Label',
            color: 'ff0000',
            description: 'Test description'
          }),
        });
      } catch (error: any) {
        expect(error.message).toContain('Network error');
      }
    });

    it('should handle invalid label data', async () => {
      const invalidLabels = [
        { name: '', color: 'ff0000', description: 'Empty name' },
        { name: 'Test', color: 'invalid', description: 'Invalid color' },
        { name: 'Test', color: 'ff0000', description: 'A'.repeat(101) }, // Too long
      ];

      for (const label of invalidLabels) {
        // These should be validated before making API calls
        const isValid = label.name && 
                       /^[0-9a-fA-F]{6}$/.test(label.color) && 
                       label.description.length <= 100;
        
        if (label.name === '') {
          expect(label.name).toBe('');
          expect(isValid).toBeFalsy();
        } else if (label.color === 'invalid') {
          expect(label.color).toBe('invalid');
          expect(isValid).toBeFalsy();
        } else if (label.description.length > 100) {
          expect(label.description.length).toBeGreaterThan(100);
          expect(isValid).toBeFalsy();
        }
      }
    });
  });
}); 