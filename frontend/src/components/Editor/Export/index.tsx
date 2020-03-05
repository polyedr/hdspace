import React from 'react';
import { render } from 'react-dom';
import { ExportTree } from './Export';
import 'antd/dist/antd.css';

render(<ExportTree renderTreeInfo={window.renderTreeInfo} />, document.getElementById('root'));
