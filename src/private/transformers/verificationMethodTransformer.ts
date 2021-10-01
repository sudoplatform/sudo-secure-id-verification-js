import { FatalError } from '@sudoplatform/sudo-common'
import { VerificationMethod } from '../../public/types'

export class VerificationMethodTransformer {
  public static toEntity(graphql: string): VerificationMethod {
    switch (graphql) {
      case 'NONE':
        return VerificationMethod.None
      case 'GOVERNMENT_ID':
        return VerificationMethod.GovernmentID
      case 'KNOWLEDGE_OF_PII':
        return VerificationMethod.KnowledgeOfPII
      default:
        throw new FatalError(
          `Unrecognized verification method '${graphql}' received from service`,
        )
    }
  }

  public static toGraphQL(entity: VerificationMethod): string {
    return entity
  }
}
