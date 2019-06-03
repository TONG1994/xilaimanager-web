import React from 'react';
import Helmet from 'react-helmet';
import { browserHistory } from 'react-router';
import { Layout, Menu,Icon, Dropdown, Button,Modal,Form ,Input,Alert,message} from 'antd';
const FormItem = Form.Item;
const { Header, Content, Footer } = Layout;
import { PrismCode } from 'react-prism';
import ModalForm from './ModalForm';
import Logo from '../../public/icons/logo.png';
let LoginUtil = require('../../login2/LoginUtil');
var Reflux = require('reflux');
let Utils = require('../../public/script/utils');
let Common = require('../../public/script/common');

import LogActions from '../../login2/action/LogActions';
import LogStores from '../../login2/data/LogStores';
let loginData = Common.getLoginData();
const propTypes = {
  children: React.PropTypes.node,
  navItems: React.PropTypes.array,
  activeNode: React.PropTypes.string,
  offsetLeft: React.PropTypes.string,
  home: React.PropTypes.string,
};

let TopBar = React.createClass({
  getInitialState: function () {
    return {
      activeNode: null,
      menuFile: null,
      accountVisible:false,
      changePsw:false,
      form:{
        oldPsw:'',
        newPsw:'',
        confirmPsw:''
      },
      errorMsg:'',
      hints: {},
      validRules: [],
    };
  },
  mixins: [Reflux.listenTo(LogStores, 'onServiceComplete'),],
  onServiceComplete:function (data) {
    if(data.operation === 'updatePwd'){
      if(data.errMsg){
        this.setState({errorMsg:data.errMsg});
        return ;
      }else{
        message.success('密码修改成功，请重新登录。正在跳转...');
        // Common.succMsg('密码修改成功！');
        this.hideModalPsw();
        this.formClear();
        window.sessionStorage.removeItem('loginData');
        window.localStorage.removeItem('loginData');
        setInterval(function(){
            Utils.showPage('/index.html');
        },1000);
      }
    }else if(data.operation === 'logout'){
      if(data.errMsg){
        this.setState({errorMsg:data.errMsg});
        return ;
      }else{
        window.sessionStorage.removeItem('loginData');
        window.localStorage.removeItem('loginData');
        Utils.showPage('/index.html');
      }
    }
  },
  componentDidMount(){
    this.state.validRules = [
      { id: 'oldPsw', desc: '原密码',required:true},
      { id: 'newPsw', desc: '新密码',required:true,min:6,max: 16,dataType:'passwd'},
      { id: 'confirmPsw', desc: '确认密码',required:true,min:6,max: 16},
    ];
  },
  goHome: function (e) {
    let url = this.props.home;
    if (url === null || typeof (url) === 'undefined') {
      url = '/main/DeskPage/';
    }

        // 不检查主页面的菜单
    Utils.setActiveMenuName('');

    if (url.charAt(0) === '@') {
      url = url.substr(1);
      Utils.showPage(url);
    } else {
      browserHistory.push({
        pathname: url
      });
    }
  },
  handleMenuClick: function (e) {
    Common.activePage = null;

    if (e.key === '1') {
            // 改密
      browserHistory.push({
        pathname: '/main/passwd/'
      });
    } else if (e.key === '2') {
            // 签退
      //调用后台接口
      LogActions.logout({username:'',password:''});
    } else if (e.key === '103') {
            // 菜单文件
      let str = JSON.stringify(this.props.navItems, null, 4);
      this.setState({ menuFile: str });
    } else if(e.key === '3') {
      let accountVisible = true;
      this.setState({accountVisible});
    } else if(e.key === '4'){
      //版本历史
      browserHistory.push('/xilai/historyVersion')
    }else{
      console.log('handleMenuClick', e);
    }
  },
  handleClick: function (e) {
    /*菜鸟打印特殊处理*/
    if(e.key==='noobPrint'){
      window.open('https://dayin.cainiao.com');
      return;
    }
    
    this.setState({ menuFile: null, activeNode: e.key });

    let len = this.props.navItems.length;
    for (let i = 0; i < len; i++) {
      let item = this.props.navItems[i];
      if (item.to === e.key) {
        if (item.onClick) {
          item.onClick();
          return;
        }
      }
    }

    let url = e.key;
    let param = '';
    let pos = url.indexOf('?');
    if (pos > 0) {
      param = url.substring(1 + pos);
      url = url.substring(0, pos);
    }

    let pr = { fromDashboard: true };
    if (param !== '') {
      let values = param.split('&');
      values.map((str, i) => {
        pos = str.indexOf('=');
        if (pos > 0) {
          let name = str.substring(0, pos);
          let value = str.substring(1 + pos);
          pr[name] = value;
        }
      });
    }

        // console.log('pr', pr);
    browserHistory.push({
      pathname: url,
      query: pr
    });
  },

    // 查找菜单节点
  findMenuNode: function (menus, href) {
    let len = menus.length;
    for (let i = 0; i < len; i++) {
      let node = menus[i];
      let path = node.to;
      if (path && path.startsWith(href)) {
        return node;
      }

            // 子节点
      let childNodes = node.nextMenus;
      if (!childNodes) {
        childNodes = node.childItems;
      }

      if (childNodes && childNodes.length > 0) {
        node = this.findMenuNode(childNodes, href);
        if (node) {
          return node;
        }
      }
    }
  },
  hideModal:function () {
    this.setState({accountVisible:false});
  },
  hideModalPsw:function () {
    this.setState({changePsw:false,hints:{}});
  },
  handleChangePsw:function () {
    this.setState({accountVisible:false,changePsw:true,});
    this.formClear();
  },
  formClear:function () {
    let form = Object.assign({},this.state.form,{oldPsw:'', newPsw:'', confirmPsw:''});
    this.setState({form});
  },
  handleOnChange:function (e) {
    let id = e.target.id, form = this.state.form,
        val = e.target.value.replace(/\s+/g, "");
        form[id] = val;
        Common.validator(this,form, e.target.id);
    this.setState({form,errorMsg:''});
  },
  errorMsg:function () {
    this.setState({errorMsg:''});
  },
  changePswOk:function () {
    this.setState({errorMsg:''});
    if(Common.validator(this,this.state.form)){
      let obj = this.state.form;
      if(obj.confirmPsw!==obj.newPsw){
        this.setState({errorMsg:'两次输入密码不一样'});
        return;
      }
      if(obj.newPsw === obj.oldPsw){
            Common.infoMsg('建议新旧密码不一样！');
            return;
      }
      let sendObj = {
          type:"2",
          pwd:Common.calcMD5(obj.oldPsw),
          newPwd:Common.calcMD5(obj.newPsw),
          phone:loginData.staffInfo.phone
      };
      LogActions.forgetPsw(sendObj)
    }
  },
  render: function () {
    let hints=this.state.hints;
    if (window.loginData === null || typeof (window.loginData) === 'undefined') {
      if (!LoginUtil.loadContext()) {
        browserHistory.push({
          pathname: '/index.html'
        });

        return null;
      }
    }

    if (!Common.isShowMenu) {
      let href = window.location.href;
      let pos = href.indexOf('?');
      if (pos > 0) {
        href = href.substr(0, pos);
      }

      pos = href.indexOf('/', 10);
      if (pos > 0) {
        href = href.substr(pos);
      }

            // 会自动添加 /safe
      if (href.startsWith('/safe')) {
        href = href.substr(5);
      }

      let node = this.findMenuNode(this.props.navItems, href);
            // console.log('this.props.navItems', this.props.navItems, window.location.href, node)
      if (node) {
        return (<div style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
          <Helmet
            titleTemplate="喜来快递云平台 - %s"
            title="喜来快递云平台"
            defaultTitle="喜来快递云平台"
            meta={[{ name: '喜来快递云平台' }]}
          />
          <Header style={{ margin: '-36px 0 0', height: '36px', lineHeight: '36px', paddingLeft: '36px' }}>
            <div style={{ float: 'left', color: '#EFEFEF' }}>{node.name}</div>
          </Header>
          <Content style={{ width: '100%', height: '100%', padding: '0 0px' }}>
            {this.props.children}
          </Content>
        </div>);
      }

      return (<div style={{ width: '100%', height: '100%', padding: '0 0' }}>
        <img src={Logo} />
        <Helmet
          // titleTemplate="喜来快递云平台 - %s"
          title="喜来快递云平台"
          defaultTitle="喜来快递云平台"
          meta={[{ name: '喜来快递云平台' }]}
        />
        <Content style={{ width: '100%', height: '100%', padding: '0 0px' }}>
          {this.props.children}
        </Content>
      </div>);
    }

    let menuStyle = { height: '36px', fontSize: '14px',textAlign:'center'};
    const menu = (
            Common.resMode ?
              (<Menu onClick={this.handleMenuClick}>
                <Menu.Item key="1" style={menuStyle}><Icon type="unlock" style={{ marginLeft: '8px' }} /><span>修改密码</span></Menu.Item>
                <Menu.Item key="2" style={menuStyle}><Icon type="home" /><span style={{ marginLeft: '8px' }}>用户签退</span></Menu.Item>
              </Menu>) :
                (<Menu onClick={this.handleMenuClick}>
                  {/*<Menu.Item key="1" style={menuStyle}><Icon type="unlock" /><span style={{ marginLeft: '8px' }}>修改密码</span></Menu.Item>*/}
                  {/*<Menu.Item key="103" style={menuStyle}><Icon type="bars" /><span style={{ marginLeft: '8px' }}>菜单文件</span></Menu.Item>*/}
                  <Menu.Item key="3" style={menuStyle}><Icon type="user" /><span style={{ marginLeft: '8px' }}>账户信息</span></Menu.Item>
                  <Menu.Item key="4" style={menuStyle}><Icon type="exception" /><span style={{ marginLeft: '8px' }}>版本历史</span></Menu.Item>
                  <Menu.Item key="2" style={menuStyle}><Icon type="logout" /><span style={{ marginLeft: '8px' }}>退出登录</span></Menu.Item>
                </Menu>)
        );

    let offsetLeft = this.props.offsetLeft;
    if (offsetLeft === null || typeof (offsetLeft) === 'undefined') {
      offsetLeft = '10%';
    }

    let body = null;
    if (this.state.menuFile) {
      let menuFile = this.state.menuFile;
      let blob = new Blob([menuFile]);

      body = (<div style={{ width: '70%', height: '100%', margin: '0 auto', padding: '40px 0', overflow: 'hidden' }}>
        <div style={{ fontSize: '12pt', padding: '0 0 12px 0' }}>菜单文件，生成的文件保存到[build/auth]目录下，用于菜单项的授权</div>
        <div style={{ height: '80%', overflowY: 'auto' }}>
          <pre style={{ backgroundColor: '#3f3f3f' }}>
            <PrismCode className="language-jsx">
              {this.state.menuFile}
            </PrismCode>
          </pre>
        </div>
        <div style={{ padding: '20px 0 0 0' }}><a className="load-field" download={Utils.selModName + '.json'} href={window.URL.createObjectURL(blob)}>下载菜单文件</a></div>
      </div>);
    } else {
      body = this.props.children;
    }
    //解决浏览器回退头部组件不回退的问题
    this.state.activeNode = this.props.activeNode;
    let aNode = [this.state.activeNode];
    let name = loginData.staffInfo.orgName ? (loginData.staffInfo.perName+'('+loginData.staffInfo.orgName+')') : loginData.staffInfo.perName;
    return (<div style={{ width: '100%', height: '100%' }}>
      <Helmet
        // titleTemplate="喜来快递云平台 - %s"
        title="喜来快递云平台"
        defaultTitle="喜来快递云平台"
        meta={[{ name: '喜来快递云平台' }]}
      />
      <Header className="lz-header"  style={{
        height: '64px',
        lineHeight: '64px',
        paddingLeft: '16px',
        paddingRight: '24px',
        minWidth:1100,
        backgroundColor:'#001529'
      }}>
        <div style={{ float: 'left', color: '#EFEFEF',fontSize:'16px' }}><img src={Logo} style={{width:50,marginRight:4,verticalAlign:'sub'}}/>喜来快递云平台</div>
        <Menu
          theme="dark" mode="horizontal" selectedKeys={aNode} onClick={this.handleClick}
          style={{ lineHeight: '64px', float: 'left', paddingLeft: '10%'}}
        >
          {
                        this.props.navItems.map((item) => {
                            // 检查权限
                          let itemColor = 'hsla(0, 0%, 100%, .67)';
                          let itemPriv = Utils.checkMenuPriv(item.to);
                          if (itemPriv === 2) {
                                // return null ;
                            itemColor = 'red';
                          } else if (itemPriv === 0) {
                            return null;
                          }

                          let iconType = 'file';
                          if (typeof (item.icon) !== 'undefined') {
                            iconType = item.icon;
                          }

                          return (<Menu.Item key={item.to}>
                            <span>
                              {/* <Icon type={iconType} />*/}
                              <span className={itemColor === 'red' ? 'errorHint' : 'nav-text'}>{item.name}</span>
                            </span>
                          </Menu.Item>);
                        })
                    }
         {loginData.staffInfo.orgName ?        
          <Menu.Item key='noobPrint'>
            <span>
             <span className='nav-text'>菜鸟打印</span> 
            </span>
          </Menu.Item>:''}
        </Menu>
        <div style={{ float: 'right', color: '#EFEFEF' }}>
          {/*<Icon type="home" onClick={this.goHome} title="返回主页" style={{ padding: '0 8px 0 0', cursor: 'pointer', fontSize: '16px' }} />*/}
          <Dropdown overlay={menu}>
            {/*<Icon type="setting" style={{ cursor: 'pointer', fontSize: '16px' }} />*/}
            <div style={{maxWidth:240,cursor:'pointer',lineHeight:'62px',textOverflow:'ellipsis', whiteSpace:'nowrap',overflow:'hidden',textAlign:'right'}}>
              <Icon type="user" style={{ cursor: 'pointer', fontSize: '20px',color:'#08dbfb',verticalAlign:'sub' }}/>
              <span style={{fontSize:15,marginLeft:6}} title={name}>{name}</span>
            </div>
          </Dropdown>
        </div>
      </Header>
      <Content style={{ width: '100%', height: '100%', paddingBottom:64 }}>
        {body}
      </Content>
      <Modal
          visible={this.state.accountVisible}
          title="账户信息"
          footer={false}
          onCancel={this.hideModal}
          width={400}
      >
        <div style={{paddingBottom:30}}>
          <div style={{width:220,textAlign:'left',margin:'0 auto',color:'#888'}}>
            <div>
              <Icon type="user" style={{fontSize:'18px',marginRight:8,color:'#08dbfb'}} />
              <span><span style={{color:'#333',fontSize:'18px'}}>{loginData.staffInfo.perName}</span>，欢迎回来！</span>
            </div>
            <div style={{paddingLeft:26,marginTop:10}}>注册时间 {loginData.staffInfo.createTime}</div>
          </div>
          <div style={{width:'100%',padding:'0 14px',margin:'20px 0',height:0.5,backgroundColor:'#ccc'}} />
          <div style={{width:220,margin:'0 auto'}}>
            <p style={{marginTop:10}}>用户账号：<span style={{marginLeft:4}}>{loginData.staffInfo.userCode}</span>
              <Button style={{marginLeft:10}} size='small' onClick={this.handleChangePsw}>修改密码</Button>
            </p>
            <p style={{marginTop:10}}>关联手机：<span style={{marginLeft:2}}>{loginData.staffInfo.phone.replace(/^(\d{3})\d{4}(\d{4})$/,'$1****$2')}</span></p>
            <p style={{marginTop:10}}>用户类型：<span style={{marginLeft:4}}>{
              loginData.staffInfo.orgType=='1'?'总部管理员':
                  loginData.staffInfo.orgType=='2'?'经营中心管理员':
                      loginData.staffInfo.orgType=='3'?'服务站管理员':'暂无'}</span></p>
          </div>
        </div>
      </Modal>
      <Modal
          visible={this.state.changePsw}
          title="修改密码"
          footer={[
            <div style={{display:'block'}}>
             {
            this.state.errorMsg? <Alert style={{marginBottom:'10px', textAlign:'left'}} message={this.state.errorMsg} type="error" showIcon closable={true} onClose={this.errorMsg}/>:''
           }
           <div style={{textAlign:'right'}}>
             <Button type='primary' size="large" className='btn-opera-margin'  onClick={this.changePswOk}>确 定</Button>
              <Button size="large" onClick={this.hideModalPsw}>取消</Button>
             
              </div>
            </div>
          ]}
          width={400}
          onCancel={this.hideModalPsw}
      >
        <div style={{width:'80%',margin:'0 auto'}}>
        <Form>
        <FormItem  key='oldPsw' label='旧密码' required={true} labelCol={{span: 6}} wrapperCol={{span:18}} colon={true}
                     help={hints.oldPswHint} validateStatus={hints.oldPswStatus}>
            <Input type='password' name='oldPsw' id='oldPsw'
                   value={this.state.form.oldPsw}
                   onChange={this.handleOnChange} />
          </FormItem>
          <FormItem  key='newPsw' label='新密码' colon={true} required={true} labelCol={{span: 6}} wrapperCol={{span:18}}
                     help={hints.newPswHint} validateStatus={hints.newPswStatus}>
            <Input type='password' name='newPsw' id='newPsw'
                   value={this.state.form.newPsw}
                   onChange={this.handleOnChange}
                   onPaste={(e)=> {e.preventDefault()}} />
            {/*e.clipboardData.getData('Text')获取粘贴板内容*/}
          </FormItem>
          <FormItem  key='confirmPsw' label='确认密码' colon={true} required={true} labelCol={{span: 6}} wrapperCol={{span:18}}
                     help={hints.confirmPswHint} validateStatus={hints.confirmPswStatus}>
            <Input type='password' name='confirmPsw' id='confirmPsw'
                   value={this.state.form.confirmPsw}
                   onChange={this.handleOnChange}
                   onPaste={(e)=>{e.preventDefault()}}
            />
          </FormItem>
        </Form>
        
          
        </div>
      </Modal>
    </div>);
  }
});

TopBar.propTypes = propTypes;
module.exports = TopBar;
