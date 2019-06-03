/**
 *   Create by Malson on 2018/5/5
 */

import React from 'react';
import classNames from 'classnames';
import { AutoComplete } from 'antd';

// import CommonActions from '../../../../lib/action/CommonActions';
// import CommonStore from '../../../../lib/data/CommonStore';
import CommonActions from '../action/BusinessCenterActions';
import CommonStore from '../data/BusinessCenterStore';
class BusinessCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            value: '',
            flag: false
        }
    }
    getBusinessCenter = (data) => {
        let stateData = [];
        if (data.operation === 'getBusinessCenter') {
            if (data.recordSet === null) {
                this.setState({ data: [] });
                return;
            }
            data.recordSet.map(item => {
                let obj = {};
                obj.value = item.orgNo;
                obj.text = item.orgName;
                stateData.push(obj);
            });

            this.setState({ data: stateData });
        }
    }
    componentDidMount() {
        this.getBusinessCenterFun = CommonStore.listen(this.getBusinessCenter);
    }
    componentWillMount() {
        if (this.getBusinessCenterFun) {
            this.getBusinessCenterFun();
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
            if (nextProps.value === nextState.value) {
                return false
            }
            return true;
        }
        // componentWillUpdate(props){
        //   if(props.value){
        //     CommonActions.getBusinessCenterByNo({orgNo:props.value})
        //   }
        // }
    clear = () => {
        this.setState({ data: [], value: '', flag: false });
    }
    onSelect = (value) => {
        this.setState({ value, flag: false });
        // obj = data.find(item=>item.value===value);
        // this.props.onSelect(value);   // 为了Log需求，需要获取text值，因而修改
        let { data } = this.state;
        let obj = data.find(item => item.value === value);
        this.props.onSelect(obj);
    }
  handleSearch = (value)=>{
    this.setState({value});
    CommonActions.getBusinessCenter({'orgName':value,'orgType':'2'});
  }
  render(){
    let disable = this.props.disabled;
    let {value,data}=this.state;
    return(
        <AutoComplete
            ref={ref=>this.autoComplete=ref}
            dataSource={data}
            onSelect={this.onSelect}
            placeholder="模糊匹配经营中心"
            value={value}
            disabled={disable}
            onSearch={this.handleSearch}
            size='large'
            filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
        />
    )
  }
}
export default BusinessCenter;