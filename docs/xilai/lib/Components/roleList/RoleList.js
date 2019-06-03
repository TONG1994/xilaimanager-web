/**
 *   Create by Malson on 2018/6/20
 */

import React from 'react';
import { Select } from 'antd';
import common from '../../../../public/script/common';
const Option = Select.Option;


import RoleListActions from './action/RoleListActions';
import RoleListStore from './data/RoleListStore';


let RoleList =

    class RoleList extends React.Component{
        constructor(props){
            super(props);
            this.state={
                data:[]
            }
        }
        onSelect = (val)=>{
            let optData ={};
            if(val === ''){
                optData ={roleName:'',uuid:''};
              }else{
                let obj = this.state.data.find(item=>val===item.uuid);
                optData ={roleName:obj.roleName,uuid:obj.uuid};
              }
              if(this.props.changeRoleList){
                this.props.changeRoleList(optData);
              }

        };
        onStatusChange = (data)=>{
            if(data.errMsg) return;
            if(data.operation==="get"){
                let setData = data.recordSet;
                this.setState({data:setData});
            }
        };
        componentDidMount(){
            this.unsubscribe = RoleListStore.listen(this.onStatusChange);
            RoleListActions.getBranchList();
        }
        componentWillUnmount() {
            this.unsubscribe();
        }
        render(){
            let { value,disabled } = this.props;
            if(!disabled){
                disabled = false;
            }
            let options = this.state.data.map(item=>{
                return (
                    <Option value={item.uuid} key={item.uuid} title={item.roleName}>{item.roleName}</Option>
                )
            });
            return(
                <Select value ={value} onSelect={this.onSelect}  size='large' disabled = {disabled}>
                    <Option value="" key='--'> -- </Option>
                    {options}
                </Select>
            )
        }
    }
export default RoleList;