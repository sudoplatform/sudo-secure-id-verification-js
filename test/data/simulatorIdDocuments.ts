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
}

export const VALID_PASSPORT: IdDocumentInfo = {
  country: 'US',
  documentType: IdDocumentType.Passport,
  frontImagePath:
    './test/sudo-identity-verification-test-data/data/id-document-images/simulator/passport-success.jpg',
  backImagePath:
    './test/sudo-identity-verification-test-data/data/id-document-images/simulator/passport-success.jpg',
}
