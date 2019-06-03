import React from 'react';
// import Home from '../../login2/LoginInnPage';
import Home from '../../login2/LoginPage2';
import XilaiLayout from '../XilaiLayout';
let Common = require('../../public/script/common');
import NotFound from '../../lib/NotFound/index.js';


Common.getHomePage = function () {
  return {
    appGroup: 'XILAI',
    appName: '喜来快递',
    home: Common.xilaiHome
  };
};

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/xilai.html',
    component: Home
  },
  {
    path: '/main/',
    component: XilaiLayout,
	    childRoutes: [
      {
			  path: 'passwd/',
			  component: require('../../main/passwd/PasswdPage')
      },
      {
			  path: 'logout/',
			  component: require('../../main/logout/LogoutPage')
      }
    ]
  },
  require('../routes'),
	{ path: '*', component: NotFound }
];

export default routes;

