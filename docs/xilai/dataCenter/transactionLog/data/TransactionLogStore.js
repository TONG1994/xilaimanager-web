let Reflux = require('reflux');
let TransactionLogActions = require('../action/TransactionLogActions');
let MsgActions = require('../../../../lib/action/MsgActions');
import Utils from '../../../../public/script/utils';

let TransactionLogStore = Reflux.createStore({
  listenables: [TransactionLogActions],
  init: function() {
  },
  recordSet:[],
  errMsg: '',
  startPage:1,
  pageRow: 10,
  totalRow: 0,
  dataSource: [],
  dataArr: [],
  getServiceUrl: function(action)
  {
    return Utils.xilaimanagerUrl+action;
  },
  onRetrieveTradingFlow(filter, startPage, pageRow){
    let $this = this,
        url =this.getServiceUrl('tradingFlow/retrieveByFilter');
    Utils.doRetrieve(url, filter, startPage, pageRow, $this.totalRow).then(
        (result)=>{
            $this.recordSet = result.list;
            $this.startPage=result.startPage;
            $this.pageRow = result.pageRow;
            $this.totalRow = result.totalRow;
            $this.filter = filter;
            $this.fireEvent('retrieveByFilter','',$this);
        },
        (errMsg)=>{
          $this.fireEvent('retrieveByFilter', errMsg, $this);
        }
    );
  },

  onGetTradingFlowTypeList(){
    let $this = this,
    url =this.getServiceUrl('tradingType/queryAllTradingType');
    $this.dataArr = [];
    $this.dataSource = [];
    Utils.doGetService(url).then(
    (result)=>{
      if($this.resuleReturn(result.errCode)){
        let list = (result.object!=null && result.object.list!=null) ? result.object.list:[];
        $this.dataSource=[];
        if(list && list.length >0){
          list.map((item, i)=>{
            $this.dataSource.push({uuid: item.uuid, name:item.name});
          });
        }
        $this.fireEvent('queryAllTradingType','',$this);
      }
      else {
        Utils.handleServer(result.errCode);
        $this.fireEvent('queryAllTradingType','['+result.errCode+']处理错误，'+result.errDesc,$this);
      }
    },
    ()=>{
      $this.fireEvent('queryAllTradingType', '调用服务错误', $this);
    }
);
  },
  fireEvent: function(operation, errMsg, $this){
    $this.trigger({
      operation: operation,
      recordSet: $this.recordSet,
      errMsg: errMsg,
      startPage:$this.startPage,
      pageRow: $this.pageRow,
      totalRow: $this.totalRow,
      dataSource: $this.dataSource,
      dataArr: $this.dataArr,
    });
    if(operation ==='queryAllTradingType'){
      MsgActions.showError('tradingType', operation, errMsg);
    }else{
      MsgActions.showError('tradingFlow', operation, errMsg);
    }
  
  },
  resuleReturn(errCode){
    if(errCode===null||errCode===''||errCode==='000000'){
      return true;
    }else{
      return false;
    }
  }
});

module.exports = TransactionLogStore;
