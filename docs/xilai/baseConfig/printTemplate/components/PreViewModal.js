import { Button, Icon, message } from 'antd';
import React from 'react';
import $ from 'jquery';
var Common = require('../../../../public/script/common');

class Demo extends React.Component {

  constructor(){
    super();
    this.state={
        base64pic:'',
        type:'',
    }
  }

  clear(){
    this.setState({
      base64pic:''
    })
  }

  render() {
    let ab=this.state.base64pic?this.state.base64pic:this.props.PicData.base64pic;
    let mc=(  
        <div className="prePic">
                <img style={{ maxWidth:"300px"}} src={ab}/>
        </div>);
    return (
      <div className="preView">
        {mc}
      </div>
    );
  }
}
export default Demo;