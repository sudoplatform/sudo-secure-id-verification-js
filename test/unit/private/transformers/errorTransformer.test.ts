/*
 * Copyright © 2023 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  IllegalArgumentError,
  ServiceError,
  VersionMismatchError,
} from '@sudoplatform/sudo-common'
import { v4 } from 'uuid'
import {
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
} from '../../../../src'
import { ErrorTransformer } from '../../../../src/private/transformers/errorTransformer'

class InstanceUnderTest extends ErrorTransformer {}

// eslint-disable-next-line tree-shaking/no-side-effects-in-initialization
describe('Error Transformer Test Suite', () => {
  const errorMsg = v4()

  it.each`
    appSyncErrorType                                                                    | expectedErrorType
    ${'DynamoDB:ConditionalCheckFailedException'}
    ${new VersionMismatchError()}
    ${'sudoplatform.InvalidArgumentError'}
    ${new IllegalArgumentError()}
    ${'sudoplatform.ServiceError'}
    ${new ServiceError(errorMsg)}
    ${'sudoplatform.identity-verification.IdentityVerificationRecordNotFoundError'}
    ${new IdentityVerificationRecordNotFoundError(errorMsg)}
    ${'sudoplatform.identity-verification.IdentityVerificationUpdateFailedError'}
    ${new IdentityVerificationUpdateFailedError(errorMsg)}
    ${'sudoplatform.identity-verification.UnsupportedVerificationMethodError'}
    ${new UnsupportedVerificationMethodError(errorMsg)}
    ${'sudoplatform.identity-verification.ImplausibleAgeError'}
    ${new ImplausibleAgeError(errorMsg)}
    ${'sudoplatform.identity-verification.InvalidAgeError'}
    ${new InvalidAgeError(errorMsg)}
    ${'sudoplatform.identity-verification.UnsupportedCountryError'}
    ${new UnsupportedCountryError(errorMsg)}
    ${'sudoplatform.identity-verification.UnsupportedNetworkLocationError'}
    ${new UnsupportedNetworkLocationError(errorMsg)}
    ${'sudoplatform.identity-verification.RequiredIdentityInformationNotProvidedError'}
    ${new RequiredIdentityInformationNotProvidedError(errorMsg)}
    ${'sudoplatform.identity-verification.IdentityAlreadyVerifiedError'}
    ${new IdentityAlreadyVerifiedError(errorMsg)}
    ${'sudoplatform.identity-verification.IdentityCaptureRetriesExceededError'}
    ${new IdentityCaptureRetriesExceededError(errorMsg)}
    ${'sudoplatform.identity-verification.IdentityCaptureRetryBlockedError'}
    ${new IdentityCaptureRetryBlockedError(errorMsg)}
    ${'sudoplatform.identity-verification.IdentityDataRedactedError'}
    ${new IdentityDataRedactedError(errorMsg)}
  `(
    'converts $appSyncErrorType to $expectedErrorType',
    ({ appSyncErrorType, expectedErrorType }) => {
      const error = { errorType: appSyncErrorType, message: errorMsg } as any
      expect(InstanceUnderTest.toClientError(error)).toStrictEqual(
        expectedErrorType,
      )
    },
  )
})
