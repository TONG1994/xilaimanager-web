import Common from '../../public/script/common';
function ModuleMenus(MenuCtx) {
  //  expressMenus   发件菜单
  this.expressMenus = [
    {
      name: '收件',
      to: '/xilai/shoupai/',
      icon:'barcode',
      childItems: Common.getFilterList([
        {
          name: '收件',
          to: '/xilai/express/ExpressPage/'
        },
      ])
    },
  ];
  //  dataCenter   数据中心 菜单
  this.dataCenterMenus = [
    {
      name: '业务看板',
      to: '/xilai/yewu',
      icon:'line-chart',
      childItems: Common.getFilterList([
        {
          name: '业务监控',
          to: '/xilai/dataCenter/BusinessWatchPage/'
        },
        {
          name: '收件订单',
          to: '/xilai/dataCenter/OrderManagePage/'
        },
        {
          name: '派件订单',
          to: '/xilai/dataCenter/DeliveryPage/'
        },
        {
            name: '派件妥投率',
            to: '/xilai/dataCenter/InvestmentRatePage/'
        },
      ])
    },
    {
      name: '财务看板',
      to: '/xilai/caiwu',
      icon:'pay-circle-o',
      childItems: Common.getFilterList([
        {
          name: '账单管理',
          to: '/xilai/dataCenter/BillManagePage/'
        },
        {
          name: '交易流水',
          to: '/xilai/dataCenter/TransactionLogPage/'
        },
      ])
    },
  ];
  let operateLogPage = Common.getFilterList([{
    name: '操作日志',
    to: '/xilai/dataCenter/OperateLogPage/',
    icon:'copy',
  }]);
  if(operateLogPage.length){
    this.dataCenterMenus.push(operateLogPage[0])
  }
  //  baseConfig   基础配置  菜单
  this.baseConfigMenus = [
    {
      name: '基础配置',
      to: '/xilai/dizhi',
      childItems:Common.getFilterList([
        {
          name: '地址簿',
          to: '/xilai/baseConfig/AddressPage/'
        },
        {
          name: '机构信息',
          to: '/xilai/baseConfig/OrganizationInfoPage/'
        },
        {
          name: '快递员信息',
          to: '/xilai/baseConfig/PostmanInfoPage/'
        },
        {
          name: '收派件设置',
          to: '/xilai/baseConfig/TripleOrganizationPage/'
        },
        {
          name: '账号管理',
          to: '/xilai/baseConfig/SubAdminManage/'
        },
        {
          name: '角色管理',
          to: '/xilai/baseConfig/RoleManage/'
        },
        {
          name: '客服管理',
          to: '/xilai/baseConfig/serviceManagementPage/'
        },
      ])
    },
    {
      name: '高级配置',
      to: '/xilai/gaoji',
      icon:'exception',
      childItems:Common.getFilterList([
        {
          name: '电子面单',
          to: '/xilai/baseConfig/ElectronicListPage/'
        },
        //打印模板暂时不要  功能已基本完善
        // {
        //   name: '打印模板',
        //   to: '/xilai/baseConfig/PrintTemplatePage/'
        // },
        {
          name: '官方价格',
          to: '/xilai/baseConfig/OfficialPricePage/'
        },
        {
          name: '渠道价格',
          to: '/xilai/baseConfig/ChannelPricePage/'
        },
        {
          name: '分成设置',
          to: '/xilai/baseConfig/ProfitSharingPage/'
        },
      ])
    }
  ];
  
  //蚁派
  this.alipayDeliveryMenus = [
    {
      name: '蚁派',
      to: '/xilai/yipai/',
      icon:'mail',
      childItems:Common.getFilterList([
        {
          name: '蚁派订单',
          to: '/xilai/alipayDelivery/AlipayDeliveryOrderPage/'
        },
        {
          name: '门店信息',
          to: '/xilai/alipayDelivery/StoreInfoPage/'
        },
        {
          name: '店员信息',
          to: '/xilai/alipayDelivery/StaffInfoPage/'
        },
        {
          name: '订购管理',
          to: '/xilai/alipayDelivery/pluginOrderManage/'
        },
      ])
    }
  ];
  
  //蚁派
  this.operationCenterMenus = [
    {
      name: '运营中心',
      icon:'database',
      to: '/xilai/yunying/',
      childItems:Common.getFilterList([
        {
          name: '运营活动',
          to: '/xilai/operationCenter/OperationActivityPage/'
        },
        {
          name: '群发信息',
          to: '/xilai/operationCenter/GroupMsgPage/'
        },
        {
          name: '广告管理',
          to: '/xilai/operationCenter/ADManagePage/'
        },
        {
            name: '用户管理',
            to: '/xilai/operationCenter/UserManagePage/'
        },
        {
            name: '优惠券管理',
            to: '/xilai/operationCenter/DiscountManagePage/'
        },
      ])
    }
  ];
  //客服
  this.customerServiceCenterMenus = [
    {
      name: '工单管理',
      icon:'file-text',
      to: '/xilai/worksheet/',
      childItems:Common.getFilterList([
        {
          name: '工单中心',
          to: '/xilai/customerServiceCenter/worksheetManagementPage/'
        },
      ])
    },
    // {
    //   name: '在线客服',
    //   icon:'customer-service',
    //   to: '/xilai/service/',
    //   childItems:Common.getFilterList([
    //     {
    //       name: '客服管理',
    //       to: '/xilai/customerServiceCenter/serviceManagementPage/'
    //     },
    //   ])
    // }
  ];
    // 完整菜单，用于授权
  let menuLists = Common.getMenuList(),
      menuArr = menuLists.map(item=>item.path),
      newMenusArr = [];
  let moudleMenusArr = [
    {
      name: '收件',
      to: '/xilai/express/ExpressPage/',
      path: '/xilai/express/',
      nextMenus: this.expressMenus
    },
    {
      name: '数据中心',
      to: '/xilai/dataCenter/BusinessWatchPage/',
      path: '/xilai/dataCenter/',
      nextMenus: this.dataCenterMenus
    },
    {
      name: '基础配置',
      to: '/xilai/baseConfig/AddressPage/',
      path: '/xilai/baseConfig/',
      nextMenus: this.baseConfigMenus
    },
    {
      name: '运营中心',
      to: '/xilai/operationCenter/OperationActivityPage/',
      path: '/xilai/operationCenter/',
      nextMenus: this.operationCenterMenus
    },
    {
      name: '蚁派',
      to: '/xilai/alipayDelivery/AlipayDeliveryOrderPage/',
      path: '/xilai/alipayDelivery/',
      nextMenus: this.alipayDeliveryMenus
    },
    {
      name: '客服系统',
      to: '/xilai/customerServiceCenter/worksheetManagementPage/',
      path: '/xilai/customerServiceCenter/',
      nextMenus: this.customerServiceCenterMenus
    },
    {
      name: '帮助中心',
      to: '/xilai/helpCenter/topComponent/',
      path: '/xilai/helpCenter/',
    },
  ];
  moudleMenusArr.map(item=>{
    let basePath = '';
    for(let i=0;i<menuArr.length;i++){
      if(menuArr[i].indexOf(item.path)!==-1&&menuArr[i]!==item.path){
        basePath = menuArr[i];
        break;
      }
    }
    if(basePath){
      item.to = basePath;
      newMenusArr.push(item);
    }
  });
  this.moduleMenus = newMenusArr;
}
module.exports = {
  menus: function () {
    return new ModuleMenus(this);
  }
};
