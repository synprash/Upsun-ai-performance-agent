/**
 * Drupal Code Inspector (Node.js)
 */

import fs from 'node:fs';
import path from 'node:path';

export class DrupalCodeInspector {
  constructor(drupalRoot) {
    this.drupalRoot = path.resolve(drupalRoot);
  }

  findFile(relativeFilePath) {
    const fullPath = path.join(this.drupalRoot, relativeFilePath.replace(/^\/+/, ''));
    if (fs.existsSync(fullPath)) return fullPath;
    return null;
  }

  inspectBottleneck(bottleneck) {
    const codeFindings = [];
    for (const node of bottleneck.call_graph || []) {
      const fullPath = this.findFile(node.file);
      const finding = {
        caller: node.caller,
        file: node.file,
        absolute_path: fullPath || path.join(this.drupalRoot, node.file),
        line: node.line,
        code_snippet: '',
        anti_pattern: null
      };

      if (fullPath && fs.existsSync(fullPath)) {
        try {
          const lines = fs.readFileSync(fullPath, 'utf8').split('\n');
          const start = Math.max(0, node.line - 5);
          const end = Math.min(lines.length, node.line + 10);
          finding.code_snippet = lines.slice(start, end).join('\n');
        } catch (_) {}
      }

      const callee = node.callee || '';
      if (callee.includes('loadMultiple') && (node.call_count || 0) > 10) {
        finding.anti_pattern = 'N+1 Entity Loading inside loop without static or render cache';
      } else if (callee.includes('Solarium')) {
        finding.anti_pattern = 'Uncached Solr Query / Excessive result document payload';
      } else if (callee.includes('Paragraph::getFields')) {
        finding.anti_pattern = 'Un-cached Paragraph preprocessing during high-concurrency page load';
      } else if (node.caller.toLowerCase().includes('views') || callee.includes('ViewExecutable')) {
        finding.anti_pattern = 'View execution without tag-based or time-based query caching enabled';
      }

      codeFindings.push(finding);
    }

    return {
      path: bottleneck.path,
      site_name: bottleneck.site_name,
      code_findings: codeFindings,
      slow_queries_count: (bottleneck.slow_queries || []).length
    };
  }
}
