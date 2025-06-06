/**
 * Generated by Orval
 * Do not edit manually.
 * See `gen:api` script in package.json
 */
import type { UiConfigSchemaAuthenticationType } from './uiConfigSchemaAuthenticationType';
import type { UiConfigSchemaBilling } from './uiConfigSchemaBilling';
import type { UiConfigSchemaFlags } from './uiConfigSchemaFlags';
import type { UiConfigSchemaLinksItem } from './uiConfigSchemaLinksItem';
import type { ResourceLimitsSchema } from './resourceLimitsSchema';
import type { UiConfigSchemaUnleashContext } from './uiConfigSchemaUnleashContext';
import type { VersionSchema } from './versionSchema';

/**
 * A collection of properties used to configure the Unleash Admin UI.
 */
export interface UiConfigSchema {
    /** The type of authentication enabled for this Unleash instance */
    authenticationType?: UiConfigSchemaAuthenticationType;
    /** The base URI path at which this Unleash instance is listening. */
    baseUriPath: string;
    /** The billing model in use for this Unleash instance. */
    billing?: UiConfigSchemaBilling;
    /** Whether password authentication should be disabled or not. */
    disablePasswordAuth?: boolean;
    /** Whether this instance can send out emails or not. */
    emailEnabled?: boolean;
    /** What kind of Unleash instance it is: Enterprise, Pro, or Open source */
    environment?: string;
    /** The URI path at which the feedback endpoint is listening. */
    feedbackUriPath?: string;
    /** Additional (largely experimental) features that are enabled in this Unleash instance. */
    flags?: UiConfigSchemaFlags;
    /** The list of origins that the front-end API should accept requests from. */
    frontendApiOrigins?: string[];
    /** Relevant links to use in the UI. */
    links?: UiConfigSchemaLinksItem[];
    /** Whether maintenance mode is currently active or not. */
    maintenanceMode?: boolean;
    /** The maximum number of sessions that a user has. */
    maxSessionsCount?: number;
    /** The name of this Unleash instance. Used to build the text in the footer. */
    name?: string;
    /** Whether the OIDC configuration is set through environment variables or not. */
    oidcConfiguredThroughEnv?: boolean;
    /** Whether a Prometheus API is available. */
    prometheusAPIAvailable?: boolean;
    /** A map of resource names and their limits. */
    resourceLimits?: ResourceLimitsSchema;
    /** Whether the SAML configuration is set through environment variables or not. */
    samlConfiguredThroughEnv?: boolean;
    /**
     * The maximum number of values that can be used in a single segment.
     * @deprecated
     */
    segmentValuesLimit?: number;
    /** The slogan to display in the UI footer. */
    slogan?: string;
    /**
     * The maximum number of segments that can be applied to a single strategy.
     * @deprecated
     */
    strategySegmentsLimit?: number;
    /** The context object used to configure the Unleash instance. */
    unleashContext?: UiConfigSchemaUnleashContext;
    /** The URL of the Unleash instance. */
    unleashUrl: string;
    /** The current version of Unleash */
    version: string;
    versionInfo: VersionSchema;
}
