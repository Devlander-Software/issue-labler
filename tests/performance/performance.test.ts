import { detectLabels } from '../../src/label-detector';

describe('Performance Tests', () => {
  describe('Large Issue Body Handling', () => {
    it('should handle very large issue bodies efficiently', () => {
      // Create a large issue body (10KB+)
      const largeBody = `
# Large Issue Description

${'A'.repeat(5000)}

## Technical Details

${'B'.repeat(3000)}

## Steps to Reproduce

${'C'.repeat(2000)}

## Additional Context

${'D'.repeat(1000)}

Story Points: 5 - This is a complex issue that requires significant investigation.

- [x] **Story Points: 5**
- [x] **Difficulty: Hard**
- [x] **Priority: High**
- [x] **🎨 Client Side**
- [x] **🖥️ Backend**
- [x] **🍎 Platform-Specific: iOS**
- [x] **🤖 Platform-Specific: Android**
- [x] **🚀 Performance**
- [x] **🔬 Testing: Unit**
- [x] **🧩 Testing: Integration**
- [x] **🌐 Testing: End-to-End**
- [x] **📚 Documentation: Updates**
- [x] **📝 Documentation: New**
- [x] **📉 Technical Debt**
- [x] **🔄 Maintenance: Dependency Update**
- [x] **🧹 Maintenance: Chore**
- [x] **☁️ Cloud Infrastructure**
- [x] **⚙️ DevOps**
- [x] **👩‍💻 Component/UI**
- [x] **🧠 Logic/Functions**
- [x] **🚨 Priority: Critical**
- [x] **🚨 Priority: High**
- [x] **🚨 Priority: Medium**
- [x] **🚨 Priority: Low**
- [x] **🌱 Difficulty: Simple**
- [x] **👍 Difficulty: Easy**
- [x] **🛠️ Difficulty: Moderate**
- [x] **🔥 Difficulty: Hard**
- [x] **🧠 Difficulty: Very Hard**
- [x] **⚫ Difficulty: Epic**
- [x] **⏳ Story Points: 1**
- [x] **⏳ Story Points: 2-3**
- [x] **⏳ Story Points: 8**
- [x] **⏳ Story Points: 13**
- [x] **⏳ Story Points: 20+**
`;

      const startTime = performance.now();
      
      const result = detectLabels({
        title: 'Performance Test Issue',
        body: largeBody
      });
      
      const endTime = performance.now();
      const processingTime = endTime - startTime;

      // Should complete within 100ms
      expect(processingTime).toBeLessThan(100);
      
      // Should still detect labels correctly
      expect(result.labels).toContain('⏳ Story Points: 1');
      expect(result.labels).toContain('🌱 Difficulty: Simple');
      expect(result.labels).toContain('🚨 Priority: Critical');
      expect(result.labels.length).toBeGreaterThan(0);
    });

    it('should handle multiple concurrent label detections', () => {
      const issues = Array.from({ length: 100 }, (_, i) => ({
        title: `Issue ${i + 1}`,
        body: `Story Points: ${(i % 5) + 1} - This is issue number ${i + 1}.

- [x] **Story Points: ${(i % 5) + 1}**
- [x] **Difficulty: ${['Simple', 'Easy', 'Moderate', 'Hard', 'Very Hard'][i % 5]}**
- [x] **Priority: ${['Low', 'Medium', 'High', 'Critical'][i % 4]}**
- [x] **🎨 Client Side**
- [x] **🖥️ Backend**`
      }));

      const startTime = performance.now();
      
      const results = issues.map(issue => detectLabels(issue));
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const avgTime = totalTime / issues.length;

      // Average processing time should be less than 10ms per issue
      expect(avgTime).toBeLessThan(10);
      
      // All issues should have detected labels
      results.forEach((result, index) => {
        expect(result.labels.length).toBeGreaterThan(0);
        expect(result.confidence).toBeGreaterThan(0);
      });
    });
  });

  describe('Memory Usage', () => {
    it('should not cause memory leaks with repeated processing', () => {
      const baseMemory = process.memoryUsage().heapUsed;
      
      // Process many issues
      for (let i = 0; i < 1000; i++) {
        detectLabels({
          title: `Memory Test Issue ${i}`,
          body: `Story Points: ${(i % 5) + 1} - Memory test issue.

- [x] **Story Points: ${(i % 5) + 1}**
- [x] **🎨 Client Side**
- [x] **🖥️ Backend**`
        });
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - baseMemory;
      
      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });
  });

  describe('Regex Performance', () => {
    it('should handle complex regex patterns efficiently', () => {
      const complexBody = `
# Complex Issue with Many Patterns

Story Points: 13 - This is a very complex issue.

## Technical Details
- Frontend: React components need updating
- Backend: API endpoints need optimization
- iOS: iPhone-specific features
- Android: Samsung device compatibility
- Performance: Slow loading times
- Testing: Unit tests failing
- Documentation: API docs outdated
- DevOps: CI/CD pipeline broken
- Cloud: AWS costs too high
- Security: Authentication vulnerabilities

## Keywords that should trigger multiple labels:
- UI/UX improvements needed
- Database queries slow
- API authentication failing
- Mobile app crashes
- Performance optimization required
- Unit test coverage low
- Integration tests failing
- End-to-end tests broken
- Documentation missing
- Technical debt accumulation
- Dependency updates needed
- Maintenance tasks pending
- Cloud infrastructure scaling
- DevOps automation required
- Component library updates
- Business logic refactoring
- Critical security fix
- High priority feature
- Medium complexity task
- Simple bug fix
- Easy enhancement
- Hard optimization
- Very hard architecture change
- Epic system redesign

- [x] **Story Points: 13**
- [x] **Difficulty: Very Hard**
- [x] **Priority: Critical**
- [x] **🎨 Client Side**
- [x] **🖥️ Backend**
- [x] **🍎 Platform-Specific: iOS**
- [x] **🤖 Platform-Specific: Android**
- [x] **🚀 Performance**
- [x] **🔬 Testing: Unit**
- [x] **🧩 Testing: Integration**
- [x] **🌐 Testing: End-to-End**
- [x] **📚 Documentation: Updates**
- [x] **📉 Technical Debt**
- [x] **🔄 Maintenance: Dependency Update**
- [x] **☁️ Cloud Infrastructure**
- [x] **⚙️ DevOps**
- [x] **👩‍💻 Component/UI**
- [x] **🧠 Logic/Functions**
`;

      const startTime = performance.now();
      
      const result = detectLabels({
        title: 'Complex Regex Test',
        body: complexBody
      });
      
      const endTime = performance.now();
      const processingTime = endTime - startTime;

      // Should complete within 50ms even with complex patterns
      expect(processingTime).toBeLessThan(50);
      
      // Should detect many labels
      expect(result.labels.length).toBeGreaterThan(10);
      expect(result.confidence).toBeGreaterThan(0.8);
    });
  });

  describe('Unicode and Special Character Handling', () => {
    it('should handle Unicode characters efficiently', () => {
      const unicodeBody = `
# Unicode Test Issue

Story Points: 5 - Testing Unicode handling 🚀

## Emoji and Special Characters:
- 🍎 iOS development
- 🤖 Android development
- 🎨 Frontend design
- 🖥️ Backend services
- ☁️ Cloud infrastructure
- ⚙️ DevOps automation
- 👩‍💻 Component development
- 🧠 Business logic
- 🚨 Critical priority
- 🌱 Simple difficulty
- 👍 Easy difficulty
- 🛠️ Moderate difficulty
- 🔥 Hard difficulty
- 🧠 Very hard difficulty
- ⚫ Epic difficulty
- ⏳ Story points tracking
- 🪲 Bug reports
- ✨ Feature requests
- 🚀 Performance issues
- 🔬 Unit testing
- 🧩 Integration testing
- 🌐 End-to-end testing
- 📚 Documentation
- 📝 New documentation
- 📉 Technical debt
- 🔄 Maintenance
- 🧹 Chores
- 📱 Mobile development
- 🏬 App store releases
- 🧪 TestFlight validation

## Special Characters:
- API endpoints (with hyphens)
- Database queries (with underscores)
- File paths (with slashes)
- URLs (with dots and colons)
- Email addresses (with @ symbols)
- Phone numbers (with dashes and parentheses)
- Version numbers (with dots)
- Commit hashes (with letters and numbers)

- [x] **Story Points: 5**
- [x] **Difficulty: Moderate**
- [x] **Priority: High**
- [x] **🍎 Platform-Specific: iOS**
- [x] **🤖 Platform-Specific: Android**
- [x] **🎨 Client Side**
- [x] **🖥️ Backend**
- [x] **☁️ Cloud Infrastructure**
- [x] **⚙️ DevOps**
- [x] **👩‍💻 Component/UI**
- [x] **🧠 Logic/Functions**
- [x] **🚀 Performance**
- [x] **🔬 Testing: Unit**
- [x] **🧩 Testing: Integration**
- [x] **🌐 Testing: End-to-End**
- [x] **📚 Documentation: Updates**
- [x] **📝 Documentation: New**
- [x] **📉 Technical Debt**
- [x] **🔄 Maintenance: Dependency Update**
- [x] **🧹 Maintenance: Chore**
- [x] **📱 App Store / Google Play Store**
- [x] **🏬 Deployment: App Store Release**
- [x] **📱 Deployment: Google Play Release**
- [x] **📱 Validation: Platform-Specific**
- [x] **🚀 Deployment: TestFlight Release**
- [x] **🧪 Validation: TestFlight**
`;

      const startTime = performance.now();
      
      const result = detectLabels({
        title: 'Unicode Test Issue 🚀',
        body: unicodeBody
      });
      
      const endTime = performance.now();
      const processingTime = endTime - startTime;

      // Should complete within 50ms
      expect(processingTime).toBeLessThan(50);
      
      // Should detect labels correctly despite Unicode
      expect(result.labels).toContain('⏳ Story Points: 5');
      expect(result.labels).toContain('🛠️ Difficulty: Moderate');
      expect(result.labels).toContain('🚨 Priority: High');
      expect(result.labels).toContain('🍎 Platform-Specific: iOS');
      expect(result.labels).toContain('🤖 Platform-Specific: Android');
    });
  });
}); 