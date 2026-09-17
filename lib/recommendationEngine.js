/**
 * AI Recommendation & Remediation Generator (Node.js)
 * Powered by Google Gemini AI with instant generation, strict timeout protection,
 * automatic model waterfall & deterministic heuristic backup.
 */

export class RecommendationEngine {
  constructor(aiModelConfig = {}) {
    this.apiKey = aiModelConfig.apiKey || '';
    this.modelName = aiModelConfig.modelName || 'gemini-3.6-flash';
    this.temperature = aiModelConfig.temperature !== undefined ? aiModelConfig.temperature : 0.2;
    this.timeoutMs = aiModelConfig.timeoutMs || 12000;
  }

  get isGeminiEnabled() {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  async generateRecommendations(correlatedData, inspectedBottlenecks = []) {
    if (this.isGeminiEnabled) {
      try {
        const geminiRecs = await this.generateWithGemini(correlatedData, inspectedBottlenecks);
        if (geminiRecs && geminiRecs.length > 0) {
          return geminiRecs;
        }
      } catch (err) {
        console.warn(`\n      ⚠️  Gemini API unreachable (${err.message}). Auto-completed using built-in engine.\n`);
      }
    }

    // Fallback: Built-in deterministic heuristic engine
    return this.generateHeuristicRecommendations(correlatedData, inspectedBottlenecks);
  }

  /**
   * Generates intelligent performance remediation using Google Gemini AI.
   * Optimized with zero-latency thinking budget and strict timeout protection.
   */
  async generateWithGemini(correlatedData, inspectedBottlenecks = []) {
    const bottlenecks = correlatedData.ranked_bottlenecks || [];
    if (bottlenecks.length === 0) return [];

    const inspectionMap = new Map();
    for (const b of inspectedBottlenecks) {
      inspectionMap.set(b.path, b);
    }

    const itemsToAnalyze = bottlenecks.slice(0, 5).map((b, idx) => {
      const insp = inspectionMap.get(b.path) || {};
      return {
        id: `REC-${b.site_name.toUpperCase()}-${String(idx + 1).padStart(2, '0')}`,
        site: b.site_name,
        domain: b.domain,
        path: b.path,
        traffic_24h: b.request_count_24h,
        p95_latency_ms: b.p95_latency_ms,
        sql_queries: b.sql_count,
        solr_time_ms: b.solr_time_ms,
        memcached_hit_ratio: b.memcached_hit_ratio,
        impact_score: b.impact_score,
        call_graph: b.call_graph,
        slow_queries: b.slow_queries,
        code_findings: insp.code_findings || []
      };
    });

    const systemPrompt = `You are a Principal Drupal 11 & Enterprise Performance Architect for Solvay's global multisite platform hosted on Upsun (Platform.sh) with Blackfire.io APM.
Analyze the provided performance telemetry, Blackfire traces, and Drupal custom code.
For each bottleneck, generate:
1. "id": string matching input id
2. "priority": "CRITICAL" (if impact_score > 1000 or p95 > 1200ms) or "HIGH"
3. "site": string matching site
4. "domain": string matching domain
5. "path": string matching path
6. "title": Concise technical title
7. "root_cause": Clear explanation connecting high traffic to the exact PHP execution flaw
8. "recommendation_summary": Numbered step-by-step developer action
9. "code_diff": Ready-to-apply PHP/Twig code diff block with Drupal 11 #cache tags, contexts, keys, and entity loading optimizations.

Return ONLY a valid JSON array of recommendation objects adhering to this schema.`;

    const userPrompt = `Telemetry & Bottleneck Data to optimize:
${JSON.stringify(itemsToAnalyze, null, 2)}

Return JSON output with array of recommendations matching the required fields.`;

    // Candidate model waterfall
    const modelCandidates = Array.from(new Set([
      this.modelName.replace(/^models\//, ''),
      'gemini-3.6-flash',
      'gemini-3.7-flash',
      'gemini-3.1-pro-preview',
      'gemini-flash-latest',
      'gemini-pro-latest'
    ]));

    let lastError = null;

    for (const model of modelCandidates) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${systemPrompt}\n\n${userPrompt}` }
            ]
          }
        ],
        generationConfig: {
          temperature: this.temperature,
          responseMimeType: 'application/json',
          thinkingConfig: {
            thinkingBudget: 0
          }
        }
      };

      try {
        console.log(`      ⏳ Sending telemetry to Gemini API (${model})...`);
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(this.timeoutMs)
        });

        if (resp.status === 404) {
          // Model deprecated, try next candidate
          continue;
        }

        if (!resp.ok) {
          const errText = await resp.text();
          lastError = new Error(`HTTP ${resp.status} on ${model}: ${errText}`);
          continue;
        }

        const json = await resp.json();
        const candidateText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!candidateText) {
          lastError = new Error(`Empty response received from ${model}`);
          continue;
        }

        const parsed = JSON.parse(candidateText);
        const results = Array.isArray(parsed) ? parsed : (parsed.recommendations || []);
        const bottleneckMap = new Map(bottlenecks.map(b => [b.path, b]));

        return results.map((r, idx) => {
          const original = bottleneckMap.get(r.path) || bottlenecks[idx] || {};
          const reqCount = original.request_count_24h || 0;
          const p95 = original.p95_latency_ms || 0;
          const impact = original.impact_score || 0;
          const sqlCount = original.sql_count || 0;
          const memHit = original.memcached_hit_ratio || 0;

          return {
            id: r.id || `REC-${(original.site_name || 'SITE').toUpperCase()}-${String(idx + 1).padStart(2, '0')}`,
            priority: r.priority || (impact > 1000 || p95 > 1200 ? 'CRITICAL' : 'HIGH'),
            site: r.site || original.site_name,
            domain: r.domain || original.domain,
            path: r.path || original.path,
            metrics_summary: `Traffic: ${reqCount.toLocaleString()} req/day | p95: ${p95}ms | SQL Queries: ${sqlCount} | Memcached Hit: ${memHit}%`,
            impact_score: impact,
            title: r.title,
            root_cause: r.root_cause,
            recommendation_summary: r.recommendation_summary,
            code_diff: r.code_diff,
            model_used: `Google Gemini (${model})`
          };
        });
      } catch (err) {
        lastError = err;
      }
    }

    if (lastError) {
      throw lastError;
    }

    return [];
  }

  /**
   * Deterministic heuristic fallback engine
   */
  generateHeuristicRecommendations(correlatedData, inspectedBottlenecks = []) {
    const recommendations = [];
    const bottlenecks = correlatedData.ranked_bottlenecks || [];

    for (let idx = 0; idx < Math.min(bottlenecks.length, 5); idx++) {
      const item = bottlenecks[idx];
      const { path, site_name: site, domain, p95_latency_ms: p95, request_count_24h: reqCount, impact_score: impact, sql_count: sqlCount, solr_time_ms: solrTime, memcached_hit_ratio: memHit } = item;

      const rec = {
        id: `REC-${site.toUpperCase()}-${String(idx + 1).padStart(2, '0')}`,
        priority: (impact > 1000 || p95 > 1200) ? 'CRITICAL' : 'HIGH',
        site: site,
        domain: domain,
        path: path,
        metrics_summary: `Traffic: ${reqCount.toLocaleString()} req/day | p95: ${p95}ms | SQL Queries: ${sqlCount} | Memcached Hit: ${memHit}%`,
        impact_score: impact,
        title: '',
        root_cause: '',
        recommendation_summary: '',
        code_diff: '',
        model_used: 'Deterministic Heuristic Engine'
      };

      if (path.includes('/products')) {
        rec.title = 'Fix N+1 Term Loading & Enable Render Caching in Product Listing';
        rec.root_cause = `During traffic surge (${reqCount.toLocaleString()} requests), the product category endpoint executes ${sqlCount} database queries. Taxonomy terms are loaded in a loop inside ProductManager::getCategoryProducts() instead of bulk-loading via loadMultiple().`;
        rec.recommendation_summary = '1. Bulk load taxonomy terms using loadMultiple().\n2. Attach render cache tags (taxonomy_term_list:product_categories).';
        rec.code_diff = [
          '```php',
          '// File: docroot/profiles/custom/solvay_core/modules/solvay_product/src/ProductManager.php',
          '',
          '- // BEFORE: N+1 loading inside loop',
          '- foreach ($term_ids as $tid) {',
          '-     $term = $this->entityTypeManager->getStorage(\'taxonomy_term\')->load($tid);',
          '-     $build[\'categories\'][] = $this->termRenderer->render($term);',
          '- }',
          '+',
          '+ // AFTER: Optimized bulk loading & Cache tags',
          '+ $terms = $this->entityTypeManager->getStorage(\'taxonomy_term\')->loadMultiple($term_ids);',
          '+ foreach ($terms as $term) {',
          '+     $build[\'categories\'][] = $this->termRenderer->render($term);',
          '+ }',
          '+ $build[\'#cache\'] = [',
          '+     \'keys\' => [\'solvay_product_listing\', $category_id],',
          '+     \'contexts\' => [\'url.query_args:page\', \'languages:language_interface\'],',
          '+     \'tags\' => [\'taxonomy_term_list:product_categories\', \'node_list:product\'],',
          '+     \'max-age\' => 3600,',
          '+ ];',
          '```'
        ].join('\n');
      } else if (path.includes('/search')) {
        rec.title = 'Optimize Solr 9.9 Search Query Highlighting & Field Retrieval';
        rec.root_cause = `Solr search queries contribute ${solrTime}ms of backend latency on ${reqCount.toLocaleString()} daily searches. Full unindexed blobs are being retrieved directly.`;
        rec.recommendation_summary = '1. Limit retrieved Solr fields in Search API to IDs.\n2. Enable Search API caching plugin.';
        rec.code_diff = [
          '```php',
          '// File: docroot/profiles/custom/solvay_core/modules/solvay_search/src/SearchHelper.php',
          '',
          '- $query->setFields([\'*\']);',
          '+ $query->setFields([\'id\', \'entity_id\', \'search_api_datasource\', \'search_api_language\']);',
          '+ $query->addTag(\'search_api_solr_cached_search\');',
          '+ $query->getResults()->setCacheTags([\'search_api_solr_results\']);',
          '```'
        ].join('\n');
      } else if (path === '/' && site === 'solvay_brand') {
        rec.title = 'Enable View Query Cache & Paragraph Caching on Brand Homepage';
        rec.root_cause = `Brand homepage p95 latency is ${p95}ms with low cache hit ratio (${memHit}%). The brand_highlight view executes duplicate queries on each hit.`;
        rec.recommendation_summary = '1. Set Views query cache tags to node_list:brand_highlight.\n2. Enable render cache max-age.';
        rec.code_diff = [
          '```php',
          '// File: docroot/profiles/custom/solvay_brand/modules/solvay_brand_homepage/solvay_brand_homepage.module',
          '',
          '+ function solvay_brand_homepage_views_pre_render(ViewExecutable $view) {',
          '+   if ($view->id() === \'brand_highlight\') {',
          '+     $view->element[\'#cache\'][\'tags\'][] = \'node_list:brand_highlight\';',
          '+     $view->element[\'#cache\'][\'max-age\'] = 86400;',
          '+   }',
          '+ }',
          '```'
        ].join('\n');
      } else {
        rec.title = `Reduce Query Latency and Enable Max-Age Caching on ${path}`;
        rec.root_cause = `Path ${path} observed ${p95}ms p95 latency across ${reqCount.toLocaleString()} daily requests.`;
        rec.recommendation_summary = 'Attach cache contexts and tags to avoid cold bootstrap.';
        rec.code_diff = [
          '```php',
          '+ $build[\'#cache\'] = [',
          '+     \'contexts\' => [\'url.path\', \'languages:language_interface\'],',
          '+     \'tags\' => [\'node_list\'],',
          '+     \'max-age\' => 1800,',
          '+ ];',
          '```'
        ].join('\n');
      }

      recommendations.push(rec);
    }

    return recommendations;
  }
}
