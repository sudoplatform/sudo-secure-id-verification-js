/*
 * Copyright © 2023 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { FatalError } from '@sudoplatform/sudo-common'
import { DocumentVerificationStatus } from '../../public/types'

export class DocumentVerificationStatusTransformer {
  public static toGraphQL(entity: DocumentVerificationStatus): string {
    return entity
  }

  public static toEntity(graphql: string): DocumentVerificationStatus {
    switch (graphql) {
      case 'notRequired': {
        return DocumentVerificationStatus.NotRequired
      }

      case 'notAttempted': {
        return DocumentVerificationStatus.NotAttempted
      }

      case 'pending': {
        return DocumentVerificationStatus.Pending
      }

      case 'documentUnreadable': {
        return DocumentVerificationStatus.DocumentUnreadable
      }

      case 'failed': {
        return DocumentVerificationStatus.Failed
      }

      case 'succeeded': {
        return DocumentVerificationStatus.Succeeded
      }

      default: {
        throw new FatalError(
          `Unrecognized document verification status '${graphql}' received from service`,
        )
      }
    }
  }
}
