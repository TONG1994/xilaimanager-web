/**
 *   Created by chenhui on 2018/5/8
 **/
import { Select ,Spin  } from 'antd';
const Option = Select.Option;
import React from 'react';
var Reflux = require('reflux');
import ManageOrderActions from '../action/ManageOrderActions';
import ManageOrderStore from '../data/ManageOrderStore';


var OrgBranchSelect= React.createClass({
        getInitialState : function() {
            return {
                data: [],
                value: '',
                valueUuid:''
            };
        },
        mixins: [Reflux.listenTo(ManageOrderStore, 'onServiceComplete')],
        onServiceComplete: function(datas) {
            if(datas.operation === 'get'){
                var data = [];
                if(datas.recordSet != null && datas.recordSet.length > 0){
                    data = datas.recordSet;
                }else{
                    data.push({orgUuid:'无匹配结果',orgName:'无匹配结果'})
                }
                this.setState({ data });
            }
        },

        clear:function(){
            this.setState({ data:[],value:'' });
        },
         handleChange:function (value) {
             var value = value.replace(/(^\s*)/g, "");
            if(value =='无匹配结果'){
                this.setState({
                    data:[],
                    value:'',
                });
            }else{
                this.setState({ value });
                ManageOrderActions.searchSitesByFilter({orgName:value});
            }

        },
        onBlur:function(){
            var dataArr  = this.state.data;
            let value = this.state.value;
            let index = dataArr.findIndex(item=>item.orgName == value);
            if(index === -1){
                this.setState({
                    data:[],
                    value:'',
                    valueUuid:''
                });
                this.props.organizationNo('')
            }else{
                this.setState({
                    data:[],
                    valueUuid:dataArr[index].orgNo
                });
                this.props.organizationNo(dataArr[index].orgNo,dataArr[index].orgType)
            }

        },
        render() {
        const options = this.state.data.map(d => <Option key={d.orgName}>{d.orgName}</Option>);
        return (

            <Select
                {...this.props}
        mode="combobox"
        value={this.state.value}
        placeholder= '输入机构名称并选择'
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onChange={this.handleChange}
        onBlur={this.onBlur}
    >
        {options}
    </Select>
        );
    }
}
);
module.exports = OrgBranchSelect;
