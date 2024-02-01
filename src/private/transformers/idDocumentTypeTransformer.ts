/*
 * Copyright © 2023 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { FatalError } from '@sudoplatform/sudo-common'
import { IdDocumentType } from '../../public/types'

export class IdDocumentTypeTransformer {
  public static toGraphQL(entity: IdDocumentType): string {
    return entity
  }

  public static toEntity(graphql: string): IdDocumentType {
    switch (graphql) {
      case 'driverLicense': {
        return IdDocumentType.DriverLicense
      }

      case 'passport': {
        return IdDocumentType.Passport
      }

      case 'idCard': {
        return IdDocumentType.IdCard
      }

      default: {
        throw new FatalError(
          `Unrecognized document type '${graphql}' received from service`,
        )
      }
    }
  }
}
