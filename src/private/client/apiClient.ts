import {
  ApiClientManager,
  DefaultApiClientManager,
} from '@sudoplatform/sudo-api-client'
import { FatalError, UnknownGraphQLError } from '@sudoplatform/sudo-common'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { ApolloError } from 'apollo-client'
import { AWSAppSyncClient } from 'aws-appsync'
import {
  CheckIdentityVerificationDocument,
  CheckIdentityVerificationQuery,
  GetSupportedCountriesForIdentityVerificationDocument,
  GetSupportedCountriesForIdentityVerificationQuery,
  SupportedCountries,
  VerifiedIdentity,
  VerifyIdentityDocument,
  VerifyIdentityDocumentDocument,
  VerifyIdentityDocumentInput,
  VerifyIdentityDocumentMutation,
  VerifyIdentityInput,
  VerifyIdentityMutation,
} from '../../gen/graphql-types'
import { QueryOption } from '../../public/types'
import { ErrorTransformer } from '../transformers/errorTransformer'

/**
 * AppSync wrapper to use to invoke Sudo Secure ID Verification Service APIs.
 */
export class ApiClient {
  private readonly _client: AWSAppSyncClient<NormalizedCacheObject>

  public constructor(apiClientManager?: ApiClientManager) {
    const clientManager =
      apiClientManager ?? DefaultApiClientManager.getInstance()

    this._client = clientManager.getClient({ disableOffline: true })
  }

  public async listSupportedCountries(
    queryOption?: QueryOption,
  ): Promise<SupportedCountries> {
    let result
    try {
      result =
        await this._client.query<GetSupportedCountriesForIdentityVerificationQuery>(
          {
            query: GetSupportedCountriesForIdentityVerificationDocument,
            fetchPolicy: queryOption || QueryOption.REMOTE_ONLY,
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

    if (
      result.data?.getSupportedCountriesForIdentityVerification?.countryList
    ) {
      return result.data.getSupportedCountriesForIdentityVerification
    } else {
      throw new FatalError('listSupportedCountries did not return any result')
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
      throw new FatalError('unable to verify identity')
    }
  }

  public async reset(): Promise<void> {
    await this._client.clearStore()
  }
}
