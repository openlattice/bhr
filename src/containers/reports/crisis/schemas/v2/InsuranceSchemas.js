import { DataProcessingUtils } from 'lattice-fabricate';

import * as FQN from '../../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import {
  INSURANCE,
  INSURANCE_NO_SECONDARY,
  PRIMARY,
  SECONDARY,
  SELECT_ONLY_ONE
} from '../constants';

const { INSURANCE_FQN } = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  properties: {
    [getPageSectionKey(7, 1)]: {
      type: 'object',
      title: 'Insurance',
      properties: {
        [getEntityAddressKey(0, INSURANCE_FQN, FQN.ORGANIZATION_NAME_FQN)]: {
          type: 'array',
          title: 'Primary Insurance',
          description: SELECT_ONLY_ONE,
          items: {
            type: 'string',
            enum: INSURANCE,
          },
          sharedProperty: {
            property: FQN.GENERAL_STATUS_FQN,
            value: PRIMARY,
          },
          uniqueItems: true
        },
        [getEntityAddressKey(0, INSURANCE_FQN, FQN.GENERAL_STATUS_FQN)]: {
          type: 'string',
          title: 'Type',
          default: PRIMARY,
          skipPopulate: true,
        },
        [getEntityAddressKey(1, INSURANCE_FQN, FQN.ORGANIZATION_NAME_FQN)]: {
          type: 'array',
          title: 'Secondary Insurance',
          description: SELECT_ONLY_ONE,
          items: {
            type: 'string',
            enum: INSURANCE_NO_SECONDARY,
          },
          sharedProperty: {
            property: FQN.GENERAL_STATUS_FQN,
            value: SECONDARY,
          },
          uniqueItems: true
        },
        [getEntityAddressKey(1, INSURANCE_FQN, FQN.GENERAL_STATUS_FQN)]: {
          type: 'string',
          title: 'Type',
          default: SECONDARY,
          skipPopulate: true,
        },
      },
      required: [
        getEntityAddressKey(0, INSURANCE_FQN, FQN.ORGANIZATION_NAME_FQN),
        getEntityAddressKey(0, INSURANCE_FQN, FQN.GENERAL_STATUS_FQN),
        getEntityAddressKey(1, INSURANCE_FQN, FQN.ORGANIZATION_NAME_FQN),
        getEntityAddressKey(1, INSURANCE_FQN, FQN.GENERAL_STATUS_FQN),
      ]
    }
  }
};

const uiSchema = {
  [getPageSectionKey(7, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': {
      editable: true
    },
    [getEntityAddressKey(0, INSURANCE_FQN, FQN.ORGANIZATION_NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'OtherRadioWidget',
      'ui:options': {
        mode: 'button',
        row: true,
      }
    },
    [getEntityAddressKey(0, INSURANCE_FQN, FQN.GENERAL_STATUS_FQN)]: {
      'ui:widget': 'hidden'
    },
    [getEntityAddressKey(1, INSURANCE_FQN, FQN.ORGANIZATION_NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'OtherRadioWidget',
      'ui:options': {
        mode: 'button',
        row: true,
      }
    },
    [getEntityAddressKey(1, INSURANCE_FQN, FQN.GENERAL_STATUS_FQN)]: {
      'ui:widget': 'hidden'
    },
  }
};

export {
  schema,
  uiSchema,
};
