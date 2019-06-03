import React from 'react';
import {Timeline} from 'antd';
export default class TimeLine extends React.Component{

render(){
  const data=this.props.data;
  let arr=data!==null&&JSON.stringify(data)!=='{}'?data:{routes:[{createTime:'暂无数据',desc:''}]};

  return(
      <div style={{width:'532px',height:'450px',overflow:'auto',marginTop:'12px'}}>
        <Timeline>

          {
            arr.routes.map((item,i)=>{
              return <Timeline.Item key={i}>{item.createTime+item.desc}</Timeline.Item>
            })
          }
        </Timeline>
      </div>
  );
}

}