import XilaiLayout from './XilaiLayout';
import Home from '../login2/LoginPage2';
// express
import ExpressPage from './express/express/ExpressPage';
import AsyncComponent from './AsyncComponent';

// dataCenter
// import BusinessWatchPage from './dataCenter/businessWatch/BusinessWatchPage';
const BusinessWatchPage = AsyncComponent(()=>import('./dataCenter/businessWatch/BusinessWatchPage'))
import BillManagePage from './dataCenter/billManage/BillManagePage';
import OrderManagePage from './dataCenter/orderManage/OrderManagePage';
import DeliveryPage from './dataCenter/delivery/DeliveryPage';
import InvestmentRatePage from './dataCenter/investment/InvestmentRatePage';
import TransactionLogPage from './dataCenter/transactionLog/TransactionLogPage';
import OperateLogPage from './dataCenter/operateLog/OperateLogPage';
import Common from '../public/script/common';
// baseConfig
import AddressPage from './baseConfig/address/AddressPage';
import OrganizationInfoPage from './baseConfig/organizationInfo/OrganizationInfoPage';
import PostmanInfoPage from './baseConfig/postmanInfo/PostmanInfoPage';
import ElectronicListPage from './baseConfig/electronicList/ElectronicListPage';
import PrintTemplatePage from './baseConfig/printTemplate/PrintTemplatePage';
import OfficialPricePage from './baseConfig/officialPrice/OfficialPricePage';
import ChannelPricePage from './baseConfig/channelPrice/ChannelPricePage';
import ProfitSharingPage from './baseConfig/profitSharing/ProfitSharingPage';
import SubAdminManagePage from './baseConfig/subAdminManage/SubAdminManagePage';
import TripleOrganizationPage from './baseConfig/tripleOrganization/TripleOrganizationPage';
import RoleManagePage from './baseConfig/roleManage/RoleManagePage';
import serviceManagementPage from './baseConfig/serviceManagement/serviceManagementPage';

//alipayDelivery
import AlipayDeliveryOrderPage from './alipayDelivery/alipayDeliveryOrder/AlipayDeliveryOrderPage';
import StoreInfoPage from  './alipayDelivery/storeInfo/StoreInfoPage';
import StaffInfoPage from './alipayDelivery/staffInfo/StaffInfoPage';
import PluginOrderManagePage from './alipayDelivery/pluginOrderManage/PluginOrderManagePage';

//operationCenter
import OperationActivityPage from './operationCenter/operationActivity/OperationActivityPage';
import GroupMsgPage from './operationCenter/groupMsg/GroupMsgPage';
const ADManagePage = AsyncComponent(()=>import('./operationCenter/ADManage/ADManagePage'));
// import ADManagePage from './operationCenter/ADManage/ADManagePage';
import UserManagePage from './operationCenter/userManage/UserManagePage';
import DiscountManagePage from './operationCenter/discountManage/DiscountManagePage';

//historyVersion
import HistoryVersion from './main/HistoryVersion';
//customerServiceCenter
import worksheetManagementPage from './customerServiceCenter/worksheetManagement/worksheetManagementPage';
//topComponent
import topComponent from './helpCenter/topComponent';


let expressRoutes = [
      {
        path: 'express/ExpressPage/',
        component: ExpressPage
      },
    ],
    dataCenterRoutes = [
      {
        path: 'dataCenter/BusinessWatchPage/',
        component: BusinessWatchPage
      },
      {
        path: 'dataCenter/OrderManagePage/',
        component: OrderManagePage
      },
      {
          path: 'dataCenter/DeliveryPage/',
          component: DeliveryPage
      },
      {
          path: 'dataCenter/InvestmentRatePage/',
          component: InvestmentRatePage
      },
      {
        path: 'dataCenter/BillManagePage/',
        component: BillManagePage
      },
      {
        path: 'dataCenter/TransactionLogPage/',
        component: TransactionLogPage
      },
      {
        path: 'dataCenter/OperateLogPage/',
        component: OperateLogPage
      },
    ],
    baseConfigRoutes = [
      {
        path: 'baseConfig/AddressPage/',
        component: AddressPage
      },
      {
        path: 'baseConfig/OrganizationInfoPage/',
        component: OrganizationInfoPage
      },
      {
        path: 'baseConfig/PostmanInfoPage/',
        component: PostmanInfoPage
      },
      {
        path: 'baseConfig/ElectronicListPage/',
        component: ElectronicListPage
      },
        //打印模板暂时不要  功能已基本完善
      // {
      //   path: 'baseConfig/PrintTemplatePage/',
      //   component: PrintTemplatePage
      // },
      {
        path: 'baseConfig/OfficialPricePage/',
        component: OfficialPricePage
      },
      {
        path: 'baseConfig/ChannelPricePage/',
        component: ChannelPricePage
      },
      {
        path: 'baseConfig/ProfitSharingPage/',
        component: ProfitSharingPage
      },
      {
        path: 'baseConfig/TripleOrganizationPage/',
        component: TripleOrganizationPage
      },
      {
        path: 'baseConfig/SubAdminManage/',
        component: SubAdminManagePage
      },
      {
        path: 'baseConfig/RoleManage/',
        component: RoleManagePage
      },
      {
        path: 'baseConfig/serviceManagementPage/',
        component: serviceManagementPage
      },
    ],
    alipayDeliveryRoutes = [
      {
        path: 'alipayDelivery/AlipayDeliveryOrderPage/',
        component: AlipayDeliveryOrderPage
      },
      {
        path: 'alipayDelivery/StoreInfoPage/',
        component: StoreInfoPage
      },
      {
        path: 'alipayDelivery/StaffInfoPage/',
        component: StaffInfoPage
      },
      {
        path: 'alipayDelivery/pluginOrderManage/',
        component: PluginOrderManagePage
      }
    ],
    operationCenterRoutes = [
      {
        path: 'operationCenter/OperationActivityPage/',
        component: OperationActivityPage
      },
      {
        path: 'operationCenter/GroupMsgPage/',
        component: GroupMsgPage
      },
      {
        path: 'operationCenter/ADManagePage/',
        component: ADManagePage
      },
      {
          path: 'operationCenter/UserManagePage/',
          component: UserManagePage
      },
      {
          path: 'operationCenter/DiscountManagePage/',
          component: DiscountManagePage
      },
    ],
    otherRoutes = [
      {
        path: 'historyVersion',
        component: HistoryVersion
      }
    ],
    customerServiceCenterRoutes = [
      {
        path: 'customerServiceCenter/worksheetManagementPage/',
        component: worksheetManagementPage
      }
    ],
    helpCenterRoutes = [
      {
        path: 'helpCenter/topComponent/',
        component: topComponent
      }
    ];
let menuLists = Common.getMenuList(),
    menuArr = menuLists.map(item=>item.path);
let filterRoute = function (Arr=[]) {
  let newArr = [];
  Arr.map(j=>{
    let f = false;
    for(let i=0;i<menuArr.length;i++){
      if(menuArr[i].indexOf(j.path)!==-1){
        f = true;
        break;
      }
    }
    if(f) {
      newArr.push(j)
    }
  });
  return newArr;
};
expressRoutes = filterRoute(expressRoutes);
dataCenterRoutes = filterRoute(dataCenterRoutes);
baseConfigRoutes = filterRoute(baseConfigRoutes);
alipayDeliveryRoutes = filterRoute(alipayDeliveryRoutes);
operationCenterRoutes = filterRoute(operationCenterRoutes);
customerServiceCenterRoutes = filterRoute(customerServiceCenterRoutes);
let topRoutes = [
  {
    path: '/xilai/',
    component: require('./main/express_menu'),
    indexRoute: { component: ExpressPage },
    childRoutes: expressRoutes
  },
  {
    path: '/xilai/',
    component: require('./main/dataCenter_menu'),
    indexRoute: { component: BusinessWatchPage },
    childRoutes: dataCenterRoutes
  },
  {
    path: '/xilai/',
    component: require('./main/baseConfig_menu'),
    indexRoute: { component: AddressPage },
    childRoutes: baseConfigRoutes
  },
  {
    path: '/xilai/',
    component: require('./main/alipayDelivery_menu'),
    indexRoute: { component: AlipayDeliveryOrderPage },
    childRoutes: alipayDeliveryRoutes
  },
  {
    path: '/xilai/',
    component: require('./main/operationCente_menu'),
    indexRoute: { component: OperationActivityPage },
    childRoutes: operationCenterRoutes
  },
  {
    path: '/xilai/',
    component: require('./main/customerServiceCenter_menu'),
    indexRoute: { component: worksheetManagementPage },
    childRoutes: customerServiceCenterRoutes
  },
  {
    path: '/xilai/',
    component: require('./main/helpCenter_menu'),
    indexRoute: { component: topComponent },
    childRoutes: helpCenterRoutes
  },
  {
    path: '/xilai/',
    indexRoute: { component: HistoryVersion },
    childRoutes: otherRoutes
  },
];
module.exports = {
  path: '/xilai',
  component: XilaiLayout,
  indexRoute: { component: Home },
  childRoutes: topRoutes
};

