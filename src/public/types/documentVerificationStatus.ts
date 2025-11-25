/*
 * Copyright © 2024 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

export enum DocumentVerificationStatus {
  // ID document is not required
  NotRequired = 'notRequired',
  // ID document is required but has not yet uploaded
  NotAttempted = 'notAttempted',
  // capture URL has been generated but not opened
  CaptureInitiated = 'captureInitiated',
  // capture URL has been opened but documents not yet submitted
  CaptureLinkOpened = 'captureLinkOpened',
  // capture URL has been opened too many times as per provider
  CaptureRetryLimitExceeded = 'captureRetryLimitExceeded',
  // capture URL was not opened within the allowed time window
  CaptureLinkTimeout = 'captureLinkTimeout',
  // capture URL was never opened and has expired
  CaptureLinkExpired = 'captureLinkExpired',
  // ID document images have been uploaded and is being processed
  Pending = 'pending',
  // ID document images are unable to be read. For example the may be too small,
  // too large, too dim, too bright, have reflections, incomplete
  DocumentUnreadable = 'documentUnreadable',
  // ID document images could not be verified
  Failed = 'failed',
  // ID document images were successfully verified
  Succeeded = 'succeeded',
}
