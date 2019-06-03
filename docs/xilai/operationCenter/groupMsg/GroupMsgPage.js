import React from 'react';
import ReactMixin from 'react-mixin';
let Reflux = require('reflux');
import { Button, Table, Tabs, Icon, Modal, Input } from 'antd';
const Search = Input.Search;
const TabPane = Tabs.TabPane;
import ServiceMsg from '../../../lib/Components/ServiceMsg';
let Common = require('../../../public/script/common');
let Utils = require('../../../public/script/utils');
let QRCode = require('qrcode.react');
let GroupMsgStore = require('./store/GroupMsgStore.js');
let GroupMsgActions = require('./action/GroupMsgActions');

let filterValue = '';

import Filter from './components/Filter';
import GroupMsgModal from './components/GroupMsgModal';

import FormUtil from '../../../lib/Components/FormUtil';
import DictTable from '../../../lib/Components/DictTable';
const tableName = 'GroupMsgTable';
var FormDef = require('./components/GroupMsgForm');

let GroupMsgPage = React.createClass({
  getInitialState: function () {
    return {
      groupMsgSet: {
        recordSet: '',
        errMsg: '',
        startPage: 1,
        pageRow: 10,
        totalRow: 0,
      },
      loading: false,
      filter: {},
      value: '',
      actionType: 'retrieve',
      activeKey: '2'
    };
  },

  mixins: [Reflux.listenTo(GroupMsgStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
    if (data.operation === 'retrieve') {
      for (var i = 0; i < data.recordSet.length; i++) {
        if (data.recordSet[i].messageType == 'versions-update') {
          data.recordSet[i].messageTypeName = '版本更新通知'
        };

        if (data.recordSet[i].notifyobject == 'STAFF') {
          data.recordSet[i].notifyobjectName = '快递员'
        } else if (data.recordSet[i].notifyobject == 'MANAGER') {
          data.recordSet[i].notifyobjectName = '管理员'
        } else if (data.recordSet[i].notifyobject == 'CONSUMER') {
          data.recordSet[i].notifyobjectName = '用户'
        } else if (data.recordSet[i].notifyobject == 'STAFF,MANAGER') {
          data.recordSet[i].notifyobjectName = '快递员,管理员'
        } else if (data.recordSet[i].notifyobject == 'STAFF,CONSUMER') {
          data.recordSet[i].notifyobjectName = '快递员,用户'
        } else if (data.recordSet[i].notifyobject == 'MANAGER,CONSUMER') {
          data.recordSet[i].notifyobjectName = '管理员,用户'
        } else if (data.recordSet[i].notifyobject == 'STAFF,MANAGER,CONSUMER') {
          data.recordSet[i].notifyobjectName = '所有人'
        };

        if (data.recordSet[i].sendtype == '0') {
          data.recordSet[i].sendtypeName = '未发送'
        } else if (data.recordSet[i].sendtype == '1') {
          data.recordSet[i].sendtypeName = '已发送（发送成功）'
        } else if (data.recordSet[i].sendtype == '2') {
          data.recordSet[i].sendtypeName = '已发送（发送失败）'
        };

      };
      this.setState({
        loading: false,
        groupMsgSet: Object.assign({}, this.state.groupMsgSet, data)
      });
    }
    if (data.operation === 'remove') {
      this.handleQueryClick();
    }
  },
  // 刷新
  handleQueryClick: function () {
    let obj = this.filter ? this.filter.getFilter() : {};
    if (obj) {
      this.setState({ loading: true });
      // 根据条件调方法
      GroupMsgActions.retrieveGroupMsgPage(obj, this.state.groupMsgSet.startPage, this.state.groupMsgSet.pageRow);
    }
  },

  // 第一次加载
  componentDidMount: function () {
    this.state.validRules = FormDef.getFilterFormRule(this);
    var dataSet = this.state.groupMsgSet;
    var conf = FormUtil.getTableConf(tableName);
    dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
    dataSet.startPage = (conf.page !== true) ? 0 : 1;
    this.handleQueryClick();
  },

  clear: function (filter) {

    FormDef.initFilterForm(this.state.groupMsg);
    // FIXME 输入参数，对象初始化
    this.state.hints = {};
    this.state.filter.uuid = '';
    this.state.filter.filter = filter;
    this.state.loading = false;
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },
  onFilterRecord: function (e) {
    filterValue = e.target.value;
    this.setState({ loading: this.state.loading });
  },
  onTableRefresh: function (current, pageRow) {
    if (pageRow != this.state.groupMsgSet.pageRow) { current = 1 }
    this.state.groupMsgSet.startPage = current;
    this.state.groupMsgSet.pageRow = pageRow;
    this.handleQueryClick();
  },
  search: function () {
    this.state.groupMsgSet.startPage=1;
    this.handleQueryClick();
  },
  //新增
  add: function () {
    this.setState({ actionType: 'add' }, () => {
      //this.GroupMsgModal.addData();
    });
  },
  //查看
  onClickCheck: function (record) {
    this.setState({ actionType: 'check' }, () => {
      this.GroupMsgModal.initEditData(record);
    });
  },
  //删除
  delete: function (record) {
    let $this = this;
    Modal.confirm({
      title: '删除确认',
      content: '是否确定删除本条记录？',
      okText: '确定',
      cancelText: '取消',
      onOk: function () {
        $this.setState({ loading: true });
        GroupMsgActions.deleteMsg(record.uuid);
      }
    });
  },
  //编辑短信
  onClickEdit: function (record) {
    if(record.sendtype != '0'){
      Common.infoMsg('已发送的短信不能进行修改！');
      return
    };
    this.setState({ actionType: 'edit' }, () => {
      this.GroupMsgModal.initEditData(record);
    });
  },
  //返回
  goBack() {
    this.setState({ actionType: 'retrieve' });
    this.handleQueryClick();
  },
  //重置
  reset: function () {
    this.state.groupMsgSet.startPage = '1';
    this.filter.setState({
      filter: {
        messageType: '',
        sendtype: '',
      }
    }, () => {
      this.handleQueryClick();
    });
  },
  render: function () {
    let operCol = {
      title: '操作',
      key: 'action',
      width: 140,
      render: (text, record) => {
        return (
          <span>
            <Button title="查看" onClick={this.onClickCheck.bind(this, record)} key='查看'>查看</Button>
            <Button className='btn-margin' title="修改" onClick={this.onClickEdit.bind(this, record)} key='修改'>修改</Button>
            <Button type='danger' className='btn-margin' title="删除" onClick={this.delete.bind(this, record)} key='删除'>删除</Button>
          </span>
        )
      }
    };
    var leftButtons = [
      <Button icon={Common.iconSearch} title="查询" type='primary' onClick={this.search} key='查询'>查询</Button>,
      <Button icon={Common.iconAdd} title="重置" onClick={this.add} className='btn-margin' key="新建">新建</Button>,
      <Button icon={Common.iconReset} title="重置" onClick={this.reset} className='btn-margin' key="重置">重置</Button>,
    ];
    // 表格属性
    var attrs = {
      self: this,
      tableName: tableName,
      primaryKey: 'uuid',
      fixedTool: false,    // 固定按钮，不滚动
      buttons: leftButtons,
      btnPosition: 'top',
      rightButtons: '',
      operCol: operCol,
      tableForm: FormDef,
      editCol: false,
      editTable: false,
      defView: 'GroupMsgTable',
      totalPage: this.state.groupMsgSet.totalRow,
      currentPage: this.state.groupMsgSet.startPage,
      onRefresh: this.onTableRefresh,
    };
    let recordSet = Common.filter(this.state.groupMsgSet.recordSet);


    //数据
    // let data = [];
    // for (let i = 0; i < 9; i++) {
    //   data.push({
    //     key: i,
    //     msgType: '版本更新通知',
    //     time: '2018-10-10 12:12:00',
    //     personnel: '所有人',
    //     msgNumber: '120',
    //     msgStatus: '已发送（发送成功）'
    //   })
    // }
    let actionType = this.state.actionType;

    let modalProps = {
      actionType,
      goBack: this.goBack
    };

    return (
      <div className="grid-page">
        <ServiceMsg ref='mxgBox' svcList={['marketCampaign/retrieveOrgBaseInfo']} />
        {
          actionType === 'retrieve' ? (
            <div>
              <Filter ref={ref => this.filter = ref} />
              <DictTable dataSource={recordSet} loading={this.state.loading} attrs={attrs} />
            </div>
          ) :
            <div>
              <GroupMsgModal ref={ref => this.GroupMsgModal = ref}  {...modalProps} />
            </div>
        }
      </div>
    );
  }
});

module.exports = GroupMsgPage;