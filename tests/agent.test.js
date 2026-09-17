import { test } from 'node:test';
import assert from 'node:assert/strict';
import { UpsunLogAnalyzer } from '../lib/upsunLogAnalyzer.js';
import { TrafficCorrelator } from '../lib/trafficCorrelator.js';
import { RecommendationEngine } from '../lib/recommendationEngine.js';

test('UpsunLogAnalyzer returns synthetic data', async () => {
  const analyzer = new UpsunLogAnalyzer();
  const data = await analyzer.analyzeLogs();
  assert.ok(data.sites);
  assert.ok(data.sites['solvay.solvay']);
  assert.ok(data.sites['solvay.solvay'].total_requests > 1000);
});

test('TrafficCorrelator ranks bottlenecks by impact score', () => {
  const correlator = new TrafficCorrelator({ latencyThresholdMs: 800, maxSqlBudget: 75 });
  const mockTraffic = {
    sites: {
      'solvay.solvay': {
        site_name: 'solvay_solvay',
        total_requests: 50000,
        cache_hit_ratio: 50.0,
        p95_latency_ms: 1100.0,
        top_paths: [
          { path: '/en/products', request_count: 30000, avg_latency_ms: 900.0, p95_latency_ms: 1200.0 }
        ]
      }
    }
  };
  const mockProfiles = [
    { site: 'solvay_solvay', url: '/en/products', sql_count: 100, sql_time_ms: 200, solr_time_ms: 0, memcached_hit_ratio: 40.0 }
  ];
  const res = correlator.correlate(mockTraffic, mockProfiles, []);
  assert.equal(res.ranked_bottlenecks.length, 1);
  assert.equal(res.ranked_bottlenecks[0].path, '/en/products');
  assert.ok(res.ranked_bottlenecks[0].impact_score > 0);
});

test('RecommendationEngine generates code diffs', async () => {
  const engine = new RecommendationEngine();
  const mockCorrelated = {
    ranked_bottlenecks: [
      {
        path: '/en/products',
        site_name: 'solvay_solvay',
        domain: 'solvay.solvay',
        request_count_24h: 40000,
        avg_latency_ms: 850,
        p95_latency_ms: 1150,
        impact_score: 1250.0,
        sql_count: 110,
        sql_time_ms: 300,
        solr_time_ms: 0,
        memcached_hit_ratio: 45.0
      }
    ]
  };
  const recs = await engine.generateRecommendations(mockCorrelated);
  assert.equal(recs.length, 1);
  assert.ok(recs[0].code_diff.includes('loadMultiple'));
  assert.ok(recs[0].code_diff.includes('#cache'));
});
