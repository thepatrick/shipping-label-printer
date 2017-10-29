import React from 'react';

import { connect } from 'react-redux';

import { printFromLabel } from '../../actions';

const previewLabel = () => {
  window.open('/v1/preview/from-label');
};

const FromLabel = ({ printFromLabel }) => (
  <div>
    <button onClick={previewLabel}>Preview</button>
    <button onClick={printFromLabel}>Print</button>
  </div>
);

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => (
  {
    printFromLabel: () => {
      dispatch(printFromLabel());
    },
  }
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FromLabel);
