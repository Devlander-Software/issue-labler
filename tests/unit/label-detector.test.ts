import {
  detectStoryPoints,
  detectDifficulty,
  detectPriority,
  detectDevelopmentArea,
  detectTestingType,
  detectPlatform,
  detectIssueType,
  detectLabels,
  validateLabel,
  type IssueContent,
} from '../../src/label-detector';

describe('Label Detector', () => {
  describe('detectStoryPoints', () => {
    it('should detect story points: 1', () => {
      const content: IssueContent = {
        title: 'Add login feature',
        body: 'Story Points: 1 - Simple login form',
      };
      expect(detectStoryPoints(content)).toBe('⏳ Story Points: 1');
    });

    it('should detect story points: 2-3', () => {
      const content: IssueContent = {
        title: 'Implement user registration',
        body: 'Story Points: 2-3 - Registration form with validation',
      };
      expect(detectStoryPoints(content)).toBe('⏳ Story Points: 2-3');
    });

    it('should detect story points: 5', () => {
      const content: IssueContent = {
        title: 'Add payment integration',
        body: 'Story Points: 5 - Stripe payment processing',
      };
      expect(detectStoryPoints(content)).toBe('⏳ Story Points: 5');
    });

    it('should detect story points: 8', () => {
      const content: IssueContent = {
        title: 'Implement real-time chat',
        body: 'Story Points: 8 - WebSocket chat functionality',
      };
      expect(detectStoryPoints(content)).toBe('⏳ Story Points: 8');
    });

    it('should detect story points: 13', () => {
      const content: IssueContent = {
        title: 'Build admin dashboard',
        body: 'Story Points: 13 - Complete admin interface',
      };
      expect(detectStoryPoints(content)).toBe('⏳ Story Points: 13');
    });

    it('should detect story points: 20+', () => {
      const content: IssueContent = {
        title: 'Complete app rewrite',
        body: 'Story Points: 20+ - Full application rewrite',
      };
      expect(detectStoryPoints(content)).toBe('⏳ Story Points: 20+');
    });

    it('should return null when no story points detected', () => {
      const content: IssueContent = {
        title: 'Fix typo in README',
        body: 'Just a small typo fix',
      };
      expect(detectStoryPoints(content)).toBeNull();
    });
  });

  describe('detectDifficulty', () => {
    it('should detect simple difficulty', () => {
      const content: IssueContent = {
        title: 'Fix typo',
        body: 'Difficulty: Simple - Just a text change',
      };
      expect(detectDifficulty(content)).toBe('🌱 Difficulty: Simple');
    });

    it('should detect easy difficulty', () => {
      const content: IssueContent = {
        title: 'Add button',
        body: 'Difficulty: Easy - Simple UI addition',
      };
      expect(detectDifficulty(content)).toBe('👍 Difficulty: Easy');
    });

    it('should detect moderate difficulty', () => {
      const content: IssueContent = {
        title: 'Add form validation',
        body: 'Difficulty: Moderate - Client and server validation',
      };
      expect(detectDifficulty(content)).toBe('🛠️ Difficulty: Moderate');
    });

    it('should detect hard difficulty', () => {
      const content: IssueContent = {
        title: 'Implement OAuth',
        body: 'Difficulty: Hard - Complex authentication flow',
      };
      expect(detectDifficulty(content)).toBe('🔥 Difficulty: Hard');
    });

    it('should detect very hard difficulty', () => {
      const content: IssueContent = {
        title: 'Build recommendation engine',
        body: 'Difficulty: Very Hard - ML algorithm implementation',
      };
      expect(detectDifficulty(content)).toBe('🧠 Difficulty: Very Hard');
    });

    it('should detect epic difficulty', () => {
      const content: IssueContent = {
        title: 'Complete platform rewrite',
        body: 'Difficulty: Epic - Full system redesign',
      };
      expect(detectDifficulty(content)).toBe('⚫ Difficulty: Epic');
    });
  });

  describe('detectPriority', () => {
    it('should detect critical priority', () => {
      const content: IssueContent = {
        title: 'Security vulnerability',
        body: 'Priority: Critical - SQL injection vulnerability',
      };
      expect(detectPriority(content)).toBe('🚨 Priority: Critical');
    });

    it('should detect high priority', () => {
      const content: IssueContent = {
        title: 'Login broken',
        body: 'Priority: High - Users cannot log in',
      };
      expect(detectPriority(content)).toBe('🚨 Priority: High');
    });

    it('should detect medium priority', () => {
      const content: IssueContent = {
        title: 'Add search feature',
        body: 'Priority: Medium - Nice to have feature',
      };
      expect(detectPriority(content)).toBe('🚨 Priority: Medium');
    });

    it('should detect low priority', () => {
      const content: IssueContent = {
        title: 'Update footer text',
        body: 'Priority: Low - Cosmetic change',
      };
      expect(detectPriority(content)).toBe('🚨 Priority: Low');
    });
  });

  describe('detectDevelopmentArea', () => {
    it('should detect frontend/client side', () => {
      const content: IssueContent = {
        title: 'Fix button styling',
        body: 'The CSS needs to be updated for the login button',
      };
      const areas = detectDevelopmentArea(content);
      expect(areas).toContain('🎨 Client Side');
    });

    it('should detect backend', () => {
      const content: IssueContent = {
        title: 'Fix API endpoint',
        body: 'The server is returning 500 errors on the user endpoint',
      };
      const areas = detectDevelopmentArea(content);
      expect(areas).toContain('🖥️ Backend');
    });

    it('should detect cloud infrastructure', () => {
      const content: IssueContent = {
        title: 'Deploy to AWS',
        body: 'Need to set up EC2 instances and S3 buckets',
      };
      const areas = detectDevelopmentArea(content);
      expect(areas).toContain('☁️ Cloud Infrastructure');
    });

    it('should detect devops', () => {
      const content: IssueContent = {
        title: 'Set up CI/CD',
        body: 'Need to configure GitHub Actions for automated deployment',
      };
      const areas = detectDevelopmentArea(content);
      expect(areas).toContain('⚙️ DevOps');
    });

    it('should detect multiple areas', () => {
      const content: IssueContent = {
        title: 'Full stack feature',
        body: 'Need to update the React component and the API endpoint, then deploy with Docker',
      };
      const areas = detectDevelopmentArea(content);
      expect(areas).toContain('🎨 Client Side');
      expect(areas).toContain('🖥️ Backend');
      expect(areas).toContain('⚙️ DevOps');
    });
  });

  describe('detectTestingType', () => {
    it('should detect unit testing', () => {
      const content: IssueContent = {
        title: 'Add unit tests',
        body: 'Need to write unit tests for the user service',
      };
      expect(detectTestingType(content)).toBe('🔬 Testing: Unit');
    });

    it('should detect integration testing', () => {
      const content: IssueContent = {
        title: 'Integration tests failing',
        body: 'The integration tests for the payment flow are failing',
      };
      expect(detectTestingType(content)).toBe('🧩 Testing: Integration');
    });

    it('should detect end-to-end testing', () => {
      const content: IssueContent = {
        title: 'E2E test setup',
        body: 'Need to set up end-to-end tests with Cypress',
      };
      expect(detectTestingType(content)).toBe('🌐 Testing: End-to-End');
    });

    it('should detect general testing', () => {
      const content: IssueContent = {
        title: 'Improve test coverage',
        body: 'Need to add more tests to improve coverage',
      };
      expect(detectTestingType(content)).toBe('🔬 QA/Automation');
    });
  });

  describe('detectPlatform', () => {
    it('should detect iOS platform', () => {
      const content: IssueContent = {
        title: 'iOS app crash',
        body: 'The app crashes on iPhone when opening the camera',
      };
      const platforms = detectPlatform(content);
      expect(platforms).toContain('🍎 Platform-Specific: iOS');
    });

    it('should detect Android platform', () => {
      const content: IssueContent = {
        title: 'Android notification issue',
        body: 'Push notifications not working on Samsung devices',
      };
      const platforms = detectPlatform(content);
      expect(platforms).toContain('🤖 Platform-Specific: Android');
    });

    it('should detect both platforms', () => {
      const content: IssueContent = {
        title: 'Cross-platform issue',
        body: 'The app crashes on both iOS and Android when accessing the camera',
      };
      const platforms = detectPlatform(content);
      expect(platforms).toContain('🍎 Platform-Specific: iOS');
      expect(platforms).toContain('🤖 Platform-Specific: Android');
    });
  });

  describe('detectIssueType', () => {
    it('should detect bug', () => {
      const content: IssueContent = {
        title: 'Login button broken',
        body: 'The login button doesn\'t work when clicked',
      };
      const types = detectIssueType(content);
      expect(types).toContain('🪲 Bug');
    });

    it('should detect feature', () => {
      const content: IssueContent = {
        title: 'Add dark mode',
        body: 'Implement dark mode feature for better user experience',
      };
      const types = detectIssueType(content);
      expect(types).toContain('✨ Feature');
    });

    it('should detect performance issue', () => {
      const content: IssueContent = {
        title: 'Slow page load',
        body: 'The homepage takes 5 seconds to load, need to optimize',
      };
      const types = detectIssueType(content);
      expect(types).toContain('🚀 Performance');
    });

    it('should detect technical debt', () => {
      const content: IssueContent = {
        title: 'Refactor old code',
        body: 'Need to clean up legacy code and improve architecture',
      };
      const types = detectIssueType(content);
      expect(types).toContain('📉 Technical Debt');
    });

    it('should detect documentation updates', () => {
      const content: IssueContent = {
        title: 'Update API docs',
        body: 'The documentation needs to be updated with new endpoints',
      };
      const types = detectIssueType(content);
      expect(types).toContain('📚 Documentation: Updates');
    });

    it('should detect new documentation', () => {
      const content: IssueContent = {
        title: 'Create user guide',
        body: 'Need to write a new user guide for the application',
      };
      const types = detectIssueType(content);
      expect(types).toContain('📝 Documentation: New');
    });
  });

  describe('detectLabels', () => {
    it('should detect multiple labels from complex issue', () => {
      const content: IssueContent = {
        title: 'Fix iOS login bug - Priority: High',
        body: 'Story Points: 5 - The login screen crashes on iPhone. Need to fix the authentication API and add unit tests.',
      };
      
      const result = detectLabels(content);
      
      expect(result.labels).toContain('⏳ Story Points: 5');
      expect(result.labels).toContain('🚨 Priority: High');
      expect(result.labels).toContain('🪲 Bug');
      expect(result.labels).toContain('🍎 Platform-Specific: iOS');
      expect(result.labels).toContain('🖥️ Backend');
      expect(result.labels).toContain('🔬 Testing: Unit');
      
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should remove duplicate labels', () => {
      const content: IssueContent = {
        title: 'Frontend bug with React components',
        body: 'The UI components are broken. Need to fix the frontend code and update the CSS styling.',
      };
      
      const result = detectLabels(content);
      const clientSideCount = result.labels.filter(label => label === '🎨 Client Side').length;
      
      expect(clientSideCount).toBe(1); // Should only appear once
    });
  });

  describe('edge cases and robustness', () => {
    it('should return empty array when no labels detected', () => {
      const content: IssueContent = {
        title: '',
        body: '',
      };
      const result = detectLabels(content);
      expect(result.labels).toEqual([]);
      expect(result.confidence).toBe(0);
    });

    it('should handle case insensitivity', () => {
      const content: IssueContent = {
        title: 'BUG: login fails',
        body: 'PRIORITY: HIGH. STORY POINTS: 1. DIFFICULTY: EASY.',
      };
      const result = detectLabels(content);
      expect(result.labels).toContain('🪲 Bug');
      expect(result.labels).toContain('🚨 Priority: High');
      expect(result.labels).toContain('⏳ Story Points: 1');
      expect(result.labels).toContain('👍 Difficulty: Easy');
    });

    it('should handle special characters and punctuation', () => {
      const content: IssueContent = {
        title: 'Add feature! (new)',
        body: 'Let\'s implement: dark mode, ASAP.',
      };
      const result = detectLabels(content);
      expect(result.labels).toContain('✨ Feature');
    });

    it('should not duplicate labels for repeated keywords', () => {
      const content: IssueContent = {
        title: 'Bug bug bug',
        body: 'This bug is a big bug.',
      };
      const result = detectLabels(content);
      const bugCount = result.labels.filter(l => l === '🪲 Bug').length;
      expect(bugCount).toBe(1);
    });

    it('should handle conflicting keywords (feature and bug)', () => {
      const content: IssueContent = {
        title: 'Feature request: fix bug in new module',
        body: 'This feature will fix a bug.',
      };
      const result = detectLabels(content);
      expect(result.labels).toContain('✨ Feature');
      expect(result.labels).toContain('🪲 Bug');
    });

    it('should handle very long input gracefully', () => {
      const content: IssueContent = {
        title: 'A'.repeat(1000),
        body: 'B'.repeat(5000),
      };
      const result = detectLabels(content);
      expect(Array.isArray(result.labels)).toBe(true);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe('validateLabel', () => {
    it('should validate correct label', () => {
      expect(validateLabel('Bug', 'ff0000', 'Something is broken')).toBe(true);
    });

    it('should reject empty name', () => {
      expect(validateLabel('', 'ff0000', 'Description')).toBe(false);
    });

    it('should reject invalid color format', () => {
      expect(validateLabel('Bug', 'red', 'Description')).toBe(false);
      expect(validateLabel('Bug', 'ff00', 'Description')).toBe(false);
      expect(validateLabel('Bug', 'ff00000', 'Description')).toBe(false);
    });

    it('should reject description too long', () => {
      const longDescription = 'A'.repeat(101);
      expect(validateLabel('Bug', 'ff0000', longDescription)).toBe(false);
    });

    it('should accept description at max length', () => {
      const maxDescription = 'A'.repeat(100);
      expect(validateLabel('Bug', 'ff0000', maxDescription)).toBe(true);
    });
  });
}); 