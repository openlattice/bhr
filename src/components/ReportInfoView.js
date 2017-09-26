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
import { bootstrapValidation, validateOnInput, validateRequiredInput } from '../shared/Validation';


const REQUIRED_FIELDS = ['complaintNumber'];

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

  setDidClickNav = () => {
    this.setState({ didClickNav: true });
  }

  handlePageChange = (path) => {
    this.setState({ didClickNav: true });
    validateRequiredInput(this, REQUIRED_FIELDS);
    if (!this.state.sectionValid) {
      console.log('section not valid!');
      // show errors
    } else {
      this.props.handlePageChange(path);
    }
  }

  renderErrors = () => {
    console.log('section errors:', this.state.sectionRequiredErrors, this.state.sectionFormatErrors);
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

    return (
      <div>
        { !isInReview() ? <SectionHeader>Report Info</SectionHeader> : null}
        <PaddedRow>
          <Col lg={6}>
              <TitleLabel>1. Primary Reason for Dispatch</TitleLabel>
              <FormControl data-section={section} name='dispatchReason' value={input.dispatchReason} onChange={(e) => handleTextInput(e, this, 'string', REQUIRED_FIELDS)} disabled={isInReview()} />
          </Col>
          <Col lg={6}>
            <FormGroup validationState={bootstrapValidation(this, 'complaintNumber', true)}>
              <TitleLabel>2. Complaint Number*</TitleLabel>
              <FormControl data-section={section} name='complaintNumber' value={input.complaintNumber} onChange={(e) => handleTextInput(e, this, 'number', REQUIRED_FIELDS)} disabled={isInReview()} />
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
            <FormControl data-section={section} name='incident' value={input.incident} onChange={(e) => handleTextInput(e, this, 'string', REQUIRED_FIELDS)} disabled={isInReview()} />
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={12}>
            <TitleLabel>5. Location of Offense / Incident</TitleLabel>
            <FormControl data-section={section} name='locationOfIncident' value={input.locationOfIncident} onChange={(e) => handleTextInput(e, this, 'string', REQUIRED_FIELDS)} disabled={isInReview()} />
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>6. Unit</TitleLabel>
            <FormControl data-section={section} name='unit' value={input.unit} onChange={(e) => handleTextInput(e, this, 'string', REQUIRED_FIELDS)} disabled={isInReview()} />
          </Col>
          <Col lg={6}>
            <TitleLabel>7. Post of Occurrence</TitleLabel>
            <FormControl data-section={section} name='postOfOccurrence' value={input.postOfOccurrence} onChange={(e) => handleTextInput(e, this, 'string', REQUIRED_FIELDS)} disabled={isInReview()} />
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <FormGroup validationState={bootstrapValidation(this, 'cadNumber')}>
              <TitleLabel>8. CAD Number</TitleLabel>
              <FormControl data-section={section} name='cadNumber' value={input.cadNumber} onChange={(e) => handleTextInput(e, this, 'number', REQUIRED_FIELDS)} disabled={isInReview()} />
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
            <FormGroup validationState={bootstrapValidation(this, 'dateOccurred')}>
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
