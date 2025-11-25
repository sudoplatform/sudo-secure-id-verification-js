/*
 * Copyright © 2023 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiClientManager,
  DefaultApiClientManager,
} from '@sudoplatform/sudo-api-client'
import {
  FatalError,
  GraphQLNetworkError,
  isGraphQLNetworkError,
  mapNetworkErrorToClientError,
  UnknownGraphQLError,
} from '@sudoplatform/sudo-common'
import {
  CaptureAndVerifyIdentityDocumentDocument,
  CaptureAndVerifyIdentityDocumentMutation,
  CheckIdentityVerificationDocument,
  CheckIdentityVerificationQuery,
  GetIdentityDataProcessingConsentContentDocument,
  GetIdentityDataProcessingConsentContentQuery,
  GetIdentityDataProcessingConsentStatusDocument,
  GetIdentityDataProcessingConsentStatusQuery,
  GetIdentityVerificationCapabilitiesDocument,
  GetIdentityVerificationCapabilitiesQuery,
  IdentityDataProcessingConsentContent,
  IdentityDataProcessingConsentContentInput,
  IdentityDataProcessingConsentInput,
  IdentityDataProcessingConsentResponse,
  IdentityDataProcessingConsentStatus,
  IdentityDocumentCaptureInitiationResponse,
  IdentityVerificationCapabilities,
  InitiateIdentityDocumentCaptureDocument,
  InitiateIdentityDocumentCaptureMutation,
  ProvideIdentityDataProcessingConsentDocument,
  ProvideIdentityDataProcessingConsentMutation,
  VerifiedIdentity,
  VerifyIdentityDocument,
  VerifyIdentityDocumentDocument,
  VerifyIdentityDocumentInput,
  VerifyIdentityDocumentMutation,
  VerifyIdentityInput,
  VerifyIdentityMutation,
  WithdrawIdentityDataProcessingConsentDocument,
  WithdrawIdentityDataProcessingConsentMutation,
} from '../../gen/graphql-types'
import { ErrorTransformer } from '../transformers/errorTransformer'
import { configNamespace } from '../config'
import { GraphQLClient } from '@sudoplatform/sudo-user'
import { GraphQLError } from 'graphql'

/**
 * AppSync wrapper to use to invoke Sudo Secure ID Verification Service APIs.
 */
export class ApiClient {
  private readonly _client: GraphQLClient

  public constructor(apiClientManager?: ApiClientManager) {
    const clientManager =
      apiClientManager ?? DefaultApiClientManager.getInstance()

    this._client = clientManager.getClient({
      configNamespace: configNamespace,
    })
  }

  public async getCapabilities(): Promise<IdentityVerificationCapabilities> {
    let result
    try {
      result =
        await this._client.query<GetIdentityVerificationCapabilitiesQuery>({
          query: GetIdentityVerificationCapabilitiesDocument,
        })
    } catch (err: unknown) {
      const networkError = err as GraphQLNetworkError
      throw this.convertAllErrors(networkError, err)
    }

    const error = result.errors?.[0]
    if (error) {
      throw ErrorTransformer.toClientError(error)
    }

    if (result.data?.getIdentityVerificationCapabilities) {
      return result.data.getIdentityVerificationCapabilities
    } else {
      throw new FatalError(
        'getIdentityVerificationCapabilities did not return any result',
      )
    }
  }

  public async checkIdentityVerification(): Promise<VerifiedIdentity> {
    let result
    try {
      result = await this._client.query<CheckIdentityVerificationQuery>({
        query: CheckIdentityVerificationDocument,
      })
    } catch (err: unknown) {
      const networkError = err as GraphQLNetworkError
      throw this.convertAllErrors(networkError, err)
    }

    const error = result.errors?.[0]
    if (error) {
      throw ErrorTransformer.toClientError(error)
    }

    if (result.data?.checkIdentityVerification) {
      return result.data.checkIdentityVerification
    } else {
      throw new FatalError('unable to retrieve identity verification status')
    }
  }

  public async getIdentityDataProcessingConsentContent(
    input: IdentityDataProcessingConsentContentInput,
  ): Promise<IdentityDataProcessingConsentContent> {
    let result
    try {
      result =
        await this._client.query<GetIdentityDataProcessingConsentContentQuery>({
          query: GetIdentityDataProcessingConsentContentDocument,
          variables: { input },
        })
    } catch (err: unknown) {
      const networkError = err as GraphQLNetworkError
      throw this.convertAllErrors(networkError, err)
    }

    const error = result.errors?.[0]
    if (error) {
      throw ErrorTransformer.toClientError(error)
    }

    if (result.data?.getIdentityDataProcessingConsentContent) {
      return result.data.getIdentityDataProcessingConsentContent
    } else {
      throw new FatalError(
        'unable to get identity data processing consent content',
      )
    }
  }

  public async getIdentityDataProcessingConsentStatus(): Promise<IdentityDataProcessingConsentStatus> {
    let result
    try {
      result =
        await this._client.query<GetIdentityDataProcessingConsentStatusQuery>({
          query: GetIdentityDataProcessingConsentStatusDocument,
        })
    } catch (err: unknown) {
      const networkError = err as GraphQLNetworkError
      throw this.convertAllErrors(networkError, err)
    }

    const error = result.errors?.[0]
    if (error) {
      throw ErrorTransformer.toClientError(error)
    }

    if (result.data?.getIdentityDataProcessingConsentStatus) {
      return result.data.getIdentityDataProcessingConsentStatus
    } else {
      throw new FatalError(
        'unable to get identity data processing consent status',
      )
    }
  }

  public async provideIdentityDataProcessingConsent(
    input: IdentityDataProcessingConsentInput,
  ): Promise<IdentityDataProcessingConsentResponse> {
    let result
    try {
      result =
        await this._client.mutate<ProvideIdentityDataProcessingConsentMutation>(
          {
            mutation: ProvideIdentityDataProcessingConsentDocument,
            variables: { input },
          },
        )
    } catch (err: unknown) {
      const networkError = err as GraphQLNetworkError
      throw this.convertAllErrors(networkError, err)
    }

    const error = result.errors?.[0]
    if (error) {
      throw ErrorTransformer.toClientError(error)
    }

    if (result.data?.provideIdentityDataProcessingConsent) {
      return result.data.provideIdentityDataProcessingConsent
    } else {
      throw new FatalError('unable to provide identity data processing consent')
    }
  }

  public async withdrawIdentityDataProcessingConsent(): Promise<IdentityDataProcessingConsentResponse> {
    let result
    try {
      result =
        await this._client.mutate<WithdrawIdentityDataProcessingConsentMutation>(
          {
            mutation: WithdrawIdentityDataProcessingConsentDocument,
          },
        )
    } catch (err: unknown) {
      const networkError = err as GraphQLNetworkError
      throw this.convertAllErrors(networkError, err)
    }

    const error = result.errors?.[0]
    if (error) {
      throw ErrorTransformer.toClientError(error)
    }

    if (result.data?.withdrawIdentityDataProcessingConsent) {
      return result.data.withdrawIdentityDataProcessingConsent
    } else {
      throw new FatalError(
        'unable to withdraw identity data processing consent',
      )
    }
  }

  public async verifyIdentity(
    pii: VerifyIdentityInput,
  ): Promise<VerifiedIdentity> {
    let result
    try {
      result = await this._client.mutate<VerifyIdentityMutation>({
        mutation: VerifyIdentityDocument,
        variables: { input: pii },
      })
    } catch (err: unknown) {
      const networkError = err as GraphQLNetworkError
      throw this.convertAllErrors(networkError, err)
    }

    const error = result.errors?.[0]
    if (error) {
      throw ErrorTransformer.toClientError(error)
    }

    if (result.data?.verifyIdentity) {
      return result.data.verifyIdentity
    } else {
      throw new FatalError('unable to verify identity')
    }
  }

  public async verifyIdentityDocument(
    idDocumentInfo: VerifyIdentityDocumentInput,
  ): Promise<VerifiedIdentity> {
    let result
    try {
      result = await this._client.mutate<VerifyIdentityDocumentMutation>({
        mutation: VerifyIdentityDocumentDocument,
        variables: { input: idDocumentInfo },
      })
    } catch (err: unknown) {
      const networkError = err as GraphQLNetworkError
      throw this.convertAllErrors(networkError, err)
    }

    const error = result.errors?.[0]
    if (error) {
      throw ErrorTransformer.toClientError(error)
    }

    if (result.data?.verifyIdentityDocument) {
      return result.data.verifyIdentityDocument
    } else {
      throw new FatalError('unable to verify identity document')
    }
  }

  public async captureAndVerifyIdentityDocument(
    idDocumentInfo: VerifyIdentityDocumentInput,
  ): Promise<VerifiedIdentity> {
    let result
    try {
      result =
        await this._client.mutate<CaptureAndVerifyIdentityDocumentMutation>({
          mutation: CaptureAndVerifyIdentityDocumentDocument,
          variables: { input: idDocumentInfo },
        })
    } catch (err: unknown) {
      const networkError = err as GraphQLNetworkError
      throw this.convertAllErrors(networkError, err)
    }

    const error = result.errors?.[0]
    if (error) {
      throw ErrorTransformer.toClientError(error)
    }

    if (result.data?.captureAndVerifyIdentityDocument) {
      return result.data.captureAndVerifyIdentityDocument
    } else {
      throw new FatalError('unable to capture and verify identity document')
    }
  }

  public async initiateIdentityDocumentCapture(): Promise<IdentityDocumentCaptureInitiationResponse> {
    let result
    try {
      result =
        await this._client.mutate<InitiateIdentityDocumentCaptureMutation>({
          mutation: InitiateIdentityDocumentCaptureDocument,
          variables: {},
        })
    } catch (err: unknown) {
      const networkError = err as GraphQLNetworkError
      throw this.convertAllErrors(networkError, err)
    }

    const error = result.errors?.[0]
    if (error) {
      throw ErrorTransformer.toClientError(error)
    }

    if (result.data?.initiateIdentityDocumentCapture) {
      return result.data.initiateIdentityDocumentCapture
    } else {
      throw new FatalError('unable to initiate identity document capture')
    }
  }

  public reset(): Promise<void> {
    return Promise.resolve()
  }

  private convertAllErrors(
    networkError:
      | GraphQLNetworkError
      | (GraphQLError & {
          errorType?: string | null
          errorInfo?: unknown
        })
      | (GraphQLError & {
          errorType?: string | null
          errorInfo?: unknown
        } & Error & {
            networkError: Error & { statusCode?: number }
          }),
    err: unknown,
  ): Error {
    if (isGraphQLNetworkError(networkError)) {
      return mapNetworkErrorToClientError(networkError)
    }

    return this.mapGraphQLCallError(err as Error)
  }
  mapGraphQLCallError = (err: Error): Error => {
    if ('graphQLErrors' in err && Array.isArray(err.graphQLErrors)) {
      const error = err.graphQLErrors[0] as {
        errorType: string
        message: string
      }
      if (error) {
        return ErrorTransformer.toClientError(error)
      }
    }
    if ('errorType' in err) {
      return ErrorTransformer.toClientError(
        err as { errorType: string; message: string },
      )
    }
    return new UnknownGraphQLError(err.message)
  }
}
