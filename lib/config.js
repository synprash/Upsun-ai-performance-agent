import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

/**
 * Lightweight .env parser to auto-load environment variables without third-party deps.
 */
function loadDotEnv() {
  const envPath = path.join(ROOT_DIR, '.env');
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (key && process.env[key] === undefined) {
        process.env[key] = val;
      }
    }
  }
}

// Auto-load .env on module evaluation
loadDotEnv();

function interpolateEnvVars(data) {
  if (typeof data === 'string') {
    return data.replace(/\$\{([A-Za-z0-9_]+)\}/g, (_, varName) => process.env[varName] || '');
  } else if (Array.isArray(data)) {
    return data.map(interpolateEnvVars);
  } else if (data !== null && typeof data === 'object') {
    const res = {};
    for (const [k, v] of Object.entries(data)) {
      res[k] = interpolateEnvVars(v);
    }
    return res;
  }
  return data;
}

export function loadConfig(configPath = null) {
  let targetPath = configPath;
  if (!targetPath) {
    const defaultPath = path.join(ROOT_DIR, 'config.json');
    const samplePath = path.join(ROOT_DIR, 'config.sample.json');
    if (fs.existsSync(defaultPath)) {
      targetPath = defaultPath;
    } else if (fs.existsSync(samplePath)) {
      targetPath = samplePath;
    }
  }

  let raw = {};
  if (targetPath && fs.existsSync(targetPath)) {
    const content = fs.readFileSync(targetPath, 'utf8');
    raw = interpolateEnvVars(JSON.parse(content));
  }

  const ai = raw.ai_model || {};
  const bf = raw.blackfire || {};
  const upsun = raw.upsun || {};
  const th = raw.thresholds || {};
  const nt = raw.notifications || {};

  return {
    projectName: raw.project_name || 'solvay-multisite',
    drupalRoot: path.resolve(raw.drupal_root || '/Users/prashantk/dev/solvay/solvay-solvay_platform'),
    aiModel: {
      provider: ai.provider || 'google-gemini',
      modelName: process.env.GEMINI_MODEL_NAME || ai.model_name || 'gemini-3.6-flash',
      apiKey: process.env.GEMINI_API_KEY || ai.api_key || '',
      temperature: ai.temperature !== undefined ? ai.temperature : 0.2
    },
    blackfire: {
      apiUrl: bf.api_url || 'https://blackfire.io/api/v1',
      clientId: process.env.BLACKFIRE_CLIENT_ID || bf.client_id || '',
      clientToken: process.env.BLACKFIRE_CLIENT_TOKEN || bf.client_token || '',
      envUuid: process.env.BLACKFIRE_ENVIRONMENT_UUID || bf.environment_uuid || ''
    },
    upsun: {
      projectId: process.env.UPSUN_PROJECT_ID || upsun.project_id || '',
      environment: upsun.environment || 'main',
      appName: upsun.app_name || 'drupal',
      accessLogPath: upsun.access_log_path || ''
    },
    multisites: raw.multisites || [
      { name: 'solvay_solvay', domain: 'solvay.solvay', profile: 'solvay_main', db_schema: 'solvay' },
      { name: 'solvay_brand', domain: 'brand.solvay', profile: 'solvay_brand', db_schema: 'solvaybrand' },
      { name: 'solvay_beeco', domain: 'beeco.solvay', profile: 'solvay_country', db_schema: 'beeco' },
      { name: 'solvay_bicarbonatoeco', domain: 'bicarbonato.solvay', profile: 'solvay_country_complex', db_schema: 'bicarbonatoit' },
      { name: 'solvay_peroxidoseco', domain: 'peroxidos.solvay', profile: 'solvay_country', db_schema: 'peroxidosecobr' }
    ],
    thresholds: {
      p95LatencyMs: th.p95_latency_ms || 800,
      p99LatencyMs: th.p99_latency_ms || 1500,
      maxSqlQueries: th.max_sql_queries_per_request || 75,
      maxSolrQueries: th.max_solr_queries_per_request || 10,
      maxMemoryMb: th.max_memory_mb || 128,
      minTrafficImpact: th.min_traffic_impact_threshold || 500
    },
    notifications: {
      slackWebhookUrl: process.env.SLACK_WEBHOOK_URL || nt.slack_webhook_url || '',
      teamsWebhookUrl: process.env.TEAMS_WEBHOOK_URL || nt.teams_webhook_url || '',
      saveMarkdownReport: nt.save_markdown_report !== false,
      reportsDirectory: path.resolve(ROOT_DIR, nt.reports_directory || 'reports')
    }
  };
}
