/**
 * Notification & Markdown Reporter (Node.js)
 */

import fs from 'node:fs';
import path from 'node:path';

export class Notifier {
  constructor({ reportsDir, slackWebhookUrl = '', teamsWebhookUrl = '' }) {
    this.reportsDir = path.resolve(reportsDir);
    this.slackWebhookUrl = slackWebhookUrl;
    this.teamsWebhookUrl = teamsWebhookUrl;
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  generateMarkdownReport(correlatedData, recommendations, customFilename = null) {
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = customFilename || `daily-performance-report-node-${dateStr}.md`;
    const fullPath = path.join(this.reportsDir, filename);

    const lines = [
      `# 🚀 Solvay Multisite Daily Performance & Traffic Report (${dateStr}) [Node.js Agent]`,
      '',
      '> **Environment**: Upsun PaaS | **APM**: Blackfire.io | **Target**: `solvay-solvay_platform`',
      '',
      '## 📊 1. Traffic & APM Multisite Executive Summary',
      '',
      '| Multisite | Domain | 24h Requests | Trend | p95 Latency | Cache Hit Rate | Status |',
      '| :--- | :--- | :---: | :---: | :---: | :---: | :---: |'
    ];

    for (const [siteName, sInfo] of Object.entries(correlatedData.site_summaries || {})) {
      const p95 = sInfo.p95_latency_ms || 0;
      const statusIcon = p95 < 800 ? '🟢 Healthy' : (p95 < 1200 ? '🟡 Warning' : '🔴 Critical');
      lines.push(
        `| \`${siteName}\` | ${sInfo.domain} | ${sInfo.total_requests.toLocaleString()} | ${sInfo.traffic_trend} | **${p95}ms** | ${sInfo.cache_hit_ratio}% | ${statusIcon} |`
      );
    }

    lines.push(
      '',
      '---',
      '',
      '## 💡 2. Prioritized Recommendations & Code Fixes',
      ''
    );

    for (const rec of recommendations) {
      const badge = rec.priority === 'CRITICAL' ? '🔴 CRITICAL' : '🟡 HIGH';
      lines.push(
        `### ${badge}: ${rec.title} (\`${rec.site}\`)`,
        `**Endpoint**: \`${rec.domain}${rec.path}\` | **Impact Score**: \`${rec.impact_score}\``,
        `> **Metrics**: ${rec.metrics_summary}`,
        '',
        `#### 🔎 Root Cause Analysis`,
        rec.root_cause,
        '',
        `#### 🛠️ Recommended Action`,
        rec.recommendation_summary,
        '',
        `#### 📝 Suggested Code Diff`,
        rec.code_diff,
        '',
        '---',
        ''
      );
    }

    fs.writeFileSync(fullPath, lines.join('\n'), 'utf8');
    return fullPath;
  }

  async sendSlackNotification(correlatedData, recommendations) {
    if (!this.slackWebhookUrl || !this.slackWebhookUrl.startsWith('http')) return false;
    const dateStr = new Date().toISOString().split('T')[0];
    const payload = {
      text: `🚀 Solvay Daily Performance Digest (${dateStr}): ${recommendations.length} optimization opportunities found.`
    };
    try {
      const res = await fetch(this.slackWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return res.ok;
    } catch (_) {
      return false;
    }
  }

  async sendTeamsNotification(correlatedData, recommendations) {
    if (!this.teamsWebhookUrl || !this.teamsWebhookUrl.startsWith('http')) return false;
    const dateStr = new Date().toISOString().split('T')[0];
    const payload = {
      '@type': 'MessageCard',
      'summary': `Solvay Daily Performance Report - ${dateStr}`,
      'title': `🚀 Solvay Daily Performance Report (${dateStr})`,
      'text': `Found ${recommendations.length} performance optimization recommendations.`
    };
    try {
      const res = await fetch(this.teamsWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return res.ok;
    } catch (_) {
      return false;
    }
  }
}
