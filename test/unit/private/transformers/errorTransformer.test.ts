import {
  IllegalArgumentError,
  ServiceError,
  VersionMismatchError,
} from '@sudoplatform/sudo-common'
import { v4 } from 'uuid'
import {
  IdentityVerificationRecordNotFoundError,
  IdentityVerificationUpdateFailedError,
  ImplausibleAgeError,
  InvalidAgeError,
  UnsupportedCountryError,
  UnsupportedVerificationMethodError,
} from '../../../../src'
import { ErrorTransformer } from '../../../../src/private/transformers/errorTransformer'

class InstanceUnderTest extends ErrorTransformer {}

describe('Error Transformer Test Suite', () => {
  const errorMsg = v4()

  it.each`
    appSyncErrorType                                                                | expectedErrorType
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
    ${'sudoplatform.identity-verification.UnsupportedCurrencyError'}
    ${new UnsupportedCountryError(errorMsg)}
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
