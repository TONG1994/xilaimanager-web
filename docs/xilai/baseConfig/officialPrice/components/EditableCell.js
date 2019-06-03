import React from 'react';
import { Table, Input, Icon, Button, Popconfirm } from 'antd';
import '../style/main2.scss';

class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: false,
    placeholder:"",
    errorVisible:false,
    visible: false,
    errorText:"",
  }
  handleChange = (e) => {
    const value = e.target.value;
    if(this.props.onChange) {
      this.props.onChange(value);
    }
    this.setState({ value });
  }
  check = () => {
    this.setState({ editable: false });
    if (this.props.onCheck) {
      this.props.onCheck(this.props.value);
    }
  }

  showMessage=(errorText)=>{
    this.setState({ editable: true, errorVisible: true, errorText: errorText});
    let $this = this;
    let timeOut=setTimeout(function(){
      $this.setState({errorVisible: false });
    },3000);
    this.setState({ editable: true, errorVisible: true, errorText: errorText , timeOut: timeOut});
  }

  edit = () => {
    this.setState({ editable: true });
  }
  
  componentDidMount=()=>{
    this.switchData(this.props.cellName);
  }

  //气泡卡片渲染的父节点
  appendZoon=()=>{
    return document.getElementById("officePrice-editable");
  }

  onCancel=()=>{
    clearTimeout(this.state.timeOut);
    this.setState({
      errorVisible: false
    });
  }

  switchData=(cellName)=>{
    switch(cellName){
      case "section1":
        this.setState({
          placeholder:"格式如:0＜x＜1"
        });
        break;
      case "section2":
        this.setState({
          placeholder:"格式如:1＜=x＜3"
        });
        break;
      case "section3":
        this.setState({
          placeholder:"格式如:3＜=x＜20"
        });
        break;
      case "firstWeightPrice":
        this.setState({
          placeholder:"格式如:0.00"
        });
        break;
      case "firstWeight":
        this.setState({
          placeholder:"格式如:0.00"
        });
        break;
      case "furtherWeightPrice":
        this.setState({
          placeholder:"格式如:0.00"
        });
        
    }
  }

  render() {
    let { editable,errorVisible,errorText } = this.state;
    let pContent = this.state.placeholder;
    return (
      <div  id="officePrice-editable">
      <div className="editable-cell">
        {
          editable || this.props.required?
              <div className="editable-cell-input-wrapper">
                <Popconfirm 
                  getPopupContainer={this.appendZoon}
                  onCancel={this.onCancel} 
                  autoAdjustOverflow={false}
                  placement="top" 
                  visible={errorVisible} 
                  title={errorText} 
                  cancelText="关闭"
                >
                  <Input
                      placeholder={pContent}
                      value={this.props.value}
                      onChange={this.handleChange}
                      onPressEnter={this.check}
                  />
                  <Icon
                    type="check"
                    className="editable-cell-icon-check"
                    onClick={this.check}
                  />
                </Popconfirm>
              </div>
            :
            <div className="editable-cell-text-wrapper">
              <div className="office-editable-cell" >{this.props.value || ' '}</div>
              <Icon
                type="edit"
                className="editable-cell-icon"
                onClick={this.edit}
              />
            </div>
        }
      </div>
      </div>
    );
  }
}
export default EditableCell;