/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Configured GitHub token status
 */
export type GitHubTokenStatus = {
    status: 'valid' | 'invalid' | 'unknown';
    /**
     * Non-blocking warning for an invalid or missing token
     */
    warning?: string | null;
};

