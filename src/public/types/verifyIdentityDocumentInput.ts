import { IdDocumentType } from './idDocumentType'
import { VerificationMethod } from './verificationMethod'

/**
 * Input to verifyIdentityDocument method
 *
 * @property {VerificationMethod} verificationMethod
 *     Verification method to use to verify data. Must be
 *     {@link VerificationMethod.GovernmentID} if specified.
 *
 * @property {string} imageBase64
 *     Base64 encoded image of front of government ID document
 *
 * @property {string} backImageBase64
 *     Base64 encoded image of back of government ID document
 *
 * @property {string} country
 *     ISO 3166-1 alpha-2 country code, e.g. US.
 *
 * @property {IdDocumentType} documentType
 *     Type of id document being presented.
 */
export interface VerifyIdentityDocumentInput {
  verificationMethod?: VerificationMethod
  imageBase64: string
  backImageBase64: string
  country: string
  documentType: IdDocumentType
}
