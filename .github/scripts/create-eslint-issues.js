#!/usr/bin/env node

/**
 * Script: create-eslint-issues.js
 * Purpose: Automatically creates GitHub issues from ESLint report
 * Usage: Called by GitHub Actions workflow after ESLint execution
 * 
 * Environment Variables Required:
 * - GITHUB_TOKEN: GitHub Actions token for API access
 * - GITHUB_REPOSITORY: Repository in format "owner/repo"
 * - GITHUB_SHA: Full commit SHA
 * - GITHUB_REF_NAME: Branch name
 * - GITHUB_ACTOR: User who triggered the workflow
 * - GITHUB_RUN_ID: Workflow run ID for logs link
 */

const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');

// Initialize Octokit with GitHub token
const octokit = new Octokit({ 
  auth: process.env.GITHUB_TOKEN 
});

// Extract repository owner and name
const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
const commitHash = process.env.GITHUB_SHA?.substring(0, 7) || 'unknown';
const fullCommitHash = process.env.GITHUB_SHA || 'unknown';
const commitAuthor = process.env.GITHUB_ACTOR || 'unknown';
const branchName = process.env.GITHUB_REF_NAME || 'unknown';
const runId = process.env.GITHUB_RUN_ID || '';

/**
 * Main function to process ESLint report and create issues
 */
async function createIssuesFromEslint() {
  console.log('🔍 Reading ESLint report...');
  
  const reportPath = path.join(process.cwd(), 'frontend', 'eslint-report.json');
  
  if (!fs.existsSync(reportPath)) {
    console.log('⚠️  No ESLint report found. Skipping issue creation.');
    return;
  }
  
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  
  // Collect all issues from the report
  const issues = [];
  let totalErrors = 0;
  let totalWarnings = 0;
  
  report.forEach(file => {
    if (file.errorCount === 0 && file.warningCount === 0) return;
    
    totalErrors += file.errorCount;
    totalWarnings += file.warningCount;
    
    file.messages.forEach(msg => {
      issues.push({
        file: file.filePath,
        message: msg
      });
    });
  });
  
  console.log(`📊 Found ${totalErrors} errors and ${totalWarnings} warnings`);
  
  if (issues.length === 0) {
    console.log('✅ No linting issues found. Great job!');
    return;
  }
  
  // Get existing open issues to avoid duplicates
  console.log('🔎 Checking for existing issues...');
  const existingIssues = await getExistingLintIssues();
  
  // Create issues for each linting error
  let createdCount = 0;
  let skippedCount = 0;
  
  for (const issue of issues) {
    const isDuplicate = await isIssueDuplicate(issue, existingIssues);
    
    if (isDuplicate) {
      console.log(`⏭️  Skipping duplicate: ${issue.message.ruleId || 'syntax-error'} in ${getRelativePath(issue.file)}`);
      skippedCount++;
      continue;
    }
    
    await createGitHubIssue(issue);
    createdCount++;
    
    // Rate limit: wait 1 second between issue creations
    await sleep(1000);
  }
  
  console.log('\n📈 Summary:');
  console.log(`   ✅ Created: ${createdCount} issues`);
  console.log(`   ⏭️  Skipped: ${skippedCount} duplicates`);
  console.log(`   📊 Total: ${issues.length} linting violations`);
}

/**
 * Gets all existing open issues with 'eslint' label
 */
async function getExistingLintIssues() {
  try {
    const { data } = await octokit.issues.listForRepo({
      owner,
      repo,
      state: 'open',
      labels: 'eslint',
      per_page: 100
    });
    
    return data;
  } catch (error) {
    console.error(`⚠️  Error fetching existing issues: ${error.message}`);
    return [];
  }
}

/**
 * Checks if an issue already exists
 */
async function isIssueDuplicate(issue, existingIssues) {
  const expectedTitle = generateIssueTitle(issue);
  return existingIssues.some(existing => existing.title === expectedTitle);
}

/**
 * Generates the issue title
 */
function generateIssueTitle(issue) {
  const errorType = issue.message.ruleId || 'syntax-error';
  const relativePath = getRelativePath(issue.file);
  return `[LINT] ${errorType} in ${relativePath}`;
}

/**
 * Generates the issue body with the custom format
 */
function generateIssueBody(issue) {
  const msg = issue.message;
  const relativePath = getRelativePath(issue.file);
  const severity = msg.severity === 2 ? 'Error' : 'Warning';
  const ruleId = msg.ruleId || 'syntax-error';
  const ruleLink = msg.ruleId 
    ? `https://eslint.org/docs/latest/rules/${msg.ruleId}`
    : 'N/A';
  
  // Read source code context (3 lines before and after)
  const sourceContext = getSourceContext(issue.file, msg.line);
  
  const workflowLogsUrl = `https://github.com/${owner}/${repo}/actions/runs/${runId}`;
  
  return `## 🚨 ESLint Violation Detected

**File:** \`${relativePath}:${msg.line}\`  
**Rule:** [\`${ruleId}\`](${ruleLink})  
**Severity:** ${severity}

### 📝 Error Message
> ${msg.message}

### 🛠 Automated Context
- **Commit:** [\`${commitHash}\`](https://github.com/${owner}/${repo}/commit/${fullCommitHash})
- **Author:** @${commitAuthor}
- **Branch:** \`${branchName}\`
- **Workflow Run:** [View Logs](${workflowLogsUrl})

### 🔍 Code Context
\`\`\`typescript
// ${relativePath}:${msg.line}
${sourceContext}
\`\`\`

---
_This issue was automatically generated by the Frontend CI/CD workflow. Please fix the linting error and close this issue._`;
}

/**
 * Gets relative path from workspace root
 */
function getRelativePath(filePath) {
  const workspaceRoot = process.cwd();
  return filePath.replace(workspaceRoot + '/', '').replace(/^\//, '');
}

/**
 * Reads source code context around the error line
 */
function getSourceContext(filePath, lineNumber) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    const contextBefore = 2;
    const contextAfter = 2;
    const startLine = Math.max(0, lineNumber - contextBefore - 1);
    const endLine = Math.min(lines.length, lineNumber + contextAfter);
    
    const contextLines = [];
    for (let i = startLine; i < endLine; i++) {
      const lineNum = i + 1;
      const marker = lineNum === lineNumber ? '→ ' : '  ';
      contextLines.push(`${marker}${lineNum.toString().padStart(4)} | ${lines[i]}`);
    }
    
    return contextLines.join('\n');
  } catch (error) {
    return `Error reading file: ${error.message}`;
  }
}

/**
 * Creates a GitHub issue
 */
async function createGitHubIssue(issue) {
  const title = generateIssueTitle(issue);
  const body = generateIssueBody(issue);
  const severity = issue.message.severity === 2 ? 'high' : 'medium';
  
  const labels = [
    'eslint',
    'code-quality',
    `priority-${severity}`,
    issue.message.severity === 2 ? 'bug' : 'technical-debt'
  ];
  
  try {
    await octokit.issues.create({
      owner,
      repo,
      title,
      body,
      labels
    });
    
    console.log(`✅ Created: ${title}`);
  } catch (error) {
    console.error(`❌ Failed to create issue "${title}": ${error.message}`);
  }
}

/**
 * Sleep utility for rate limiting
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Execute the script
createIssuesFromEslint().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
