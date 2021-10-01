import {
  IdDocument,
  QueryOption,
  SudoSecureIdVerificationClient,
  DefaultSudoSecureIdVerificationClient,
  VerificationMethod,
  IdDocumentType,
  VerifyIdentityDocumentInput,
} from '../../src'
import { ApiClient } from '../../src/private/client/apiClient'
import {
  mock,
  when,
  instance,
  reset,
  anything,
  capture,
  verify,
} from 'ts-mockito'
import {
  DefaultConfigurationManager,
  IllegalArgumentError,
  NotSignedInError,
} from '@sudoplatform/sudo-common'
import * as SimulatorPII from '../data/simulatorPII'
import * as SimulatorDocuments from '../data/simulatorIdDocuments'
import { SudoUserClient } from '@sudoplatform/sudo-user'
import { VerifyIdentityDocumentInputTransformer } from '../../src/private/transformers/verifyIdentityDocumentInputTransformer'
import { SudoSecureIdVerificationClientPrivateOptions } from '../../src/private/privateOptions'
import { VerifyIdentityInputTransformer } from '../../src/private/transformers/verifyIdentityInputTransformer'

describe('SudoSecureIdVerificationClient', () => {
  const sudoUserClientMock = mock<SudoUserClient>()
  const sudoUserClient = instance(sudoUserClientMock)
  const apiClientMock = mock<ApiClient>()
  const apiClient = instance(apiClientMock)

  const config = {
    region: '',
    apiUrl: '',
  }

  DefaultConfigurationManager.getInstance().setConfig(JSON.stringify(config))

  const clientOptions: SudoSecureIdVerificationClientPrivateOptions = {
    sudoUserClient,
    apiClient,
    identityVerificationServiceConfig: {},
  }

  const client: SudoSecureIdVerificationClient =
    new DefaultSudoSecureIdVerificationClient(clientOptions)

  beforeEach(async () => {
    reset(sudoUserClientMock)
    reset(apiClientMock)
    await client.reset()

    when(sudoUserClientMock.isSignedIn()).thenResolve(true)
  })

  afterEach(async () => {
    reset(apiClientMock)
    await client.reset()
  })

  describe('constructor', () => {
    it('should throw ConfigurationSetNotFoundError if no configuration is available', () => {
      const clientOptions: SudoSecureIdVerificationClientPrivateOptions = {
        sudoUserClient,
        apiClient,
      }

      expect(
        () => new DefaultSudoSecureIdVerificationClient(clientOptions),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Configuration set not found. Key: IdentityVerificationService"`,
      )
    })
  })

  describe('listSupportedCountries()', () => {
    it('throws NotSignedInError if not signed in', async () => {
      when(sudoUserClientMock.isSignedIn()).thenResolve(false)
      await expect(client.listSupportedCountries()).rejects.toEqual(
        new NotSignedInError(),
      )
    })

    it('returns successfully', async () => {
      // with no query option
      when(apiClientMock.listSupportedCountries(undefined)).thenResolve({
        countryList: ['US'],
      })

      let supportedCountries = await client.listSupportedCountries()
      expect(supportedCountries).toBeDefined()
      expect(supportedCountries.length).toEqual(1)
      expect(supportedCountries[0]).toEqual('US')

      // with a query option
      when(
        apiClientMock.listSupportedCountries(QueryOption.CACHE_ONLY),
      ).thenResolve({
        countryList: ['US'],
      })

      supportedCountries = await client.listSupportedCountries(
        QueryOption.CACHE_ONLY,
      )
      expect(supportedCountries).toBeDefined()
      expect(supportedCountries.length).toEqual(1)
      expect(supportedCountries[0]).toEqual('US')
    })
  })

  describe('checkIdentityVerification', () => {
    it('throws NotSignedInError if not signed in', async () => {
      when(sudoUserClientMock.isSignedIn()).thenResolve(false)
      await expect(client.checkIdentityVerification()).rejects.toEqual(
        new NotSignedInError(),
      )
    })

    it('returns successfully with default query option', async () => {
      when(apiClientMock.checkIdentityVerification(anything())).thenResolve({
        owner: 'o-uuid',
        verified: false,
        verificationMethod: 'NONE',
        canAttemptVerificationAgain: true,
        requiredVerificationMethod: 'KNOWLEDGE_OF_PII',
      })

      const status = await client.checkIdentityVerification()
      expect(status).toEqual({
        owner: 'o-uuid',
        verified: false,
        verificationMethod: VerificationMethod.None,
        canAttemptVerificationAgain: true,
        requiredVerificationMethod: VerificationMethod.KnowledgeOfPII,
      })

      verify(apiClientMock.checkIdentityVerification(anything())).once()
      const [actualQuery] = capture(
        apiClientMock.checkIdentityVerification,
      ).first()
      expect(actualQuery).toBeUndefined()
    })

    it('returns successfully with non-default query option', async () => {
      when(apiClientMock.checkIdentityVerification(anything())).thenResolve({
        owner: 'o-uuid',
        verified: false,
        verificationMethod: 'NONE',
        canAttemptVerificationAgain: true,
        requiredVerificationMethod: 'KNOWLEDGE_OF_PII',
      })

      const status = await client.checkIdentityVerification(
        QueryOption.CACHE_ONLY,
      )
      expect(status).toEqual({
        owner: 'o-uuid',
        verified: false,
        verificationMethod: VerificationMethod.None,
        canAttemptVerificationAgain: true,
        requiredVerificationMethod: VerificationMethod.KnowledgeOfPII,
      })

      verify(apiClientMock.checkIdentityVerification(anything())).once()
      const [actualQuery] = capture(
        apiClientMock.checkIdentityVerification,
      ).first()
      expect(actualQuery).toEqual(QueryOption.CACHE_ONLY)
    })
  })

  describe('verifyIdentity()', () => {
    it('throws NotSignedInError if not signed in', async () => {
      when(sudoUserClientMock.isSignedIn()).thenResolve(false)
      await expect(
        client.verifyIdentity(SimulatorPII.VALID_IDENTITY),
      ).rejects.toEqual(new NotSignedInError())
    })

    it('throws IllegalArgumentError if unsupported verification method specified', async () => {
      await expect(
        client.verifyIdentity({
          ...SimulatorPII.VALID_IDENTITY,
          verificationMethod: VerificationMethod.GovernmentID,
        }),
      ).rejects.toEqual(
        new IllegalArgumentError(
          'GOVERNMENT_ID is not a supported verification method for verifyIdentity',
        ),
      )
    })

    it('returns successfully', async () => {
      const now = new Date()

      when(apiClientMock.verifyIdentity(anything())).thenResolve({
        owner: 'o-uuid',
        verified: true,
        verificationMethod: 'KNOWLEDGE_OF_PII',
        verifiedAtEpochMs: now.getTime(),
        canAttemptVerificationAgain: false,
        requiredVerificationMethod: 'KNOWLEDGE_OF_PII',
      })

      const verifiedIdentity = await client.verifyIdentity(
        SimulatorPII.VALID_IDENTITY,
      )
      expect(verifiedIdentity.verified).toEqual(true)
      expect(verifiedIdentity.canAttemptVerificationAgain).toEqual(false)
      expect(verifiedIdentity.verifiedAt).toEqual(now)
      expect(verifiedIdentity.verificationMethod).toEqual(
        VerificationMethod.KnowledgeOfPII,
      )
      expect(verifiedIdentity.requiredVerificationMethod).toEqual(
        VerificationMethod.KnowledgeOfPII,
      )

      verify(apiClientMock.verifyIdentity(anything())).once()
      const [actualInput] = capture(apiClientMock.verifyIdentity).first()
      expect(actualInput).toEqual(
        VerifyIdentityInputTransformer.toGraphQL(SimulatorPII.VALID_IDENTITY),
      )
    })
  })

  describe('verifyIdentityDocument()', () => {
    let idDocument: VerifyIdentityDocumentInput
    beforeEach(async () => {
      idDocument = await IdDocument.buildDocumentVerificationRequest({
        country: 'US',
        documentType: IdDocumentType.DriverLicense,
        frontImagePath: SimulatorDocuments.VALID_DRIVERS_LICENSE.frontImagePath,
        backImagePath: SimulatorDocuments.VALID_DRIVERS_LICENSE.backImagePath,
      })
      idDocument.verificationMethod = undefined
    })

    it('throws NotSignedInError if not signed in', async () => {
      when(sudoUserClientMock.isSignedIn()).thenResolve(false)
      await expect(client.verifyIdentityDocument(idDocument)).rejects.toEqual(
        new NotSignedInError(),
      )
    })

    it('throws IllegalArgumentError if unsupported verification method specified', async () => {
      await expect(
        client.verifyIdentityDocument({
          ...idDocument,
          verificationMethod: VerificationMethod.KnowledgeOfPII,
        }),
      ).rejects.toEqual(
        new IllegalArgumentError(
          'KNOWLEDGE_OF_PII is not a supported verification method for verifyIdentityDocument',
        ),
      )
    })

    it('returns successfully', async () => {
      const now = new Date()
      when(apiClientMock.verifyIdentityDocument(anything())).thenResolve({
        owner: 'o-uuid',
        verified: true,
        verificationMethod: 'GOVERNMENT_ID',
        verifiedAtEpochMs: now.getTime(),
        canAttemptVerificationAgain: false,
        requiredVerificationMethod: 'GOVERNMENT_ID',
      })

      const verifiedIdentity = await client.verifyIdentityDocument(idDocument)
      expect(verifiedIdentity.verified).toEqual(true)
      expect(verifiedIdentity.canAttemptVerificationAgain).toEqual(false)
      expect(verifiedIdentity.verifiedAt).toEqual(now)
      expect(verifiedIdentity.verificationMethod).toEqual(
        VerificationMethod.GovernmentID,
      )
      expect(verifiedIdentity.requiredVerificationMethod).toEqual(
        VerificationMethod.GovernmentID,
      )

      verify(apiClientMock.verifyIdentityDocument(anything())).once()
      const [actualInput] = capture(
        apiClientMock.verifyIdentityDocument,
      ).first()
      expect(actualInput).toEqual(
        VerifyIdentityDocumentInputTransformer.toGraphQL(idDocument),
      )
    })
  })
})
