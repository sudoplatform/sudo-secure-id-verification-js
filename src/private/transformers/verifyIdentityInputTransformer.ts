import { VerifyIdentityInput as VerifyIdentityInputEntity } from '../../public/types'
import { VerifyIdentityInput as VerifyIdentityInputGraphQL } from '../../gen/graphql-types'
import { VerificationMethodTransformer } from './verificationMethodTransformer'

export class VerifyIdentityInputTransformer {
  public static toGraphQL(
    entity: VerifyIdentityInputEntity,
  ): VerifyIdentityInputGraphQL {
    return {
      verificationMethod:
        entity.verificationMethod === undefined
          ? undefined
          : VerificationMethodTransformer.toGraphQL(entity.verificationMethod),
      firstName: entity.firstName,
      lastName: entity.lastName,
      address: entity.address,
      city: entity.city,
      state: entity.state,
      postalCode: entity.postalCode,
      country: entity.country,
      dateOfBirth: entity.dateOfBirth,
    }
  }
}
