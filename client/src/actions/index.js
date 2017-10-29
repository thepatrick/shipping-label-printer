// import blobStream from 'blob-stream';

import fetch from 'isomorphic-fetch';

export const useless = () => ({ type: 'USELESS' });

export const printFromLabel = () => async (dispatch) => {
  dispatch({ type: 'PRINT_FROM_LABEL' });

  try {
    const response = await fetch('/v1/print/from-label', {
      method: 'POST',
    });

    const data = await response.json();

    dispatch({ type: 'PRINT_FROM_LABEL_SUCCESS', data });
  } catch (error) {
    dispatch({ type: 'PRINT_FROM_LABEL_ERROR', error });
  }
};

