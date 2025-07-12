# TypeScript Definitions for GitHub Auto-Label Issues & Templates Action

This package provides comprehensive TypeScript type definitions for the [GitHub Auto-Label Issues & Templates Action](https://github.com/Devlander-Software/issue-labler).

## Installation

```bash
npm install @devlander-software/issue-labler
```

## Usage

```typescript
import type {
  ActionInputs,
  ActionOutputs,
  LabelDefinition,
  StoryPointLabel,
  DifficultyLabel,
  PriorityLabel,
  PlatformLabel,
  LanguageLabel,
  FileTypeMapping,
  IssueTemplate,
  AutoLabelRule,
  ConfigFile,
  GitHubContext,
  IssueData,
  PullRequestData,
  LabelCreationResult,
  TemplateCreationResult,
  AutoLabelResult,
  RateLimitInfo,
  ActionContext,
  IssuesEvent,
  PullRequestEvent
} from '@devlander-software/issue-labler';
```

## Type Definitions

### Core Action Types

#### `ActionInputs`
Defines the input parameters for the GitHub Action:

```typescript
interface ActionInputs {
  github_token: string;           // GitHub token for authentication
  create_templates?: boolean;     // Whether to create issue templates
  create_labels?: boolean;        // Whether to create labels
  auto_label_issues?: boolean;    // Whether to auto-label issues
  rate_limit_delay?: number;      // Delay between API calls (seconds)
  max_retries?: number;          // Maximum retries for failed operations
}
```

#### `ActionOutputs`
Defines the output values from the GitHub Action:

```typescript
interface ActionOutputs {
  templates_created: number;      // Number of templates created
  labels_created: number;         // Number of labels created
  issues_labeled: number;         // Number of issues auto-labeled
  success: boolean;               // Whether action completed successfully
  errors: string[];              // Any error messages encountered
}
```

### Label Types

#### `LabelDefinition`
Base interface for all labels:

```typescript
interface LabelDefinition {
  name: string;                   // Label name
  color: string;                  // Label color (hex code)
  description: string;            // Label description
  category: LabelCategory;        // Label category
}
```

#### Specialized Label Types

- `StoryPointLabel` - Labels for story point estimation
- `DifficultyLabel` - Labels for task difficulty levels
- `PriorityLabel` - Labels for issue priority
- `PlatformLabel` - Labels for platform-specific issues
- `LanguageLabel` - Labels for programming languages

### Configuration Types

#### `ConfigFile`
Complete configuration structure:

```typescript
interface ConfigFile {
  action: {
    inputs: Partial<ActionInputs>;
    auto_label_rules: AutoLabelRule[];
    file_type_mappings: FileTypeMapping[];
  };
  labels: {
    story_points: StoryPointLabel[];
    difficulty: DifficultyLabel[];
    priority: PriorityLabel[];
    platforms: PlatformLabel[];
    languages: LanguageLabel[];
    custom: LabelDefinition[];
  };
  templates: {
    issue_templates: IssueTemplate[];
    variables: Record<string, string>;
  };
  organization?: {
    default_repo_settings: Partial<ActionInputs>;
    repo_overrides: Record<string, Partial<ActionInputs>>;
  };
}
```

### Event Types

#### `IssuesEvent`
GitHub Issues webhook event:

```typescript
interface IssuesEvent {
  action: 'opened' | 'edited' | 'closed' | 'reopened' | /* ... */;
  issue: IssueData;
  repository: {
    owner: string;
    name: string;
    full_name: string;
  };
}
```

#### `PullRequestEvent`
GitHub Pull Request webhook event:

```typescript
interface PullRequestEvent {
  action: 'opened' | 'edited' | 'closed' | 'reopened' | /* ... */;
  pull_request: PullRequestData;
  repository: {
    owner: string;
    name: string;
    full_name: string;
  };
}
```

## Utility Types

```typescript
type LabelCategory = 'story-points' | 'difficulty' | 'priority' | 'platform' | 'type' | 'language' | 'infrastructure' | 'testing' | 'documentation';
type StoryPointValue = 1 | 2 | 3 | 5 | 8 | 13 | 20;
type DifficultyLevel = 'simple' | 'easy' | 'moderate' | 'hard' | 'very-hard' | 'epic';
type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';
type PlatformType = 'ios' | 'android' | 'web' | 'desktop' | 'cross-platform';
```

## Examples

### Creating a Configuration File

```typescript
import type { ConfigFile } from '@devlander-software/issue-labler';

const config: ConfigFile = {
  action: {
    inputs: {
      create_templates: true,
      create_labels: true,
      auto_label_issues: true,
      rate_limit_delay: 0.5,
      max_retries: 3
    },
    auto_label_rules: [
      {
        name: 'Bug Detection',
        keywords: ['bug', 'error', 'crash', 'fix'],
        labels: ['🪲 Bug'],
        match_in: 'both',
        case_sensitive: false
      }
    ],
    file_type_mappings: [
      {
        pattern: '*.ts',
        labels: ['🔷 TypeScript'],
        category: 'language'
      }
    ]
  },
  labels: {
    story_points: [
      {
        name: 'Story Points: 1',
        color: '0e8a16',
        description: '1-2 hours of work',
        category: 'story-points',
        hours: 1
      }
    ],
    difficulty: [
      {
        name: 'Difficulty: Easy',
        color: '0e8a16',
        description: 'Easy to implement',
        category: 'difficulty',
        level: 'easy'
      }
    ],
    priority: [],
    platforms: [],
    languages: [],
    custom: []
  },
  templates: {
    issue_templates: [],
    variables: {}
  }
};
```

### Handling GitHub Events

```typescript
import type { IssuesEvent, ActionInputs } from '@devlander-software/issue-labler';

function handleIssueEvent(event: IssuesEvent, inputs: ActionInputs) {
  if (event.action === 'opened') {
    console.log(`New issue opened: ${event.issue.title}`);
    
    // Auto-label based on content
    if (inputs.auto_label_issues) {
      const labels = detectLabels(event.issue.title, event.issue.body);
      applyLabels(event.issue.number, labels);
    }
  }
}
```

## Development

### Building Types

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see [LICENSE](../LICENSE) for details. 