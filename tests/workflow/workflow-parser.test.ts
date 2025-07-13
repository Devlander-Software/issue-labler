import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'js-yaml';

describe('Workflow Parser Tests', () => {
  let workflowContent: string;
  let workflowYaml: any;

  beforeAll(async () => {
    // Read the actual workflow file
    const workflowPath = path.join(process.cwd(), '.github/workflows/auto-label-issues.yml');
    workflowContent = await fs.readFile(workflowPath, 'utf-8');
    workflowYaml = yaml.load(workflowContent) as any;
  });

  describe('Workflow Structure', () => {
    it('should have correct workflow name', () => {
      expect(workflowYaml.name).toBe('Setup Issue Templates and Labels');
    });

    it('should have correct triggers', () => {
      expect(workflowYaml.on).toBeDefined();
      expect(workflowYaml.on.issues).toBeDefined();
      expect(workflowYaml.on.pull_request).toBeDefined();
      expect(workflowYaml.on.repository_dispatch).toBeDefined();
      
      expect(workflowYaml.on.issues.types).toContain('opened');
      expect(workflowYaml.on.issues.types).toContain('edited');
      expect(workflowYaml.on.pull_request.types).toContain('opened');
      expect(workflowYaml.on.pull_request.types).toContain('edited');
      expect(workflowYaml.on.pull_request.types).toContain('synchronize');
    });

    it('should have required environment variables', () => {
      expect(workflowYaml.env).toBeDefined();
      expect(workflowYaml.env.CREATE_TEMPLATES).toBeDefined();
      expect(workflowYaml.env.CREATE_LABELS).toBeDefined();
      expect(workflowYaml.env.AUTO_LABEL_ISSUES).toBeDefined();
      expect(workflowYaml.env.RATE_LIMIT_DELAY).toBeDefined();
      expect(workflowYaml.env.MAX_RETRIES).toBeDefined();
    });

    it('should have all required jobs', () => {
      expect(workflowYaml.jobs).toBeDefined();
      expect(workflowYaml.jobs.create_issue_templates).toBeDefined();
      expect(workflowYaml.jobs.create_labels).toBeDefined();
      expect(workflowYaml.jobs['label-by-files']).toBeDefined();
      expect(workflowYaml.jobs.cleanup_labels).toBeDefined();
      expect(workflowYaml.jobs['label-issue']).toBeDefined();
    });
  });

  describe('Job Dependencies', () => {
    it('should have correct job dependencies', () => {
      const createLabelsJob = workflowYaml.jobs.create_labels;
      const labelByFilesJob = workflowYaml.jobs['label-by-files'];
      const cleanupLabelsJob = workflowYaml.jobs.cleanup_labels;
      const labelIssueJob = workflowYaml.jobs['label-issue'];

      expect(createLabelsJob.needs).toContain('create_issue_templates');
      expect(labelByFilesJob.needs).toContain('create_labels');
      expect(cleanupLabelsJob.needs).toContain('create_labels');
      expect(labelIssueJob.needs).toContain('create_labels');
    });
  });

  describe('Job Conditions', () => {
    it('should have correct conditional logic', () => {
      const createTemplatesJob = workflowYaml.jobs.create_issue_templates;
      const createLabelsJob = workflowYaml.jobs.create_labels;
      const labelByFilesJob = workflowYaml.jobs['label-by-files'];
      const labelIssueJob = workflowYaml.jobs['label-issue'];

      expect(createTemplatesJob.if).toContain('vars.CREATE_TEMPLATES != \'false\'');
      expect(createLabelsJob.if).toContain('vars.CREATE_LABELS != \'false\'');
      expect(labelByFilesJob.if).toContain('vars.AUTO_LABEL_ISSUES != \'false\'');
      expect(labelByFilesJob.if).toContain('github.event_name == \'pull_request\'');
      expect(labelIssueJob.if).toContain('vars.AUTO_LABEL_ISSUES != \'false\'');
      expect(labelIssueJob.if).toContain('github.event_name == \'issues\'');
    });
  });

  describe('Template Creation Job', () => {
    it('should create feature request template correctly', () => {
      const job = workflowYaml.jobs.create_issue_templates;
      const steps = job.steps;

      // Find the feature request template step
      const featureStep = steps.find((step: any) => 
        step.name === 'Create feature_request.md template'
      );

      expect(featureStep).toBeDefined();
      expect(featureStep.run).toContain('feature_request.md');
      expect(featureStep.run).toContain('✨ Feature Request');
      expect(featureStep.run).toContain('Story Points: 1');
      expect(featureStep.run).toContain('Difficulty: Simple');
      expect(featureStep.run).toContain('Priority: Critical');
    });

    it('should create bug report template correctly', () => {
      const job = workflowYaml.jobs.create_issue_templates;
      const steps = job.steps;

      const bugStep = steps.find((step: any) => 
        step.name === 'Create general_bug_report.md template'
      );

      expect(bugStep).toBeDefined();
      expect(bugStep.run).toContain('general_bug_report.md');
      expect(bugStep.run).toContain('🪲 Bug Report');
      expect(bugStep.run).toContain('Story Points: 1');
      expect(bugStep.run).toContain('🎨 Client Side');
      expect(bugStep.run).toContain('🍎 Platform-Specific: iOS');
    });

    it('should create performance bug template correctly', () => {
      const job = workflowYaml.jobs.create_issue_templates;
      const steps = job.steps;

      const perfStep = steps.find((step: any) => 
        step.name === 'Create performance_bug.md template'
      );

      expect(perfStep).toBeDefined();
      expect(perfStep.run).toContain('performance_bug.md');
      expect(perfStep.run).toContain('🚀 Performance Issue');
      expect(perfStep.run).toContain('Story Points: 1');
      expect(perfStep.run).toContain('🍎 Platform-Specific: iOS');
      expect(perfStep.run).toContain('🤖 Platform-Specific: Android');
    });
  });

  describe('Label Creation Job', () => {
    it('should have correct label creation logic', () => {
      const job = workflowYaml.jobs.create_labels;
      const steps = job.steps;

      const labelStep = steps.find((step: any) => 
        step.name === 'Create GitHub labels'
      );

      expect(labelStep).toBeDefined();
      expect(labelStep.run).toContain('Story Points: 1');
      expect(labelStep.run).toContain('Story Points: 2-3');
      expect(labelStep.run).toContain('Story Points: 5');
      expect(labelStep.run).toContain('Story Points: 8');
      expect(labelStep.run).toContain('Story Points: 13');
      expect(labelStep.run).toContain('Story Points: 20+');
      expect(labelStep.run).toContain('Difficulty: Simple');
      expect(labelStep.run).toContain('Difficulty: Easy');
      expect(labelStep.run).toContain('Difficulty: Moderate');
      expect(labelStep.run).toContain('Difficulty: Hard');
      expect(labelStep.run).toContain('Difficulty: Very Hard');
      expect(labelStep.run).toContain('Difficulty: Epic');
      expect(labelStep.run).toContain('Priority: Critical');
      expect(labelStep.run).toContain('Priority: High');
      expect(labelStep.run).toContain('Priority: Medium');
      expect(labelStep.run).toContain('Priority: Low');
      expect(labelStep.run).toContain('🎨 Client Side');
      expect(labelStep.run).toContain('🖥️ Backend');
      expect(labelStep.run).toContain('🍎 Platform-Specific: iOS');
      expect(labelStep.run).toContain('🤖 Platform-Specific: Android');
    });

    it('should have rate limiting and retry logic', () => {
      const job = workflowYaml.jobs.create_labels;
      const steps = job.steps;

      const labelStep = steps.find((step: any) => 
        step.name === 'Create GitHub labels'
      );

      expect(labelStep.run).toContain('check_rate_limit');
      expect(labelStep.run).toContain('retry_with_backoff');
      expect(labelStep.run).toContain('validate_label');
      expect(labelStep.run).toContain('sleep 0.5');
    });
  });

  describe('File-based Labeling Job', () => {
    it('should detect programming languages correctly', () => {
      const job = workflowYaml.jobs['label-by-files'];
      const steps = job.steps;

      const labelStep = steps.find((step: any) => 
        step.name === 'Label by file changes'
      );

      expect(labelStep.run).toContain('\\.js$');
      expect(labelStep.run).toContain('\\.jsx$');
      expect(labelStep.run).toContain('\\.ts$');
      expect(labelStep.run).toContain('\\.tsx$');
      expect(labelStep.run).toContain('\\.py$');
      expect(labelStep.run).toContain('\\.java$');
      expect(labelStep.run).toContain('\\.swift$');
      expect(labelStep.run).toContain('\\.kt$');
      expect(labelStep.run).toContain('\\.go$');
      expect(labelStep.run).toContain('\\.rs$');
      expect(labelStep.run).toContain('\\.php$');
      expect(labelStep.run).toContain('\\.rb$');
      expect(labelStep.run).toContain('\\.cs$');
    });

    it('should detect platform-specific files', () => {
      const job = workflowYaml.jobs['label-by-files'];
      const steps = job.steps;

      const labelStep = steps.find((step: any) => 
        step.name === 'Label by file changes'
      );

      expect(labelStep.run).toContain('ios');
      expect(labelStep.run).toContain('iPhone');
      expect(labelStep.run).toContain('iPad');
      expect(labelStep.run).toContain('android');
      expect(labelStep.run).toContain('\\.ipa$');
      expect(labelStep.run).toContain('\\.apk$');
      expect(labelStep.run).toContain('\\.aab$');
    });

    it('should detect infrastructure and DevOps files', () => {
      const job = workflowYaml.jobs['label-by-files'];
      const steps = job.steps;

      const labelStep = steps.find((step: any) => 
        step.name === 'Label by file changes'
      );

      expect(labelStep.run).toContain('docker');
      expect(labelStep.run).toContain('Dockerfile');
      expect(labelStep.run).toContain('terraform');
      expect(labelStep.run).toContain('\\.tf$');
      expect(labelStep.run).toContain('kubernetes');
      expect(labelStep.run).toContain('k8s');
      expect(labelStep.run).toContain('\\.yaml');
      expect(labelStep.run).toContain('\\.yml');
      expect(labelStep.run).toContain('\\.github/workflows');
    });
  });

  describe('Issue Labeling Job', () => {
    it('should detect story points from checkboxes', () => {
      const job = workflowYaml.jobs['label-issue'];
      const steps = job.steps;

      const labelStep = steps.find((step: any) => 
        step.name === 'Parse and apply labels based on issue content'
      );

      expect(labelStep.run).toContain('Story Points: 1');
      expect(labelStep.run).toContain('Story Points: 2-3');
      expect(labelStep.run).toContain('Story Points: 5');
      expect(labelStep.run).toContain('Story Points: 8');
      expect(labelStep.run).toContain('Story Points: 13');
      expect(labelStep.run).toContain('Story Points: 20+');
    });

    it('should detect difficulty levels from checkboxes', () => {
      const job = workflowYaml.jobs['label-issue'];
      const steps = job.steps;

      const labelStep = steps.find((step: any) => 
        step.name === 'Parse and apply labels based on issue content'
      );

      expect(labelStep.run).toContain('Difficulty: Simple');
      expect(labelStep.run).toContain('Difficulty: Easy');
      expect(labelStep.run).toContain('Difficulty: Moderate');
      expect(labelStep.run).toContain('Difficulty: Hard');
      expect(labelStep.run).toContain('Difficulty: Very Hard');
      expect(labelStep.run).toContain('Difficulty: Epic');
    });

    it('should detect priority levels from checkboxes', () => {
      const job = workflowYaml.jobs['label-issue'];
      const steps = job.steps;

      const labelStep = steps.find((step: any) => 
        step.name === 'Parse and apply labels based on issue content'
      );

      expect(labelStep.run).toContain('Priority: Critical');
      expect(labelStep.run).toContain('Priority: High');
      expect(labelStep.run).toContain('Priority: Medium');
      expect(labelStep.run).toContain('Priority: Low');
    });

    it('should detect development areas from checkboxes', () => {
      const job = workflowYaml.jobs['label-issue'];
      const steps = job.steps;

      const labelStep = steps.find((step: any) => 
        step.name === 'Parse and apply labels based on issue content'
      );

      expect(labelStep.run).toContain('🎨 Client Side');
      expect(labelStep.run).toContain('🖥️ Backend');
      expect(labelStep.run).toContain('☁️ Cloud Infrastructure');
      expect(labelStep.run).toContain('⚙️ DevOps');
      expect(labelStep.run).toContain('👩‍💻 Component/UI');
      expect(labelStep.run).toContain('🧠 Logic/Functions');
    });

    it('should detect platform-specific areas from checkboxes', () => {
      const job = workflowYaml.jobs['label-issue'];
      const steps = job.steps;

      const labelStep = steps.find((step: any) => 
        step.name === 'Parse and apply labels based on issue content'
      );

      expect(labelStep.run).toContain('🍎 Platform-Specific: iOS');
      expect(labelStep.run).toContain('🤖 Platform-Specific: Android');
    });

    it('should detect testing types from checkboxes', () => {
      const job = workflowYaml.jobs['label-issue'];
      const steps = job.steps;

      const labelStep = steps.find((step: any) => 
        step.name === 'Parse and apply labels based on issue content'
      );

      expect(labelStep.run).toContain('🔬 Testing: Unit');
      expect(labelStep.run).toContain('🧩 Testing: Integration');
      expect(labelStep.run).toContain('🌐 Testing: End-to-End');
    });
  });

  describe('Error Handling', () => {
    it('should handle errors gracefully in label creation', () => {
      const job = workflowYaml.jobs.create_labels;
      const steps = job.steps;

      const labelStep = steps.find((step: any) => 
        step.name === 'Create GitHub labels'
      );

      expect(labelStep.run).toContain('set -e');
      expect(labelStep.run).toContain('error_count');
      expect(labelStep.run).toContain('exit 1');
    });

    it('should have proper environment variable handling', () => {
      const job = workflowYaml.jobs.create_labels;
      const steps = job.steps;

      const labelStep = steps.find((step: any) => 
        step.name === 'Create GitHub labels'
      );

      expect(labelStep.env).toBeDefined();
      expect(labelStep.env.GITHUB_TOKEN).toBeDefined();
    });
  });
}); 