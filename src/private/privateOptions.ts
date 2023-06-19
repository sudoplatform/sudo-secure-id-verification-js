/*
 * Copyright © 2023 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { SudoSecureIdVerificationClientOptions } from '../public/types/sudoIdentityVerificationClientOptions'
import { ApiClient } from './client/apiClient'
import { IdentityVerificationServiceConfig } from './config'

export interface SudoSecureIdVerificationClientPrivateOptions
  extends SudoSecureIdVerificationClientOptions {
  apiClient?: ApiClient
  identityVerificationServiceConfig?: IdentityVerificationServiceConfig
}
