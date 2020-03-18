import React from 'react';
import { render } from 'react-dom';
import 'antd/dist/antd.css';

import { ExportedApp } from '$containers/ExportedApp';

render(
  <ExportedApp />,
  document.getElementById('root'),
);
