/*
 * Copyright © 2023 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Logger,
  DefaultLogger,
  IllegalArgumentError,
  NotSignedInError,
} from '@sudoplatform/sudo-common'
import { SudoUserClient } from '@sudoplatform/sudo-user'
import { ApiClient } from '../private/client/apiClient'
import {
  getIdentityVerificationServiceConfig,
  IdentityVerificationServiceConfig,
} from '../private/config'
import { SudoSecureIdVerificationClientPrivateOptions } from '../private/privateOptions'
import { VerifiedIdentityTransformer } from '../private/transformers/verifiedIdentityTransformer'
import { VerifyIdentityDocumentInputTransformer } from '../private/transformers/verifyIdentityDocumentInputTransformer'
import { VerifyIdentityInputTransformer } from '../private/transformers/verifyIdentityInputTransformer'
import { IdentityDocumentCaptureInfoTransformer } from '../private/transformers/idDocumentCaptureInfoTransformer'
import {
  VerificationMethod,
  VerifiedIdentity,
  VerifyIdentityDocumentInput,
  VerifyIdentityInput,
  IdDocumentCaptureInitiationInfo,
  IdentityDataProcessingConsentContent,
  IdentityDataProcessingConsentContentInput,
  IdentityDataProcessingConsentInput,
  IdentityDataProcessingConsentResponse,
  IdentityDataProcessingConsentStatus,
} from './types'
import { QueryOption } from './types/queryOption'
import { SudoSecureIdVerificationClientOptions } from './types/sudoIdentityVerificationClientOptions'
import { IdentityDataProcessingConsentContentTransformer } from '../private/transformers/identityDataProcessingConsentContentTransformer'
import { IdentityDataProcessingConsentStatusTransformer } from '../private/transformers/identityDataProcessingConsentStatusTransformer'
import { IdentityDataProcessingConsentInputTransformer } from '../private/transformers/identityDataProcessingConsentInputTransformer'

/**
 * Client interface for accessing Secure ID Verification service.
 */
export interface SudoSecureIdVerificationClient {
  /**
   * Resets internal state and clear any cached data.
   */
  reset(): Promise<void>

  /**
   * Retrieves the list of countries for which secure ID verification is supported in the
   * environment.
   *
   * @returns List of ISO 3166-1 alpha-2 country codes.
   *
   * @param {QueryOption} queryOption Control for using local cache or make a network call
   *
   * @throws NotSignedInError
   * @throws UnknownGraphQLError
   * @throws ServiceError
   * @throws FatalError
   */
  listSupportedCountries(queryOption?: QueryOption): Promise<string[]>

  /**
   * Retrieves whether face images must be provided as part of ID document
   * verification.
   *
   * @returns Boolean
   *
   * @throws NotSignedInError
   * @throws UnknownGraphQLError
   * @throws ServiceError
   * @throws FatalError
   */
  isFaceImageRequiredWithDocumentVerification(
    queryOption?: QueryOption,
  ): Promise<boolean>

  /**
   * Retrieves whether face images must be provided as part of ID document
   * capture.
   *
   * @returns Boolean
   *
   * @throws NotSignedInError
   * @throws UnknownGraphQLError
   * @throws ServiceError
   * @throws FatalError
   */
  isFaceImageRequiredWithDocumentCapture(
    queryOption?: QueryOption,
  ): Promise<boolean>

  /**
   * Retrieves whether initiateIdentityDocumentCapture() can be called in the configured
   * service environment.
   *
   * @returns Boolean
   *
   * @throws NotSignedInError
   * @throws UnknownGraphQLError
   * @throws ServiceError
   * @throws FatalError
   */
  isDocumentCaptureInitiationEnabled(
    queryOption?: QueryOption,
  ): Promise<boolean>

  /**
   * Retrieves whether consent is required before identity verification can succeed in the configured
   * service environment.
   *
   * @returns Boolean
   *
   * @throws NotSignedInError
   * @throws UnknownGraphQLError
   * @throws ServiceError
   * @throws FatalError
   */
  isConsentRequiredForVerification(queryOption?: QueryOption): Promise<boolean>

  /**
   * Queries the current identity verification status for the signed in user.
   *
   * @returns Verified identity results.
   *
   * @param {QueryOption} queryOption Control for using local cache or make a network call
   *
   * @throws NotSignedInError
   * @throws ServiceError
   * @throws UnknownGraphQLError
   * @throws FatalError
   */
  checkIdentityVerification(
    queryOption?: QueryOption,
  ): Promise<VerifiedIdentity>

  /**
   * Attempts to verify identity based on provided personally identifiable information (PII).
   *
   * @param {VerifyIdentityInput} pii Dictionary of personally identifiable information required to verify identity.
   *
   * @returns Verified identity results.
   *
   * @throws NotSignedInError
   * @throws {@link ImplausibleAgeError}
   * @throws {@link InvalidAgeError}
   * @throws {@link UnsupportedVerificationMethodError}
   * @throws {@link UnsupportedCountryError}
   * @throws {@link UnsupportedNetworkLocationError}
   * @throws ServiceError
   * @throws UnknownGraphQLError
   * @throws FatalError
   */
  verifyIdentity(pii: VerifyIdentityInput): Promise<VerifiedIdentity>

  /**
   * Attempts to verify identity based on provided identity documents.
   *
   * @returns Verified identity results.
   *
   * @param {VerifyIdentityDocumentInput} idDocumentInfo Identity document information
   *
   * @throws NotSignedInError
   * @throws {@link ImplausibleAgeError}
   * @throws {@link InvalidAgeError}
   * @throws {@link UnsupportedVerificationMethodError}
   * @throws {@link UnsupportedCountryError}
   * @throws {@link UnsupportedNetworkLocationError}
   * @throws ServiceError
   * @throws UnknownGraphQLError
   * @throws FatalError
   */
  verifyIdentityDocument(
    idDocumentInfo: VerifyIdentityDocumentInput,
  ): Promise<VerifiedIdentity>

  /**
   * Attempts to extracts identity information from provided identity documents,
   * and then use that to verify identity.
   *
   * @returns Verified identity results.
   *
   * @param {VerifyIdentityDocumentInput} idDocumentInfo Identity document information
   *
   * @throws NotSignedInError
   * @throws {@link ImplausibleAgeError}
   * @throws {@link InvalidAgeError}
   * @throws {@link UnsupportedVerificationMethodError}
   * @throws {@link UnsupportedCountryError}
   * @throws {@link UnsupportedNetworkLocationError}
   * @throws ServiceError
   * @throws UnknownGraphQLError
   * @throws FatalError
   */
  captureAndVerifyIdentityDocument(
    idDocumentInfo: VerifyIdentityDocumentInput,
  ): Promise<VerifiedIdentity>

  /**
   * Attempt to initiate ID document capture using underlying provider's web
   * based method.
   *
   * @returns Information a client can use to initiate document capture.
   *
   * @throws NotSignedInError
   * @throws {@link IdentityAlreadyVerifiedError}
   * @throws ServiceError
   * @throws UnknownGraphQLError
   * @throws FatalError
   */
  initiateIdentityDocumentCapture(): Promise<IdDocumentCaptureInitiationInfo>

  /**
   * Retrieves the content for identity data processing consent, for a given preferred language
   * (in RFC 5646 format) and content type.
   *
   * @param {IdentityDataProcessingConsentContentInput} input
   *     Preferred content type and language for consent content.
   * @param {QueryOption} queryOption
   *     Control for using local cache or making a network call.
   * @returns Consent content for the given preferences.
   *
   * @throws NotSignedInError
   * @throws UnknownGraphQLError
   * @throws ServiceError
   * @throws FatalError
   */
  getIdentityDataProcessingConsentContent(
    input: IdentityDataProcessingConsentContentInput,
    queryOption?: QueryOption,
  ): Promise<IdentityDataProcessingConsentContent>

  /**
   * Withdraws the user's identity data processing consent.
   *
   * @returns Response indicating if the withdrawal was processed.
   *
   * @throws NotSignedInError
   * @throws UnknownGraphQLError
   * @throws ServiceError
   * @throws FatalError
   */
  withdrawIdentityDataProcessingConsent(): Promise<IdentityDataProcessingConsentResponse>

  /**
   * Retrieves the user's current identity data processing consent status.
   *
   * @param {QueryOption} queryOption
   *     Control for using local cache or making a network call.
   * @returns Consent status for the user.
   *
   * @throws NotSignedInError
   * @throws UnknownGraphQLError
   * @throws ServiceError
   * @throws FatalError
   */
  getIdentityDataProcessingConsentStatus(
    queryOption?: QueryOption,
  ): Promise<IdentityDataProcessingConsentStatus>

  /**
   * Provides the user's identity data processing consent.
   *
   * @param {IdentityDataProcessingConsentInput} input
   *     Consent content, content type, and language.
   * @returns Response indicating if the consent was processed.
   *
   * @throws NotSignedInError
   * @throws UnknownGraphQLError
   * @throws ServiceError
   * @throws FatalError
   */
  provideIdentityDataProcessingConsent(
    input: IdentityDataProcessingConsentInput,
  ): Promise<IdentityDataProcessingConsentResponse>
}

/**
 * Implementation of Secure ID Verification client.
 */
export class DefaultSudoSecureIdVerificationClient
  implements SudoSecureIdVerificationClient
{
  private readonly sudoUserClient: SudoUserClient
  private readonly apiClient: ApiClient
  private readonly identityVerificationServiceConfig: IdentityVerificationServiceConfig
  private readonly logger: Logger

  /**
   * Initializes the Secure ID Verification client.
   *
   * @param {SudoSecureIdVerificationClientOptions} options
   *    Specify the SudoUserClient and Logger to use. If no Logger is
   *    specified, a new one is constructed.
   *
   * @throws ConfigurationSetNotFoundError
   *     If identity verification service is not configured in the environment
   */
  constructor(options: SudoSecureIdVerificationClientOptions) {
    this.sudoUserClient = options.sudoUserClient
    this.logger =
      options.logger ?? new DefaultLogger('Sudo Secure Id Verification', 'info')
    this.logger.info('Initializing the client.')

    const privateOptions =
      options as SudoSecureIdVerificationClientPrivateOptions

    this.identityVerificationServiceConfig =
      privateOptions.identityVerificationServiceConfig ??
      getIdentityVerificationServiceConfig()

    this.apiClient = privateOptions.apiClient ?? new ApiClient()
  }

  /**
   * Resets internal state and clear any cached data.
   */
  reset(): Promise<void> {
    return this.apiClient.reset()
  }

  /**
   * Retrieves the list of countries for which secure ID verification is supported in the
   * environment.
   *
   * @returns List of ISO 3166-1 alpha-2 country codes.
   *
   * @throws NotSignedInError
   * @throws UnknownGraphQLError
   * @throws ServiceError
   * @throws FatalError
   */
  async listSupportedCountries(queryOption?: QueryOption): Promise<string[]> {
    if (!(await this.sudoUserClient.isSignedIn())) {
      throw new NotSignedInError()
    }

    this.logger.info('Listing supported countries for identity verification')
    const capabilities = await this.apiClient.getCapabilities(queryOption)
    return capabilities.supportedCountries
  }

  /**
   * Retrieves whether face images must be provided as part of ID document
   * verification.
   *
   * @returns Boolean
   *
   * @throws NotSignedInError
   * @throws UnknownGraphQLError
   * @throws ServiceError
   * @throws FatalError
   */
  async isFaceImageRequiredWithDocumentVerification(
    queryOption?: QueryOption,
  ): Promise<boolean> {
    if (!(await this.sudoUserClient.isSignedIn())) {
      throw new NotSignedInError()
    }

    this.logger.info(
      'Determining requirement to provide face image with ID document verification.',
    )
    const capabilities = await this.apiClient.getCapabilities(queryOption)
    return capabilities.faceImageRequiredWithDocumentVerification
  }

  /**
   * Retrieves whether face images must be provided as part of ID document
   * capture.
   *
   * @returns Boolean
   *
   * @throws NotSignedInError
   * @throws UnknownGraphQLError
   * @throws ServiceError
   * @throws FatalError
   */
  async isFaceImageRequiredWithDocumentCapture(
    queryOption?: QueryOption,
  ): Promise<boolean> {
    if (!(await this.sudoUserClient.isSignedIn())) {
      throw new NotSignedInError()
    }

    this.logger.info(
      'Determining requirement to provide face image with ID document capture.',
    )
    const capabilities = await this.apiClient.getCapabilities(queryOption)
    return capabilities.faceImageRequiredWithDocumentCapture
  }

  /**
   * Retrieves whether initiateIdentityDocumentCapture() can be called in the configured
   * service environment.
   *
   * @returns Boolean
   *
   * @throws NotSignedInError
   * @throws UnknownGraphQLError
   * @throws ServiceError
   * @throws FatalError
   */
  async isDocumentCaptureInitiationEnabled(
    queryOption?: QueryOption,
  ): Promise<boolean> {
    if (!(await this.sudoUserClient.isSignedIn())) {
      throw new NotSignedInError()
    }

    this.logger.info(
      'Determining requirement to provide face image with ID document',
    )
    const capabilities = await this.apiClient.getCapabilities(queryOption)
    return capabilities.canInitiateDocumentCapture
  }

  /**
   * Retrieves whether consent is required before identity verification can succeed in the configured
   * service environment.
   *
   * @returns Boolean
   *
   * @throws NotSignedInError
   * @throws UnknownGraphQLError
   * @throws ServiceError
   * @throws FatalError
   */
  async isConsentRequiredForVerification(
    queryOption?: QueryOption,
  ): Promise<boolean> {
    if (!(await this.sudoUserClient.isSignedIn())) {
      throw new NotSignedInError()
    }
    this.logger.info(
      'Determining requirement to provide consent before identity verification may proceed',
    )
    const capabilities = await this.apiClient.getCapabilities(queryOption)
    return capabilities.consentRequired
  }
  /**
   * Queries the current identity verification status for the signed in user.
   *
   * @returns Verified identity results.
   *
   * @throws NotSignedInError
   * @throws UnknownGraphQLError
   * @throws ServiceError
   * @throws FatalError
   */
  async checkIdentityVerification(
    queryOption?: QueryOption,
  ): Promise<VerifiedIdentity> {
    if (!(await this.sudoUserClient.isSignedIn())) {
      throw new NotSignedInError()
    }

    this.logger.info('Retrieving current identity verification status')
    const verifiedIdentity =
      await this.apiClient.checkIdentityVerification(queryOption)
    return VerifiedIdentityTransformer.toEntity(verifiedIdentity)
  }

  /**
   * Attempts to verify identity based on provided personally identifiable information (PII).
   *
   * @param {VerifyIdentityInput} pii
   *     Dictionary of personally identifiable information required to
   *     verify identity. The verificationMethod property must be absent
   *     or set to {@link VerificationMethod.KnowledgeOfPII}
   *
   * @returns Verified identity results.
   *
   * @throws NotSignedInError
   * @throws UnknownGraphQLError
   * @throws ServiceError
   * @throws FatalError
   */
  async verifyIdentity(pii: VerifyIdentityInput): Promise<VerifiedIdentity> {
    if (!(await this.sudoUserClient.isSignedIn())) {
      throw new NotSignedInError()
    }

    this.logger.info('Verifying identity using PII')
    if (!pii.verificationMethod) {
      pii.verificationMethod = VerificationMethod.KnowledgeOfPII
    }
    if (pii.verificationMethod !== VerificationMethod.KnowledgeOfPII) {
      throw new IllegalArgumentError(
        `${pii.verificationMethod} is not a supported verification method for verifyIdentity`,
      )
    }

    const input = VerifyIdentityInputTransformer.toGraphQL(pii)

    const verifiedIdentity = await this.apiClient.verifyIdentity(input)

    return VerifiedIdentityTransformer.toEntity(verifiedIdentity)
  }

  /**
   * Attempts to verify identity based on provided identity documents.
   *
   * @returns Verified identity results.
   *
   * @param {VerifyIdentityDocumentInput} idDocumentInfo
   *     Identity document information. The verificationMethod property must
   *     be absent or set to {@link VerificationMethod.GovernmentID}
   *
   * @throws NotSignedInError
   * @throws ConsentRequiredError
   * @throws IllegalArgumentError
   * @throws UnknownGraphQLError
   * @throws ServiceError
   * @throws FatalError
   */
  async verifyIdentityDocument(
    idDocumentInfo: VerifyIdentityDocumentInput,
  ): Promise<VerifiedIdentity> {
    if (!(await this.sudoUserClient.isSignedIn())) {
      throw new NotSignedInError()
    }

    this.logger.info('Verifying identity using document')

    if (!idDocumentInfo.verificationMethod) {
      idDocumentInfo.verificationMethod = VerificationMethod.GovernmentID
    }
    if (idDocumentInfo.verificationMethod !== VerificationMethod.GovernmentID) {
      throw new IllegalArgumentError(
        `${idDocumentInfo.verificationMethod} is not a supported verification method for verifyIdentityDocument`,
      )
    }

    const input =
      VerifyIdentityDocumentInputTransformer.toGraphQL(idDocumentInfo)

    const verifiedIdentity = await this.apiClient.verifyIdentityDocument(input)

    return VerifiedIdentityTransformer.toEntity(verifiedIdentity)
  }

  /**
   * Attempts to extracts identity information from provided identity documents,
   * and then use that to verify identity.
   *
   * @returns Verified identity results.
   *
   * @param {VerifyIdentityDocumentInput} idDocumentInfo
   *     Identity document information. The verificationMethod property must
   *     be absent or set to {@link VerificationMethod.GovernmentID}
   *
   * @throws NotSignedInError
   * @throws IllegalArgumentError
   * @throws UnknownGraphQLError
   * @throws ServiceError
   * @throws FatalError
   */
  async captureAndVerifyIdentityDocument(
    idDocumentInfo: VerifyIdentityDocumentInput,
  ): Promise<VerifiedIdentity> {
    if (!(await this.sudoUserClient.isSignedIn())) {
      throw new NotSignedInError()
    }

    this.logger.info('Capture identity from document and verify')

    if (!idDocumentInfo.verificationMethod) {
      idDocumentInfo.verificationMethod = VerificationMethod.GovernmentID
    }
    if (idDocumentInfo.verificationMethod !== VerificationMethod.GovernmentID) {
      throw new IllegalArgumentError(
        `${idDocumentInfo.verificationMethod} is not a supported verification method for verifyIdentityDocument`,
      )
    }

    const input =
      VerifyIdentityDocumentInputTransformer.toGraphQL(idDocumentInfo)

    const verifiedIdentity =
      await this.apiClient.captureAndVerifyIdentityDocument(input)

    return VerifiedIdentityTransformer.toEntity(verifiedIdentity)
  }

  /**
   * Attempt to initiate ID document capture using underlying provider's web
   * based method.
   *
   * @returns Information a client can use to initiate document capture.
   *
   * @throws NotSignedInError
   * @throws {@link IdentityAlreadyVerifiedError}
   * @throws ServiceError
   * @throws UnknownGraphQLError
   * @throws FatalError
   */
  async initiateIdentityDocumentCapture(): Promise<IdDocumentCaptureInitiationInfo> {
    if (!(await this.sudoUserClient.isSignedIn())) {
      throw new NotSignedInError()
    }

    this.logger.info('Initiate identity document capture')

    const idDocumentCaptureInitiationInfo =
      await this.apiClient.initiateIdentityDocumentCapture()

    return IdentityDocumentCaptureInfoTransformer.toEntity(
      idDocumentCaptureInitiationInfo,
    )
  }

  /**
   * Retrieves the content for identity data processing consent, for a given preferred language
   * (in RFC 5646 format) and content type.
   *
   * @param {IdentityDataProcessingConsentContentInput} input
   *     Preferred content type and language for consent content.
   * @param {QueryOption} queryOption
   *     Control for using local cache or making a network call.
   * @returns Consent content for the given preferences.
   *
   * @throws NotSignedInError
   * @throws UnknownGraphQLError
   * @throws ServiceError
   * @throws FatalError
   */
  async getIdentityDataProcessingConsentContent(
    input: IdentityDataProcessingConsentContentInput,
    queryOption?: QueryOption,
  ): Promise<IdentityDataProcessingConsentContent> {
    if (!(await this.sudoUserClient.isSignedIn())) {
      throw new NotSignedInError()
    }
    this.logger.info('Retrieving identity data processing consent content')
    // The input shape for the public API matches the GraphQL input so no explicit conversion is required
    const content =
      await this.apiClient.getIdentityDataProcessingConsentContent(
        input,
        queryOption,
      )
    return IdentityDataProcessingConsentContentTransformer.toEntity(content)
  }

  /**
   * Withdraws the user's identity data processing consent.
   *
   * @returns Response indicating if the withdrawal was processed.
   *
   * @throws NotSignedInError
   * @throws UnknownGraphQLError
   * @throws ServiceError
   * @throws FatalError
   */
  async withdrawIdentityDataProcessingConsent(): Promise<IdentityDataProcessingConsentResponse> {
    if (!(await this.sudoUserClient.isSignedIn())) {
      throw new NotSignedInError()
    }
    this.logger.info('Withdrawing identity data processing consent')
    const response =
      await this.apiClient.withdrawIdentityDataProcessingConsent()
    return { processed: response.processed }
  }

  /**
   * Retrieves the user's current identity data processing consent status.
   *
   * @param {QueryOption} queryOption
   *     Control for using local cache or making a network call.
   * @returns Consent status for the user.
   *
   * @throws NotSignedInError
   * @throws UnknownGraphQLError
   * @throws ServiceError
   * @throws FatalError
   */
  async getIdentityDataProcessingConsentStatus(
    queryOption?: QueryOption,
  ): Promise<IdentityDataProcessingConsentStatus> {
    if (!(await this.sudoUserClient.isSignedIn())) {
      throw new NotSignedInError()
    }
    this.logger.info('Retrieving identity data processing consent status')
    const status =
      await this.apiClient.getIdentityDataProcessingConsentStatus(queryOption)
    return IdentityDataProcessingConsentStatusTransformer.toEntity(status)
  }

  /**
   * Provides the user's identity data processing consent.
   *
   * @param {IdentityDataProcessingConsentContentInput} input
   *     Consent content, content type, and language.
   * @returns Response indicating if the consent was processed.
   *
   * @throws NotSignedInError
   * @throws UnknownGraphQLError
   * @throws ServiceError
   * @throws FatalError
   */
  async provideIdentityDataProcessingConsent(
    input: IdentityDataProcessingConsentInput,
  ): Promise<IdentityDataProcessingConsentResponse> {
    if (!(await this.sudoUserClient.isSignedIn())) {
      throw new NotSignedInError()
    }
    this.logger.info('Providing identity data processing consent')
    const gqlInput =
      IdentityDataProcessingConsentInputTransformer.toGraphQL(input)
    const response =
      await this.apiClient.provideIdentityDataProcessingConsent(gqlInput)
    return { processed: response.processed }
  }
}
