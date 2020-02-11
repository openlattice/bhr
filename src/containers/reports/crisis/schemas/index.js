import { schema as behaviorSchema, uiSchema as behaviorUiSchema } from './BehaviorSchemas';
import { schema as dispositionSchema, uiSchema as dispositionUiSchema } from './DispositionSchemas';
import {
  schema as housingAndEmploymentSchema,
  uiSchema as housingAndEmploymentUiSchema
} from './HousingAndEmploymentSchemas';
import { schema as incidentSchema, uiSchema as incidentUiSchema } from './IncidentSchemas';
import { schema as insuranceSchema, uiSchema as insuranceUiSchema } from './InsuranceSchemas';
import { schema as medicalSchema, uiSchema as medicalUiSchema } from './MedicalSchemas';
import { schema as profileSchema, uiSchema as profileUiSchema } from './ProfileSchemas';
import { schema as threatSchema, uiSchema as threatUiSchema } from './ThreatSchemas';

const schemas = [
  profileSchema,
  incidentSchema,
  behaviorSchema,
  medicalSchema,
  threatSchema,
  housingAndEmploymentSchema,
  insuranceSchema,
  dispositionSchema,
];

const uiSchemas = [
  profileUiSchema,
  incidentUiSchema,
  behaviorUiSchema,
  medicalUiSchema,
  threatUiSchema,
  housingAndEmploymentUiSchema,
  insuranceUiSchema,
  dispositionUiSchema,
];

const xSchemas = {
  profile: profileSchema,
  incident: incidentSchema,
  behavior: behaviorSchema,
  medical: medicalSchema,
  threat: threatSchema,
  housingAndEmployment: housingAndEmploymentSchema,
  insurance: insuranceSchema,
  disposition: dispositionSchema,
};

const xUiSchemas = {
  profile: profileUiSchema,
  incident: incidentUiSchema,
  behavior: behaviorUiSchema,
  medical: medicalUiSchema,
  threat: threatUiSchema,
  housingAndEmployment: housingAndEmploymentUiSchema,
  insurance: insuranceUiSchema,
  disposition: dispositionUiSchema,
};

export {
  schemas,
  uiSchemas,
  xSchemas,
  xUiSchemas,
};