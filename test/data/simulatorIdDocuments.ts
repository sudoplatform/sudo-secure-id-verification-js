/*
 * Copyright © 2023 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Identity documents for use with identity verification services using
 * the simulator.
 */
import { IdDocumentInfo, IdDocumentType } from '../../src'

export const VALID_DRIVERS_LICENSE: IdDocumentInfo = {
  country: 'US',
  documentType: IdDocumentType.DriverLicense,
  frontImagePath:
    './test/sudo-identity-verification-test-data/data/id-document-images/simulator/drivers-license-front-success.jpg',
  backImagePath:
    './test/sudo-identity-verification-test-data/data/id-document-images/simulator/drivers-license-back-success.jpg',
  faceImagePath: undefined,
}

export const VALID_DRIVERS_LICENSE_WITH_FACE_IMAGE: IdDocumentInfo = {
  country: 'US',
  documentType: IdDocumentType.DriverLicense,
  frontImagePath:
    './test/sudo-identity-verification-test-data/data/id-document-images/simulator/drivers-license-front-success.jpg',
  backImagePath:
    './test/sudo-identity-verification-test-data/data/id-document-images/simulator/drivers-license-back-success.jpg',
  faceImagePath:
    './test/sudo-identity-verification-test-data/data/id-document-images/simulator/face-image-match.jpg',
}

export const UNREADABLE_DRIVERS_LICENSE: IdDocumentInfo = {
  country: 'US',
  documentType: IdDocumentType.DriverLicense,
  frontImagePath:
    './test/sudo-identity-verification-test-data/data/id-document-images/simulator/drivers-license-front-unreadable.gif',
  backImagePath:
    './test/sudo-identity-verification-test-data/data/id-document-images/simulator/drivers-license-back-unreadable.gif',
  faceImagePath: undefined,
}

export const UNREADABLE_DRIVERS_LICENSE_WITH_FACE_IMAGE: IdDocumentInfo = {
  country: 'US',
  documentType: IdDocumentType.DriverLicense,
  frontImagePath:
    './test/sudo-identity-verification-test-data/data/id-document-images/simulator/drivers-license-front-unreadable.gif',
  backImagePath:
    './test/sudo-identity-verification-test-data/data/id-document-images/simulator/drivers-license-back-unreadable.gif',
  faceImagePath:
    './test/sudo-identity-verification-test-data/data/id-document-images/simulator/face-image-match.jpg',
}

export const VALID_PASSPORT: IdDocumentInfo = {
  country: 'US',
  documentType: IdDocumentType.Passport,
  frontImagePath:
    './test/sudo-identity-verification-test-data/data/id-document-images/simulator/passport-success.jpg',
  backImagePath:
    './test/sudo-identity-verification-test-data/data/id-document-images/simulator/passport-success.jpg',
  faceImagePath: undefined,
}

export const VALID_PASSPORT_WITH_FACE_IMAGE: IdDocumentInfo = {
  country: 'US',
  documentType: IdDocumentType.Passport,
  frontImagePath:
    './test/sudo-identity-verification-test-data/data/id-document-images/simulator/passport-success.jpg',
  backImagePath:
    './test/sudo-identity-verification-test-data/data/id-document-images/simulator/passport-success.jpg',
  faceImagePath:
    './test/sudo-identity-verification-test-data/data/id-document-images/simulator/face-image-match.jpg',
}
