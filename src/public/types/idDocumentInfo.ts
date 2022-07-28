import { IdDocumentType } from './idDocumentType'

/**
 * Type to hold information needed to construct an identity document verification request,
 * using image resources from the local filesystem.
 *
 * @property {string} country ISO 3166-1 alpha-2 country code, e.g. US.
 * @property {IdDocumentType} documentType Type of id document being presented. One of: driverLicense, passport, idCard
 * @property {string} frontImagePath Filesystem location of image of the front of the id document.
 * @property {string} backImagePath Filesystem location of the image of the back of the id document. For a passport, set to the same value as frontImagePath.
 */
export interface IdDocumentInfo {
  country: string
  documentType: IdDocumentType
  frontImagePath: string
  backImagePath: string
}
