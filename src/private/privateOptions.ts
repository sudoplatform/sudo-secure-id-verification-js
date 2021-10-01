import { SudoSecureIdVerificationClientOptions } from '../public/types/sudoIdentityVerificationClientOptions'
import { ApiClient } from './client/apiClient'
import { IdentityVerificationServiceConfig } from './config'

export interface SudoSecureIdVerificationClientPrivateOptions
  extends SudoSecureIdVerificationClientOptions {
  apiClient?: ApiClient
  identityVerificationServiceConfig?: IdentityVerificationServiceConfig
}
