/**
 *   Created by chenhui on 2018/5/8
 **/
import {Form, Icon, Spin} from 'antd';

const FormItem = Form.Item;
import React from 'react';

var Reflux = require('reflux');
import CommonStore from '../../../lib/data/CommonStore';
import CommonActions from '../../../lib/action/CommonActions';

var OperateLog = React.createClass({
      getInitialState: function () {
        return {
          loading: false,
          recordSet: [],
          display: '',
          flag: true
        };
      },
      mixins: [Reflux.listenTo(CommonStore, 'onServiceComplete')],
      onServiceComplete: function (datas) {
        this.setState({
          loading: false,
          recordSet: datas.recordSet,
        });
      },
      changeLog: function (e) {
        let $dom = e.target;
        let $domparent = $dom.parentNode;
        let type = $dom.getAttribute('class');
        if (type.indexOf('plus-square-o') != -1) {
          $dom.setAttribute('title', '折叠');
          $dom.setAttribute('class', 'anticon anticon-minus-square-o');
          $domparent.getElementsByTagName("div")[0].style.display = '';
        } else {
          $dom.setAttribute('title', '展开');
          $dom.setAttribute('class', 'anticon anticon-plus-square-o');
          $domparent.getElementsByTagName("div")[0].style.display = 'none';
        }
      },
      componentWillReceiveProps: function (newProps) {
        if (newProps.modal) {
          if (this.state.flag) {
            let uuid = newProps.uuid;
            let obj = {'uuid': uuid}
            CommonActions.retrieveOperateLogPage(obj, 1, 50);
            this.setState({flag: false, loading: true});
          }
        } else {
          this.setState({recordSet: [], loading: false, flag: true});
        }
      },
      render() {
        let htm = '';
        let dataAll = this.state.recordSet;
        if (dataAll.length == 0) {
          this.state.display = 'none';
        } else {
          this.state.display = '';
          htm = <span>{
            dataAll.map((item, index) => {
              let data = item.differData || [];
              let count = 0;
              return <div style={{marginBottom: '10px'}}>{
                    <span>{index + 1}.{item.createTime}由{item.userCode}{item.operation}</span>
              }{
                item.operation == '修改' ?
                    <Icon type="plus-square-o" style={{marginRight: 8, cursor: 'pointer'}} title="展开" onClick={(e) => {
                      this.changeLog(e)
                    }}/> :
                    ''
              }
                {
                  data.length == 0 ?
                      <div style={{marginLeft: '20px', display: this.state.display}}></div> :
                      <div style={{marginLeft: '20px', background: '1px gainsboro', display: 'none'}}>{
                        data.map(item => {
                          count++;
                          if (item.oldValue != item.value) {
                            return <div style={{overflow: 'auto', padding: '2px 10px'}}>
                              修改了{item.label},旧值为:{item.oldValue},新值为:{item.value}</div>
                          }
                          if (count == data.length) {
                            return <div style={{marginLeft: '20px', display: 'none'}}></div>
                          }
                        })
                      }</div>
                }</div>
            })
          }</span>;
        }
        return (
            <div style={{marginTop: '10px'}}>
              <Spin spinning={this.state.loading}>
                <lable style={{display: this.state.display}}>历史记录</lable>
                <div id='span' style={{marginLeft: '50px'}}>
                  {htm}
                </div>
              </Spin>
            </div>
        );
      }
    }
);
module.exports = OperateLog;
