/*
 * Copyright © 2023 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { GraphQLError } from 'graphql'

/**
 * Type for AppSync errors.
 */
export type AppSyncError = GraphQLError & {
  errorType?: string | null
}
