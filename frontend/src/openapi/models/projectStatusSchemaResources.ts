/**
 * Generated by Orval
 * Do not edit manually.
 * See `gen:api` script in package.json
 */

/**
 * Key resources within the project
 */
export type ProjectStatusSchemaResources = {
    /**
     * The number of API tokens created specifically for this project.
     * @minimum 0
     */
    apiTokens: number;
    /**
     * The number of users who have been granted roles in this project. Does not include users who have access via groups.
     * @minimum 0
     */
    members: number;
    /**
     * The number of segments that are scoped to this project.
     * @minimum 0
     */
    segments: number;
};
