/**
 * Traffic and APM Correlator (Node.js)
 */

export class TrafficCorrelator {
  constructor({ latencyThresholdMs = 800, maxSqlBudget = 75 } = {}) {
    this.latencyThresholdMs = latencyThresholdMs;
    this.maxSqlBudget = maxSqlBudget;
  }

  correlate(trafficData, apmProfiles = [], buildAssertions = []) {
    const siteSummaries = {};
    const rankedBottlenecks = [];
    const sitesTraffic = trafficData.sites || {};

    const profileMap = new Map();
    for (const p of apmProfiles) {
      profileMap.set(`${p.site}:${p.url}`, p);
    }

    for (const [host, tInfo] of Object.entries(sitesTraffic)) {
      const siteName = tInfo.site_name || host.replace('.solvay', '');
      const totalReqs = tInfo.total_requests || 0;
      const cacheHit = tInfo.cache_hit_ratio || 0.0;
      const p95Site = tInfo.p95_latency_ms || 0.0;

      siteSummaries[siteName] = {
        domain: host,
        total_requests: totalReqs,
        cache_hit_ratio: cacheHit,
        p95_latency_ms: p95Site,
        status_breakdown: tInfo.status_breakdown || {},
        traffic_trend: tInfo.traffic_trend || 'Stable'
      };

      for (const pathData of tInfo.top_paths || []) {
        const path = pathData.path || '/';
        const reqCount = pathData.request_count || 0;
        const p95Lat = pathData.p95_latency_ms || 0.0;
        const avgLat = pathData.avg_latency_ms || 0.0;

        const profile = profileMap.get(`${siteName}:${path}`) || profileMap.get(`${siteName}:${path.split('?')[0]}`);

        const sqlCount = profile ? profile.sql_count || 0 : 0;
        const sqlTime = profile ? profile.sql_time_ms || 0 : 0;
        const solrTime = profile ? profile.solr_time_ms || 0 : 0;
        const memRatio = profile ? profile.memcached_hit_ratio || cacheHit : cacheHit;
        const callGraph = profile ? profile.top_call_graph_nodes || [] : [];
        const slowQueries = profile ? profile.slow_queries || [] : [];

        const latencyDelta = Math.max(0.0, p95Lat - this.latencyThresholdMs);
        const sqlPenalty = Math.max(0, sqlCount - this.maxSqlBudget) * 5.0;
        const impactScore = Number(((reqCount / 1000.0) * (latencyDelta + sqlPenalty)).toFixed(1));

        const isBottleneck = p95Lat > this.latencyThresholdMs || sqlCount > this.maxSqlBudget || solrTime > 200;

        if (isBottleneck) {
          rankedBottlenecks.push({
            site_name: siteName,
            domain: host,
            path: path,
            request_count_24h: reqCount,
            avg_latency_ms: avgLat,
            p95_latency_ms: p95Lat,
            impact_score: impactScore,
            sql_count: sqlCount,
            sql_time_ms: sqlTime,
            solr_time_ms: solrTime,
            memcached_hit_ratio: memRatio,
            call_graph: callGraph,
            slow_queries: slowQueries,
            profile_uuid: profile ? profile.profile_uuid : null
          });
        }
      }
    }

    rankedBottlenecks.sort((a, b) => b.impact_score - a.impact_score);

    return {
      period: trafficData.period || 'Last 24 Hours',
      site_summaries: siteSummaries,
      ranked_bottlenecks: rankedBottlenecks,
      build_assertions: buildAssertions
    };
  }
}
