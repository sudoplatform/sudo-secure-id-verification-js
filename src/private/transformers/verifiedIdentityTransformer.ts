import { VerifiedIdentity as VerifiedIdentityEntity } from '../../public/types'
import { VerifiedIdentity as VerifiedIdentityGraphQL } from '../../gen/graphql-types'
import { VerificationMethodTransformer } from './verificationMethodTransformer'

export class VerifiedIdentityTransformer {
  public static toEntity(
    graphql: VerifiedIdentityGraphQL,
  ): VerifiedIdentityEntity {
    return {
      owner: graphql.owner,
      verified: graphql.verified,
      verifiedAt:
        graphql.verifiedAtEpochMs === undefined ||
        graphql.verifiedAtEpochMs === null
          ? undefined
          : new Date(graphql.verifiedAtEpochMs),
      verificationMethod: VerificationMethodTransformer.toEntity(
        graphql.verificationMethod,
      ),
      canAttemptVerificationAgain: graphql.canAttemptVerificationAgain,
      idScanUrl: graphql.idScanUrl ?? undefined,
      requiredVerificationMethod:
        graphql.requiredVerificationMethod === undefined ||
        graphql.requiredVerificationMethod === null
          ? undefined
          : VerificationMethodTransformer.toEntity(
              graphql.requiredVerificationMethod,
            ),
    }
  }
}
