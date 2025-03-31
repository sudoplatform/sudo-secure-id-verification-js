/*
 * Copyright © 2023 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { IdDocumentCaptureInitiationInfo as IdDocumentCaptureInitiationInfoEntity } from '../../public/types/idDocumentCaptureInitiationInfo'
import { IdentityDocumentCaptureInitiationResponse as IdDocumentCaptureInitiationInfoEntityGraphQL } from '../../gen/graphql-types'

export class IdentityDocumentCaptureInfoTransformer {
  public static toEntity(
    graphql: IdDocumentCaptureInitiationInfoEntityGraphQL,
  ): IdDocumentCaptureInitiationInfoEntity {
    return {
      documentCaptureUrl: graphql.documentCaptureUrl,
      expiryAtEpochSeconds: graphql.expiryAtEpochSeconds,
    }
  }
}
