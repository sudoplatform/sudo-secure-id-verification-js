/*
 * Copyright © 2023 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { IdDocumentType } from '../../public/types'

export class IdDocumentTypeTransformer {
  public static toGraphQL(entity: IdDocumentType): string {
    return entity
  }
}
