/*
 * Copyright © 2023 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { IdentityDataProcessingConsentContent as IdentityDataProcessingConsentContentEntity } from '../../public/types/identityDataProcessingConsentContent'
import { IdentityDataProcessingConsentContent as IdentityDataProcessingConsentContentGraphQL } from '../../gen/graphql-types'

export class IdentityDataProcessingConsentContentTransformer {
  public static toEntity(
    graphql: IdentityDataProcessingConsentContentGraphQL,
  ): IdentityDataProcessingConsentContentEntity {
    return {
      content: graphql.content,
      contentType: graphql.contentType,
      locale: graphql.locale,
    }
  }
}
