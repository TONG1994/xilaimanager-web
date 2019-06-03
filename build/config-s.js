
var corpStruct = '园区';	// 园区，多公司，单公司
var serviceIP = window.location.origin + '/';
var utilConf = {
  checkRole: false,	// 检查权限
  localDict: true, //下拉列表本地获取
  imageUrl: 'http://127.0.0.1:8390/assets',
  authUrl: serviceIP + 'auth_s/',
  paramUrl: serviceIP + 'param_s/',
  campUrl: serviceIP + 'camp_s/',
  devUrl: serviceIP + 'dev_s/',
  resumeUrl: serviceIP + 'resume2_s/',
  hrUrl: serviceIP + 'hr_s/',
  projUrl: serviceIP + 'proj_s/',
  costUrl: serviceIP + 'cost_s/',
  flowUrl: serviceIP + 'flow_s/',
  atsUrl: serviceIP + 'ats_s/',
  assetUrl: serviceIP + 'asset_s/',
  dsaUrl: serviceIP + 'dsa_s/',
  msgUrl: serviceIP + 'msg_s/',
  xchgUrl: serviceIP + 'xchg_s/',
  xilaimanagerUrl: serviceIP + 'xilaimanager_s/',
  baomimanagerUrl: serviceIP + 'baomimanager_s/',
  customerUrl: serviceIP + 'customer_s/',
  curVersion:'Version 2.13.19030410.product'
};

var commonConf = {
  // 公共变量
  resMode: false,
  
  corpStruct: corpStruct,
  campusUuid: 'nan',
  campusName: '无',
  corpUuid: '113K11A4B8R3L003',
  corpName: '无锡公司',
  userDept: 'N',	// 用户是否划分部门
  
  // 公共变量
  authHome: (corpStruct === '园区') ? '/auth/CampusPage/' : ((corpStruct === '多公司') ? '/auth/CorpPage/' : '/auth/SysUserPage/'),
  avtHome: '/avt/hr/PersonInfoPage/',
  xilaiHome: '/xilai/dataCenter/BusinessWatchPage/',
  fileAddress:"http://gridfs-cs.icerno.com",
  
  iconAdd: 'plus',//新增
  iconRefresh: 'reload',//刷新
  iconBack: 'rollback',//返回
  iconUpdate: 'edit',//编辑
  iconRemove: 'delete',//删除
  iconUser: 'user',//用户
  iconAddChild: 'folder-add',//文件新增
  iconDetail: 'bars',//详情
  iconSearch: 'search',//搜索
  iconReset:'sync',//重置参数
  iconExport:'export',//导出
  iconImport:'upload',//导入
  iconDownload:'download',//下载
  iconMail:'mail',//发件
  
  tableBorder: false,
  tableHeight: '510px',
  searchWidth: '180px',
  
  // 日期格式
  dateFormat: 'YYYY-MM-DD',
  monthFormat: 'YYYY-MM',
  
  // 标题
  removeTitle: '删除确认',
  removeOkText: '确定',
  removeCancelText: '取消',
};
