/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Button } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';

import FileUpload from '../../components/documents/FileUpload';
import UploadedDocument from '../../components/documents/UploadedDocument';
import { uploadDocuments, loadUsedTags } from './DocumentsActionFactory';


type Props = {
  downloading :boolean,
  actions :{
    loadUsedTags :Function;
    uploadDocuments :Function;
  }
};

type State = {
  startDate :?string,
  endDate :?string
};

export const DownloadsWrapper = styled.div`
  display: flex;
  width: 100%;
`;

export const FormWrapper = styled.div`
  align-items: center;
  background: #fff;
  border: solid 1px #e1e1eb;
  display: flex;
  flex-direction: column;
  margin: 30px auto;
  padding: 30px 0;
  width: 100%;
`;

class DocumentsContainer extends React.Component<Props, State> {

  constructor(props :Props) {
    super(props);
    this.state = {
      startDate: '',
      endDate: '',
      files: []
    };
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.loadUsedTags();
  }

  download = () => {
    const { actions } = this.props;
    const { endDate, startDate } = this.state;

    actions.uploadDocuments({ endDate, startDate });
  }

  onDateChange = (field :string, newDate :string) => {
    this.setState({ [field]: newDate });
  }

  onUpload = ({ file }) => {
    const { files } = this.state;
    files.push(file);
    this.setState({ files });
  }

  renderUploadedFiles = () => {
    const { files } = this.state;
    return files.map((file, idx) => {
      const onDelete = () => {
        files.splice(idx, 1);
        this.setState({ files });
      };
      return <UploadedDocument file={file} key={idx} onDelete={onDelete} />;
    });
  }

  renderUploadDocumentsButton = () => {
    const { actions } = this.props;
    const { files } = this.state;

    return <button onClick={() => actions.uploadDocuments({ files })}>Upload!</button>;
  }

  render() {
    const { actions } = this.props;

    return (
      <div>
        <h1>Upload documents</h1>
        <FileUpload onUpload={this.onUpload} />
        {this.renderUploadedFiles()}
        {this.renderUploadDocumentsButton()}
      </div>
    );
  }
}

const mapStateToProps = (state :Map) => ({
  downloading: state.getIn(['downloads', 'downloading'])
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    loadUsedTags,
    uploadDocuments,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(DocumentsContainer);
