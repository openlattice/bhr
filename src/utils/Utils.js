/*
 * @flow
 */

import Lattice from 'lattice';
import LatticeAuth from 'lattice-auth';
import isString from 'lodash/isString';
import isUUID from 'validator/lib/isUUID';
import parseInt from 'lodash/parseInt';

// injected by Webpack.DefinePlugin
declare var __ENV_DEV__ :boolean;

const { AuthUtils } = LatticeAuth;

/**
 * @deprecated - replace with "isValidUuid" from "lattice" package
 */
export function isValidUuid(value :any) :boolean {

  return isString(value) && isUUID(value);
}

/**
 * @deprecated - use randomStringId() instead
 */
export function randomId() :string {

  // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  // not meant to be a cryptographically strong random id
  return Math.random().toString(36).slice(2);
}

export function randomStringId() :string {

  // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  // https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id
  // not meant to be a cryptographically strong random id
  return Math.random().toString(36).slice(2) + (new Date()).getTime().toString(36);
}

export function getCurrentPage() :number {

  const slashIndex :number = window.location.hash.lastIndexOf('/');
  const page = window.location.hash.substring(slashIndex + 1);
  return parseInt(page, 10);
}

export function getLatticeConfigBaseUrl() :string {

  // TODO: this probably doesn't belong here, also hardcoded strings == not great
  let baseUrl = 'localhost';
  if (!__ENV_DEV__) {
    baseUrl = window.location.host.startsWith('staging') ? 'staging' : 'production';
  }
  return baseUrl;
}

export function resetLatticeConfig() :void {

  Lattice.configure({
    authToken: AuthUtils.getAuthToken(),
    baseUrl: getLatticeConfigBaseUrl(),
  });
}
