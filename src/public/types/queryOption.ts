/*
 * Copyright © 2023 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Control for whether to use local cache or not.
 */
export enum QueryOption {
  /**
   * Returns result from the local cache only.
   */
  CACHE_ONLY = 'cache-only',

  /**
   * Fetches result from the service and ignores any cached entries.
   */
  REMOTE_ONLY = 'network-only',
}
