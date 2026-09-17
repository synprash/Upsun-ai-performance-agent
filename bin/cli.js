#!/usr/bin/env node
/**
 * Solvay AI Performance Agent CLI (Node.js)
 */

import { loadConfig } from '../lib/config.js';
import { BlackfireCollector } from '../lib/blackfireCollector.js';
import { UpsunLogAnalyzer } from '../lib/upsunLogAnalyzer.js';
import { TrafficCorrelator } from '../lib/trafficCorrelator.js';
import { DrupalCodeInspector } from '../lib/drupalCodeInspector.js';
import { RecommendationEngine } from '../lib/recommendationEngine.js';
import { Notifier } from '../lib/notifier.js';

export async function runPipeline({ configPath = null, logFile = null, siteFilter = null, notify = true } = {}) {
  console.log('='.repeat(75));
  console.log(' 🚀 Solvay AI Performance Agent (Node.js) - Blackfire & Traffic Optimizer');
  console.log('='.repeat(75));

  const config = loadConfig(configPath);

  // 1. Blackfire
  console.log('\n[1/5] 📡 Fetching Blackfire APM Profiles & Build Assertions...');
  const bf = new BlackfireCollector(config.blackfire);
  const builds = await bf.fetchRecentBuilds();
  const profiles = await bf.fetchTransactionProfiles();
  console.log(`      ✔ Retrieved ${builds.length} build runs and ${profiles.length} transaction profiles.`);

  // 2. Upsun Log Analyzer
  console.log('\n[2/5] 🌐 Analyzing Upsun Router Access Logs & Traffic Movement...');
  const analyzer = new UpsunLogAnalyzer(logFile || config.upsun.accessLogPath);
  const trafficData = await analyzer.analyzeLogs();
  const totalReqs = Object.values(trafficData.sites || {}).reduce((acc, s) => acc + (s.total_requests || 0), 0);
  console.log(`      ✔ Processed ${totalReqs.toLocaleString()} requests across ${Object.keys(trafficData.sites || {}).length} multisites.`);

  // 3. Traffic Correlator
  console.log('\n[3/5] 🧠 Correlating Traffic Movement with Latency & Resource Traces...');
  const correlator = new TrafficCorrelator({
    latencyThresholdMs: config.thresholds.p95LatencyMs,
    maxSqlBudget: config.thresholds.maxSqlQueries
  });
  const correlated = correlator.correlate(trafficData, profiles, builds);
  let bottlenecks = correlated.ranked_bottlenecks || [];
  if (siteFilter) {
    bottlenecks = bottlenecks.filter(b => b.site_name === siteFilter);
    correlated.ranked_bottlenecks = bottlenecks;
    console.log(`      ℹ Filtered for site \`${siteFilter}\`: ${bottlenecks.length} bottlenecks.`);
  } else {
    console.log(`      ✔ Identified ${bottlenecks.length} high-impact performance bottlenecks.`);
  }

  // 4. Drupal Codebase Inspector
  console.log(`\n[4/5] 🔍 Inspecting Solvay Drupal Codebase (${config.drupalRoot})...`);
  const inspector = new DrupalCodeInspector(config.drupalRoot);
  const inspections = bottlenecks.map(b => inspector.inspectBottleneck(b));
  console.log(`      ✔ Analyzed call graphs and cache metadata for ${inspections.length} endpoints.`);

  // 5. Recommendations & Notifications
  console.log('\n[5/5] 💡 Synthesizing Code Improvements with AI Engine...');
  const engine = new RecommendationEngine(config.aiModel);
  if (engine.isGeminiEnabled) {
    console.log(`      ✨ Using Google Gemini 1.5 Pro AI model (${config.aiModel.modelName})`);
  } else {
    console.log('      ⚡ Using Built-in Deterministic Heuristic Engine (Gemini API key not set)');
  }
  const recommendations = await engine.generateRecommendations(correlated, inspections);

  const notifier = new Notifier({
    reportsDir: config.notifications.reportsDirectory,
    slackWebhookUrl: config.notifications.slackWebhookUrl,
    teamsWebhookUrl: config.notifications.teamsWebhookUrl
  });

  const reportPath = notifier.generateMarkdownReport(correlated, recommendations);
  console.log(`      📄 Markdown Report Generated: ${reportPath}`);

  if (notify) {
    if (config.notifications.slackWebhookUrl) {
      const ok = await notifier.sendSlackNotification(correlated, recommendations);
      if (ok) console.log('      💬 Slack alert delivered successfully.');
    }
    if (config.notifications.teamsWebhookUrl) {
      const ok = await notifier.sendTeamsNotification(correlated, recommendations);
      if (ok) console.log('      💬 Teams notification delivered successfully.');
    }
  }

  console.log('\n' + '='.repeat(75));
  console.log(` ✅ Daily Performance Analysis Completed! Generated ${recommendations.length} recommendations.`);
  console.log('='.repeat(75));
  for (const rec of recommendations) {
    console.log(`\n  [${rec.priority}] ${rec.title} (${rec.site})`);
    console.log(`  • Path: ${rec.path} | Impact Score: ${rec.impact_score}`);
    console.log(`  • Engine: ${rec.model_used || config.aiModel.modelName}`);
    console.log(`  • ${rec.metrics_summary}`);
  }
  console.log('\n');

  return { correlated, recommendations, reportPath };
}

function mask(str, visibleChars = 4) {
  if (!str) return '❌ Not Set';
  if (str.length <= visibleChars * 2) return '✔ [CONFIGURED]';
  return `✔ ${str.slice(0, visibleChars)}...${str.slice(-visibleChars)}`;
}

export function checkKeys() {
  const config = loadConfig();
  console.log('\n' + '='.repeat(70));
  console.log(' 🔑 Solvay AI Performance Agent - Environment & API Key Status');
  console.log('='.repeat(70));

  console.log('\n1. 🧠 Google Gemini 1.5 Pro AI:');
  console.log(`   • Model Name:     ${config.aiModel.modelName}`);
  console.log(`   • GEMINI_API_KEY: ${mask(config.aiModel.apiKey)}`);
  if (!config.aiModel.apiKey) {
    console.log('     👉 Tip: Get a free API key at https://aistudio.google.com/app/apikey and paste it into .env');
  }

  console.log('\n2. 📡 Blackfire.io APM:');
  console.log(`   • BLACKFIRE_CLIENT_ID:        ${mask(config.blackfire.clientId)}`);
  console.log(`   • BLACKFIRE_CLIENT_TOKEN:     ${mask(config.blackfire.clientToken)}`);
  console.log(`   • BLACKFIRE_ENVIRONMENT_UUID: ${mask(config.blackfire.envUuid)}`);

  console.log('\n3. 🌐 Upsun PaaS:');
  console.log(`   • UPSUN_PROJECT_ID:           ${mask(config.upsun.projectId)}`);
  console.log(`   • Environment:                ${config.upsun.environment}`);

  console.log('\n4. 💬 Notification Webhooks:');
  console.log(`   • SLACK_WEBHOOK_URL:          ${mask(config.notifications.slackWebhookUrl)}`);
  console.log(`   • TEAMS_WEBHOOK_URL:          ${mask(config.notifications.teamsWebhookUrl)}`);

  console.log('\n' + '='.repeat(70));
  console.log(' 📝 Keys are loaded automatically from:');
  console.log('    • solvay-ai-performance-agent/.env');
  console.log('    • Environment variables (export GEMINI_API_KEY=...)');
  console.log('    • config.json');
  console.log('=' .repeat(70) + '\n');
}

// Direct execution from CLI
const args = process.argv.slice(2);
const command = args[0] || 'demo';

if (import.meta.url === `file://${process.argv[1]}`) {
  if (command === 'analyze' || command === 'demo') {
    const siteIdx = args.indexOf('--site');
    const siteFilter = siteIdx !== -1 ? args[siteIdx + 1] : null;
    const noNotify = args.includes('--no-notify');
    await runPipeline({ siteFilter, notify: !noNotify });
  } else if (command === 'check-keys' || command === 'status') {
    checkKeys();
  } else if (command === 'test-notify') {
    const config = loadConfig();
    const notifier = new Notifier({
      reportsDir: config.notifications.reportsDirectory,
      slackWebhookUrl: config.notifications.slackWebhookUrl,
      teamsWebhookUrl: config.notifications.teamsWebhookUrl
    });
    console.log('Testing Slack & Teams webhooks...');
    const sOk = await notifier.sendSlackNotification({}, [{ title: 'Test Node.js Notification' }]);
    console.log(`Slack status: ${sOk ? 'SUCCESS' : 'SKIPPED/FAILED'}`);
  } else {
    console.log('Usage: node bin/cli.js [demo|analyze|check-keys|test-notify] [--site <site_name>] [--no-notify]');
  }
}
