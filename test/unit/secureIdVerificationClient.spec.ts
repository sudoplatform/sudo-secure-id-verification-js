/*
 * Copyright © 2023 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DefaultSudoSecureIdVerificationClient,
  DocumentVerificationStatus,
  IdDocument,
  IdDocumentType,
  SudoSecureIdVerificationClient,
  VerificationMethod,
  VerifyIdentityDocumentInput,
} from '../../src'
import { ApiClient } from '../../src/private/client/apiClient'
import {
  anything,
  capture,
  instance,
  mock,
  reset,
  verify,
  when,
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
      when(apiClientMock.getCapabilities()).thenResolve({
        supportedCountries: ['US'],
        faceImageRequiredWithDocumentCapture: false,
        faceImageRequiredWithDocumentVerification: false,
        canInitiateDocumentCapture: false,
        consentRequired: false,
      })

      let supportedCountries = await client.listSupportedCountries()
      expect(supportedCountries).toBeDefined()
      expect(supportedCountries.length).toEqual(1)
      expect(supportedCountries[0]).toEqual('US')

      // with a query option
      supportedCountries = await client.listSupportedCountries()
      expect(supportedCountries).toBeDefined()
      expect(supportedCountries.length).toEqual(1)
      expect(supportedCountries[0]).toEqual('US')

      verify(apiClientMock.getCapabilities()).twice()
    })
  })

  describe('isFaceImageRequiredWithDocumentVerification()', () => {
    it('throws NotSignedInError if not signed in', async () => {
      when(sudoUserClientMock.isSignedIn()).thenResolve(false)
      await expect(
        client.isFaceImageRequiredWithDocumentVerification(),
      ).rejects.toEqual(new NotSignedInError())
    })

    it('returns successfully', async () => {
      // with no query option
      when(apiClientMock.getCapabilities()).thenResolve({
        supportedCountries: ['US'],
        faceImageRequiredWithDocumentCapture: false,
        faceImageRequiredWithDocumentVerification: false,
        canInitiateDocumentCapture: false,
        consentRequired: false,
      })

      let isFaceImageRequiredWithDocumentVerification =
        await client.isFaceImageRequiredWithDocumentVerification()
      expect(isFaceImageRequiredWithDocumentVerification).toBeFalsy()

      // with a query option
      isFaceImageRequiredWithDocumentVerification =
        await client.isFaceImageRequiredWithDocumentVerification()
      expect(isFaceImageRequiredWithDocumentVerification).toBeFalsy()
    })
  })

  describe('isFaceImageRequiredWithDocumentCapture()', () => {
    it('throws NotSignedInError if not signed in', async () => {
      when(sudoUserClientMock.isSignedIn()).thenResolve(false)
      await expect(
        client.isFaceImageRequiredWithDocumentCapture(),
      ).rejects.toEqual(new NotSignedInError())
    })

    it('returns successfully', async () => {
      // with no query option
      when(apiClientMock.getCapabilities()).thenResolve({
        supportedCountries: ['US'],
        faceImageRequiredWithDocumentCapture: false,
        faceImageRequiredWithDocumentVerification: false,
        canInitiateDocumentCapture: false,
        consentRequired: false,
      })

      let isFaceImageRequiredWithDocumentCapture =
        await client.isFaceImageRequiredWithDocumentCapture()
      expect(isFaceImageRequiredWithDocumentCapture).toBeFalsy()

      // with a query option
      isFaceImageRequiredWithDocumentCapture =
        await client.isFaceImageRequiredWithDocumentCapture()
      expect(isFaceImageRequiredWithDocumentCapture).toBeFalsy()
    })
  })

  describe('isDocumentCaptureInitiationEnabled()', () => {
    it('throws NotSignedInError if not signed in', async () => {
      when(sudoUserClientMock.isSignedIn()).thenResolve(false)
      await expect(client.isDocumentCaptureInitiationEnabled()).rejects.toEqual(
        new NotSignedInError(),
      )
    })

    it('returns successfully', async () => {
      // with no query option
      when(apiClientMock.getCapabilities()).thenResolve({
        supportedCountries: ['US'],
        faceImageRequiredWithDocumentCapture: false,
        faceImageRequiredWithDocumentVerification: false,
        canInitiateDocumentCapture: true,
        consentRequired: false,
      })

      let canInitiateDocumentCapture =
        await client.isDocumentCaptureInitiationEnabled()
      expect(canInitiateDocumentCapture).toBeTruthy()

      // with a query option
      canInitiateDocumentCapture =
        await client.isDocumentCaptureInitiationEnabled()
      expect(canInitiateDocumentCapture).toBeTruthy()
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
      const now = new Date()
      const epoch = new Date(0)

      when(apiClientMock.checkIdentityVerification()).thenResolve({
        owner: 'o-uuid',
        verified: false,
        verificationMethod: 'NONE',
        canAttemptVerificationAgain: true,
        requiredVerificationMethod: 'KNOWLEDGE_OF_PII',
        acceptableDocumentTypes: [],
        documentVerificationStatus: 'notRequired',
        verifiedAtEpochMs: epoch.getTime(),
        verificationLastAttemptedAtEpochMs: now.getTime(),
        attemptsRemaining: 2,
      })

      const status = await client.checkIdentityVerification()
      expect(status).toEqual({
        owner: 'o-uuid',
        verified: false,
        verificationMethod: VerificationMethod.None,
        canAttemptVerificationAgain: true,
        requiredVerificationMethod: VerificationMethod.KnowledgeOfPII,
        acceptableDocumentTypes: [],
        documentVerificationStatus: DocumentVerificationStatus.NotRequired,
        verifiedAt: epoch,
        verificationLastAttemptedAt: now,
        attemptsRemaining: 2,
      })

      verify(apiClientMock.checkIdentityVerification()).once()
      const [actualQuery] = capture(
        apiClientMock.checkIdentityVerification,
      ).first()
      expect(actualQuery).toBeUndefined()
    })

    it('returns successfully with non-default query option', async () => {
      const now = new Date()
      const epoch = new Date(0)

      when(apiClientMock.checkIdentityVerification()).thenResolve({
        owner: 'o-uuid',
        verified: false,
        verificationMethod: 'NONE',
        canAttemptVerificationAgain: true,
        requiredVerificationMethod: 'KNOWLEDGE_OF_PII',
        acceptableDocumentTypes: [],
        documentVerificationStatus: 'notRequired',
        verifiedAtEpochMs: epoch.getTime(),
        verificationLastAttemptedAtEpochMs: now.getTime(),
        attemptsRemaining: 2,
      })

      const status = await client.checkIdentityVerification()
      expect(status).toEqual({
        owner: 'o-uuid',
        verified: false,
        verificationMethod: VerificationMethod.None,
        canAttemptVerificationAgain: true,
        requiredVerificationMethod: VerificationMethod.KnowledgeOfPII,
        acceptableDocumentTypes: [],
        documentVerificationStatus: DocumentVerificationStatus.NotRequired,
        verifiedAt: epoch,
        verificationLastAttemptedAt: now,
        attemptsRemaining: 2,
      })

      verify(apiClientMock.checkIdentityVerification()).once()
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
        acceptableDocumentTypes: [],
        documentVerificationStatus: 'notRequired',
        verificationLastAttemptedAtEpochMs: now.getTime(),
        attemptsRemaining: 0,
      })

      const verifiedIdentity = await client.verifyIdentity(
        SimulatorPII.VALID_IDENTITY,
      )
      expect(verifiedIdentity).toEqual({
        owner: 'o-uuid',
        verified: true,
        verifiedAt: now,
        verificationMethod: VerificationMethod.KnowledgeOfPII,
        canAttemptVerificationAgain: false,
        requiredVerificationMethod: VerificationMethod.KnowledgeOfPII,
        acceptableDocumentTypes: [],
        documentVerificationStatus: DocumentVerificationStatus.NotRequired,
        verificationLastAttemptedAt: now,
        attemptsRemaining: 0,
      })

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
        faceImagePath: undefined,
      })
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
        acceptableDocumentTypes: [],
        documentVerificationStatus: 'succeeded',
        verificationLastAttemptedAtEpochMs: now.getTime(),
        attemptsRemaining: 0,
      })

      const verifiedIdentity = await client.verifyIdentityDocument(idDocument)
      expect(verifiedIdentity).toEqual({
        owner: 'o-uuid',
        verified: true,
        verifiedAt: now,
        verificationMethod: VerificationMethod.GovernmentID,
        canAttemptVerificationAgain: false,
        requiredVerificationMethod: VerificationMethod.GovernmentID,
        acceptableDocumentTypes: [],
        documentVerificationStatus: DocumentVerificationStatus.Succeeded,
        verificationLastAttemptedAt: now,
        attemptsRemaining: 0,
      })

      verify(apiClientMock.verifyIdentityDocument(anything())).once()
      const [actualInput] = capture(
        apiClientMock.verifyIdentityDocument,
      ).first()
      expect(actualInput).toEqual(
        VerifyIdentityDocumentInputTransformer.toGraphQL(idDocument),
      )
    })

    it('returns successfully - face image supplied', async () => {
      const now = new Date()

      when(apiClientMock.verifyIdentityDocument(anything())).thenResolve({
        owner: 'o-uuid',
        verified: true,
        verificationMethod: 'GOVERNMENT_ID',
        verifiedAtEpochMs: now.getTime(),
        canAttemptVerificationAgain: false,
        requiredVerificationMethod: 'GOVERNMENT_ID',
        acceptableDocumentTypes: [],
        documentVerificationStatus: 'succeeded',
        verificationLastAttemptedAtEpochMs: now.getTime(),
        attemptsRemaining: 2,
      })

      const idDocumentWithFaceImage: VerifyIdentityDocumentInput =
        await IdDocument.buildDocumentVerificationRequest({
          country: 'US',
          documentType: IdDocumentType.DriverLicense,
          frontImagePath:
            SimulatorDocuments.VALID_DRIVERS_LICENSE.frontImagePath,
          backImagePath: SimulatorDocuments.VALID_DRIVERS_LICENSE.backImagePath,
          faceImagePath: SimulatorDocuments.VALID_DRIVERS_LICENSE.faceImagePath,
        })

      const verifiedIdentity = await client.verifyIdentityDocument(
        idDocumentWithFaceImage,
      )
      expect(verifiedIdentity).toEqual({
        owner: 'o-uuid',
        verified: true,
        verifiedAt: now,
        verificationMethod: VerificationMethod.GovernmentID,
        canAttemptVerificationAgain: false,
        requiredVerificationMethod: VerificationMethod.GovernmentID,
        acceptableDocumentTypes: [],
        documentVerificationStatus: DocumentVerificationStatus.Succeeded,
        verificationLastAttemptedAt: now,
        attemptsRemaining: 2,
      })

      verify(apiClientMock.verifyIdentityDocument(anything())).once()
      const [actualInput] = capture(
        apiClientMock.verifyIdentityDocument,
      ).first()
      expect(actualInput).toEqual(
        VerifyIdentityDocumentInputTransformer.toGraphQL(idDocument),
      )
    })
  })

  describe('initiateIdentityDocumentCapture()', () => {
    it('throws NotSignedInError if not signed in', async () => {
      when(sudoUserClientMock.isSignedIn()).thenResolve(false)
      await expect(client.initiateIdentityDocumentCapture()).rejects.toEqual(
        new NotSignedInError(),
      )
    })

    it('returns successfully', async () => {
      // with no query option
      when(apiClientMock.initiateIdentityDocumentCapture()).thenResolve({
        documentCaptureUrl: 'https://mock-url',
        expiryAtEpochSeconds: Math.floor(Date.now() / 1000),
      })

      const identityDocumentCaptureInitiationInfo =
        await client.initiateIdentityDocumentCapture()
      expect(identityDocumentCaptureInitiationInfo).toBeDefined()
      expect(identityDocumentCaptureInitiationInfo.documentCaptureUrl).toEqual(
        'https://mock-url',
      )
      expect(
        identityDocumentCaptureInitiationInfo.expiryAtEpochSeconds,
      ).toBeGreaterThan(0)
      expect(
        identityDocumentCaptureInitiationInfo.expiryAtEpochSeconds,
      ).toBeLessThan(Date.now() / 1000)
    })
  })

  describe('getIdentityDataProcessingConsentContent()', () => {
    it('throws NotSignedInError if not signed in', async () => {
      when(sudoUserClientMock.isSignedIn()).thenResolve(false)
      await expect(
        client.getIdentityDataProcessingConsentContent({
          preferredContentType: 'text/html',
          preferredLanguage: 'en-US',
        }),
      ).rejects.toEqual(new NotSignedInError())
    })

    it('returns successfully', async () => {
      when(
        apiClientMock.getIdentityDataProcessingConsentContent(anything()),
      ).thenResolve({
        content: '<p>Consent</p>',
        contentType: 'text/html',
        language: 'en-US',
      })
      const result = await client.getIdentityDataProcessingConsentContent({
        preferredContentType: 'text/html',
        preferredLanguage: 'en-US',
      })
      expect(result).toEqual({
        content: '<p>Consent</p>',
        contentType: 'text/html',
        language: 'en-US',
      })
      verify(
        apiClientMock.getIdentityDataProcessingConsentContent(anything()),
      ).once()
    })
  })

  describe('getIdentityDataProcessingConsentStatus()', () => {
    it('throws NotSignedInError if not signed in', async () => {
      when(sudoUserClientMock.isSignedIn()).thenResolve(false)
      await expect(
        client.getIdentityDataProcessingConsentStatus(),
      ).rejects.toEqual(new NotSignedInError())
    })

    it('returns successfully', async () => {
      when(apiClientMock.getIdentityDataProcessingConsentStatus()).thenResolve({
        consented: true,
        consentedAtEpochMs: 123456789,
        consentWithdrawnAtEpochMs: undefined,
        content: '<p>Consent</p>',
        contentType: 'text/html',
        language: 'en-US',
      })
      const result = await client.getIdentityDataProcessingConsentStatus()
      expect(result).toEqual({
        consented: true,
        consentedAtEpochMs: 123456789,
        consentWithdrawnAtEpochMs: undefined,
        content: '<p>Consent</p>',
        contentType: 'text/html',
        language: 'en-US',
      })
      verify(apiClientMock.getIdentityDataProcessingConsentStatus()).once()
    })
  })

  describe('provideIdentityDataProcessingConsent()', () => {
    it('throws NotSignedInError if not signed in', async () => {
      when(sudoUserClientMock.isSignedIn()).thenResolve(false)
      await expect(
        client.provideIdentityDataProcessingConsent({
          content: '<p>Consent</p>',
          contentType: 'text/html',
          language: 'en-US',
        }),
      ).rejects.toEqual(new NotSignedInError())
    })

    it('returns successfully and transforms input', async () => {
      when(
        apiClientMock.provideIdentityDataProcessingConsent(anything()),
      ).thenResolve({
        processed: true,
      })
      const result = await client.provideIdentityDataProcessingConsent({
        content: '<p>Consent</p>',
        contentType: 'text/html',
        language: 'en-US',
      })
      expect(result).toEqual({ processed: true })
      verify(
        apiClientMock.provideIdentityDataProcessingConsent(anything()),
      ).once()

      const [arg1] = capture(
        apiClientMock.provideIdentityDataProcessingConsent,
      ).first()
      expect(arg1).toMatchObject({
        content: '<p>Consent</p>',
        contentType: 'text/html',
        language: 'en-US',
      })
    })
  })

  describe('withdrawIdentityDataProcessingConsent()', () => {
    it('throws NotSignedInError if not signed in', async () => {
      when(sudoUserClientMock.isSignedIn()).thenResolve(false)
      await expect(
        client.withdrawIdentityDataProcessingConsent(),
      ).rejects.toEqual(new NotSignedInError())
    })

    it('returns successfully', async () => {
      when(apiClientMock.withdrawIdentityDataProcessingConsent()).thenResolve({
        processed: true,
      })
      const result = await client.withdrawIdentityDataProcessingConsent()
      expect(result).toEqual({ processed: true })
      verify(apiClientMock.withdrawIdentityDataProcessingConsent()).once()
    })
  })
})
