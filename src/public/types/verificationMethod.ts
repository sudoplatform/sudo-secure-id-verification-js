/**
 * Method of identity verification
 */
export enum VerificationMethod {
  /**
   * None. Returned when a user's identity has not yet been verified.
   */
  None = 'NONE',

  /**
   * Identity verification by providing knowledge of PII
   */
  KnowledgeOfPII = 'KNOWLEDGE_OF_PII',

  /**
   * Identity verification by providing images of a government issued
   * identity document.
   */
  GovernmentID = 'GOVERNMENT_ID',
}
