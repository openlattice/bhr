/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormGroup, FormControl, Col } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';
import TimePicker from 'react-bootstrap-time-picker';

import FormNav from './FormNav';
import { TitleLabel, LabelDescription, InlineRadio, PaddedRow, SectionHeader, ErrorMessage } from '../shared/Layout';
import { FORM_PATHS, FORM_ERRORS } from '../shared/Consts';
import { getNumberValidation, getDateValidation } from '../shared/Validation';


const REQUIRED_VALIDITIES = ['complaintNumberValid'];

class ReportInfoView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sectionFormatErrors: [],
      sectionRequiredErrors: [FORM_ERRORS.IS_REQUIRED],
      complaintNumberValid: true,
      cadNumberValid: true,
      dateOccurredValid: true,
      sectionValid: false,
      didClickNav: false
    }
  }
  
  static propTypes = {
    input: PropTypes.object.isRequired,
    handleTextInput: PropTypes.func.isRequired,
    handleDateInput: PropTypes.func.isRequired,
    handleTimeInput: PropTypes.func.isRequired,
    handleSingleSelection: PropTypes.func.isRequired,
    isInReview: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    section: PropTypes.string.isRequired
  }

  bootstrapValidation = (name, required) => {
    const inputValid = this.state[`${name}Valid`];
    const input = this.props.input[name];
    // If required, show error for invalid input only if user has tried to navigate to next/prev section
    if (!inputValid && this.state.didClickNav || required && input.length < 1 && this.state.didClickNav) return 'error';
    // Show error if there is input and it is invalid 
    if (input && input.length && !inputValid) return 'error';
  }

  validateOnInput = (input, name, fieldType, required) => {
    const validStateKey = `${name}Valid`;
    let inputValid = this.state[validStateKey];
    let sectionFormatErrors = this.state.sectionFormatErrors.slice();
    let sectionRequiredErrors = this.state.sectionRequiredErrors.slice();

    switch(fieldType) {
      case 'number':
        const idx = sectionFormatErrors.indexOf(FORM_ERRORS.INVALID_FORMAT);
        console.log('idx:', idx);
        if (input && isNaN(input)) {
          inputValid = false;
          if (idx === -1) {
            sectionFormatErrors.push(FORM_ERRORS.INVALID_FORMAT);
          }
        } else {
          inputValid = true;
          if (idx !== -1) {
            sectionFormatErrors.splice(idx);
          }
        }
        break;
      default:
        break;
    }

    if (required) {
      const idx = sectionRequiredErrors.indexOf(FORM_ERRORS.IS_REQUIRED);
      if (!input) {
        if (idx === -1) {
          sectionRequiredErrors.push(FORM_ERRORS.IS_REQUIRED);
        }
        inputValid = false;
      } else {
        let allRequiredFieldsAreValid = true;
        REQUIRED_VALIDITIES.forEach((validity) => {
          if (!validity) {
            allRequiredFieldsAreValid = false;
            return;
          };
        });
        if (allRequiredFieldsAreValid) {
          sectionRequiredErrors.splice(idx);
        }
      }
    }

    this.setState({
      sectionFormatErrors,
      sectionRequiredErrors,
      [validStateKey]: inputValid
    }, () => {
      if (this.state.complaintNumberValid) {
        this.setState({ sectionValid: true });
      } else {
        this.setState({ sectionValid: false });
      }
    });
  }

  handleTextInput = (e, name, fieldType, required) => {
    const {input} = this.props;
    const isRequired = required || false;
    this.props.handleTextInput(e);
    this.validateOnInput(input[name], name, fieldType, isRequired);
  } 

  setDidClickNav = () => {
    this.setState({ didClickNav: true });
  }

  handlePageChange = (path) => {
    this.setState({ didClickNav: true });
    if (!this.state.sectionValid) {
      console.log('section not valid!');
      // show errors
    } else {
      this.props.handlePageChange(path);
    }
  }

  renderErrors = () => {
    console.log('state required errors:', this.state.sectionRequiredErrors);
    const formatErrors = this.state.sectionFormatErrors.map((error) => <ErrorMessage key={error}>{error}</ErrorMessage>);
    let requiredErrors = [];
    if (this.state.didClickNav) {
      requiredErrors = this.state.sectionRequiredErrors.map((error) => <ErrorMessage key={error}>{error}</ErrorMessage>);
    };

    return (
      <div>
        {formatErrors}
        {requiredErrors}
      </div>
    );
  }

  render() {
    const {
      section,
      handleTextInput,
      handleDateInput,
      handleTimeInput,
      handleSingleSelection,
      input,
      isInReview,
      handlePageChange
    } = this.props;

    const requiredFieldStates = {
      complaintNumber: this.state.complaintNoIsValid
    }

    return (
      <div>
        { !isInReview() ? <SectionHeader>Report Info</SectionHeader> : null}
        <PaddedRow>
          <Col lg={6}>
              <TitleLabel>1. Primary Reason for Dispatch</TitleLabel>
              <FormControl data-section={section} name='dispatchReason' value={input.dispatchReason} onChange={(e) => this.handleTextInput(e, 'dispatchReason', 'string')} disabled={isInReview()} />
          </Col>
          <Col lg={6}>
            <FormGroup validationState={this.bootstrapValidation('complaintNumber', true)}>
              <TitleLabel>2. Complaint Number*</TitleLabel>
              <FormControl data-section={section} name='complaintNumber' value={input.complaintNumber} onChange={(e) => this.handleTextInput(e, 'complaintNumber', 'number', true)} disabled={isInReview()} />
            </FormGroup>
          </Col>
        </PaddedRow>

         <PaddedRow>
           <Col lg={6}>
             <TitleLabel>3. Companion Offense Report Prepared</TitleLabel>
             <InlineRadio
                inline
                data-section={section}
                name='companionOffenseReport'
                value={true}
                checked={input.companionOffenseReport === 'true'}
                onChange={handleSingleSelection}
                disabled={isInReview()} >Yes</InlineRadio>
            <InlineRadio
                inline
                data-section={section}
                name ='companionOffenseReport'
                value={false}
                checked={input.companionOffenseReport === 'false'}
                onChange={handleSingleSelection}
                disabled={isInReview()} >No</InlineRadio>
          </Col>
          <Col lg={6}>
            <TitleLabel>4. Crime / Incident</TitleLabel>
            <FormControl data-section={section} name='incident' value={input.incident} onChange={(e) => this.handleTextInput(e, 'incident', 'string')} disabled={isInReview()} />
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={12}>
            <TitleLabel>5. Location of Offense / Incident</TitleLabel>
            <FormControl data-section={section} name='locationOfIncident' value={input.locationOfIncident} onChange={(e) => this.handleTextInput(e, 'locationOfIncident', 'string')} disabled={isInReview()} />
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>6. Unit</TitleLabel>
            <FormControl data-section={section} name='unit' value={input.unit} onChange={(e) => this.handleTextInput(e, 'unit', 'string')} disabled={isInReview()} />
          </Col>
          <Col lg={6}>
            <TitleLabel>7. Post of Occurrence</TitleLabel>
            <FormControl data-section={section} name='postOfOccurrence' value={input.postOfOccurrence} onChange={(e) => this.handleTextInput(e, 'postOfOccurrence', 'string')} disabled={isInReview()} />
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <FormGroup validationState={this.bootstrapValidation('cadNumber')}>
              <TitleLabel>8. CAD Number</TitleLabel>
              <FormControl data-section={section} name='cadNumber' value={input.cadNumber} onChange={(e) => this.handleTextInput(e, 'cadNumber', 'number')} disabled={isInReview()} />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <TitleLabel>9. On View</TitleLabel>
            <InlineRadio
                inline
                data-section={section}
                name='onView'
                value={true}
                checked={input.onView === 'true'}
                onChange={handleSingleSelection}
                disabled={isInReview()}>Yes</InlineRadio>
            <InlineRadio
                inline
                data-section={section}
                name ='onView'
                value={false}
                checked={input.onView === 'false'}
                onChange={handleSingleSelection}
                disabled={isInReview()}>No</InlineRadio>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <FormGroup validationState={this.bootstrapValidation('dateOccurred')}>
              <TitleLabel>10. Date Occurred</TitleLabel>
              <DatePicker value={input.dateOccurred} onChange={(e) => {handleDateInput(e, section, 'dateOccurred')}} disabled={isInReview()} />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <TitleLabel>Time Occurred</TitleLabel>
            <TimePicker value={input.timeOccurred} onChange={(e) => {handleTimeInput(e, section, 'timeOccurred')}} disabled={isInReview()} />
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>11. Date Reported</TitleLabel>
            <DatePicker value={input.dateReported} onChange={(e) => {handleDateInput(e, section, 'dateReported')}} disabled={isInReview()} />
          </Col>
          <Col lg={6}>
            <TitleLabel>Time Reported</TitleLabel>
            <TimePicker value={input.timeReported} onChange={(e) => {handleTimeInput(e, section, 'timeReported')}} disabled={isInReview()} />
          </Col>
        </PaddedRow>

        { !isInReview() ? <FormNav nextPath={FORM_PATHS.CONSUMER_SEARCH} handlePageChange={this.handlePageChange} sectionValid={this.state.sectionValid} setDidClickNav={this.setDidClickNav} /> : null}
        { this.renderErrors() }
      </div>
    );
  }
}

export default ReportInfoView;
