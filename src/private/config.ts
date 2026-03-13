/*
 * Copyright © 2023 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultConfigurationManager } from '@sudoplatform/sudo-common'
import * as t from 'io-ts'

const IdentityVerificationServiceConfigProps = {}
export const configNamespace = 'IdentityVerificationService'
const IdentityVerificationServiceConfigCodec = t.type(
  IdentityVerificationServiceConfigProps,
)

export type IdentityVerificationServiceConfig = t.TypeOf<
  typeof IdentityVerificationServiceConfigCodec
>

export const getIdentityVerificationServiceConfig =
  (): IdentityVerificationServiceConfig => {
    return DefaultConfigurationManager.getInstance().bindConfigSet<IdentityVerificationServiceConfig>(
      IdentityVerificationServiceConfigCodec,
      configNamespace,
    )
  }
