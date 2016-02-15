require('./main.less');

import React from 'react';
import ReactDom from 'react-dom';
import AreaChartExtent from './components/AreaChartExtent.jsx';
// import BarChartExtent from './components/BarChartExtent.jsx';

ReactDom.render((
    <AreaChartExtent/>
), document.querySelector('#container'));