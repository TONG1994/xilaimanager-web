/**
 *   Create by Malson on 2018/8/17
 */

import React from 'react';
import {  Input ,Button,Modal,Icon} from 'antd';
import PropTypes from 'prop-types';
import AMap from './AMap';
import Utils from './Utils';
class MapIndex extends React.Component{
  constructor(props){
    super(props);
    this.state={
      position:'',
      visible:false,
      errorFlag:false,
      curP:''
    };
  }
  componentDidMount(){
  }
  getPosition(){
    if(this.props.value){
      this.setState({errorFlag:false});
      this.setState({visible:!this.state.visible});
    }else{
      this.setState({errorFlag:true});
    }
  }
  handleOK = ()=>{
    let position = this.aMapCom.state.lastPosition;
    if(position==='获取错误'){
      this.setState({visible:false});
      return;
    }
    this.setState({position,visible:false});
    this.props.handlemapok(position)
  };
  close=()=>{
    this.setState({visible:false});
  };
  render(){
    let aMapProps = {
      defaultVal:this.props.value,
    };
    
    let positionVal='';
    if(this.props.position && this.props.lngType){
      let pArr = this.props.position.split(',');
      let lng = Utils.ChangeToDFM(pArr[0])+'E',
          lat = Utils.ChangeToDFM(pArr[1])+'N';
      positionVal = lng + ',' + lat;
    }else if(this.props.position==undefined || null){
        positionVal = ''
    }else{
        positionVal = this.props.position.toString();
    }
    return(
        <div>
          <div style={{float:'left'}}>
            <Button onClick={()=>this.getPosition()}>获取经纬度</Button>
            {
              this.state.errorFlag?<span style={{color:'red',marginLeft:20}}>请先输入地址</span>:positionVal
                  ?<span style={{marginLeft:20}}><Icon type="environment-o" style={{color:'#575eff',marginRight:2}}/>{positionVal}</span>:''
            }
            <Modal
                title="经纬度确定"
                width={680}
                height={400}
                visible={this.state.visible}
                okText="确认"
                cancelText="取消"
                onCancel={this.close}
                onOk={this.handleOK}
            >
              <div style={{width:'100%',height:'360px'}}>
                {
                  this.state.visible?<AMap {...aMapProps} ref={ref=>this.aMapCom=ref}/>:''
                }
              </div>
            </Modal>
          </div>
          
        </div>
    )
  }
}
MapIndex.propTypes = {
  value:PropTypes.string.isRequired,
  handlemapok:PropTypes.func,
  align:PropTypes.string,
  lngType:PropTypes.boolean
};
export default MapIndex;