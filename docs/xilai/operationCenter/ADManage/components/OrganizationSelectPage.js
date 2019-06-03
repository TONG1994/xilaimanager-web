/**
 *   Create by Malson on 2018/4/26
 */

import React from 'react';
import ReactDOM from 'react-dom'
import moment from 'moment';
let Reflux = require('reflux');
import {TreeSelect} from 'antd';
const TreeNode = TreeSelect.TreeNode;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var ADCommon = require('../components/ADCommon');
let FormDef = require('./ADManageForm');
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');

var ADManageStore = require('../data/ADManageStore');
var ADManageActions = require('../action/ADManageActions');

let OrganizationSelectPage = React.createClass({
    getInitialState: function () {
        return {
            loading: false,
            // modal: false,
            // validRules: [],
            // adManage: {
            //     upTime:'',
            //     downTime:'',
            // },
            // hints: {},
            organizationList: {
                recordSet: [],
                errMsg: '',
            },
            value:undefined,
        };
    },
    mixins: [Reflux.listenTo(ADManageStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        if (data.errMsg) return;
        if (data.operation === 'getOrgsByCitys') {
            this.setState({organizationList: data, loading: false});
        }
    },
    // 第一次加载
    componentDidMount: function () {
        this.setState({loading: true});
        ADManageActions.getOrgsByCitys();
    },

    onChange:function(value){
        this.setState({ value });
        if(value !== '0'){
            if(this.props.onSelected){
                this.props.onSelected(value);
            }
        }else{
            if(this.props.onSelected){
                this.props.onSelected(null);
            }
        }
    },
    getAllOrgNo:function(){
        let treeData = this.state.organizationList.getOrgsByCitys || [];
        let orgNoAll = [];
        treeData.map(item=>{
            if(item.children){
                item.children.map(jtem=>{
                    if(jtem.children){
                        jtem.children.map(htem=>{
                            if(htem.orgNo){
                                orgNoAll.push(htem.orgNo);
                            }
                        })
                    }
                })
            }
        });
        return orgNoAll
    },
    render() {
        let treeData = this.state.organizationList.getOrgsByCitys || [];
        let { value,disabled} = this.props;
        //当没有数据的时候展示
        // if (treeData.length === 0) {
        //     if (this.state.loading) {
        //         return (<Spin tip="正在努力加载数据..." style={{ minHeight: '200px' }}></Spin>);
        //     }
        //     else {
        //         return (<div style={{ margin: '16px 0 0 16px' }}>暂时没有数据</div>);
        //     }
        // }
        let parentDate = [];//一级
        treeData.map(item=>{
            let childrenFirstDate = [];
            let childrenSecondDate = [];
            if(item.children){
                item.children.map(jtem=>{
                    childrenSecondDate = [];
                    if(jtem.children){
                        jtem.children.map(htem=>{
                            childrenSecondDate.push(<TreeNode value={htem.orgNo} title={htem.orgName} key={htem.orgNo}></TreeNode>)
                        })
                    }
                    childrenFirstDate.push(<TreeNode value={jtem.value} title={jtem.label} key={jtem.value}>{childrenSecondDate}</TreeNode>);
                });
                parentDate.push(<TreeNode value={item.value} title={item.label} key={item.value}>{childrenFirstDate}</TreeNode>);
            }
        });
        let TreeSelectHtml = <TreeSelect
            value={value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择服务站"
            allowClear
            treeCheckable="true"
            onChange={this.onChange}
            disabled={disabled}
        >
            {parentDate}
        </TreeSelect>
        return (
            <div>
                {TreeSelectHtml}
            </div>
        );
    }
});

export default OrganizationSelectPage;
