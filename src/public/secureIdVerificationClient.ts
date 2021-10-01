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
 * Client interface for accessinmg Secure ID Verification service.
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
   * @throws {@link NotSignedInError}
   * @throws {@link UnknownGraphQLError}
   * @throws {@link ServiceError}
   * @throws {@link FatalError}
   */
  listSupportedCountries(queryOption?: QueryOption): Promise<string[]>

  /**
   * Queries the current identity verification status for the signed in user.
   *
   * @returns Verified identity results.
   *
   * @param {QueryOption} queryOption Control for using local cache or make a network call
   *
   * @throws {@link NotSignedInError}
   * @throws {@link UnknownGraphQLError}
   * @throws {@link ServiceError}
   * @throws {@link FatalError}
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
   * @throws {@link NotSignedInError}
   * @throws {@link UnknownGraphQLError}
   * @throws {@link ServiceError}
   * @throws {@link FatalError}
   */
  verifyIdentity(pii: VerifyIdentityInput): Promise<VerifiedIdentity>

  /**
   * Attempts to verify identity based on provided identity documents.
   *
   * @returns Verified identity results.
   *
   * @param {VerifyIdentityDocumentInput} idDocumentInfo Identity document information
   *
   * @throws {@link NotSignedInError}
   * @throws {@link UnknownGraphQLError}
   * @throws {@link ServiceError}
   * @throws {@link FatalError}
   */
  verifyIdentityDocument(
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
   * @param {SudoUserClient} options.sudoUserClient SudoUserClient to use
   * @param {Logger} options.logger Existing logger. If not specified, a new one is constructed.
   * @param {ApiClient} options.apiClient Undocumented
   *
   * @throws {@link ConfigurationSetNotFoundError}
   *     If identity verification serivce is not configured in the environment
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
   * @throws {@link NotSignedInError}
   * @throws {@link UnknownGraphQLError}
   * @throws {@link ServiceError}
   * @throws {@link FatalError}
   */
  async listSupportedCountries(queryOption?: QueryOption): Promise<string[]> {
    if (!(await this.sudoUserClient.isSignedIn())) {
      throw new NotSignedInError()
    }

    this.logger.info('Listing supported countries for identity verification')
    const supportedCountries = await this.apiClient.listSupportedCountries(
      queryOption,
    )
    return supportedCountries.countryList
  }

  /**
   * Queries the current identity verification status for the signed in user.
   *
   * @returns Verified identity results.
   *
   * @throws {@link NotSignedInError}
   * @throws {@link UnknownGraphQLError}
   * @throws {@link ServiceError}
   * @throws {@link FatalError}
   */
  async checkIdentityVerification(
    queryOption?: QueryOption,
  ): Promise<VerifiedIdentity> {
    if (!(await this.sudoUserClient.isSignedIn())) {
      throw new NotSignedInError()
    }

    this.logger.info('Retrieving current identity verification status')
    const verifiedIdentity = await this.apiClient.checkIdentityVerification(
      queryOption,
    )
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
   * @throws {@link NotSignedInError}
   * @throws {@link UnknownGraphQLError}
   * @throws {@link ServiceError}
   * @throws {@link FatalError}
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
   * @throws {@link NotSignedInError}
   * @throws {@link IllegalArgumentError}
   * @throws {@link UnknownGraphQLError}
   * @throws {@link ServiceError}
   * @throws {@link FatalError}
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
}
