
let $ = require('jquery');

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';

let Reflux = require('reflux');
import { withRouter } from 'react-router';

import { Form, Button, Input, Icon, Checkbox } from 'antd';

const FormItem = Form.Item;

let Common = require('../public/script/common');
let Utils = require('../public/script/utils');
import ErrorMsg from '../lib/Components/ErrorMsg';
import CompSelect from './Components/CompSelect';
import CanvasDotePage from './Components/CanvasDotePage';

let LoginUtil = require('./LoginUtil');


let LoginInnPage = withRouter(React.createClass({
  getInitialState: function () {
    let isLogined = false;
    if (LoginUtil.loadContext()) {
      isLogined = true;
      this.props.router.push({
        pathname: Common.getHomePage().home,
        state: { from: 'login' }
      });
    }

    let storage = window.localStorage;
    let flag = (storage.isRemember === '1');
    let userName = (flag ? storage.userName : '');

    let corpUuid = '';
    if (Common.corpStruct === '单公司') {
      corpUuid = Common.corpUuid;
    } else if (flag) {
      corpUuid = storage.corpUuid;
    }

    return {
      user: {
        userName: userName,
        passwd: '',
        corpUuid: corpUuid
      },
      isLogined: isLogined,
      loading: false,
      isRemember: true,
      errMsg: '',
      hints: {},
      validRules: []
    };
  },

  // 第一次加载
  componentDidMount: function () {
    if (!this.state.isLogined) {
      let self = this;
      LoginUtil.downConfig(this).then((result) => {
        if (Common.corpStruct === '单公司') {
          self.state.user.corpUuid = Common.corpUuid;
        } else {
          self.onConfigLoaded();
        }
      }, (value) => {
        Common.errMsg('加载配置文件错误');
      });
    }

    this.state.validRules = [
      { id: 'userName', desc: '用户名', required: true, max: 24 },
      { id: 'passwd', desc: '密码', required: true, max: 16 }
    ];
  },
  showError: function (msg) {
    this.setState({
      errMsg: msg
    });
  },
  onConfigLoaded: function () {
    // 自动登录
    if (LoginUtil.isSafetyLogin(this)) {

    } else {
      // 检查登录信息

      if (this.refs.compSelect) {
        this.refs.compSelect.loadCorps();
      }
    }
  },
  onSafetyNavi: function (loginData) {
    LoginUtil.safeNavi(this, loginData);
  },

  clickLogin: function (event) {
    let passwd = this.state.user.passwd;
    this.state.errMsg = '';
    if (!Common.formValidator(this, this.state.user)) {
      return;
    }

    let url = Utils.authUrl + 'auth-user/login';
    let pwd = Common.calcMD5(passwd);

    let loginData = {};
    loginData.password = pwd;
    loginData.username = this.state.user.userName;

    let self = this;
    this.setState({ loading: true });
    Utils.loginService(url, loginData).then((userData, status, xhr) => {
      self.state.loading = false;
      if (userData.errCode == null || userData.errCode == '' || userData.errCode == '000000') {
        self.loginSuccess(userData.object);
      } else {
        self.showError('处理错误[' + userData.errCode + '][' + userData.errDesc + ']');
      }
    }, (xhr, errorText, errorType) => {
      self.state.loading = false;
      self.showError('未知错误');
    });
  },

  clickQuickLogin: function (event) {
    this.state.user.corpUuid = Common.corpUuid;

    let url = Utils.authUrl + 'auth-user/login';
    let loginData = {};
    loginData.password = 'admin';
    loginData.username = 'admin';

    let self = this;
    this.setState({ loading: true });
    Utils.loginService(url, loginData).then((userData, status, xhr) => {
      self.state.loading = false;
      if (userData.errCode == null || userData.errCode == '' || userData.errCode == '000000') {
        self.loginSuccess(userData.object);
      } else {
        self.showError('处理错误[' + userData.errCode + '][' + userData.errDesc + ']');
      }
    }, (xhr, errorText, errorType) => {
      self.state.loading = false;
      self.showError('未知错误');
    });
  },

  loginSuccess: function (loginData) {
    let corpUuid = this.state.user.corpUuid;
    LoginUtil.saveLoginData(loginData, corpUuid);

    let storage = window.localStorage;
    storage.isRemember = (this.state.isRemember ? '1' : '0');
    storage.userName = (this.state.isRemember ? this.state.user.userName : '');
    storage.corpUuid = (this.state.isRemember ? this.state.user.corpUuid : '');

    // 下载菜单
    let self = this;
    Utils.downAppMenu(Common.getHomePage().appName, Common.getHomePage().appGroup).then((data) => {
      self.state.loading = false;

      self.props.router.push({
        pathname: Common.getHomePage().home,
        state: { from: 'login' }
      });
    }, (errMsg) => {
      self.state.loading = false;
      self.showError(errMsg);
    });
  },

  handleOnChange: function (e) {
    let user = this.state.user;
    user[e.target.id] = e.target.value;
    Common.validator(this, user, e.target.id);
    this.setState({
      user: user
    });
  },
  handleCheckBox: function (e) {
    let value = e.target.checked;
    this.setState({
      isRemember: value
    });
  },
  handleOnSelected: function (id, value, option) {
    let user = this.state.user;
    user[id] = value;
    this.setState({
      user: user
    });
  },
  onUserNameFinished: function (e) {
    if (Common.corpStruct !== '单公司') {
      this.refs.compSelect.loadData(this.state.user.userName);
    }
  },
  onLoadCamp: function (corpUuid) {
    let user = this.state.user;
    user.corpUuid = corpUuid;
    this.setState({
      user: user
    });
  },
  onDismiss: function () {
    this.setState({
      errMsg: ''
    });
  },

  render: function () {
    let errMsg = this.state.errMsg;

    let layout = 'vertical';
    let layoutItem = 'form-item-' + layout;
    const formItemLayout = {
      labelCol: ((layout == 'vertical') ? null : { span: 0 }),
      wrapperCol: ((layout == 'vertical') ? null : { span: 24 }),
    };

    let hints = this.state.hints;
    let corpBox = (Common.corpStruct === '单公司') ?
        null :
        (<FormItem
          labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} colon style={{ marginBottom: '20px' }}
          className={layoutItem} help={hints.compUuidHint} validateStatus={hints.compUuidStatus}
        >
          <CompSelect
            style={{ opacity: '.9' }} name="corpUuid" id="corpUuid" ref="compSelect"
            value={this.state.user.corpUuid} onSelect={this.handleOnSelected.bind(this, 'corpUuid')}
            onLoaded={this.onLoadCamp}
          />
        </FormItem>);

    return (
      <div style={{ width: '100%' }}>
        <CanvasDotePage />
        <div style={{ width: '300px', paddingTop: '100px', margin: '0 auto' }}>
          <Form layout={layout}>
            <FormItem
              {...formItemLayout} label="" colon style={{ marginBottom: '20px' }}
              help={hints.userNameHint} validateStatus={hints.userNameStatus}
            >
              <Input
                prefix={<Icon type="user" style={{ fontSize: 13 }} />} style={{ opacity: '.9' }} placeholder="用户名"
                type="text" name="userName" id="userName" value={this.state.user.userName}
                onChange={this.handleOnChange} onBlur={this.onUserNameFinished}
              />
            </FormItem>
            <FormItem
              {...formItemLayout} label="" colon style={{ marginBottom: '20px' }} className={layoutItem}
              help={hints.passwdHint} validateStatus={hints.passwdStatus}
            >
              <Input
                prefix={<Icon type="lock" style={{ fontSize: 13 }} />} style={{ opacity: '.9' }} placeholder="密码"
                type="password" name="passwd" id="passwd" value={this.state.user.passwd}
                onChange={this.handleOnChange}
              />
            </FormItem>
            {corpBox}
            <FormItem>
              <ErrorMsg message={errMsg} toggle={this.onDismiss} />
              <Checkbox
                id="remember" style={{ color: '#fff', opacity: '.9' }} checked={this.state.isRemember}
                onChange={this.handleCheckBox}
              >记住用户名</Checkbox>
              <Button
                key="btnOK" type="primary" size="large" onClick={this.clickLogin}
                style={{ width: '100%', opacity: '.9' }} loading={this.state.loading}
              >登录</Button>
              {Common.resMode ? null : <Button
                key="btnOK1" type="primary" size="large" onClick={this.clickQuickLogin}
                style={{ width: '100%', marginTop: '20px', opacity: '.9' }}
                loading={this.state.loading}
              >快速登录</Button>}
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}));

module.exports = LoginInnPage;
