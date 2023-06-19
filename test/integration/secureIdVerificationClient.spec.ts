/*
 * Copyright © 2023 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * These tests currently assume execution against an IDV instance using the Platform internal
 * simulator. Some tests may not pass when run against an IDV instance using IDology in sandbox
 * mode, and all tests will likely fail against an IDV instance in production mode.
 */
import { DefaultApiClientManager } from '@sudoplatform/sudo-api-client'
import { DefaultConfigurationManager } from '@sudoplatform/sudo-common'
import { DefaultSudoEntitlementsClient } from '@sudoplatform/sudo-entitlements'
import { DefaultSudoEntitlementsAdminClient } from '@sudoplatform/sudo-entitlements-admin'
import {
  DefaultSudoUserClient,
  TESTAuthenticationProvider,
} from '@sudoplatform/sudo-user'
import { existsSync, readFileSync } from 'fs'
import { TextDecoder, TextEncoder } from 'util'
import { v4 } from 'uuid'
import {
  DefaultSudoSecureIdVerificationClient,
  IdDocument,
  QueryOption,
  VerificationMethod,
  VerifiedIdentity,
} from '../../src'
import * as SimulatorDocuments from '../data/simulatorIdDocuments'
import * as SimulatorPII from '../data/simulatorPII'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as typeof global.TextDecoder

// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-member-access
global.crypto = require('crypto').webcrypto
global.fetch = require('node-fetch')

if (typeof btoa === 'undefined') {
  global.btoa = function (b) {
    return Buffer.from(b, 'binary').toString('base64')
  }
}

if (typeof atob === 'undefined') {
  global.atob = function (a) {
    return Buffer.from(a, 'base64').toString('binary')
  }
}

describe('SudoSecureIdVerificationClient', () => {
  const configFilePath = 'config/sudoplatformconfig.json'
  const testKeyPath = 'config/register_key.private'
  const testKeyIdPath = 'config/register_key.id'

  if (
    existsSync(configFilePath) &&
    existsSync(testKeyPath) &&
    existsSync(testKeyIdPath)
  ) {
    const verifyIdentityUserEntitledName =
      'sudoplatform.identity-verification.verifyIdentityUserEntitled'
    const config = readFileSync(configFilePath, 'utf8')
    const testKey = readFileSync(testKeyPath, 'ascii').trim()
    const testKeyId = readFileSync(testKeyIdPath, 'ascii').trim()
    const testAuthenticationProvider = new TESTAuthenticationProvider(
      'mytest',
      testKey,
      testKeyId,
    )

    DefaultConfigurationManager.getInstance().setConfig(config)

    const sudoUserClient = new DefaultSudoUserClient()
    DefaultApiClientManager.getInstance().setAuthClient(sudoUserClient)
    const sudoEntitlementsClient = new DefaultSudoEntitlementsClient(
      sudoUserClient,
    )
    const sudoEntitlementsAdminClient = new DefaultSudoEntitlementsAdminClient(
      process.env.ADMIN_API_KEY || 'IAM',
    )
    const client = new DefaultSudoSecureIdVerificationClient({ sudoUserClient })

    /**
     * New user for each test, so we can exercise different verification scenarios.
     */
    beforeEach(async () => {
      await sudoUserClient.registerWithAuthenticationProvider(
        testAuthenticationProvider,
        v4(),
      )
      await sudoUserClient.signInWithKey()

      const externalId = await sudoEntitlementsClient.getExternalId()
      await sudoEntitlementsAdminClient.applyEntitlementsToUser(externalId, [
        { name: verifyIdentityUserEntitledName, value: 1 },
      ])
      await sudoEntitlementsClient.redeemEntitlements()

      await expect(sudoUserClient.isSignedIn()).resolves.toEqual(true)
      await client.reset()
      await expect(sudoUserClient.isSignedIn()).resolves.toEqual(true)
    }, 30000)

    afterEach(async () => {
      await sudoUserClient.deregister()
    }, 20000)

    /**
     * Helpers
     */
    async function validateUnverifiedResponse(
      verifiedIdentity: VerifiedIdentity,
    ): Promise<void> {
      const subject = await sudoUserClient.getSubject()
      expect(verifiedIdentity).toBeDefined()
      expect(verifiedIdentity.owner).toEqual(subject)
      expect(verifiedIdentity.verified).toEqual(false)
      expect(verifiedIdentity.canAttemptVerificationAgain).toEqual(true)
      expect(verifiedIdentity.verificationMethod).toEqual(
        VerificationMethod.None,
      )
      expect(verifiedIdentity.verifiedAt ?? new Date(0)).toEqual(new Date(0))
      expect(verifiedIdentity.idScanUrl ?? '').toHaveLength(0)
      expect(verifiedIdentity.requiredVerificationMethod).toEqual(
        VerificationMethod.KnowledgeOfPII,
      )
    }

    async function validatePiiVerifiedResponse(
      verifiedIdentity: VerifiedIdentity,
    ): Promise<void> {
      const subject = await sudoUserClient.getSubject()
      expect(verifiedIdentity).toBeDefined()
      expect(verifiedIdentity.owner).toEqual(subject)
      expect(verifiedIdentity.verified).toEqual(true)
      expect(verifiedIdentity.canAttemptVerificationAgain).toEqual(false)
      expect(verifiedIdentity.verificationMethod).toEqual(
        VerificationMethod.KnowledgeOfPII,
      )
      expect(verifiedIdentity.requiredVerificationMethod).toEqual(
        VerificationMethod.KnowledgeOfPII,
      )
      expect(verifiedIdentity.verifiedAt?.getTime()).toBeGreaterThan(0)
    }

    async function validateIdDocumentVerifiedResponse(
      verifiedIdentity: VerifiedIdentity,
    ): Promise<void> {
      const subject = await sudoUserClient.getSubject()
      expect(verifiedIdentity).toBeDefined()
      expect(verifiedIdentity.owner).toEqual(subject)
      expect(verifiedIdentity.verified).toEqual(true)
      expect(verifiedIdentity.canAttemptVerificationAgain).toEqual(false)
      expect(verifiedIdentity.verificationMethod).toEqual(
        VerificationMethod.GovernmentID,
      )
      expect(verifiedIdentity.verifiedAt?.getTime()).toBeGreaterThan(0)
      expect(verifiedIdentity.requiredVerificationMethod).toBe(
        VerificationMethod.GovernmentID,
      )
    }

    /**
     * Tests
     */
    it('list supported countries', async () => {
      const supportedCountries: string[] = await client.listSupportedCountries()

      // Regardless of the environment, the supported countries list should
      // be empty and contain ISO 3166-2 character country codes.
      expect(supportedCountries).toBeDefined()
      expect(supportedCountries.length).toBeGreaterThanOrEqual(1)
      supportedCountries.forEach((element) => {
        expect(element.length).toBe(2)
      })
    }, 20000)

    it('list supported countries - cache empty', async () => {
      try {
        await client.listSupportedCountries(QueryOption.CACHE_ONLY)
      } catch (err: unknown) {
        const error = err as Error
        expect(error.name).toBe('FatalError')
      }
    }, 20000)

    it('list supported countries - cache test', async () => {
      let supportedCountries: string[] = await client.listSupportedCountries(
        QueryOption.REMOTE_ONLY,
      )

      // Regardless of the environment, the supported countries list should
      // be empty and contain ISO 3166-2 character country codes.
      expect(supportedCountries).toBeDefined()
      expect(supportedCountries.length).toBeGreaterThanOrEqual(1)
      supportedCountries.forEach((element) => {
        expect(element.length).toBe(2)
      })

      supportedCountries = await client.listSupportedCountries(
        QueryOption.CACHE_ONLY,
      )
      expect(supportedCountries).toBeDefined()
      expect(supportedCountries.length).toBeGreaterThanOrEqual(1)
      supportedCountries.forEach((element) => {
        expect(element.length).toBe(2)
      })
    }, 25000)

    it('check idv status for newly registered user', async () => {
      const verifiedIdentity = await client.checkIdentityVerification()
      await validateUnverifiedResponse(verifiedIdentity)
    }, 20000)

    it('check idv status for newly registered user - cache test', async () => {
      let verifiedIdentity = await client.checkIdentityVerification(
        QueryOption.REMOTE_ONLY,
      )
      await validateUnverifiedResponse(verifiedIdentity)

      verifiedIdentity = await client.checkIdentityVerification(
        QueryOption.CACHE_ONLY,
      )
      await validateUnverifiedResponse(verifiedIdentity)
    }, 25000)

    it('successful pii idv with test data, with city and state omitted', async () => {
      let verifiedIdentity = await client.checkIdentityVerification()
      await validateUnverifiedResponse(verifiedIdentity)

      verifiedIdentity = await client.verifyIdentity(
        SimulatorPII.VALID_IDENTITY,
      )
      await validatePiiVerifiedResponse(verifiedIdentity)

      verifiedIdentity = await client.checkIdentityVerification()
      await validatePiiVerifiedResponse(verifiedIdentity)
    }, 30000)

    it('successful pii idv with test data, including city and state', async () => {
      let verifiedIdentity = await client.checkIdentityVerification()
      await validateUnverifiedResponse(verifiedIdentity)

      verifiedIdentity = await client.verifyIdentity(
        SimulatorPII.VALID_IDENTITY_WITH_CITY_STATE,
      )
      await validatePiiVerifiedResponse(verifiedIdentity)

      verifiedIdentity = await client.checkIdentityVerification()
      await validatePiiVerifiedResponse(verifiedIdentity)
    }, 30000)

    it('successful pii idv with test data, including null city and state', async () => {
      let verifiedIdentity = await client.checkIdentityVerification()
      await validateUnverifiedResponse(verifiedIdentity)

      verifiedIdentity = await client.verifyIdentity(
        Object.assign({}, SimulatorPII.VALID_IDENTITY, {
          city: undefined,
          state: undefined,
        }),
      )
      await validatePiiVerifiedResponse(verifiedIdentity)

      verifiedIdentity = await client.checkIdentityVerification()
      await validatePiiVerifiedResponse(verifiedIdentity)
    }, 30000)

    it('successful pii idv with test data, including undefined city and state', async () => {
      let verifiedIdentity = await client.checkIdentityVerification()
      await validateUnverifiedResponse(verifiedIdentity)

      verifiedIdentity = await client.verifyIdentity(
        Object.assign({}, SimulatorPII.VALID_IDENTITY, {
          city: undefined,
          state: undefined,
        }),
      )
      await validatePiiVerifiedResponse(verifiedIdentity)

      verifiedIdentity = await client.checkIdentityVerification()
      await validatePiiVerifiedResponse(verifiedIdentity)
    }, 30000)

    it('unsuccessful pii idv with test data', async () => {
      let verifiedIdentity = await client.checkIdentityVerification()
      await validateUnverifiedResponse(verifiedIdentity)

      verifiedIdentity = await client.verifyIdentity(
        SimulatorPII.INVALID_IDENTITY,
      )
      await validateUnverifiedResponse(verifiedIdentity)

      verifiedIdentity = await client.checkIdentityVerification()
      await validateUnverifiedResponse(verifiedIdentity)
    }, 30000)

    it('repeated unsuccessful pii idv with test data, reaching max retries', async () => {
      // Needs different data for each invocation otherwise repeated attempts with the same data
      // in a small timeframe are ignored by the IDV service.
      let attempt = 1
      while (true) {
        const verifiedIdentity = await client.verifyIdentity(
          Object.assign({}, SimulatorPII.INVALID_IDENTITY, {
            lastName: `${SimulatorPII.INVALID_IDENTITY.lastName}${attempt}`,
          }),
        )
        expect(verifiedIdentity.verified).toBeFalsy()
        if (!verifiedIdentity.canAttemptVerificationAgain) {
          break
        }
        attempt++
      }
    }, 60000)

    it('unsuccessful pii idv due to bad verification method', async () => {
      let verifiedIdentity = await client.checkIdentityVerification()
      await validateUnverifiedResponse(verifiedIdentity)

      try {
        verifiedIdentity = await client.verifyIdentity(
          Object.assign({}, SimulatorPII.VALID_IDENTITY, {
            verificationMethod: 'PII_OR_SOMETHING' as VerificationMethod,
          }),
        )
        fail('Expected exception was not thrown.')
      } catch (UnknownGraphQLError) {
        // expected
      }
    }, 30000)

    it('successful idv using driver license after PII', async () => {
      let verifiedIdentity = await client.checkIdentityVerification()
      await validateUnverifiedResponse(verifiedIdentity)

      // verification using id document must be on top of an attempt
      // using PII
      verifiedIdentity = await client.verifyIdentity(
        SimulatorPII.INVALID_IDENTITY,
      )
      await validateUnverifiedResponse(verifiedIdentity)

      const idDocument = await IdDocument.buildDocumentVerificationRequest(
        SimulatorDocuments.VALID_DRIVERS_LICENSE,
      )

      verifiedIdentity = await client.verifyIdentityDocument(idDocument)
      await validateIdDocumentVerifiedResponse(verifiedIdentity)
    }, 60000)

    it('successful idv using passport after PII', async () => {
      let verifiedIdentity = await client.checkIdentityVerification()
      await validateUnverifiedResponse(verifiedIdentity)

      // verification using id document must be on top of an attempt
      // using PII
      verifiedIdentity = await client.verifyIdentity(
        SimulatorPII.VALID_IDENTITY,
      )
      await validatePiiVerifiedResponse(verifiedIdentity)

      const idDocument = await IdDocument.buildDocumentVerificationRequest(
        SimulatorDocuments.VALID_PASSPORT,
      )

      verifiedIdentity = await client.verifyIdentityDocument(idDocument)
      await validateIdDocumentVerifiedResponse(verifiedIdentity)
    }, 60000)

    it('unsuccessful idv using driver license without prior PII attempt', async () => {
      let verifiedIdentity = await client.checkIdentityVerification()
      await validateUnverifiedResponse(verifiedIdentity)

      const idDocument = await IdDocument.buildDocumentVerificationRequest(
        SimulatorDocuments.VALID_DRIVERS_LICENSE,
      )

      try {
        verifiedIdentity = await client.verifyIdentityDocument(idDocument)
        fail('Expected exception was not thrown.')
      } catch (UnknownGraphQLError) {
        // expected
      }
    }, 60000)
  } else {
    it('Skip all tests.', () => {
      console.log(
        'No sudoplatformconfig.json, test key and test key ID file found. Skipping all integration tests.',
      )
    })
  }
})
