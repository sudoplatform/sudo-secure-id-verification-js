/*
 * Copyright © 2023 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  mapGraphQLToClientError,
  VersionMismatchError,
} from '@sudoplatform/sudo-common'
import {
  ConsentRequiredError,
  IdentityAlreadyVerifiedError,
  IdentityCaptureRetriesExceededError,
  IdentityCaptureRetryBlockedError,
  IdentityDataRedactedError,
  IdentityVerificationRecordNotFoundError,
  IdentityVerificationUpdateFailedError,
  ImplausibleAgeError,
  InvalidAgeError,
  RequiredIdentityInformationNotProvidedError,
  UnsupportedCountryError,
  UnsupportedNetworkLocationError,
  UnsupportedVerificationMethodError,
} from '../..'
import { GraphQLError } from 'graphql'

export class ErrorTransformer {
  static toClientError(
    error: { errorType: string; message: string } | GraphQLError,
  ): Error {
    const errorType = 'errorType' in error ? error.errorType : error.message
    switch (errorType) {
      case 'DynamoDB:ConditionalCheckFailedException':
        return new VersionMismatchError()
      case 'sudoplatform.identity-verification.IdentityVerificationRecordNotFoundError':
        return new IdentityVerificationRecordNotFoundError(error.message)
      case 'sudoplatform.identity-verification.IdentityVerificationUpdateFailedError':
        return new IdentityVerificationUpdateFailedError(error.message)
      case 'sudoplatform.identity-verification.UnsupportedVerificationMethodError':
        return new UnsupportedVerificationMethodError(error.message)
      case 'sudoplatform.identity-verification.ImplausibleAgeError':
        return new ImplausibleAgeError(error.message)
      case 'sudoplatform.identity-verification.InvalidAgeError':
        return new InvalidAgeError(error.message)
      case 'sudoplatform.identity-verification.UnsupportedCountryError':
        return new UnsupportedCountryError(error.message)
      case 'sudoplatform.identity-verification.UnsupportedNetworkLocationError':
        return new UnsupportedNetworkLocationError(error.message)
      case 'sudoplatform.identity-verification.RequiredIdentityInformationNotProvidedError':
        return new RequiredIdentityInformationNotProvidedError(error.message)
      case 'sudoplatform.identity-verification.IdentityAlreadyVerifiedError':
        return new IdentityAlreadyVerifiedError(error.message)
      case 'sudoplatform.identity-verification.IdentityCaptureRetriesExceededError':
        return new IdentityCaptureRetriesExceededError(error.message)
      case 'sudoplatform.identity-verification.IdentityCaptureRetryBlockedError':
        return new IdentityCaptureRetryBlockedError(error.message)
      case 'sudoplatform.identity-verification.IdentityDataRedactedError':
        return new IdentityDataRedactedError(error.message)
      case 'sudoplatform.identity-verification.ConsentRequiredError':
        return new ConsentRequiredError(error.message)
      default:
        return mapGraphQLToClientError(error)
    }
  }
}
