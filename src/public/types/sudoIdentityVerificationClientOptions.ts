import { Logger } from '@sudoplatform/sudo-common'
import { SudoUserClient } from '@sudoplatform/sudo-user'

/**
 * Options to DefaultSudoSecureIdVerificationClient constructor
 *
 * @property {SudoUserClient} sudoUserClient
 *     SudoUserClient to use. No default.
 *
 * @property {Logger} logger
 *     Logger to use. Default: a new DefaultLogger is constructed and used.
 */
export interface SudoSecureIdVerificationClientOptions {
  sudoUserClient: SudoUserClient
  logger?: Logger
}
