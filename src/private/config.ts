import { DefaultConfigurationManager } from '@sudoplatform/sudo-common'
import { type, TypeOf } from 'io-ts'

const IdentityVerificationServiceConfigProps = {}

const IdentityVerificationServiceConfigCodec = type(
  IdentityVerificationServiceConfigProps,
)

export type IdentityVerificationServiceConfig = TypeOf<
  typeof IdentityVerificationServiceConfigCodec
>

export const getIdentityVerificationServiceConfig =
  (): IdentityVerificationServiceConfig => {
    return DefaultConfigurationManager.getInstance().bindConfigSet<IdentityVerificationServiceConfig>(
      IdentityVerificationServiceConfigCodec,
      'IdentityVerificationService',
    )
  }
