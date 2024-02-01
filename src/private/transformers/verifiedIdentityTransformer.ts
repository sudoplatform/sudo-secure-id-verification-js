/*
 * Copyright © 2023 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { VerifiedIdentity as VerifiedIdentityEntity } from '../../public/types/verifiedIdentity'
import { VerifiedIdentity as VerifiedIdentityGraphQL } from '../../gen/graphql-types'
import { VerificationMethodTransformer } from './verificationMethodTransformer'
import { IdDocumentTypeTransformer } from './idDocumentTypeTransformer'
import { DocumentVerificationStatusTransformer } from './documentVerificationStatusTransformer'

export class VerifiedIdentityTransformer {
  public static toEntity(
    graphql: VerifiedIdentityGraphQL,
  ): VerifiedIdentityEntity {
    return {
      owner: graphql.owner,
      verified: graphql.verified,
      verifiedAt:
        graphql.verifiedAtEpochMs === undefined ||
        graphql.verifiedAtEpochMs === null
          ? undefined
          : new Date(graphql.verifiedAtEpochMs),
      verificationMethod: VerificationMethodTransformer.toEntity(
        graphql.verificationMethod,
      ),
      canAttemptVerificationAgain: graphql.canAttemptVerificationAgain,
      idScanUrl: graphql.idScanUrl ?? undefined,
      requiredVerificationMethod:
        graphql.requiredVerificationMethod === undefined ||
        graphql.requiredVerificationMethod === null
          ? undefined
          : VerificationMethodTransformer.toEntity(
              graphql.requiredVerificationMethod,
            ),
      acceptableDocumentTypes:
        graphql.acceptableDocumentTypes?.map((t) =>
          IdDocumentTypeTransformer.toEntity(t),
        ) ?? undefined,
      documentVerificationStatus:
        DocumentVerificationStatusTransformer.toEntity(
          graphql.documentVerificationStatus,
        ),
    }
  }
}
