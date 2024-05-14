/*
 * Copyright © 2023 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

class IdentityVerificationError extends Error {
  constructor(msg?: string) {
    super(msg)
    this.name = this.constructor.name
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

/**
 * The Verified Identity cannot be found.
 *
 * The Verified Identity attempted to be accessed does not exist or cannot be found.
 */
export class IdentityVerificationRecordNotFoundError extends IdentityVerificationError {
  constructor(msg?: string) {
    super(msg)
  }
}

/**
 * An attempt to update the Verified Identity has failed.
 */
export class IdentityVerificationUpdateFailedError extends IdentityVerificationError {
  constructor(msg?: string) {
    super(msg)
  }
}

/**
 * The method used for verification is unsupported.
 */
export class UnsupportedVerificationMethodError extends IdentityVerificationError {
  constructor(msg?: string) {
    super(msg)
  }
}

/**
 * An implausible age was input for verification.
 */
export class ImplausibleAgeError extends IdentityVerificationError {
  constructor(msg?: string) {
    super(msg)
  }
}

/**
 * An invalid age was input for verification.
 */
export class InvalidAgeError extends IdentityVerificationError {
  constructor(msg?: string) {
    super(msg)
  }
}

/**
 * An unsupported country was associated with an identity to be verified.
 */
export class UnsupportedCountryError extends IdentityVerificationError {
  constructor(msg?: string) {
    super(msg)
  }
}

/**
 * An identity verification attempt was initiated from an unsupported network location.
 */
export class UnsupportedNetworkLocationError extends IdentityVerificationError {
  constructor(msg?: string) {
    super(msg)
  }
}
