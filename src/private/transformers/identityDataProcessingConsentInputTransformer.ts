/*
 * Copyright © 2023 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { IdentityDataProcessingConsentInput as IdentityDataProcessingConsentInputEntity } from '../../public/types/identityDataProcessingConsentInput'
import { IdentityDataProcessingConsentInput as IdentityDataProcessingConsentInputGraphQL } from '../../gen/graphql-types'

export class IdentityDataProcessingConsentInputTransformer {
  public static toGraphQL(
    input: IdentityDataProcessingConsentInputEntity,
  ): IdentityDataProcessingConsentInputGraphQL {
    return {
      content: input.content,
      contentType: input.contentType,
      locale: input.locale,
    }
  }
}
