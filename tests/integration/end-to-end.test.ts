import nock from 'nock';
import { detectLabels } from '../../src/label-detector';

describe('End-to-End Workflow Tests', () => {
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

  describe('Complete Issue Labeling Flow', () => {
    it('should process a complex iOS bug issue end-to-end', async () => {
      // 1. Simulate issue creation
      const issueData = {
        number: 123,
        title: 'iOS app crashes on login - Priority: High',
        body: `Story Points: 5 - The app crashes when users try to log in on iPhone.

## Steps to reproduce:
1. Open app on iPhone
2. Tap login button
3. App crashes immediately

## Expected behavior:
User should be able to log in successfully.

## Technical details:
- iOS 15.0+
- iPhone 12 and newer
- Related to authentication API

- [x] **Story Points: 5**
- [x] **Difficulty: Hard**
- [x] **Priority: High**
- [x] **🍎 Platform-Specific: iOS**
- [x] **🖥️ Backend**`
      };

      // 2. Detect labels using our logic
      const detectedLabels = detectLabels({
        title: issueData.title,
        body: issueData.body
      });

      // 3. Verify label detection
      expect(detectedLabels.labels).toContain('⏳ Story Points: 5');
      expect(detectedLabels.labels).toContain('🔥 Difficulty: Hard');
      expect(detectedLabels.labels).toContain('🚨 Priority: High');
      expect(detectedLabels.labels).toContain('🍎 Platform-Specific: iOS');
      expect(detectedLabels.labels).toContain('🖥️ Backend');
      expect(detectedLabels.labels).toContain('🪲 Bug');

      // 4. Verify the detected labels are correct
      expect(detectedLabels.labels).toHaveLength(9);
      expect(detectedLabels.confidence).toBeGreaterThan(0.7);
    });

    it('should process a feature request with story points', async () => {
      const issueData = {
        number: 124,
        title: 'Add dark mode feature',
        body: `Story Points: 8 - Implement dark mode for better user experience.

## Feature description:
Users want a dark mode option to reduce eye strain.

## Implementation details:
- Add theme toggle in settings
- Create dark color palette
- Update all UI components
- Add system theme detection

- [x] **Story Points: 8**
- [x] **Difficulty: Moderate**
- [x] **Priority: Medium**
- [x] **🎨 Client Side**`
      };

      const detectedLabels = detectLabels({
        title: issueData.title,
        body: issueData.body
      });

      expect(detectedLabels.labels).toContain('⏳ Story Points: 8');
      expect(detectedLabels.labels).toContain('🛠️ Difficulty: Moderate');
      expect(detectedLabels.labels).toContain('🚨 Priority: Medium');
      expect(detectedLabels.labels).toContain('🎨 Client Side');
      expect(detectedLabels.labels).toContain('✨ Feature');

      // Verify the detected labels are correct
      expect(detectedLabels.labels).toHaveLength(5);
      expect(detectedLabels.confidence).toBeGreaterThanOrEqual(0.5);
    });

    it('should handle Android-specific performance issues', async () => {
      const issueData = {
        number: 125,
        title: 'Android app is slow on Samsung devices',
        body: `Story Points: 13 - Performance optimization needed for Samsung devices.

## Performance metrics:
- App startup: 8 seconds (should be < 3 seconds)
- Memory usage: 450MB (should be < 200MB)
- Battery drain: 15% per hour (should be < 5%)

## Affected devices:
- Samsung Galaxy S21, S22, S23
- Android 12, 13, 14

- [x] **Story Points: 13**
- [x] **Difficulty: Very Hard**
- [x] **Priority: High**
- [x] **🤖 Platform-Specific: Android**
- [x] **🚀 Performance**`
      };

      const detectedLabels = detectLabels({
        title: issueData.title,
        body: issueData.body
      });

      expect(detectedLabels.labels).toContain('⏳ Story Points: 13');
      expect(detectedLabels.labels).toContain('🧠 Difficulty: Very Hard');
      expect(detectedLabels.labels).toContain('🚨 Priority: High');
      expect(detectedLabels.labels).toContain('🤖 Platform-Specific: Android');
      expect(detectedLabels.labels).toContain('🚀 Performance');
    });
  });

  describe('Edge Cases and Error Scenarios', () => {
    it('should handle issues with no detectable labels', async () => {
      const issueData = {
        number: 126,
        title: 'Update README',
        body: 'Just need to update the README file with new information.'
      };

      const detectedLabels = detectLabels({
        title: issueData.title,
        body: issueData.body
      });

      // Should still detect some labels based on keywords
      expect(detectedLabels.labels).toContain('📚 Documentation: Updates');
      expect(detectedLabels.confidence).toBeLessThan(0.5);
    });

    it('should handle very long issue descriptions', async () => {
      const longDescription = 'A'.repeat(5000) + '\n\nStory Points: 1 - Simple task';
      
      const issueData = {
        number: 127,
        title: 'Test long description',
        body: longDescription
      };

      const detectedLabels = detectLabels({
        title: issueData.title,
        body: issueData.body
      });

      // Should still detect story points even in long text
      expect(detectedLabels.labels).toContain('⏳ Story Points: 1');
    });

    it('should handle Unicode and emoji in issue content', async () => {
      const issueData = {
        number: 128,
        title: '🐛 Bug: App crashes on 🍎 iPhone',
        body: `Story Points: 2-3 - The app crashes when users try to log in on 📱 iPhone.

## Steps to reproduce:
1. Open app on 📱 iPhone
2. Tap login button
3. App crashes immediately 😱

## Expected behavior:
User should be able to log in successfully ✅

- [x] **Story Points: 2-3**
- [x] **🍎 Platform-Specific: iOS**`
      };

      const detectedLabels = detectLabels({
        title: issueData.title,
        body: issueData.body
      });

      expect(detectedLabels.labels).toContain('⏳ Story Points: 2-3');
      expect(detectedLabels.labels).toContain('🍎 Platform-Specific: iOS');
      expect(detectedLabels.labels).toContain('🪲 Bug');
    });

    it('should handle conflicting labels gracefully', async () => {
      const issueData = {
        number: 129,
        title: 'Feature request: fix bug in new module',
        body: `This feature will fix a bug in the authentication module.

- [x] **Story Points: 5**
- [x] **Difficulty: Moderate**`
      };

      const detectedLabels = detectLabels({
        title: issueData.title,
        body: issueData.body
      });

      // Should detect both feature and bug labels
      expect(detectedLabels.labels).toContain('✨ Feature');
      expect(detectedLabels.labels).toContain('🪲 Bug');
      expect(detectedLabels.labels).toContain('⏳ Story Points: 5');
      expect(detectedLabels.labels).toContain('🛠️ Difficulty: Moderate');
    });
  });

  describe('Mobile Development Specific Scenarios', () => {
    it('should handle TestFlight-specific issues', async () => {
      const issueData = {
        number: 130,
        title: 'TestFlight build fails on iOS 17',
        body: `Story Points: 3 - TestFlight build is failing for iOS 17 devices.

## Build errors:
- Xcode 15 compatibility issues
- iOS 17 API changes
- TestFlight upload failures

- [x] **Story Points: 3**
- [x] **🍎 Platform-Specific: iOS**
- [x] **🚀 Deployment: TestFlight Release**`
      };

      const detectedLabels = detectLabels({
        title: issueData.title,
        body: issueData.body
      });

      expect(detectedLabels.labels).toContain('🍎 Platform-Specific: iOS');
      expect(detectedLabels.labels).toContain('🪲 Bug');
    });

    it('should handle Google Play Store issues', async () => {
      const issueData = {
        number: 131,
        title: 'Google Play Store rejection - API level too low',
        body: `Story Points: 5 - App rejected due to minimum API level requirement.

## Issue:
Google Play requires minimum API level 24, but our app targets API 21.

## Solution needed:
- Update targetSdkVersion to 34
- Update compileSdkVersion to 34
- Test compatibility with older devices

- [x] **Story Points: 5**
- [x] **🤖 Platform-Specific: Android**
- [x] **📱 Deployment: Google Play Release**`
      };

      const detectedLabels = detectLabels({
        title: issueData.title,
        body: issueData.body
      });

      expect(detectedLabels.labels).toContain('⏳ Story Points: 5');
      expect(detectedLabels.labels).toContain('🤖 Platform-Specific: Android');
    });
  });
}); 