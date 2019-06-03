import React from 'react';
import {Select,Spin ,Popconfirm} from 'antd';
const Option = Select.Option;
/*
  data:数据(对象数组)
  dataLevel:数据总共几个层级 注意->最多支持3级
  useLevel:用第几级数据
  showCode:是否显示code
  mode:设置Select的模式为多选或标签
  required:fale->不需要占位符，反之则要
  FYloading:是否需要刷新
  firstLevelValue:一级参数
  secondLevelValue:二级参数
  thirdLevelValue:三级参数
  showSearch:设置为可查询（根据显示内容查询）
  ***多选的参数必须是Array格式，单选可以是数组或者字符串
*/ 

export default class FYSelect extends React.Component{

  constructor(newProps){
    super(newProps);
    this.state={
      errorVisible:false,
      errorText:"",
    }
  }

  selectMultiValue= (value)=> {
    if (this.props.onSelect) {
        var inputValue = this.props.value;
        var arr = inputValue ? inputValue.split(',') : [];
        arr.push(value);
        inputValue = arr.join(',');

        this.props.onSelect(inputValue);
    }
  }

  deselectMultiValue=(value)=> {
    if (this.props.onSelect) {
        var inputValue = this.props.value;
        var arr = inputValue ? inputValue.split(',') : [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === value) {
                arr.splice(i, 1);
                break;
            }
        }
        inputValue = arr.join(',');
        this.props.onSelect(inputValue);
    }
  }

  //气泡卡片渲染的父节点
  appendZoon=()=>{
    return document.getElementById("officePrice-editable");
  }

  onCancel=()=>{
    this.setState({
      errorVisible: false
    });
  }

  showMessage=(errorText)=>{
    this.setState({ errorVisible: true, errorText: errorText});
    let $this = this;
    setTimeout(function(){
      $this.setState({errorVisible: false });
    },3000);
  }

  render(){
    let { errorVisible,errorText } = this.state;
    const {
      data,
      dataLevel,
      useLevel,
      showCode,
      mode,
      required,
      FYloading,
      onSelect,
      firstLevelValue,
      secondLevelValue,
      thirdLevelValue,
      ...attributes
    } = this.props;

    var opts;
    let value;
    if(data){
      if((useLevel && useLevel === "1") || !useLevel){
        value = firstLevelValue;
        opts=data.map((item,i)=>{
          return <Option key={item.code} value={item.code}>{item.label}</Option>
        });
      }else if(useLevel && useLevel === "2"){
        value = secondLevelValue;
        if(firstLevelValue instanceof Array){
          let usedata = [];
          for (let i = 0; i < firstLevelValue.length; i++) {
            for (let k = 0; k < data.length; k++) {
              if(firstLevelValue[i] === data[k].code){
                if(data[k].children){
                  usedata.concat(data[k].children);
                }
              }
            }
          }
          opts = usedata.map((item,i)=>{
            return <Option key={item.code} value={item.code}>{item.label}</Option>
          });
        }else if(typeof(firstLevelValue) === "string"){
          let fatherData = data.find(item=>item.code === firstLevelValue);
          if(fatherData && fatherData.children){
            opts = fatherData.children.map((item,i)=>{
              return <Option key={item.code} value={item.code} >{item.label}</Option>
            });
          }
        }
      }else if(useLevel && useLevel === "3"){
        value = thirdLevelValue;
        if(firstLevelValue instanceof Array){
          let usedata1 = [];
          for (let i = 0; i < firstLevelValue.length; i++) {
            for (let k = 0; k < data.length; k++) {
              if(firstLevelValue[i] === data[k].code){
                usedata1.concat(data[k].children);
              }
            }
          }

          if(secondLevelValue instanceof Array){
            let usedata2 = [];
            for (let j = 0; j < secondLevelValue.length; j++) {
             for (let l = 0; l < usedata1.length; l++) {
              if(secondLevelValue[j] === usedata1[l].code){
                usedata2.concat(usedata1[l].children);
              }
             }
            }
            opts = usedata2.map((item,i)=>{
              return <Option key={item.code} value={item.code}>{item.label}</Option>
            });
          }else if(typeof(secondLevelValue) === "string"){
            let usedata2=[];
            usedata2=usedata1.find(item=>item.code === secondLevelValue).children;
            opts = usedata2.map((item,i)=>{
              return <Option key={item.code} value={item.code}>{item.label}</Option>
            });
          }
        }else if(typeof(firstLevelValue) === "string"){
          let usedata1 = data.find(item=>item.code === firstLevelValue).children;
          if(secondLevelValue instanceof Array){
            let usedata2 = [];
            for (let j = 0; j < secondLevelValue.length; j++) {
             for (let l = 0; l < usedata1.length; l++) {
              if(secondLevelValue[j] === usedata1[l].code){
                usedata2.concat(usedata1[l].children);
              }
             }
            }
            opts = usedata2.map((item,i)=>{
              return <Option key={item.code} value={item.code}>{item.label}</Option>
            });
          }else if(typeof(secondLevelValue) === "string"){
            let usedata2 = usedata1.find(item=> item.code === secondLevelValue).children;
            opts = usedata2.map((item,i)=>{
              return <Option key={item.code} value={item.code}>{item.label}</Option>
            });
          }
        }
      }
    }else{
      opts=<Option key="" value="">--</Option>;
    }

    var obj;
    if (mode === 'multiple') {
        // var list = value ? value.split(',') : [];
        obj =
            <Select mode="multiple" value={value} onSelect={this.selectMultiValue} onDeselect={this.deselectMultiValue} {...attributes}>
                {opts}
            </Select>;
    }
    else {
        if (required) {
            obj = <Select value={value} optionFilterProp="children" onSelect={onSelect} {...attributes}>
                {opts}
            </Select>;
        }
        else {
            obj = <Select value={value} onSelect={onSelect} optionFilterProp="children" {...attributes}>
                <Option value=''>--</Option>
                {opts}
            </Select>;
        }
    }

    return <Popconfirm 
      getPopupContainer={this.appendZoon}
      onCancel={this.onCancel} 
      autoAdjustOverflow={false}
      placement="top" 
      visible={errorVisible} 
      title={errorText} 
      cancelText="关闭"
  >
    {FYloading ? 
      <Spin>{obj}</Spin>
    :
    obj}
  </Popconfirm>
  }

};
