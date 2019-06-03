let Reflux = require('reflux');
let LogActions = require('../action/LogActions');
import Utils from '../../public/script/utils';
let LogStore = Reflux.createStore({
  listenables: [LogActions],
  init: function() {
  },
  recordSet:[],
  checkVercode:null,
  getServiceUrl: function(action)
  {
    return Utils.xilaimanagerUrl+action;
    // return `xilaimanager_s/${action}`;
  },
  onLogin(data){
    let $this = this,
        url =this.getServiceUrl('auth/manager-login');
    Utils.loginService(url,data).then(
        (result)=>{
          if($this.resuleReturn(result.errCode)){
            $this.recordSet = result.object;
            $this.fireEvent('login','',$this);
          }
          else {
            $this.fireEvent('login',result.errDesc,$this);
          }
        },
        ()=>{
          $this.fireEvent('login', '调用服务错误', $this);
        }
    );
  },
 
 onCheckVerCode(data){
  let $this = this,
  url = this.getServiceUrl('user/checkVerCode');
  Utils.doUpdateService(url,data).then(
    (result)=>{
      if($this.resuleReturn(result.errCode)){
        $this.checkVercode=result.object;
        $this.fireEvent('checkVerCode','',$this);
      }
      else {
        $this.fireEvent('checkVerCode',`${result.errDesc}`,$this);
      }
    },
    ()=>{
      $this.fireEvent('checkVerCode', '调用服务错误', $this);
    }
);
 },
  onForgetPswSendMail(data){
    let $this = this,
        url = this.getServiceUrl('user/forgetPwdcreateVercode');
    Utils.doUpdateService(url,data).then(
        (result)=>{
          if($this.resuleReturn(result.errCode)){
            $this.fireEvent('forgetPwdcreateVercode','',$this);
          }
          else {
            $this.fireEvent('forgetPwdcreateVercode',`${result.errDesc}`,$this);
          }
        },
        ()=>{
          $this.fireEvent('forgetPwdcreateVercode', '调用服务错误', $this);
        }
    );
  },
  
  onForgetPsw(data){
    let $this = this,
        url = this.getServiceUrl('user/updatePwd');
    Utils.doUpdateService(url,data).then(
        (result)=>{
          if($this.resuleReturn(result.errCode)){
            $this.fireEvent('updatePwd','',$this);
          }
          else {
            $this.fireEvent('updatePwd',`${result.errDesc}`,$this);
          }
        },
        ()=>{
          $this.fireEvent('updatePwd', '调用服务错误', $this);
        }
    );
  },
  onLogout(data){
    let $this = this,
        url = this.getServiceUrl('auth/logout');
    Utils.doUpdateService(url,data).then(
        (result)=>{
          if($this.resuleReturn(result.errCode)){
            $this.fireEvent('logout','',$this);
          }
          else {
            $this.fireEvent('logout',`${result.errDesc}`,$this);
          }
        },
        ()=>{
          $this.fireEvent('logout', '调用服务错误', $this);
        }
    );
  },
  fireEvent: function(operation, errMsg, $this){
    $this.trigger({
      operation: operation,
      recordSet: $this.recordSet,
      errMsg: errMsg,
      checkVercode:$this.checkVercode
    });
  },
  resuleReturn(errCode){
    if(errCode===null||errCode===''||errCode==='000000'){
      return true;
    }else{
      return false;
    }
  },
    onGetWebManage: function (filter, startPage, pageRow) {
        let  $this = this;
        let url = this.getServiceUrl('advertisement/queryWebAd');
        Utils.doRetrieveService(url, filter, startPage, pageRow, $this.totalRow).then(
            (result)=>{
                if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                    $this.recordSet = result.object.list;
                    $this.fireEvent('queryWebAd', '', $this);
                } else {
                    // Utils.handleServer(result.errCode);
                    // $this.fireEvent('queryWebAd', '[' + result.errCode + ']处理错误，' + result.errDesc, $this);
                }
            }, () => {
                // $this.fireEvent('queryWebAd', '宣传图显示错误', $this);
            }
        );
    },
});

module.exports = LogStore;
