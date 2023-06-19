/*
 * Copyright © 2023 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * PII data that will produce predictable results with the Simulator implementation
 * of an identity verification provider.
 */

export const VALID_IDENTITY = {
  firstName: 'JOHN',
  lastName: 'SMITH',
  address: '222333 PEACHTREE PLACE',
  postalCode: '30318',
  country: 'US',
  dateOfBirth: '1975-02-28',
}

export const VALID_IDENTITY_WITH_CITY_STATE = {
  firstName: 'JOHN',
  lastName: 'SMITH',
  address: '222333 PEACHTREE PLACE',
  postalCode: '30318',
  city: 'ATLANTA',
  state: 'GA',
  country: 'US',
  dateOfBirth: '1975-02-28',
}

export const INVALID_IDENTITY = {
  firstName: 'JACK',
  lastName: 'SMITH',
  address: '222333 PEACHTREE PLACE',
  postalCode: '30318',
  country: 'US',
  dateOfBirth: '1975-02-28',
}
