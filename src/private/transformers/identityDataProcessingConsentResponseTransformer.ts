/*
 * Copyright © 2023 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { IdentityDataProcessingConsentResponse as IdentityDataProcessingConsentResponseEntity } from '../../public/types/identityDataProcessingConsentResponse'
import { IdentityDataProcessingConsentResponse as IdentityDataProcessingConsentResponseGraphQL } from '../../gen/graphql-types'

export class IdentityDataProcessingConsentResponseTransformer {
  public static toEntity(
    graphql: IdentityDataProcessingConsentResponseGraphQL,
  ): IdentityDataProcessingConsentResponseEntity {
    return {
      processed: graphql.processed,
    }
  }
}
