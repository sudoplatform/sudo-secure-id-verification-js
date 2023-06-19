/*
 * Copyright © 2023 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { VerificationMethod } from './verificationMethod'

/**
 * Input to verifyIdentity method
 *
 * @property {VerificationMethod} verificationMethod
 *     Verification method to use to verify data. Must be
 *     {@link VerificationMethod.KnowledgeOfPII} if specified.
 *
 * @property {string} firstName First name of identity to verify
 * @property {string} lastName Last name of identity to verify
 * @property {string} address Street address of identity to verify
 * @property {string} city City of identity to verify
 * @property {string} state State of identity to verify
 * @property {string} postalCode Postal code of identity to verify
 * @property {string} country ISO 3166-1 alpha-2 country code, e.g. US.
 * @property {string} dateOfBirth Date of birth of identity to verify
 */
export interface VerifyIdentityInput {
  verificationMethod?: VerificationMethod
  firstName: string
  lastName: string
  address: string
  city?: string
  state?: string
  postalCode: string
  country: string
  dateOfBirth: string
}
