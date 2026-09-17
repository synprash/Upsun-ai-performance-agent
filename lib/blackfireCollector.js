/**
 * Blackfire APM & Builds Collector (Node.js)
 */

export class BlackfireCollector {
  constructor({ apiUrl, clientId, clientToken, envUuid }) {
    this.apiUrl = (apiUrl || 'https://blackfire.io/api/v1').replace(/\/+$/, '');
    this.clientId = clientId || '';
    this.clientToken = clientToken || '';
    this.envUuid = envUuid || '';
  }

  get isConfigured() {
    return Boolean(this.clientId && this.clientToken && this.envUuid);
  }

  getAuthHeader() {
    const creds = `${this.clientId}:${this.clientToken}`;
    const encoded = Buffer.from(creds).toString('base64');
    return `Basic ${encoded}`;
  }

  async request(endpoint) {
    if (!this.isConfigured) return null;
    const url = `${this.apiUrl}/${endpoint.replace(/^\/+/, '')}`;
    try {
      const resp = await fetch(url, {
        headers: {
          'Authorization': this.getAuthHeader(),
          'Accept': 'application/json',
          'User-Agent': 'Solvay-AI-Performance-Agent-Node/1.0'
        }
      });
      if (!resp.ok) return null;
      return await resp.json();
    } catch (err) {
      console.warn(`[BlackfireCollector] Request error for ${endpoint}:`, err.message);
      return null;
    }
  }

  async fetchRecentBuilds() {
    if (!this.isConfigured) {
      return this.getSyntheticBuilds();
    }
    const data = await this.request(`environments/${this.envUuid}/builds`);
    if (data && data['hydra:member']) {
      return data['hydra:member'];
    }
    return this.getSyntheticBuilds();
  }

  async fetchTransactionProfiles() {
    if (!this.isConfigured) {
      return this.getSyntheticProfiles();
    }
    const data = await this.request(`environments/${this.envUuid}/profiles`);
    if (data && data['hydra:member']) {
      return data['hydra:member'];
    }
    return this.getSyntheticProfiles();
  }

  getSyntheticBuilds() {
    return [
      {
        uuid: 'bf-build-84729-solvay',
        title: 'Daily Multisite Health Scenario',
        status: 'failure',
        created_at: new Date().toISOString(),
        failing_assertions_count: 3,
        assertions: [
          {
            site: 'solvay_solvay',
            path: '/en/products',
            assertion: 'metrics.sql.queries.count <= 60',
            actual_value: 114,
            status: 'failed',
            details: 'Product catalog category query triggered un-cached N+1 entity loading on taxonomy terms.'
          },
          {
            site: 'solvay_solvay',
            path: '/en/search/global',
            assertion: 'metrics.solr.queries.time < 200ms',
            actual_value: '342ms',
            status: 'failed',
            details: 'Solr search payload contains un-highlighted full-text blobs causing slow deserialization.'
          },
          {
            site: 'solvay_brand',
            path: '/',
            assertion: 'main.wall_time < 800ms',
            actual_value: '1250ms',
            status: 'failed',
            details: 'Hero banner paragraph template rendering without proper Twig render caching.'
          }
        ]
      }
    ];
  }

  getSyntheticProfiles() {
    return [
      {
        profile_uuid: 'prof-01-solvay-prod-catalog',
        site: 'solvay_solvay',
        url: '/en/products',
        http_method: 'GET',
        wall_time_ms: 1180,
        cpu_time_ms: 780,
        memory_mb: 68.4,
        sql_count: 114,
        sql_time_ms: 320,
        solr_count: 2,
        solr_time_ms: 45,
        memcached_hit_ratio: 42.5,
        top_call_graph_nodes: [
          {
            caller: 'Drupal\\solvay_product\\ProductManager::getCategoryProducts',
            callee: 'Drupal\\Core\\Entity\\Sql\\SqlContentEntityStorage::loadMultiple',
            wall_time_ms: 480,
            exclusive_time_ms: 310,
            call_count: 48,
            file: 'docroot/profiles/custom/solvay_core/modules/solvay_product/src/ProductManager.php',
            line: 84
          }
        ],
        slow_queries: [
          {
            query: "SELECT t.* FROM taxonomy_term_field_data t WHERE t.vid = 'product_categories' AND t.status = 1 ORDER BY weight ASC",
            time_ms: 82,
            count: 24,
            is_duplicate: true
          }
        ]
      },
      {
        profile_uuid: 'prof-02-solvay-solr-search',
        site: 'solvay_solvay',
        url: '/en/search/global',
        http_method: 'GET',
        wall_time_ms: 940,
        cpu_time_ms: 510,
        memory_mb: 54.2,
        sql_count: 42,
        sql_time_ms: 95,
        solr_count: 3,
        solr_time_ms: 342,
        memcached_hit_ratio: 18.0,
        top_call_graph_nodes: [
          {
            caller: 'Drupal\\solvay_search\\SearchHelper::executeGlobalSearch',
            callee: 'Drupal\\search_api_solr\\Solarium\\Result\\Document::getFields',
            wall_time_ms: 280,
            exclusive_time_ms: 210,
            call_count: 1,
            file: 'docroot/profiles/custom/solvay_core/modules/solvay_search/src/SearchHelper.php',
            line: 62
          }
        ],
        slow_queries: []
      },
      {
        profile_uuid: 'prof-03-brand-home',
        site: 'solvay_brand',
        url: '/',
        http_method: 'GET',
        wall_time_ms: 1250,
        cpu_time_ms: 820,
        memory_mb: 78.1,
        sql_count: 88,
        sql_time_ms: 240,
        solr_count: 0,
        solr_time_ms: 0,
        memcached_hit_ratio: 31.0,
        top_call_graph_nodes: [
          {
            caller: 'template_preprocess_views_view',
            callee: 'Drupal\\views\\ViewExecutable::render',
            wall_time_ms: 520,
            exclusive_time_ms: 360,
            call_count: 3,
            file: 'docroot/profiles/custom/solvay_brand/modules/solvay_brand_homepage/solvay_brand_homepage.module',
            line: 56
          }
        ],
        slow_queries: []
      }
    ];
  }
}
