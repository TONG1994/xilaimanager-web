let $ = require('jquery');

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
let Reflux = require('reflux');
import { withRouter } from 'react-router';
import CommonActions from '../lib/action/CommonActions';
import CommonStore from '../lib/data/CommonStore';

import { Form, Button, Input, Icon, Checkbox,Col,Row ,message,Carousel} from 'antd';
const FormItem = Form.Item;
import './style/login.scss';
let Common = require('../public/script/common');
let Utils = require('../public/script/utils');
import ErrorMsg from '../lib/Components/ErrorMsg';
import Logo from './style/xilai-logo.svg';
import SlideBlockPage from './Components/SlideBlockPage';
import CarouselPage from './Components/CarouselPage';
let LoginUtil = require('./LoginUtil');
let slideState='start';
import CanvasDotePage from './Components/CanvasDotePage';
import ResetPwdPage from './Components/ResetPasswdPage';
import LogActions from './action/LogActions';
import LogStores from './data/LogStores';

class LoginPage2 extends React.Component{
  constructor(props){
        super(props);
        this.state={
          user: {
            userName: '',
            passwd: ''
          },
          loading: false,
          errMsg: '',
          hints: {},
          action: 'login',
          validRules: [],
          slideEnd:false,
        };
        let loginData = window.sessionStorage.getItem('loginData');
        if (loginData !== null && typeof (loginData) !== 'undefined') {
          let skip = false;
          let loc = this.props.location;
          if (loc !== null && typeof (loc) !== 'undefined') {
            let path = loc.pathname;
            if (path !== '') {
              if (loc.search !== '') {
                skip = true;
              } else if (path !== '/' && path !== '/index.html' && path !== '/test.html' && path !== '/electron.html') {
                skip = true;
              }
            }
          }
    
          if (skip && LoginUtil.loadContext()) {
            //全局获取地址
            let hasAddress = window.sessionStorage.address;
            if(!hasAddress||hasAddress=='undefined'){
              CommonActions.getAddress();
            }
            let menus = Common.getMenuList()||[];
            if(!menus.length) {
              message.error('您没有权限登录！');
              window.sessionStorage.removeItem('loginData');
              return;
            }
            let search = this.props.location.search.substring(1);
            if(search.indexOf('href')>-1){
              search = '/'+search.split('=')[1];//对应404页面的href
            }
            search = search.substring(0,search.lastIndexOf('/')+1);
            if(!search){
              LogActions.logout({username:'',password:''})
            }
            this.props.router.push({
              pathname:search,
              state: { from: 'login' }
            });
          } else {
            let href = window.location.href;
            if (href.indexOf('linkid=') < 0) {
              window.sessionStorage.removeItem('loginData');
            }
          }
        }
      }
  
  
  componentDidMount () {
    let self = this;
    LoginUtil.downConfig(this).then((result) => {
    
    }, (value) => {
      Common.errMsg('加载配置文件错误');
    });
    this.state.validRules = [
            { id: 'userName', desc: '工号', required: true,max:30},
            { id: 'passwd', desc: '密码', required: true}
    ];
    this.unsubscribe = LogStores.listen(this.onServiceChange);
    this.getAddress = CommonStore.listen(this.onGetAddress);
    $(document).on('keydown', (e)=>{
      let theEvent = e || window.event;
      let code = theEvent.keyCode || theEvent.which || theEvent.charCode;
      if (code == 13) {
        this.clickLogin();
      }
    });
  }
  onGetAddress = (data)=>{
    if(data.operation==="getAddress" && data.recordSet[0]){
      window.sessionStorage.address = JSON.stringify(data.recordSet[0])
    }
  }
  onServiceChange = (data)=>{
    this.setState({loading:false});
    if(data.errMsg && data.operation!=='logout'){
      this.showError(data.errMsg);
      return;
    }
    if(!data.errMsg){
      if(data.operation==='login'){
        this.loginSuccess(data.recordSet);       
      }
      else if(data.operation==='logout'){
        window.sessionStorage.removeItem('loginData');
        window.localStorage.removeItem('loginData');
        window.loginData = null
      }
    }
  }

  componentWillUnmount(){
    this.unsubscribe();
    $(document).off('keydown');
  }
  showError=(msg)=>{
    this.setState({
      slideEnd:true,
      errMsg: msg
    });
  }
  setSlideState=(state)=>{
      slideState=state;
      if(state==='end'&&this.state.slideEnd){
          this.setState({slideEnd:false,errorMsg:''});
      }
  }
  onSafetyNavi=(loginData)=>{
    LoginUtil.safeNavi(this, loginData);
  }
  clickLogin=()=>{
    let passwd = this.state.user.passwd;
    this.state.errMsg = '';
    if (!Common.formValidator(this, this.state.user)) {
      return;
    }

    let password = Common.calcMD5(passwd);
    let username = this.state.user.userName;
    let loginData = {
      password,
      username
    };
    if(slideState!=='end'){
        this.showError('请拖动滑动验证！');
        return;
    }
    this.setState({ loading: true });
    LogActions.login(loginData);
  }

  clickQuickLogin=()=>{
    let loginData = {};
    this.setState({ loading: true });
    LogActions.login(loginData);
  }

  loginSuccess=(loginData)=>{
    let corpUuid = '';
    LoginUtil.saveLoginData(loginData, corpUuid);
    let menus = loginData?loginData.menuList.slice(0):[];
    let pathname='',
        businessWatchPage = "/xilai/dataCenter/",
        baseConfig = "/xilai/baseConfig/",
        expressPage = "/xilai/express/",
        alipayDeliveryPage = "/xilai/alipayDelivery/",
        operationCenterPage = "/xilai/operationCenter/",
        customerServicePage = "/xilai/customerServiceCenter/";
    for(let i=0;i<menus.length;i++){
      let path = menus[i].path;
      if(path.indexOf(businessWatchPage)>-1&&path!==businessWatchPage){
        pathname = menus[i].path;
        break;
      }
      if(path.indexOf(expressPage)>-1&&path!==expressPage){
        if(pathname.indexOf(expressPage)===-1){
          pathname = menus[i].path;
        }
      }
      if(path.indexOf(baseConfig)>-1&&path!==baseConfig){
        if(pathname.indexOf(baseConfig)===-1){
          pathname = menus[i].path;
        }
      }
      if(path.indexOf(alipayDeliveryPage)>-1&&path!==alipayDeliveryPage){
        if(pathname.indexOf(alipayDeliveryPage)===-1){
          pathname = menus[i].path;
        }
      }
      if(path.indexOf(operationCenterPage)>-1&&path!==operationCenterPage){
        if(pathname.indexOf(operationCenterPage)===-1){
          pathname = menus[i].path;
        }
      }
      if(path.indexOf(customerServicePage)>-1&&path!==customerServicePage){
        if(pathname.indexOf(customerServicePage)===-1){
          pathname = menus[i].path;
        }
      }
    }
    if(!pathname){
      message.error('您没有权限登录！');
      window.sessionStorage.removeItem('loginData');
      return;
    }
    this.props.router.push({
      pathname: pathname,
      state: { from: 'login' }

    });
  }

  handleOnChange=(e)=>{
    let user = this.state.user;
    user[e.target.id] = e.target.value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    Common.validator(this, user, e.target.id);
    this.setState({
      user: user
    });
    if(this.state.errMsg) {
      this.onDismiss();
    }
  }
  onDismiss=()=>{
    this.setState({
      errMsg: ''
    });
  }
  reqPsd=()=>{
    this.setState({action:'resetpwd'});
  }
  onGoBack=()=>{
    this.setState({action:'login'});
  }
  render() {
    let errMsg = this.state.errMsg;

    let layout = 'vertical';
    let layoutItem = 'form-item-' + layout+' ' +'form-class';
    const formItemLayout = {
      labelCol: ((layout == 'vertical') ? null : { span: 0 }),
      wrapperCol: ((layout == 'vertical') ? null : { span: 24 }),
    };
    let userName = this.state.user.userName;
    let hints = this.state.hints;
    let visible = (this.state.action === 'login') ? '' : 'none';
    let contactTable ='';
    let year = new Date().getFullYear();
    let version = Utils.curVersion || '';
    if(this.state.action === 'login'){
      contactTable =(
              <div>
                {/*<CanvasDotePage />*/}
                <div className='login-title' >喜来快递云平台</div>
                <div className='banner-container'>
                  <div className='container-left'>
                      <CarouselPage ref={ref=>this.CarouselPage=ref} />
                  </div>
                  <div className='container-right'>
                      <div className='content-wrap1'>
                          <div className='inner-wrap'>
                              <div className='input-wrap1'>
                                  <div className='top-text'>喜来快递云平台</div>
                                  <ErrorMsg message={errMsg} toggle={this.onDismiss}  />
                                  <div style={{ width: '100%', display: visible ,position:'relative' }}>
                                      <Form layout={layout}>
                                          <FormItem {...formItemLayout} label="" style={{top:15 }} colon className='form-class' help={hints.userNameHint} validateStatus={hints.userNameStatus}>
                                              <Input size='large' className='login-input' prefix={<Icon type="user" style={{ fontSize: 15}} />} placeholder="请输入工号" type="text" name="userName" id="userName" value={this.state.user.userName} onChange={this.handleOnChange}  />
                                          </FormItem>
                                          <FormItem {...formItemLayout} label="" colon style={{top:70}}  className={layoutItem} help={hints.passwdHint} validateStatus={hints.passwdStatus}>
                                              <Input size='large' className='login-input' prefix={<Icon type="lock" style={{ fontSize: 15}} />}  placeholder="请输入密码" type="password" name="passwd" id="passwd" value={this.state.user.passwd} onChange={this.handleOnChange} />
                                          </FormItem>
                                          <FormItem  style={{top:125}} className={layoutItem} >
                                              <SlideBlockPage setSlideState={this.setSlideState} />
                                          </FormItem>
                                          <FormItem style={{top:180}} className='form-class'>
                                              <Button className='button-style' key="btnOK" type="primary" size="large" onClick={this.clickLogin} style={{ width: '100%'}} loading={this.state.loading}>登录</Button>
                                              <a onClick={this.reqPsd} style={{ float: 'right', marginTop: '1px',color:'#2f4c79'}}>忘记密码？</a>
                                          </FormItem>
                                      </Form>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                </div>
                  <div className="login-foot">
                      版权所有 &copy; {year}  xilaikd.com&nbsp;&nbsp;&nbsp;&nbsp;陕ICP备14006900号
                      <p>{version}</p>
                  </div>

              </div>
          )
      ;
    }else if(this.state.action === 'resetpwd'){
      contactTable = (<ResetPwdPage  onGoBack={this.onGoBack} />);
    }

    return (
        <div style={{ width: '100%', height: '100%',  opacity: '.92'}} className='log-wrap'>
          { contactTable }
        </div>
    );
  }
}
export default withRouter(LoginPage2);
