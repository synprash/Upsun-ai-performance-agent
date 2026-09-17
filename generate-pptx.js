/**
 * Executive PowerPoint Presentation Generator for Solvay Leadership
 * Light Enterprise Theme with Strict Geometric Bounds (100% within slide margins).
 */

import PptxGenJS from 'pptxgenjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_FILE = path.join(__dirname, 'Solvay_AI_Performance_Agent_Executive_Deck.pptx');

async function createDeck() {
  const pres = new PptxGenJS();

  // Explicitly define 13.333 x 7.5 Widescreen Layout (16:9 standard)
  pres.defineLayout({ name: 'WIDE_16_9', width: 13.333, height: 7.5 });
  pres.layout = 'WIDE_16_9';

  pres.author = 'Solvay Platform Engineering';
  pres.company = 'Solvay';
  pres.title = 'Solvay AI Performance Agent - Executive Deck';
  pres.subject = 'Autonomous APM & Traffic-Aware Drupal Multisite Optimization';

  // Light Palette
  const C_BG_PAGE = 'F8FAFC';       // Slate-50 background
  const C_BG_CARD = 'FFFFFF';       // Pure White Card
  const C_BORDER_CARD = 'E2E8F0';   // Slate-200 border
  const C_BORDER_STRONG = 'CBD5E1'; // Slate-300 border
  
  const C_TEXT_DARK = '0F172A';     // Slate-900 Primary Text
  const C_TEXT_BODY = '334155';     // Slate-700 Body Text
  const C_TEXT_MUTED = '64748B';    // Slate-500 Muted Text

  const C_PRIMARY_BLUE = '0284C7';  // Solvay Primary Blue
  const C_BLUE_LIGHT = 'E0F2FE';    // Blue Tint
  const C_GREEN_DARK = '059669';    // Emerald Primary
  const C_GREEN_LIGHT = 'ECFDF5';   // Emerald Tint
  const C_PURPLE_DARK = '7C3AED';   // Purple Primary
  const C_PURPLE_LIGHT = 'F5F3FF';  // Purple Tint
  const C_AMBER_DARK = 'D97706';    // Amber Primary
  const C_AMBER_LIGHT = 'FFFBEB';   // Amber Tint
  const C_RED_DARK = 'DC2626';      // Red Primary
  const C_RED_LIGHT = 'FEF2F2';     // Red Tint

  // Helper function for slide header
  function addSlideHeader(slide, category, title) {
    slide.addShape(pres.ShapeType.rect, {
      x: 0.8, y: 0.4, w: 0.8, h: 0.06,
      fill: { color: C_PRIMARY_BLUE }
    });
    slide.addText(category.toUpperCase(), {
      x: 0.8, y: 0.55, w: 10.0, h: 0.3,
      fontSize: 10, fontFace: 'Segoe UI', color: C_PRIMARY_BLUE, bold: true, letterSpacing: 1.5
    });
    slide.addText(title, {
      x: 0.8, y: 0.85, w: 11.7, h: 0.55,
      fontSize: 20, fontFace: 'Segoe UI', color: C_TEXT_DARK, bold: true
    });
  }

  // =========================================================================
  // SLIDE 1: Title & Hero Visual (Light Enterprise Theme)
  // =========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: 'FFFFFF' };

    // Top Brand Accent Bar
    slide.addShape(pres.ShapeType.rect, {
      x: 0, y: 0, w: 13.333, h: 0.12,
      fill: { color: C_PRIMARY_BLUE }
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 0.9, w: 3.2, h: 0.4,
      fill: { color: C_BLUE_LIGHT }, line: { color: C_PRIMARY_BLUE, width: 1 }, rectRadius: 0.08
    });
    slide.addText('SOLVAY PLATFORM ENGINEERING', {
      x: 0.8, y: 0.9, w: 3.2, h: 0.4,
      fontSize: 10, fontFace: 'Segoe UI', color: C_PRIMARY_BLUE, bold: true, align: 'center', valign: 'middle'
    });

    slide.addText('Solvay AI Performance Agent', {
      x: 0.8, y: 1.5, w: 11.7, h: 1.1,
      fontSize: 36, fontFace: 'Segoe UI', color: C_TEXT_DARK, bold: true
    });

    slide.addText('Autonomous APM & Traffic-Aware Code Optimization for Upsun Drupal Multisite', {
      x: 0.8, y: 2.6, w: 11.7, h: 0.6,
      fontSize: 16, fontFace: 'Segoe UI', color: C_TEXT_MUTED
    });

    // 4 Ecosystem Feature Cards (Strict boundaries: x=0.8 to 12.5)
    const badges = [
      { name: '🧠 Google Gemini AI', sub: 'Multi-Modal Code Synthesis\nZero-latency JSON diffs', fill: C_PURPLE_LIGHT, border: C_PURPLE_DARK, textCol: C_PURPLE_DARK },
      { name: '📡 Blackfire.io APM', sub: 'Runtime Trace Profiling\nSQL, CPU, & Solr metrics', fill: C_BLUE_LIGHT, border: C_PRIMARY_BLUE, textCol: C_PRIMARY_BLUE },
      { name: '🌐 Upsun PaaS', sub: 'Router Log Telemetry\n200k+ daily access records', fill: C_GREEN_LIGHT, border: C_GREEN_DARK, textCol: C_GREEN_DARK },
      { name: '💧 Drupal 11 Multisite', sub: 'Automated Code Fixes\nRender cache & query tuning', fill: C_AMBER_LIGHT, border: C_AMBER_DARK, textCol: C_AMBER_DARK }
    ];

    badges.forEach((b, idx) => {
      const x = 0.8 + idx * 2.95;
      slide.addShape(pres.ShapeType.roundRect, {
        x: x, y: 3.5, w: 2.75, h: 2.4,
        fill: { color: b.fill }, line: { color: b.border, width: 1.5 }, rectRadius: 0.12
      });
      slide.addText(b.name, {
        x: x + 0.15, y: 3.8, w: 2.45, h: 0.5,
        fontSize: 13, fontFace: 'Segoe UI', color: b.textCol, bold: true, align: 'center'
      });
      slide.addText(b.sub, {
        x: x + 0.15, y: 4.4, w: 2.45, h: 1.2,
        fontSize: 11, fontFace: 'Segoe UI', color: C_TEXT_BODY, align: 'center'
      });
    });

    slide.addText('Executive Architecture & Strategy Briefing | 100% Risk-Free Advisory Model', {
      x: 0.8, y: 6.5, w: 11.7, h: 0.4,
      fontSize: 11, fontFace: 'Segoe UI', color: C_TEXT_MUTED
    });
  }

  // =========================================================================
  // SLIDE 2: Strategic Shift (Before vs After)
  // =========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_BG_PAGE };
    addSlideHeader(slide, 'The Strategic Shift', 'Transforming Passive Monitoring into Autonomous Remediation');

    // LEFT CARD: Traditional APM (Red Accent)
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 1.6, w: 5.5, h: 5.1,
      fill: { color: C_BG_CARD }, line: { color: C_RED_DARK, width: 1.5 }, rectRadius: 0.12
    });
    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.1, y: 1.8, w: 4.9, h: 0.45,
      fill: { color: C_RED_LIGHT }, line: { color: C_RED_DARK, width: 1 }, rectRadius: 0.08
    });
    slide.addText('❌ TRADITIONAL PASSIVE MONITORING', {
      x: 1.1, y: 1.8, w: 4.9, h: 0.45,
      fontSize: 11, fontFace: 'Segoe UI', color: C_RED_DARK, bold: true, align: 'center', valign: 'middle'
    });

    const leftBullets = [
      { text: '🚨 Uncorrelated Alert Storms\n', options: { bold: true, color: C_TEXT_DARK } },
      { text: 'Generates thousands of raw metric spikes without explaining underlying root causes.\n\n', options: { color: C_TEXT_BODY } },
      { text: '⏳ Hours of Manual Triage\n', options: { bold: true, color: C_TEXT_DARK } },
      { text: 'Senior engineers manually dissecting complex call graphs and SQL traces.\n\n', options: { color: C_TEXT_BODY } },
      { text: '📉 Reactive to Traffic Surges\n', options: { bold: true, color: C_TEXT_DARK } },
      { text: 'Bottlenecks identified only after customers abandon high-traffic marketing campaigns.', options: { color: C_TEXT_BODY } }
    ];
    slide.addText(leftBullets, {
      x: 1.1, y: 2.5, w: 4.9, h: 3.9,
      fontSize: 11, fontFace: 'Segoe UI'
    });

    // RIGHT CARD: Solvay AI Agent (Green Accent)
    slide.addShape(pres.ShapeType.roundRect, {
      x: 7.0, y: 1.6, w: 5.5, h: 5.1,
      fill: { color: C_BG_CARD }, line: { color: C_GREEN_DARK, width: 1.5 }, rectRadius: 0.12
    });
    slide.addShape(pres.ShapeType.roundRect, {
      x: 7.3, y: 1.8, w: 4.9, h: 0.45,
      fill: { color: C_GREEN_LIGHT }, line: { color: C_GREEN_DARK, width: 1 }, rectRadius: 0.08
    });
    slide.addText('🚀 SOLVAY AUTONOMOUS AI AGENT', {
      x: 7.3, y: 1.8, w: 4.9, h: 0.45,
      fontSize: 11, fontFace: 'Segoe UI', color: C_GREEN_DARK, bold: true, align: 'center', valign: 'middle'
    });

    const rightBullets = [
      { text: '🎯 Traffic-Weighted Impact Scoring\n', options: { bold: true, color: C_TEXT_DARK } },
      { text: 'Prioritizes fixes using mathematical Impact = (Traffic Volume × Latency Delta).\n\n', options: { color: C_TEXT_BODY } },
      { text: '🧠 Google Gemini AI Reasoning\n', options: { bold: true, color: C_TEXT_DARK } },
      { text: 'Correlates APM call traces directly with solvay_core PHP modules in sub-2 seconds.\n\n', options: { color: C_TEXT_BODY } },
      { text: '🛠️ Ready-to-Merge Code Diffs\n', options: { bold: true, color: C_TEXT_DARK } },
      { text: 'Delivers exact Drupal #cache tags and bulk-loading patches to Slack/Teams.', options: { color: C_TEXT_BODY } }
    ];
    slide.addText(rightBullets, {
      x: 7.3, y: 2.5, w: 4.9, h: 3.9,
      fontSize: 11, fontFace: 'Segoe UI'
    });
  }

  // =========================================================================
  // SLIDE 3: System Architecture Diagram (4 Flow Stages)
  // =========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_BG_PAGE };
    addSlideHeader(slide, 'System Architecture', 'End-to-End Autonomous Intelligence Pipeline');

    const stages = [
      {
        num: 'STAGE 1', title: 'Telemetry Ingestion', color: C_PRIMARY_BLUE, tint: C_BLUE_LIGHT,
        bullets: [
          '• Upsun Router Access Logs',
          '• 200k+ daily requests',
          '• Cache HIT/MISS ratios',
          '• Blackfire APM Wall/CPU',
          '• SQL & Solr 9.9 traces'
        ]
      },
      {
        num: 'STAGE 2', title: 'Traffic Correlation', color: C_GREEN_DARK, tint: C_GREEN_LIGHT,
        bullets: [
          '• Computes Impact Score',
          '• Traffic surge detector',
          '• p95 / p99 SLO analysis',
          '• SQL query budget filter',
          '• Eliminates low-impact noise'
        ]
      },
      {
        num: 'STAGE 3', title: 'Gemini AI Core', color: C_PURPLE_DARK, tint: C_PURPLE_LIGHT,
        bullets: [
          '• Google Gemini 1.5/3.6',
          '• Drupal 11 AST Inspector',
          '• Scans solvay_core code',
          '• N+1 loop diagnostics',
          '• Zero-latency patch generation'
        ]
      },
      {
        num: 'STAGE 4', title: 'Action & Delivery', color: C_AMBER_DARK, tint: C_AMBER_LIGHT,
        bullets: [
          '• Daily Markdown Reports',
          '• Slack & Teams Webhooks',
          '• Copy-paste PHP diffs',
          '• Engineer Review gate',
          '• Regression validation'
        ]
      }
    ];

    stages.forEach((st, idx) => {
      const x = 0.8 + idx * 2.95;

      // Card Container
      slide.addShape(pres.ShapeType.roundRect, {
        x: x, y: 1.6, w: 2.75, h: 5.1,
        fill: { color: C_BG_CARD }, line: { color: st.color, width: 1.5 }, rectRadius: 0.12
      });

      // Card Header Banner
      slide.addShape(pres.ShapeType.roundRect, {
        x: x + 0.15, y: 1.8, w: 2.45, h: 0.45,
        fill: { color: st.tint }, line: { color: st.color, width: 1 }, rectRadius: 0.08
      });
      slide.addText(`${st.num}: ${st.title}`, {
        x: x + 0.15, y: 1.8, w: 2.45, h: 0.45,
        fontSize: 10.5, fontFace: 'Segoe UI', color: st.color, bold: true, align: 'center', valign: 'middle'
      });

      slide.addText(st.bullets.join('\n\n'), {
        x: x + 0.15, y: 2.45, w: 2.45, h: 4.0,
        fontSize: 10, fontFace: 'Segoe UI', color: C_TEXT_BODY
      });
    });
  }

  // =========================================================================
  // SLIDE 4: Gemini AI Pipeline & Safety Net
  // =========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_BG_PAGE };
    addSlideHeader(slide, 'AI Engine Architecture', 'Google Gemini Reasoning Pipeline & Deterministic Safety Net');

    // Top Box: Context Assembly
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 1.5, w: 11.7, h: 1.2,
      fill: { color: C_BG_CARD }, line: { color: C_PRIMARY_BLUE, width: 1.5 }, rectRadius: 0.1
    });
    slide.addText('📦 4-Layer Context Assembly (Upsun Logs + Blackfire APM + Drupal 11 AST)', {
      x: 1.0, y: 1.65, w: 11.3, h: 0.35,
      fontSize: 12, fontFace: 'Segoe UI', color: C_PRIMARY_BLUE, bold: true
    });
    slide.addText('• Traffic Context (24h views, p95, surges)   |   • APM Traces (SQL counts, Solr 9.9 latency)   |   • Call Graph (Callee/Caller nodes)   |   • PHP Source Lines (docroot/profiles/custom/)', {
      x: 1.0, y: 2.05, w: 11.3, h: 0.5,
      fontSize: 10.5, fontFace: 'Segoe UI', color: C_TEXT_BODY
    });

    // Left Sub-Engine: Google Gemini
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 3.0, w: 5.7, h: 3.7,
      fill: { color: C_PURPLE_LIGHT }, line: { color: C_PURPLE_DARK, width: 2 }, rectRadius: 0.12
    });
    slide.addText('🧠 Google Gemini Reasoning Engine', {
      x: 1.0, y: 3.2, w: 5.3, h: 0.4,
      fontSize: 14, fontFace: 'Segoe UI', color: C_PURPLE_DARK, bold: true
    });

    const geminiPoints = [
      { text: '⚡ Sub-2s Response: ', options: { bold: true, color: C_TEXT_DARK } },
      { text: 'Configured with zero-latency thinking budget for instant JSON patch output.\n\n', options: { color: C_TEXT_BODY } },
      { text: '🔄 Dynamic Model Waterfall: ', options: { bold: true, color: C_TEXT_DARK } },
      { text: 'Auto-tries active candidate models (gemini-3.6-flash, gemini-3.7-flash, gemini-pro).\n\n', options: { color: C_TEXT_BODY } },
      { text: '⏱️ Strict 12s Timeout: ', options: { bold: true, color: C_TEXT_DARK } },
      { text: 'Guarantees the agent never hangs or stalls cron / CI pipelines.', options: { color: C_TEXT_BODY } }
    ];
    slide.addText(geminiPoints, {
      x: 1.0, y: 3.7, w: 5.3, h: 2.8,
      fontSize: 10.5, fontFace: 'Segoe UI'
    });

    // Right Sub-Engine: Deterministic Fallback
    slide.addShape(pres.ShapeType.roundRect, {
      x: 6.8, y: 3.0, w: 5.7, h: 3.7,
      fill: { color: C_GREEN_LIGHT }, line: { color: C_GREEN_DARK, width: 2 }, rectRadius: 0.12
    });
    slide.addText('🛡️ Deterministic Heuristic Safety Net', {
      x: 7.0, y: 3.2, w: 5.3, h: 0.4,
      fontSize: 14, fontFace: 'Segoe UI', color: C_GREEN_DARK, bold: true
    });

    const fallbackPoints = [
      { text: '🔌 100% Offline & Rate-Limit Immune: ', options: { bold: true, color: C_TEXT_DARK } },
      { text: 'Activates automatically if Google API quota (429) is exceeded or network is offline.\n\n', options: { color: C_TEXT_BODY } },
      { text: '📏 Rule-Based AST Pattern Matching: ', options: { bold: true, color: C_TEXT_DARK } },
      { text: 'Diagnoses N+1 entity loops, un-cached View executions, and Solr field bloat.\n\n', options: { color: C_TEXT_BODY } },
      { text: '✅ Zero Downtime Assurance: ', options: { bold: true, color: C_TEXT_DARK } },
      { text: 'Daily performance digest is ALWAYS generated on schedule.', options: { color: C_TEXT_BODY } }
    ];
    slide.addText(fallbackPoints, {
      x: 7.0, y: 3.7, w: 5.3, h: 2.8,
      fontSize: 10.5, fontFace: 'Segoe UI'
    });
  }

  // =========================================================================
  // SLIDE 5: Traffic Impact Scoring (2x2 Matrix)
  // =========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_BG_PAGE };
    addSlideHeader(slide, 'Traffic-Driven Intelligence', 'Traffic-Weighted p95 Impact Matrix: Zero-Noise Prioritization');

    // Formula Banner Box
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 1.4, w: 11.7, h: 1.1,
      fill: { color: C_BLUE_LIGHT }, line: { color: C_PRIMARY_BLUE, width: 1.5 }, rectRadius: 0.1
    });
    slide.addText([
      { text: 'Impact Score Formula: ', options: { fontSize: 12, color: C_PRIMARY_BLUE, bold: true } },
      { text: '(Traffic Volume / 1000) × [ max(0, p95 - 800ms) + 5 × (SQL Count - 75) ]\n', options: { fontSize: 13, color: C_TEXT_DARK, bold: true } },
      { text: 'Prioritizes pages where high user traffic meets severe backend latency.', options: { fontSize: 10.5, color: C_TEXT_MUTED } }
    ], { x: 1.0, y: 1.5, w: 11.3, h: 0.9, fontFace: 'Segoe UI' });

    // Quadrant 1: CRITICAL (Top Right)
    slide.addShape(pres.ShapeType.roundRect, {
      x: 6.8, y: 2.7, w: 5.7, h: 1.9,
      fill: { color: C_RED_LIGHT }, line: { color: C_RED_DARK, width: 1.5 }, rectRadius: 0.1
    });
    slide.addText('🔥 QUADRANT I: CRITICAL (High Traffic + Slow p95)', {
      x: 7.0, y: 2.85, w: 5.3, h: 0.35,
      fontSize: 11, fontFace: 'Segoe UI', color: C_RED_DARK, bold: true
    });
    slide.addText('• Example: /en/products (48.2k visits, 1,180ms p95)\n• Impact Score: 27,715 | Action: Urgent automated Gemini code patch', {
      x: 7.0, y: 3.2, w: 5.3, h: 1.2,
      fontSize: 10, fontFace: 'Segoe UI', color: C_TEXT_DARK
    });

    // Quadrant 2: LOW IMPACT (Top Left)
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 2.7, w: 5.7, h: 1.9,
      fill: { color: C_BG_CARD }, line: { color: C_BORDER_STRONG, width: 1 }, rectRadius: 0.1
    });
    slide.addText('⏸️ QUADRANT II: LOW IMPACT (Low Traffic + Slow p95)', {
      x: 1.0, y: 2.85, w: 5.3, h: 0.35,
      fontSize: 11, fontFace: 'Segoe UI', color: C_TEXT_MUTED, bold: true
    });
    slide.addText('• Example: /admin/reports/export (10 visits, 2,500ms p95)\n• Impact Score: 17.0 | Action: Deprioritized; saves engineer sprint hours', {
      x: 1.0, y: 3.2, w: 5.3, h: 1.2,
      fontSize: 10, fontFace: 'Segoe UI', color: C_TEXT_BODY
    });

    // Quadrant 3: OPTIMIZED (Bottom Right)
    slide.addShape(pres.ShapeType.roundRect, {
      x: 6.8, y: 4.8, w: 5.7, h: 1.9,
      fill: { color: C_GREEN_LIGHT }, line: { color: C_GREEN_DARK, width: 1.5 }, rectRadius: 0.1
    });
    slide.addText('🟢 QUADRANT III: OPTIMIZED (High Traffic + Fast p95)', {
      x: 7.0, y: 4.95, w: 5.3, h: 0.35,
      fontSize: 11, fontFace: 'Segoe UI', color: C_GREEN_DARK, bold: true
    });
    slide.addText('• Example: / (Homepage cache hits, 36.4k visits, 240ms p95)\n• Status: Healthy (88% Cache Hit); continuous Blackfire verification', {
      x: 7.0, y: 5.3, w: 5.3, h: 1.2,
      fontSize: 10, fontFace: 'Segoe UI', color: C_TEXT_DARK
    });

    // Quadrant 4: STABLE (Bottom Left)
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 4.8, w: 5.7, h: 1.9,
      fill: { color: C_BG_CARD }, line: { color: C_BORDER_STRONG, width: 1 }, rectRadius: 0.1
    });
    slide.addText('⚪ QUADRANT IV: STABLE (Low Traffic + Fast p95)', {
      x: 1.0, y: 4.95, w: 5.3, h: 0.35,
      fontSize: 11, fontFace: 'Segoe UI', color: C_TEXT_MUTED, bold: true
    });
    slide.addText('• Example: /en/terms-and-conditions (200 visits, 180ms p95)\n• Status: Meets all baseline latency and memory thresholds', {
      x: 1.0, y: 5.3, w: 5.3, h: 1.2,
      fontSize: 10, fontFace: 'Segoe UI', color: C_TEXT_BODY
    });
  }

  // =========================================================================
  // SLIDE 6: Multisite Fleet Health & Generated Code Patch
  // =========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_BG_PAGE };
    addSlideHeader(slide, 'Actionable Remediations', 'Solvay Multisite Telemetry & Generated Drupal 11 Patch');

    // Left: Multisite Fleet Table Card
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 1.5, w: 5.4, h: 5.2,
      fill: { color: C_BG_CARD }, line: { color: C_BORDER_STRONG, width: 1 }, rectRadius: 0.12
    });
    slide.addText('📊 Multisite Fleet Health (Last 24h)', {
      x: 1.0, y: 1.7, w: 5.0, h: 0.4,
      fontSize: 13, fontFace: 'Segoe UI', color: C_PRIMARY_BLUE, bold: true
    });

    const rows = [
      [
        { text: 'Multisite', options: { bold: true, color: C_TEXT_DARK, fill: C_BLUE_LIGHT } },
        { text: 'Traffic', options: { bold: true, color: C_TEXT_DARK, fill: C_BLUE_LIGHT } },
        { text: 'p95', options: { bold: true, color: C_TEXT_DARK, fill: C_BLUE_LIGHT } },
        { text: 'Cache', options: { bold: true, color: C_TEXT_DARK, fill: C_BLUE_LIGHT } },
        { text: 'Status', options: { bold: true, color: C_TEXT_DARK, fill: C_BLUE_LIGHT } }
      ],
      ['solvay_solvay', '142.8k', '1120ms', '64.2%', '🟡 Warning'],
      ['solvay_brand', '38.9k', '1250ms', '58.0%', '🔴 Critical'],
      ['bicarbonato', '19.4k', '620ms', '88.5%', '🟢 Healthy'],
      ['peroxidos', '14.3k', '680ms', '84.0%', '🟢 Healthy']
    ];

    slide.addTable(rows, {
      x: 1.0, y: 2.2, w: 5.0, h: 2.2,
      fontSize: 9.5, fontFace: 'Segoe UI', color: C_TEXT_BODY,
      border: { pt: 0.5, color: C_BORDER_CARD },
      align: 'center', valign: 'middle'
    });

    slide.addText('⚡ Key Diagnostic: 48,200 requests on /en/products triggered 114 SQL queries per hit due to loop entity loading.', {
      x: 1.0, y: 4.7, w: 5.0, h: 1.6,
      fontSize: 10, fontFace: 'Segoe UI', color: C_AMBER_DARK
    });

    // Right: Code Diff Card
    slide.addShape(pres.ShapeType.roundRect, {
      x: 6.6, y: 1.5, w: 5.9, h: 5.2,
      fill: { color: '0F172A' }, line: { color: C_GREEN_DARK, width: 1.5 }, rectRadius: 0.12
    });
    slide.addText('📝 Gemini AI Generated Code Patch (ProductManager.php)', {
      x: 6.8, y: 1.7, w: 5.5, h: 0.4,
      fontSize: 12, fontFace: 'Segoe UI', color: '#6EE7B7', bold: true
    });

    const diffSnippet =
      '// Bulk load taxonomy terms + Attach render cache tags\n' +
      '+ $storage = \\Drupal::entityTypeManager()->getStorage(\'node\');\n' +
      '+ $nids = \\Drupal::entityQuery(\'node\')\n' +
      '+   ->condition(\'field_category\', $category_ids, \'IN\')\n' +
      '+   ->accessCheck(TRUE)->execute();\n' +
      '+\n' +
      '+ $nodes = $storage->loadMultiple($nids);\n' +
      '+ $build = $view_builder->viewMultiple($nodes, \'teaser\');\n' +
      '+ $build[\'#cache\'] = [\n' +
      '+   \'keys\' => [\'product_listing\', implode(\'_\', $category_ids)],\n' +
      '+   \'tags\' => [\'taxonomy_term_list:product_categories\'],\n' +
      '+   \'max-age\' => 86400,\n' +
      '+ ];';

    slide.addText(diffSnippet, {
      x: 6.8, y: 2.2, w: 5.5, h: 4.2,
      fontSize: 9.5, fontFace: 'Consolas', color: '#A7F3D0', valign: 'top'
    });
  }

  // =========================================================================
  // SLIDE 7: Business Value & ROI Infographic (4 Visual Cards)
  // =========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_BG_PAGE };
    addSlideHeader(slide, 'Business Value & ROI', 'Measurable Strategic Outcomes for Solvay Digital Platform');

    const kpis = [
      { num: '⚡ 40%+', title: 'Faster p95 Latency', sub: 'Core Web Vitals Boost', desc: 'Accelerates Largest Contentful Paint (LCP) & TTFB, boosting organic SEO search ranking and customer conversion globally.', color: C_PRIMARY_BLUE, tint: C_BLUE_LIGHT },
      { num: '📉 35%', title: 'Reduced Server Load', sub: 'Upsun Cost Efficiency', desc: 'Cuts container CPU & memory consumption on Upsun, preventing peak-hour MariaDB query queueing and Solr saturation.', color: C_GREEN_DARK, tint: C_GREEN_LIGHT },
      { num: '⏱️ 8 hrs/wk', title: 'Saved Developer Triage', sub: 'Sprint Velocity', desc: 'Engineers receive copy-paste ready PHP diffs and root causes instead of manually digging through APM flamegraphs.', color: C_AMBER_DARK, tint: C_AMBER_LIGHT },
      { num: '🛡️ 100%', title: 'Zero-Risk Governance', sub: 'Human-in-the-Loop', desc: 'Read-only advisory model: Code changes are reviewed and merged by Solvay engineers via standard Git PR workflows.', color: C_PURPLE_DARK, tint: C_PURPLE_LIGHT }
    ];

    kpis.forEach((k, idx) => {
      const x = 0.8 + idx * 2.95;
      slide.addShape(pres.ShapeType.roundRect, {
        x: x, y: 1.6, w: 2.75, h: 5.0,
        fill: { color: C_BG_CARD }, line: { color: k.color, width: 2 }, rectRadius: 0.12
      });

      slide.addText(k.num, {
        x: x + 0.15, y: 1.9, w: 2.45, h: 0.7,
        fontSize: 28, fontFace: 'Segoe UI', color: k.color, bold: true, align: 'center'
      });

      slide.addText(k.title, {
        x: x + 0.15, y: 2.7, w: 2.45, h: 0.4,
        fontSize: 14, fontFace: 'Segoe UI', color: C_TEXT_DARK, bold: true, align: 'center'
      });

      slide.addText(k.sub, {
        x: x + 0.15, y: 3.1, w: 2.45, h: 0.35,
        fontSize: 10.5, fontFace: 'Segoe UI', color: k.color, bold: true, align: 'center'
      });

      slide.addText(k.desc, {
        x: x + 0.15, y: 3.6, w: 2.45, h: 2.7,
        fontSize: 10, fontFace: 'Segoe UI', color: C_TEXT_BODY, align: 'center'
      });
    });
  }

  // =========================================================================
  // SLIDE 8: Phased Roadmap & Call to Action (Chevrons)
  // =========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: 'FFFFFF' };
    addSlideHeader(slide, 'Implementation Roadmap & Actions', 'Fast Phased Rollout & Immediate Next Steps');

    const roadmap = [
      { phase: 'PHASE 1 (Days 1–2)', title: 'Blackfire APM Activation', color: C_PRIMARY_BLUE, tint: C_BLUE_LIGHT, desc: '• Enable blackfire extension in .upsun/config.yaml\n• Configure Upsun Blackfire credentials\n• Commit .blackfire.yml build assertions' },
      { phase: 'PHASE 2 (Days 3–4)', title: 'Agent Deployment & Alerts', color: C_GREEN_DARK, tint: C_GREEN_LIGHT, desc: '• Schedule Node.js Agent in Upsun Cron (0 6 * * *)\n• Connect Slack / Teams Webhooks for daily digest\n• Verify daily Markdown reports in reports/' },
      { phase: 'PHASE 3 (Ongoing)', title: 'Continuous Governance', color: C_AMBER_DARK, tint: C_AMBER_LIGHT, desc: '• Engineers apply daily suggested PR diffs\n• Track week-over-week p95 latency drops across all 5+ sites\n• Maintain 99%+ cache hit ratio on key landing pages' }
    ];

    roadmap.forEach((r, idx) => {
      const y = 1.5 + idx * 1.55;
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.8, y: y, w: 11.7, h: 1.35,
        fill: { color: r.tint }, line: { color: r.color, width: 1.5 }, rectRadius: 0.1
      });

      slide.addText(r.phase, {
        x: 1.1, y: y + 0.15, w: 3.2, h: 0.3,
        fontSize: 11, fontFace: 'Segoe UI', color: r.color, bold: true
      });

      slide.addText(r.title, {
        x: 1.1, y: y + 0.45, w: 3.2, h: 0.5,
        fontSize: 13, fontFace: 'Segoe UI', color: C_TEXT_DARK, bold: true
      });

      slide.addText(r.desc, {
        x: 4.5, y: y + 0.15, w: 7.7, h: 1.05,
        fontSize: 10, fontFace: 'Segoe UI', color: C_TEXT_BODY
      });
    });

    slide.addText('Next Step: Approve Blackfire extension in .upsun/config.yaml & Connect Slack/Teams Webhook', {
      x: 0.8, y: 6.4, w: 11.7, h: 0.4,
      fontSize: 11, fontFace: 'Segoe UI', color: C_PRIMARY_BLUE, bold: true, align: 'center'
    });
  }

  // Save the presentation
  await pres.writeFile({ fileName: OUTPUT_FILE });
  console.log(`\n🎉 Successfully generated crisp light-theme PowerPoint deck at:\n${OUTPUT_FILE}\n`);
}

createDeck().catch(err => {
  console.error('Error creating presentation:', err);
  process.exit(1);
});
