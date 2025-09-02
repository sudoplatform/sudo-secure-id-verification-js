/*
 * Copyright © 2023 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { IdentityDataProcessingConsentStatus as IdentityDataProcessingConsentStatusEntity } from '../../public/types/identityDataProcessingConsentStatus'
import { IdentityDataProcessingConsentStatus as IdentityDataProcessingConsentStatusGraphQL } from '../../gen/graphql-types'

export class IdentityDataProcessingConsentStatusTransformer {
  public static toEntity(
    graphql: IdentityDataProcessingConsentStatusGraphQL,
  ): IdentityDataProcessingConsentStatusEntity {
    return {
      consented: graphql.consented,
      consentedAtEpochMs: graphql.consentedAtEpochMs ?? undefined,
      consentWithdrawnAtEpochMs: graphql.consentWithdrawnAtEpochMs ?? undefined,
      content: graphql.content ?? undefined,
      contentType: graphql.contentType ?? undefined,
      locale: graphql.locale ?? undefined,
    }
  }
}
