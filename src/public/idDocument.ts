/**
 * Helper to load identity documents and prepare for submission to the
 * Identity Verification Service.
 */
import fs from 'fs'
import {
  IdDocumentInfo,
  VerificationMethod,
  VerifyIdentityDocumentInput,
} from './types'

/**
 * Utility class for preparing identity document verification requests.
 *
 * Image files can be in JPG, GIF or PNG format.
 */
export class IdDocument {
  /**
   * Load document image from filesystem and Base 64 encode for use with Identity Verification
   * Service.
   *
   * @param imagePath Filesystem location of image file.
   */
  private static loadAndEncodeImage(imagePath: string): Promise<string> {
    const imageBuf = fs.readFileSync(imagePath, 'binary')
    return Promise.resolve(Buffer.from(imageBuf, 'binary').toString('base64'))
  }

  /**
   * Prepare an identity document verification request.
   *
   * @param idDocumentInfo Data needed to build an identity document verification request.
   */
  static async buildDocumentVerificationRequest(
    idDocumentInfo: IdDocumentInfo,
  ): Promise<VerifyIdentityDocumentInput> {
    const ret = {
      verificationMethod: VerificationMethod.GovernmentID,
      country: idDocumentInfo.country,
      documentType: idDocumentInfo.documentType,
      imageBase64: await this.loadAndEncodeImage(idDocumentInfo.frontImagePath),
      backImageBase64: await this.loadAndEncodeImage(
        idDocumentInfo.backImagePath,
      ),
    }

    return ret
  }
}
