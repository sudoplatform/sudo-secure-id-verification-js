import { GraphQLError } from 'graphql'

/**
 * Type for AppSync errors.
 */
export type AppSyncError = GraphQLError & {
  errorType?: string | null
}
