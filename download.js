import { message } from 'antd';
import * as PropTypes from 'prop-types';

const download = ({
  url,
  method,
  body,
  defaultFileName,
  loading = {
    open: () => {},
    close: () => {},
  },
  before = () => {},
  after = () => {},
}) => {
  before();
  loading.open();
  const init = {
    method,
    credentials: 'include',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  };

  if(method === 'POST'){
    init.body = JSON.stringify(body)
  }
  fetch(url,init ).then(response => {
    loading.close();
    response.blob().then(blob => {
      if (response.status !== 200) {
        message.warn(`File download error.status:${response.status} ,message: ${response.status}`);
        return;
      }
      let fileName =
        response.headers.get('Content-Disposition') || response.headers.get('Content-disposition');
      fileName = fileName || defaultFileName || 'file.doc';
      fileName = fileName.replace('attachment;filename=', '');
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, fileName);
      } else {
        const blobUrl = window.URL.createObjectURL(blob);
        const aElement = document.createElement('a');
        document.body.appendChild(aElement);
        aElement.style.display = 'none';
        aElement.href = blobUrl;
        aElement.download = fileName || defaultFileName;
        aElement.click();
        document.body.removeChild(aElement);
      }
      after();
    });
  });
};

download.defaultProps = {
  before: () => {},
  after: () => {},
  loading: {
    open: () => {},
    close: () => {},
  },
};

download.propTypes = {
  url: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  defaultFileName: PropTypes.string.isRequired,
};

export default download;
