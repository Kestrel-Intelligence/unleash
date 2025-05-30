/**
 * Generated by Orval
 * Do not edit manually.
 * See `gen:api` script in package.json
 */
import type { EdgeLatencyMetricsSchema } from './edgeLatencyMetricsSchema';

/**
 * Latencies for upstream actions from Edge (downloading/syncing new features, uploading metrics, uploading instance data)
 */
export interface EdgeUpstreamLatencySchema {
    edge: EdgeLatencyMetricsSchema;
    features: EdgeLatencyMetricsSchema;
    metrics: EdgeLatencyMetricsSchema;
}
