/**
 *   Created by chenhui on 2018/5/8
 **/
import { Select ,Spin  } from 'antd';
const Option = Select.Option;
import React from 'react';
var Reflux = require('reflux');
import orgBranchSelectStore from './data/OrgBranchSelectStore';
import orgBranchSelectActions from './action/OrgBranchSelectActions';

var OrgBranchSelect= React.createClass({
        getInitialState : function() {
            return {
                data: [],
                value: '',
                valueUuid:''
            };
        },
        mixins: [Reflux.listenTo(orgBranchSelectStore, 'onServiceComplete')],
        onServiceComplete: function(datas) {
            var data = [];
            if(datas.object != null){
                data = datas.object;
            }else{
                data.push({orgUuid:'无匹配结果',orgName:'无匹配结果'})
            }
             this.setState({ data });
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
                orgBranchSelectActions.getBranchList({orgName:value});
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
                this.props.fromWhere('')
            }else{
                this.setState({
                    data:[],
                    valueUuid:dataArr[index].orgUuid
                });
                this.props.fromWhere(dataArr[index].orgUuid)
            }

        },
        render() {
        const options = this.state.data.map(d => <Option key={d.orgName}>{d.orgName}</Option>);
        return (

            <Select
                {...this.props}
        mode="combobox"
        value={this.state.value}
        placeholder= '输入数据来源并选择'
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
