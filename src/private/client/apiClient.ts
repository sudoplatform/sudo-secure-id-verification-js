/*
 * Copyright © 2023 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiClientManager,
  DefaultApiClientManager,
} from '@sudoplatform/sudo-api-client'
import { FatalError, UnknownGraphQLError } from '@sudoplatform/sudo-common'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { ApolloError } from 'apollo-client'
import { AWSAppSyncClient } from 'aws-appsync'
import {
  CaptureAndVerifyIdentityDocumentDocument,
  CaptureAndVerifyIdentityDocumentMutation,
  CheckIdentityVerificationDocument,
  CheckIdentityVerificationQuery,
  GetIdentityVerificationCapabilitiesDocument,
  GetIdentityVerificationCapabilitiesQuery,
  IdentityVerificationCapabilities,
  VerifiedIdentity,
  VerifyIdentityDocumentDocument,
  VerifyIdentityDocumentInput,
  VerifyIdentityDocumentMutation,
  VerifyIdentityDocument,
  VerifyIdentityInput,
  VerifyIdentityMutation,
  InitiateIdentityDocumentCaptureDocument,
  InitiateIdentityDocumentCaptureMutation,
  IdentityDocumentCaptureInitiationResponse,
  IdentityDataProcessingConsentContentInput,
  IdentityDataProcessingConsentResponse,
  IdentityDataProcessingConsentInput,
  IdentityDataProcessingConsentStatus,
  GetIdentityDataProcessingConsentContentQuery,
  GetIdentityDataProcessingConsentContentDocument,
  GetIdentityDataProcessingConsentStatusQuery,
  GetIdentityDataProcessingConsentStatusDocument,
  ProvideIdentityDataProcessingConsentMutation,
  ProvideIdentityDataProcessingConsentDocument,
  WithdrawIdentityDataProcessingConsentMutation,
  WithdrawIdentityDataProcessingConsentDocument,
  IdentityDataProcessingConsentContent,
} from '../../gen/graphql-types'
import { QueryOption } from '../../public/types'
import { ErrorTransformer } from '../transformers/errorTransformer'
import { configNamespace } from '../config'

/**
 * AppSync wrapper to use to invoke Sudo Secure ID Verification Service APIs.
 */
export class ApiClient {
  private readonly _client: AWSAppSyncClient<NormalizedCacheObject>

  public constructor(apiClientManager?: ApiClientManager) {
    const clientManager =
      apiClientManager ?? DefaultApiClientManager.getInstance()

    this._client = clientManager.getClient({
      disableOffline: true,
      configNamespace: configNamespace,
    })
  }

  public async getCapabilities(
    queryOption?: QueryOption,
  ): Promise<IdentityVerificationCapabilities> {
    let result
    try {
      result =
        await this._client.query<GetIdentityVerificationCapabilitiesQuery>({
          query: GetIdentityVerificationCapabilitiesDocument,
          fetchPolicy: queryOption || QueryOption.REMOTE_ONLY,
        })
    } catch (err) {
      const apolloError = err as ApolloError
      const error = apolloError.graphQLErrors?.[0]
      if (error) {
        throw ErrorTransformer.toClientError(error)
      } else {
        throw new UnknownGraphQLError(error)
      }
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

  public async checkIdentityVerification(
    queryOption?: QueryOption,
  ): Promise<VerifiedIdentity> {
    let result
    try {
      result = await this._client.query<CheckIdentityVerificationQuery>({
        query: CheckIdentityVerificationDocument,
        fetchPolicy: queryOption || QueryOption.REMOTE_ONLY,
      })
    } catch (err) {
      const apolloError = err as ApolloError
      const error = apolloError.graphQLErrors?.[0]
      if (error) {
        throw ErrorTransformer.toClientError(error)
      } else {
        throw new UnknownGraphQLError(error)
      }
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
    queryOption?: QueryOption,
  ): Promise<IdentityDataProcessingConsentContent> {
    let result
    try {
      result =
        await this._client.query<GetIdentityDataProcessingConsentContentQuery>({
          query: GetIdentityDataProcessingConsentContentDocument,
          variables: { input },
          fetchPolicy: queryOption || QueryOption.REMOTE_ONLY,
        })
    } catch (err) {
      const apolloError = err as ApolloError
      const error = apolloError.graphQLErrors?.[0]
      if (error) {
        throw ErrorTransformer.toClientError(error)
      } else {
        throw new UnknownGraphQLError(error)
      }
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

  public async getIdentityDataProcessingConsentStatus(
    queryOption?: QueryOption,
  ): Promise<IdentityDataProcessingConsentStatus> {
    let result
    try {
      result =
        await this._client.query<GetIdentityDataProcessingConsentStatusQuery>({
          query: GetIdentityDataProcessingConsentStatusDocument,
          fetchPolicy: queryOption || QueryOption.REMOTE_ONLY,
        })
    } catch (err) {
      const apolloError = err as ApolloError
      const error = apolloError.graphQLErrors?.[0]
      if (error) {
        throw ErrorTransformer.toClientError(error)
      } else {
        throw new UnknownGraphQLError(error)
      }
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
            fetchPolicy: 'no-cache',
          },
        )
    } catch (err) {
      const apolloError = err as ApolloError
      const error = apolloError.graphQLErrors?.[0]
      if (error) {
        throw ErrorTransformer.toClientError(error)
      } else {
        throw new UnknownGraphQLError(error)
      }
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
            fetchPolicy: 'no-cache',
          },
        )
    } catch (err) {
      const apolloError = err as ApolloError
      const error = apolloError.graphQLErrors?.[0]
      if (error) {
        throw ErrorTransformer.toClientError(error)
      } else {
        throw new UnknownGraphQLError(error)
      }
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
        fetchPolicy: 'no-cache',
      })
    } catch (err) {
      const apolloError = err as ApolloError
      const error = apolloError.graphQLErrors?.[0]
      if (error) {
        throw ErrorTransformer.toClientError(error)
      } else {
        throw new UnknownGraphQLError(error)
      }
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
        fetchPolicy: 'no-cache',
      })
    } catch (err) {
      const apolloError = err as ApolloError
      const error = apolloError.graphQLErrors?.[0]
      if (error) {
        throw ErrorTransformer.toClientError(error)
      } else {
        throw new UnknownGraphQLError(error)
      }
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
          fetchPolicy: 'no-cache',
        })
    } catch (err) {
      const apolloError = err as ApolloError
      const error = apolloError.graphQLErrors?.[0]
      if (error) {
        throw ErrorTransformer.toClientError(error)
      } else {
        throw new UnknownGraphQLError(error)
      }
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
          fetchPolicy: 'no-cache',
        })
    } catch (err) {
      const apolloError = err as ApolloError
      const error = apolloError.graphQLErrors?.[0]
      if (error) {
        throw ErrorTransformer.toClientError(error)
      } else {
        throw new UnknownGraphQLError(error)
      }
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

  public async reset(): Promise<void> {
    await this._client.clearStore()
  }
}
