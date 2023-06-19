/*
 * Copyright © 2023 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { VerificationMethod } from './verificationMethod'

/**
 * Represents current state of a verified identity
 *
 * @property {string} owner
 *   Subject of the user to whom this record pertains
 *
 * @property {boolean} verified
 *   Whether or not the user's identity has been verified to the required level
 *
 * @property {Date} verifiedAt
 *   If verified, the date at which the verification occurred
 *
 * @property {VerificationMethod} verificationMethod
 *   Method by which user is currently verified
 *
 * @property {boolean} canAttemptVerificationAgain
 *   Whether or not verification can be attempted again
 *
 * @property {string} idScanUrl
 *   URL to which images are to be submitted to complete verification
 *   by document.
 *
 * @property {VerificationMethod} requiredVerificationMethod
 *   Method by which user is required to verify in order to be considered
 *   verified.
 */
export interface VerifiedIdentity {
  owner: string
  verified: boolean
  verifiedAt?: Date
  verificationMethod: VerificationMethod
  canAttemptVerificationAgain: boolean
  idScanUrl?: string
  requiredVerificationMethod?: VerificationMethod
}
