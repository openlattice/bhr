/*
 * @flow
 */

import {
  call,
  put,
  select,
  takeEvery
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  OrderedSet,
  Set,
  fromJS,
} from 'immutable';
import { Constants, DataApi } from 'lattice';
import { Logger } from 'lattice-utils';
import { DateTime } from 'luxon';
import type { SequenceAction } from 'redux-reqseq';

import { cleanBase64ForUpload } from '../../utils/DocumentUtils';
import {
  getFilesESId,
  getIncludesESId,
  getPeopleESId,
} from '../../utils/AppUtils';
import {
  LOAD_USED_TAGS,
  UPLOAD_DOCUMENTS,
  loadUsedTags,
  uploadDocuments,
} from './DocumentsActionFactory';
import {
  COMPLETED_DT_FQN,
  DATETIME_FQN,
  FILE_DATA_FQN,
  FILE_TAG_FQN,
  FILE_TEXT_FQN,
  NAME_FQN,
  TYPE_FQN
} from '../../edm/DataModelFqns';

const { OPENLATTICE_ID_FQN } = Constants;

const LOG = new Logger('DocumentsSagas');

function* loadUsedTagsWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    yield put(loadUsedTags.request(action.id));

    const app = yield select((state) => state.get('app', Map()));
    const propertyTypeIds = yield select((state) => state.getIn(['edm', 'fqnToIdMap'], Map()));
    const filesEntitySetId = getFilesESId(app);
    const tagPropertyTypeId = propertyTypeIds.get(FILE_TAG_FQN);

    const entityTags = yield call(DataApi.getEntitySetData, filesEntitySetId, [tagPropertyTypeId]);
    let allTags = Set();
    entityTags.forEach((entity) => {
      const { [FILE_TAG_FQN]: values } = entity;
      if (values && values.length) {
        values.forEach((tagValue) => {
          allTags = allTags.add(tagValue);
        });
      }
    });

    yield put(loadUsedTags.success(action.id, allTags));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(loadUsedTags.failure(action.id, { error }));
  }
  finally {
    yield put(loadUsedTags.finally(action.id));
  }
}

function* loadUsedTagsWatcher() :Generator<*, *, *> {
  yield takeEvery(LOAD_USED_TAGS, loadUsedTagsWorker);
}

function* uploadDocumentsWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    yield put(uploadDocuments.request(action.id));

    const { files, tags, personEntityKeyIds } = action.value;

    const app = yield select((state) => state.get('app', Map()));
    const propertyTypeIds = yield select((state) => state.getIn(['edm', 'fqnToIdMap'], Map()));

    const filesEntitySetId = getFilesESId(app);
    const includesEntitySetId = getIncludesESId(app);
    const peopleEntitySetId = getPeopleESId(app);

    const tagPropertyTypeId = propertyTypeIds.get(FILE_TAG_FQN);
    const namePropertyTypeId = propertyTypeIds.get(NAME_FQN);
    const typePropertyTypeId = propertyTypeIds.get(TYPE_FQN);
    const fileDataPropertyTypeId = propertyTypeIds.get(FILE_DATA_FQN);
    const fileTextPropertyTypeId = propertyTypeIds.get(FILE_TEXT_FQN);
    const dateTimePropertyTypeId = propertyTypeIds.get(DATETIME_FQN);
    const completedDateTimePropertyTypeId = propertyTypeIds.get(COMPLETED_DT_FQN);

    const now = DateTime.local().toISO();

    const fileEntities = files.map(({
      name,
      type,
      base64
    }) => ({
      [tagPropertyTypeId]: tags.toJS(),
      [dateTimePropertyTypeId]: [now],
      [typePropertyTypeId]: [type],
      [namePropertyTypeId]: [name],
      [fileDataPropertyTypeId]: [{
        'content-type': type,
        data: cleanBase64ForUpload(base64)
      }]
    }));

    const includesEntity = { [completedDateTimePropertyTypeId]: [now] };
    const includesAssociations = [];
    personEntityKeyIds.forEach((personEntityKeyId) => {
      for (let fileIndex = 0; fileIndex < fileEntities.length; fileIndex += 1) {
        includesAssociations.push({
          srcEntitySetId: filesEntitySetId,
          srcEntityIndex: fileIndex,
          dstEntitySetId: peopleEntitySetId,
          dstEntityKeyId: personEntityKeyId,
          data: includesEntity
        });
      }
    });

    const entities = { [filesEntitySetId]: fileEntities };
    const associations = { [includesEntitySetId]: includesAssociations };

    yield call(DataApi.createEntityAndAssociationData, { entities, associations });

    yield put(uploadDocuments.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(uploadDocuments.failure(action.id, { error }));
  }
  finally {
    yield put(uploadDocuments.finally(action.id));
  }
}

function* uploadDocumentsWatcher() :Generator<*, *, *> {
  yield takeEvery(UPLOAD_DOCUMENTS, uploadDocumentsWorker);
}

export {
  loadUsedTagsWatcher,
  loadUsedTagsWorker,
  uploadDocumentsWatcher,
  uploadDocumentsWorker,
};
