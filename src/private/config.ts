import { DefaultConfigurationManager } from '@sudoplatform/sudo-common'
import * as t from 'io-ts'

const IdentityVerificationServiceConfigProps = {}

// eslint-disable-next-line tree-shaking/no-side-effects-in-initialization
const IdentityVerificationServiceConfigCodec = t.type(
  IdentityVerificationServiceConfigProps,
)

export type IdentityVerificationServiceConfig = t.TypeOf<
  typeof IdentityVerificationServiceConfigCodec
>

export const getIdentityVerificationServiceConfig =
  (): IdentityVerificationServiceConfig => {
    return DefaultConfigurationManager.getInstance().bindConfigSet<IdentityVerificationServiceConfig>(
      IdentityVerificationServiceConfigCodec,
      'IdentityVerificationService',
    )
  }
