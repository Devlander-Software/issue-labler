/**
 * Label detection utilities for GitHub issues
 * This module contains pure functions that can be easily unit tested
 */

export interface LabelDetectionResult {
  labels: string[];
  confidence: number;
}

export interface IssueContent {
  title: string;
  body: string;
}

/**
 * Detects story points from issue content
 */
export function detectStoryPoints(content: IssueContent): string | null {
  const combinedText = `${content.title} ${content.body}`.toLowerCase();
  
  // Check for explicit story point mentions
  const storyPointPatterns = [
    { pattern: /story\s*points?\s*:\s*1\b/, label: '⏳ Story Points: 1' },
    { pattern: /story\s*points?\s*:\s*2-3\b/, label: '⏳ Story Points: 2-3' },
    { pattern: /story\s*points?\s*:\s*5\b/, label: '⏳ Story Points: 5' },
    { pattern: /story\s*points?\s*:\s*8\b/, label: '⏳ Story Points: 8' },
    { pattern: /story\s*points?\s*:\s*13\b/, label: '⏳ Story Points: 13' },
    { pattern: /story\s*points?\s*:\s*20\+/, label: '⏳ Story Points: 20+' },
  ];
  
  for (const { pattern, label } of storyPointPatterns) {
    if (pattern.test(combinedText)) {
      return label;
    }
  }
  
  return null;
}

/**
 * Detects difficulty level from issue content
 */
export function detectDifficulty(content: IssueContent): string | null {
  const combinedText = `${content.title} ${content.body}`.toLowerCase();
  
  const difficultyPatterns = [
    { pattern: /difficulty\s*:\s*simple\b/, label: '🌱 Difficulty: Simple' },
    { pattern: /difficulty\s*:\s*easy\b/, label: '👍 Difficulty: Easy' },
    { pattern: /difficulty\s*:\s*moderate\b/, label: '🛠️ Difficulty: Moderate' },
    { pattern: /difficulty\s*:\s*hard\b/, label: '🔥 Difficulty: Hard' },
    { pattern: /difficulty\s*:\s*very\s*hard\b/, label: '🧠 Difficulty: Very Hard' },
    { pattern: /difficulty\s*:\s*epic\b/, label: '⚫ Difficulty: Epic' },
  ];
  
  for (const { pattern, label } of difficultyPatterns) {
    if (pattern.test(combinedText)) {
      return label;
    }
  }
  
  return null;
}

/**
 * Detects priority level from issue content
 */
export function detectPriority(content: IssueContent): string | null {
  const combinedText = `${content.title} ${content.body}`.toLowerCase();
  
  const priorityPatterns = [
    { pattern: /priority\s*:\s*critical\b/, label: '🚨 Priority: Critical' },
    { pattern: /priority\s*:\s*high\b/, label: '🚨 Priority: High' },
    { pattern: /priority\s*:\s*medium\b/, label: '🚨 Priority: Medium' },
    { pattern: /priority\s*:\s*low\b/, label: '🚨 Priority: Low' },
  ];
  
  for (const { pattern, label } of priorityPatterns) {
    if (pattern.test(combinedText)) {
      return label;
    }
  }
  
  return null;
}

/**
 * Detects development area from issue content
 */
export function detectDevelopmentArea(content: IssueContent): string[] {
  const combinedText = `${content.title} ${content.body}`.toLowerCase();
  const areas: string[] = [];
  
  // Frontend/Client Side
  if (/(ui|ux|frontend|front-end|client\s*side|react|vue|angular|component|button|form|layout|design|styling|css|html|javascript|js)/.test(combinedText)) {
    areas.push('🎨 Client Side');
  }
  
  // Backend
  if (/(api|backend|back-end|server|database|db|sql|nosql|authentication|auth|middleware|controller|service|model)/.test(combinedText)) {
    areas.push('🖥️ Backend');
  }
  
  // Cloud Infrastructure
  if (/(aws|ec2|s3|rds|lambda|cloud|infrastructure|deployment|terraform|kubernetes|docker|container)/.test(combinedText)) {
    areas.push('☁️ Cloud Infrastructure');
  }
  
  // DevOps
  if (/(ci|cd|pipeline|automation|deploy|devops|jenkins|github\s*actions|docker|kubernetes|monitoring|logging)/.test(combinedText)) {
    areas.push('⚙️ DevOps');
  }
  
  return areas;
}

/**
 * Detects testing type from issue content
 */
export function detectTestingType(content: IssueContent): string | null {
  const combinedText = `${content.title} ${content.body}`.toLowerCase();
  
  if (/(unit\s*test|unit)/.test(combinedText)) {
    return '🔬 Testing: Unit';
  }
  
  if (/(integration\s*test|integration)/.test(combinedText)) {
    return '🧩 Testing: Integration';
  }
  
  if (/(e2e|end\s*to\s*end|end-to-end)/.test(combinedText)) {
    return '🌐 Testing: End-to-End';
  }
  
  if (/(test|testing|qa|quality|automation)/.test(combinedText)) {
    return '🔬 QA/Automation';
  }
  
  return null;
}

/**
 * Detects platform-specific labels from issue content
 */
export function detectPlatform(content: IssueContent): string[] {
  const combinedText = `${content.title} ${content.body}`.toLowerCase();
  const platforms: string[] = [];
  
  if (/(ios|iphone|ipad|swift|objective-c|app\s*store|testflight)/.test(combinedText)) {
    platforms.push('🍎 Platform-Specific: iOS');
  }
  
  if (/(android|kotlin|java|google\s*play|play\s*store)/.test(combinedText)) {
    platforms.push('🤖 Platform-Specific: Android');
  }
  
  return platforms;
}

/**
 * Detects issue type (bug, feature, etc.) from content
 */
export function detectIssueType(content: IssueContent): string[] {
  const combinedText = `${content.title} ${content.body}`.toLowerCase();
  const types: string[] = [];
  
  if (/(bug|error|crash|broken|fix|issue|problem|fails|doesn't\s*work)/.test(combinedText)) {
    types.push('🪲 Bug');
  }
  
  if (/(feature|enhancement|improvement|new|add|implement)/.test(combinedText)) {
    types.push('✨ Feature');
  }
  
  if (/(performance|slow|speed|optimization|optimize|fast|latency|response\s*time)/.test(combinedText)) {
    types.push('🚀 Performance');
  }
  
  if (/(technical\s*debt|refactor|cleanup|legacy|old\s*code|deprecated)/.test(combinedText)) {
    types.push('📉 Technical Debt');
  }
  
  if (/(documentation|docs|readme|wiki|guide|tutorial|manual)/.test(combinedText)) {
    if (/(create|write)\s+(new|a\s+new)/.test(combinedText)) {
      types.push('📝 Documentation: New');
    } else {
      types.push('📚 Documentation: Updates');
    }
  }
  
  return types;
}

/**
 * Main function to detect all labels from issue content
 */
export function detectLabels(content: IssueContent): LabelDetectionResult {
  const labels: string[] = [];
  
  // Detect various label types
  const storyPoints = detectStoryPoints(content);
  if (storyPoints) labels.push(storyPoints);
  
  const difficulty = detectDifficulty(content);
  if (difficulty) labels.push(difficulty);
  
  const priority = detectPriority(content);
  if (priority) labels.push(priority);
  
  const developmentAreas = detectDevelopmentArea(content);
  labels.push(...developmentAreas);
  
  const testingType = detectTestingType(content);
  if (testingType) labels.push(testingType);
  
  const platforms = detectPlatform(content);
  labels.push(...platforms);
  
  const issueTypes = detectIssueType(content);
  labels.push(...issueTypes);
  
  // Remove duplicates
  const uniqueLabels = [...new Set(labels)];
  
  // Calculate confidence based on number of detected labels
  const confidence = Math.min(uniqueLabels.length / 10, 1.0);
  
  return {
    labels: uniqueLabels,
    confidence,
  };
}

/**
 * Validates label format
 */
export function validateLabel(name: string, color: string, description: string): boolean {
  // Check if name is not empty
  if (!name || name.trim().length === 0) {
    return false;
  }
  
  // Check if color is valid hex (6 digits)
  if (!/^[0-9a-fA-F]{6}$/.test(color)) {
    return false;
  }
  
  // Check if description is not too long (GitHub limit is 100 characters)
  if (description.length > 100) {
    return false;
  }
  
  return true;
} 