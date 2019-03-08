/*
 * @flow
 */

import moment from 'moment';
import {
  EntityDataModelApi,
  Constants,
  DataApi,
  PersistentSearchApi,
  SearchApi
} from 'lattice';
import { Map } from 'immutable';
import { call, put, takeEvery } from '@redux-saga/core/effects';

import {
  CREATE_SUBSCRIPTION,
  EXPIRE_SUBSCRIPTION,
  GET_SUBSCRIPTIONS,
  UPDATE_SUBSCRIPTION,
  createSubscription,
  expireSubscription,
  getSubscriptions,
  updateSubscription
} from './SubscribeActionFactory';

import {
  PERSON_DOB_FQN,
  PERSON_LAST_NAME_FQN,
  PERSON_FIRST_NAME_FQN
} from '../../edm/DataModelFqns';

import { APP_TYPES_FQNS } from '../../shared/Consts';

const { OPENLATTICE_ID_FQN } = Constants;
const { PEOPLE_FQN } = APP_TYPES_FQNS;

function* createSubscriptionWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    yield put(createSubscription.request(action.id));

    yield call(PersistentSearchApi.createPersistentSearch, action.value);

    yield put(createSubscription.success(action.id));
    yield put(getSubscriptions());
  }
  catch (error) {
    console.error(error);
    yield put(createSubscription.failure(action.id, error));
  }
  finally {
    yield put(createSubscription.finally(action.id))
  }
}

export function* createSubscriptionWatcher() :Generator<*, *, *> {
  yield takeEvery(CREATE_SUBSCRIPTION, createSubscriptionWorker);
}

function* updateSubscriptionWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    yield put(updateSubscription.request(action.id));

    const { id, expiration } = action.value;
    yield call(PersistentSearchApi.updatePersistentSearchExpiration, id, `"${expiration}"`);

    yield put(updateSubscription.success(action.id));
    yield put(getSubscriptions());
  }
  catch (error) {
    console.error(error);
    yield put(updateSubscription.failure(action.id, error));
  }
  finally {
    yield put(updateSubscription.finally(action.id))
  }
}

export function* updateSubscriptionWatcher() :Generator<*, *, *> {
  yield takeEvery(UPDATE_SUBSCRIPTION, updateSubscriptionWorker);
}

function* expireSubscriptionWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    yield put(expireSubscription.request(action.id));

    yield call(PersistentSearchApi.expirePersistentSearch, action.value);

    yield put(expireSubscription.success(action.id));
    yield put(getSubscriptions());
  }
  catch (error) {
    console.error(error);
    yield put(expireSubscription.failure(action.id, error));
  }
  finally {
    yield put(expireSubscription.finally(action.id))
  }
}

export function* expireSubscriptionWatcher() :Generator<*, *, *> {
  yield takeEvery(EXPIRE_SUBSCRIPTION, expireSubscriptionWorker);
}

function* getSubscriptionsWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    yield put(getSubscriptions.request(action.id));

    const subscriptions = yield call(PersistentSearchApi.loadPersistentSearches, false);

    yield put(getSubscriptions.success(action.id, subscriptions));
  }
  catch (error) {
    console.error(error);
    yield put(getSubscriptions.failure(action.id, error));
  }
  finally {
    yield put(getSubscriptions.finally(action.id))
  }
}

export function* getSubscriptionsWatcher() :Generator<*, *, *> {
  yield takeEvery(GET_SUBSCRIPTIONS, getSubscriptionsWorker);
}
