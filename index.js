/**
 * Solvay AI Performance Agent - Main Entry Point
 */

export { runPipeline } from './bin/cli.js';
export { loadConfig } from './lib/config.js';
export { BlackfireCollector } from './lib/blackfireCollector.js';
export { UpsunLogAnalyzer } from './lib/upsunLogAnalyzer.js';
export { TrafficCorrelator } from './lib/trafficCorrelator.js';
export { DrupalCodeInspector } from './lib/drupalCodeInspector.js';
export { RecommendationEngine } from './lib/recommendationEngine.js';
export { Notifier } from './lib/notifier.js';
