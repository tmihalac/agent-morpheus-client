/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GitHubTokenStatus } from '../models/GitHubTokenStatus';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GitHubTokenEndpointService {
    /**
     * Get configured GitHub token status
     * Checks the configured GitHub token and returns status and warning only
     * @returns GitHubTokenStatus Token status returned; token values are never included
     * @throws ApiError
     */
    public static getApiV1GithubTokenStatus(): CancelablePromise<GitHubTokenStatus> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/github-token/status',
        });
    }
}
