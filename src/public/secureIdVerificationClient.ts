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
import {
  VerificationMethod,
  VerifiedIdentity,
  VerifyIdentityDocumentInput,
  VerifyIdentityInput,
} from './types'
import { QueryOption } from './types/queryOption'
import { SudoSecureIdVerificationClientOptions } from './types/sudoIdentityVerificationClientOptions'

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
  isFaceImageRequired(queryOption?: QueryOption): Promise<boolean>

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

    this.apiClient = privateOptions.apiClient ?? new ApiClient()
    this.identityVerificationServiceConfig =
      privateOptions.identityVerificationServiceConfig ??
      getIdentityVerificationServiceConfig()
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
  async isFaceImageRequired(queryOption?: QueryOption): Promise<boolean> {
    if (!(await this.sudoUserClient.isSignedIn())) {
      throw new NotSignedInError()
    }

    this.logger.info(
      'Determining requirement to provide face image with ID document',
    )
    const capabilities = await this.apiClient.getCapabilities(queryOption)
    return capabilities.faceImageRequiredWithDocument
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
}
