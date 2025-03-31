/*
 * Copyright © 2025 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Type to hold information client can use to initiate document capture using
 * a web based method.
 *
 * @property {string} documentCaptureUrl URL used to capture ID document images.
 * @property {string} expiryAtEpochSeconds Time when the capture URL ceases to be usable.
 */
export interface IdDocumentCaptureInitiationInfo {
  documentCaptureUrl: string
  expiryAtEpochSeconds: number
}
