# 🚀 Solvay AI Performance Agent (Node.js)

An intelligent, traffic-aware Application Performance Monitoring (APM) and optimization agent built with **Node.js** for **Solvay's Drupal 11 Multisite Platform** hosted on **Upsun (Platform.sh)** with **Blackfire.io**.

---

## 🌟 Overview & Capabilities

The **Solvay AI Performance Agent** automates daily performance diagnostics by combining:
1. **Google Gemini 1.5 Pro AI Reasoning Engine**: Analyzes full telemetry context, Blackfire call-graph ASTs, and Drupal source code to generate precise root-cause narratives and PHP `#cache` / entity loading code diffs.
2. **Blackfire.io APM & Scenarios**: Profiles transaction metrics (Wall time, CPU time, Memory, SQL query count/time, Solr 9.9 query payloads, Memcached hits) and tracks build assertion failures.
3. **Upsun Router & Access Log Analysis**: Analyzes traffic volume shifts, surge patterns, cache hit/miss rates, and p95/p99 latency percentiles across each multisite domain (`solvay.solvay`, `brand.solvay`, `bicarbonato.solvay`, `peroxidos.solvay`, `beeco.solvay`).
4. **Traffic-Performance Correlation**: Calculates an **Impact Score** (`[Traffic Volume] × [Latency Delta + Query Budget Penalty]`) to rank bottlenecks that directly affect end users.
5. **Drupal 11 Codebase Inspector**: Scans custom profiles in `solvay-solvay_platform/docroot/profiles/custom/` (`solvay_core`, `solvay_main`, `solvay_brand`, etc.) and themes to map slow call graphs directly to file paths and functions.
6. **Daily Advisory Digest**: Generates daily Markdown reports in `reports/` and sends rich notification cards to **Slack** and **Microsoft Teams** with copy-paste ready PHP code diffs and configuration suggestions.

---

## 📁 Project Structure

```
solvay-ai-performance-agent/
├── package.json                   # Node.js project manifest & scripts
├── index.js                       # Programmatic API entry point
├── config.sample.json             # Agent configuration template
├── .env.sample                    # Environment variables template
├── bin/
│   └── cli.js                     # CLI executable (npm start / npm run demo)
├── lib/
│   ├── config.js                  # Config loader & environment interpolator
│   ├── blackfireCollector.js      # Blackfire REST API client & traces collector
│   ├── upsunLogAnalyzer.js        # Stream-based Upsun router access log parser
│   ├── trafficCorrelator.js       # Traffic & APM correlation engine (Impact Score)
│   ├── drupalCodeInspector.js     # Solvay Drupal custom code analyzer
│   ├── recommendationEngine.js    # AI code remediation & patch generator
│   └── notifier.js                # Slack/Teams webhooks & Markdown reporter
├── tests/                         # Node.js native test suite (node --test)
│   └── agent.test.js
├── templates/
│   ├── .blackfire.yml             # Blackfire build assertions for Solvay multisite
│   └── upsun-blackfire-addon.yaml # Upsun config snippet & credentials setup
├── reports/                       # Generated daily markdown reports
└── data/                          # Access logs and temporary metrics
```

---

## 🛠️ Step 1: Enabling Blackfire on Upsun

To enable Blackfire on Upsun for `solvay-solvay_platform`:

### 1. Update `.upsun/config.yaml`
Add `blackfire` to `applications.drupal.runtime.extensions`:
```yaml
applications:
  drupal:
    runtime:
      extensions:
        - apcu
        - sodium
        - gd
        - zip
        - intl
        - xsl
        - memcached
        - imagick
        - blackfire # <--- Added
```

### 2. Set Blackfire Server & Client Credentials in Upsun
Run via Upsun CLI (or configure in the Upsun Web Console):
```bash
# Blackfire Agent Server Credentials
upsun variable:create --level project env:BLACKFIRE_SERVER_ID --value "<YOUR_SERVER_ID>"
upsun variable:create --level project env:BLACKFIRE_SERVER_TOKEN --value "<YOUR_SERVER_TOKEN>" --sensitive true

# Blackfire Client Credentials (for profiling & builds)
upsun variable:create --level project env:BLACKFIRE_CLIENT_ID --value "<YOUR_CLIENT_ID>"
upsun variable:create --level project env:BLACKFIRE_CLIENT_TOKEN --value "<YOUR_CLIENT_TOKEN>" --sensitive true
upsun variable:create --level project env:BLACKFIRE_ENVIRONMENT_UUID --value "<YOUR_ENV_UUID>"
```

### 3. Copy Blackfire Assertions File
Copy `templates/.blackfire.yml` to the root of `solvay-solvay_platform/.blackfire.yml` and commit.

---

## 🚀 Step 2: Installation & Configuration

1. **Navigate to the Agent directory**:
   ```bash
   cd /Users/prashantk/dev/solvay/solvay-ai-performance-agent
   ```

2. **Configure Settings**:
   ```bash
   cp config.sample.json config.json
   cp .env.sample .env
   ```
   Fill in your Blackfire API credentials and Slack/Teams webhook URLs in `config.json` or `.env`.

---

## 💻 Step 3: Usage & Commands

### 1. Run Unit Tests
Uses Node.js built-in test runner (zero external dependencies):
```bash
npm test
```

### 2. Run Demo Simulation
Runs a complete analysis using realistic traffic simulation and Blackfire APM traces against the `solvay-solvay_platform` codebase:
```bash
npm run demo
```

### 3. Run Live Daily Performance & Traffic Analysis
```bash
# Run full analysis across all multisites and generate report
npm run analyze

# Run analysis using a specific downloaded Upsun router log file
node bin/cli.js analyze --log-file data/raw_logs/upsun_access.log

# Target a specific multisite (e.g. solvay_brand or solvay_solvay)
node bin/cli.js analyze --site solvay_brand

# Run analysis without sending external webhook notifications
node bin/cli.js analyze --no-notify
```

### 4. Test Slack / Microsoft Teams Webhooks
```bash
npm run test-notify
```

---

## ⏰ Step 4: Automating via Upsun Cron or CI/CD

### Option A: Upsun Scheduled Cron
In `solvay-solvay_platform/.upsun/config.yaml`:
```yaml
applications:
  drupal:
    crons:
      daily_ai_performance_check:
        spec: "0 6 * * *" # Daily at 06:00 UTC
        commands:
          start: "node /path/to/solvay-ai-performance-agent/bin/cli.js analyze"
```

### Option B: GitLab CI / Bitbucket Pipeline Schedule
You can configure a daily pipeline schedule in `.gitlab-ci.yml` or `bitbucket-pipelines.yml`:
```yaml
ai_performance_audit:
  image: node:20
  stage: test
  only:
    - schedules
  script:
    - cd /path/to/solvay-ai-performance-agent
    - npm run analyze
  artifacts:
    paths:
      - reports/*.md
```

---

## 📄 Output Reports

Generated reports are stored in `reports/daily-performance-report-node-YYYY-MM-DD.md`.
Each report includes:
- **Executive Summary Table**: Request volume, trends, p95 latencies, cache hit rates per site.
- **Blackfire Assertions Status**: Failing assertions and budget breaches.
- **Prioritized Recommendations**: Root causes, business impact, and ready-to-use Drupal PHP/Twig code diffs.
