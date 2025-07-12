/**
 * TypeScript definitions for GitHub Auto-Label Issues & Templates Action
 * @package @devlander-software/issue-labler
 */

export interface ActionInputs {
  /** GitHub token for authentication. Use ${{ secrets.GITHUB_TOKEN }} for most cases. */
  github_token: string;
  
  /** Whether to create issue templates (true/false) */
  create_templates?: boolean;
  
  /** Whether to create labels (true/false) */
  create_labels?: boolean;
  
  /** Whether to auto-label issues based on content (true/false) */
  auto_label_issues?: boolean;
  
  /** Delay between API calls to avoid rate limits (in seconds) */
  rate_limit_delay?: number;
  
  /** Maximum number of retries for failed operations */
  max_retries?: number;
}

export interface ActionOutputs {
  /** Number of templates created */
  templates_created: number;
  
  /** Number of labels created */
  labels_created: number;
  
  /** Number of issues auto-labeled */
  issues_labeled: number;
  
  /** Whether the action completed successfully */
  success: boolean;
  
  /** Any error messages encountered */
  errors: string[];
}

export interface LabelDefinition {
  /** Label name */
  name: string;
  
  /** Label color (hex code) */
  color: string;
  
  /** Label description */
  description: string;
  
  /** Category the label belongs to */
  category: 'story-points' | 'difficulty' | 'priority' | 'platform' | 'type' | 'language' | 'infrastructure' | 'testing' | 'documentation';
}

export interface StoryPointLabel extends LabelDefinition {
  category: 'story-points';
  /** Estimated hours for this story point */
  hours: number;
}

export interface DifficultyLabel extends LabelDefinition {
  category: 'difficulty';
  /** Difficulty level */
  level: 'simple' | 'easy' | 'moderate' | 'hard' | 'very-hard' | 'epic';
}

export interface PriorityLabel extends LabelDefinition {
  category: 'priority';
  /** Priority level */
  level: 'critical' | 'high' | 'medium' | 'low';
}

export interface PlatformLabel extends LabelDefinition {
  category: 'platform';
  /** Platform type */
  platform: 'ios' | 'android' | 'web' | 'desktop' | 'cross-platform';
}

export interface LanguageLabel extends LabelDefinition {
  category: 'language';
  /** Programming language */
  language: string;
  /** File extensions associated with this language */
  extensions: string[];
}

export interface FileTypeMapping {
  /** File extension or pattern */
  pattern: string;
  
  /** Associated labels */
  labels: string[];
  
  /** Category */
  category: 'language' | 'platform' | 'infrastructure' | 'testing' | 'documentation';
}

export interface IssueTemplate {
  /** Template name */
  name: string;
  
  /** Template filename */
  filename: string;
  
  /** Template content */
  content: string;
  
  /** Default labels for this template */
  default_labels: string[];
  
  /** Template type */
  type: 'feature' | 'bug' | 'performance' | 'documentation' | 'custom';
}

export interface AutoLabelRule {
  /** Rule name */
  name: string;
  
  /** Keywords to match */
  keywords: string[];
  
  /** Labels to apply when keywords are found */
  labels: string[];
  
  /** Whether to match in title, body, or both */
  match_in: 'title' | 'body' | 'both';
  
  /** Case sensitivity */
  case_sensitive?: boolean;
  
  /** Regular expression pattern (alternative to keywords) */
  regex?: string;
}

export interface ConfigFile {
  /** Action configuration */
  action: {
    /** Default inputs */
    inputs: Partial<ActionInputs>;
    
    /** Auto-label rules */
    auto_label_rules: AutoLabelRule[];
    
    /** File type mappings */
    file_type_mappings: FileTypeMapping[];
  };
  
  /** Labels configuration */
  labels: {
    /** Story point labels */
    story_points: StoryPointLabel[];
    
    /** Difficulty labels */
    difficulty: DifficultyLabel[];
    
    /** Priority labels */
    priority: PriorityLabel[];
    
    /** Platform labels */
    platforms: PlatformLabel[];
    
    /** Language labels */
    languages: LanguageLabel[];
    
    /** Custom labels */
    custom: LabelDefinition[];
  };
  
  /** Templates configuration */
  templates: {
    /** Issue templates */
    issue_templates: IssueTemplate[];
    
    /** Template variables */
    variables: Record<string, string>;
  };
  
  /** Organization settings */
  organization?: {
    /** Default repository settings */
    default_repo_settings: Partial<ActionInputs>;
    
    /** Repository-specific overrides */
    repo_overrides: Record<string, Partial<ActionInputs>>;
  };
}

export interface GitHubContext {
  /** Repository owner */
  owner: string;
  
  /** Repository name */
  repo: string;
  
  /** Event name */
  eventName: string;
  
  /** Event payload */
  payload: any;
  
  /** SHA of the commit */
  sha: string;
  
  /** Ref (branch/tag) */
  ref: string;
  
  /** Workflow name */
  workflow: string;
  
  /** Job name */
  job: string;
  
  /** Run ID */
  runId: number;
  
  /** Run number */
  runNumber: number;
}

export interface IssueData {
  /** Issue number */
  number: number;
  
  /** Issue title */
  title: string;
  
  /** Issue body */
  body: string;
  
  /** Issue labels */
  labels: string[];
  
  /** Issue state */
  state: 'open' | 'closed';
  
  /** Issue author */
  author: string;
  
  /** Created date */
  created_at: string;
  
  /** Updated date */
  updated_at: string;
}

export interface PullRequestData extends IssueData {
  /** Changed files */
  changed_files: string[];
  
  /** Base branch */
  base: string;
  
  /** Head branch */
  head: string;
  
  /** Mergeable state */
  mergeable_state: 'clean' | 'unstable' | 'dirty' | 'blocked';
}

export interface LabelCreationResult {
  /** Label name */
  name: string;
  
  /** Whether creation was successful */
  success: boolean;
  
  /** Error message if failed */
  error?: string;
  
  /** HTTP status code */
  status_code?: number;
}

export interface TemplateCreationResult {
  /** Template filename */
  filename: string;
  
  /** Whether creation was successful */
  success: boolean;
  
  /** Error message if failed */
  error?: string;
}

export interface AutoLabelResult {
  /** Issue number */
  issue_number: number;
  
  /** Labels applied */
  labels_applied: string[];
  
  /** Labels removed */
  labels_removed: string[];
  
  /** Whether operation was successful */
  success: boolean;
  
  /** Error message if failed */
  error?: string;
}

export interface RateLimitInfo {
  /** Remaining API calls */
  remaining: number;
  
  /** Reset time (Unix timestamp) */
  reset: number;
  
  /** Used API calls */
  used: number;
  
  /** Limit */
  limit: number;
}

export interface ActionContext {
  /** GitHub context */
  github: GitHubContext;
  
  /** Action inputs */
  inputs: ActionInputs;
  
  /** Action outputs */
  outputs: ActionOutputs;
  
  /** Configuration */
  config: ConfigFile;
  
  /** Rate limit info */
  rateLimit: RateLimitInfo;
}

// Utility types
export type LabelCategory = LabelDefinition['category'];
export type StoryPointValue = 1 | 2 | 3 | 5 | 8 | 13 | 20;
export type DifficultyLevel = DifficultyLabel['level'];
export type PriorityLevel = PriorityLabel['level'];
export type PlatformType = PlatformLabel['platform'];

// Event types
export interface IssuesEvent {
  action: 'opened' | 'edited' | 'deleted' | 'transferred' | 'pinned' | 'unpinned' | 'closed' | 'reopened' | 'assigned' | 'unassigned' | 'labeled' | 'unlabeled' | 'locked' | 'unlocked' | 'milestoned' | 'demilestoned';
  issue: IssueData;
  repository: {
    owner: string;
    name: string;
    full_name: string;
  };
}

export interface PullRequestEvent {
  action: 'opened' | 'edited' | 'deleted' | 'transferred' | 'pinned' | 'unpinned' | 'closed' | 'reopened' | 'assigned' | 'unassigned' | 'labeled' | 'unlabeled' | 'locked' | 'unlocked' | 'ready_for_review' | 'review_requested' | 'review_request_removed' | 'synchronize';
  pull_request: PullRequestData;
  repository: {
    owner: string;
    name: string;
    full_name: string;
  };
}

// All types are exported above 