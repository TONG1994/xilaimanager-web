import { Button, Icon, message } from 'antd';
import React from 'react';
import $ from 'jquery';
var Common = require('../../../../public/script/common');


class Demo extends React.Component {

  constructor(){
    super();
    this.state={
      content:'',
      base64pic:'',
    }
  }


  initDemo(){
    //初始化
    if(this.state.content){
      this.setState({
        content:'',
        base64pic:'',
      })
    }
  }


  F_Open_dialog(){
      //触发点击上传
    $("#btn_file").click();
  }

  onChange(e){
    let file=e.target.files[0];
    this.PicToBase64(file);
  }


  PicToBase64(file) {
    let $this=this;
    if(undefined==file){
        return false;
    }
    if(!/image\/\w+/.test(file.type)){
        Common.errMsg('请上传图片');
        return false;
    }
    var reader = new FileReader();  
    reader.readAsDataURL(file);
    let fileName=file.name;
    reader.onload = function (e) {
      $this.setState({
        base64pic:this.result,
        content:fileName
      })
      if($this.props.Action=="create"){
        $this.props.onCreateChange(this.result);
      }else if($this.props.Action=="update"){
        let HH={
          base64pic:this.result
        }
        $this.props.onUpdateChange(HH);
      }
    } 
}

  render() {
    let mc=(  
      <div id="all">
        <input type="file" id="btn_file" className="file_upload" style={{display:"none"}}  onChange={this.onChange.bind(this)}/>
        <Button title="上传图片" onClick={this.F_Open_dialog.bind(this)}>上传</Button>
      </div>);
    let buttonGet=this.state.content?this.state.content:mc;
    return (
      <div>
        {buttonGet}
      </div>
    );
  }
}
export default Demo;