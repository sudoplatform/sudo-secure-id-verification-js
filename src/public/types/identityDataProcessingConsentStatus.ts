export interface IdentityDataProcessingConsentStatus {
  consented: boolean
  consentedAtEpochMs?: number
  consentWithdrawnAtEpochMs?: number
  content?: string
  contentType?: string
  language?: string
}
