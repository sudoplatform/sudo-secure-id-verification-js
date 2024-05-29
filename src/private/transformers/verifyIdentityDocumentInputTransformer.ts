/*
 * Copyright © 2023 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { VerifyIdentityDocumentInput as VerifyIdentityDocumentInputEntity } from '../../public/types'
import { VerifyIdentityDocumentInput as VerifyIdentityDocumentInputGraphQL } from '../../gen/graphql-types'
import { VerificationMethodTransformer } from './verificationMethodTransformer'
import { IdDocumentTypeTransformer } from './idDocumentTypeTransformer'

export class VerifyIdentityDocumentInputTransformer {
  public static toGraphQL(
    entity: VerifyIdentityDocumentInputEntity,
  ): VerifyIdentityDocumentInputGraphQL {
    return {
      verificationMethod: VerificationMethodTransformer.toGraphQL(
        entity.verificationMethod,
      ),
      imageBase64: entity.imageBase64,
      backImageBase64: entity.backImageBase64,
      faceImageBase64: entity.faceImageBase64,
      country: entity.country,
      documentType: IdDocumentTypeTransformer.toGraphQL(entity.documentType),
    }
  }
}
