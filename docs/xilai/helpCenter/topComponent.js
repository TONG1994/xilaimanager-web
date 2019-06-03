import React from 'react';
let Reflux = require('reflux');
import HelpCtenterActions from './action/HelpCenterActions';
import HelpCenterStore from './data/HelpCenterStore';
import ServiceMsg from '../../lib/Components/ServiceMsg';
import Utils from '../../public/script/utils';
import { Menu, Icon , Layout ,Spin } from 'antd';
import IUtil from './localMethod/IUtil';
const SubMenu = Menu.SubMenu;
const { Sider, Content } = Layout;


let TopComponent = React.createClass({
  getInitialState: function () {
    return {
      currentHtml:{},
      currentOpenKeys:[],
      menuData:[],
      original:[],
      collapsed: false,
      mode: 'inline',
      rootSubmenuKeys:[],
        openKeys:[],
    };
  },
  
  mixins: [Reflux.listenTo(HelpCenterStore,"onServiceComplete")],
  componentWillMount: function(){
    let filter = {};
    this.setState({loading: true});
    HelpCtenterActions.retrieveData(filter);
  },

  componentDidMount: function(){
    this.windowResize();
    window.addEventListener("resize",this.windowResize);

  },

  writeContent: function(){
    let {currentHtml} = this.state;
    let iframeHtml = currentHtml.srcData ? currentHtml.srcData:"";
    let iframe=document.getElementById("helpCenter_page");
    iframe.innerHTML= iframeHtml;
  },

  windowResize: function(){
      let iFrame = document.getElementById("helpCenter_page");
      let pageHeadHeight = document.getElementsByClassName("lz-header");
      let seeHeight = document.body.clientHeight;
      let seeWidth = document.body.clientWidth;
      let helpCenterSider = document.getElementById("helpCenter-sider");
      let siderWidth = helpCenterSider.offsetWidth;

      //赋值
      iFrame.style.height = (seeHeight - pageHeadHeight[0].offsetHeight+1)+"px";
      iFrame.style.width = (seeWidth - siderWidth)+"px";
  },

  componentWillUnmount: function(){
    window.addEventListener("resize",null);
  },

  onServiceComplete: function(data){
    if(data.errMsg){
      return;
    }
    if(data.operation ==="getHelpCenterDatas"){
      //数据处理
      let CopyData = Utils.deepCopyValue(data.recordSet);
      let lastData = this.dealWithResultData(CopyData);
      this.setState({ 
        menuData:lastData.menuData,
        original:lastData.original,
        currentHtml:lastData.defaulData.defaultHtml ,
        currentOpenKeys:lastData.defaulData.defaultLoadPath ,
        rootSubmenuKeys:lastData.rootSubmenuKeys,
        openKeys:lastData.defaulData.defaultLoadPath,
        loading:false 
      },()=>{
        this.writeContent();
      });
    }
  },

  //对数据做最后处理
  dealWithResultData: function(original){
    //构树形结构
    let turnTreeData = IUtil.buildTree(original);
    //去根并过滤
    let filterTreeData = turnTreeData[0].children.filter((item,i)=>{
      return item.type === "1";
    });
    //找默认页面
    let defaultLoadPath = [];
    let defaulData = this.getDefaultData(filterTreeData,defaultLoadPath);
    //形成menu菜单
    let menuData=this.diguiMethod(filterTreeData);
    let rootSubmenuKeys = [];
    if(menuData.length>0){
        menuData.map((item)=>{
            rootSubmenuKeys.push(item.key);
        })
    }
    return {
        menuData:menuData,
        original:original,
        defaulData:defaulData,
        rootSubmenuKeys:rootSubmenuKeys,
    }
  },

  //获取默认页面
  getDefaultData: function(data,defaultLoadPath){
    defaultLoadPath.push(data[0].uuid);
    if(data[0].type != "2"){
      return this.getDefaultData(data[0].children,defaultLoadPath);
    }else{
      return {
        defaultHtml:data[0],
        defaultLoadPath:defaultLoadPath
      }
    }
  },

  //点击事件
  handleClick: function(e) {
    let data = this.state.original?this.state.original:{};
    let selectedHtml = data.find((item,i)=>{ return item.uuid === e.key});
    this.setState({ currentHtml:selectedHtml, currentOpenKeys: e.keyPath ,openKeys:e.keyPath},()=>{
      this.writeContent();
    });
  },

  //解析目录
  diguiMethod: function(data){
    let self = this;
    return data.map((item,i)=>{
      if(item.children.length !=0 && item.type === "1"){
        return <SubMenu key={item.uuid} title={<span><Icon type="folder-add" /><span>{item.name}</span></span>}>
                {self.diguiMethod(item.children)}
              </SubMenu>

      }else{
        return <Menu.Item key={item.uuid} title={item.name}><span><Icon type="file-text" /><span>{item.name}</span></span></Menu.Item>;
      }
    })
  },
  //目录收起和展开
  onCollapse: function(collapsed){
    this.setState({ collapsed , mode: collapsed ? 'vertical' : 'inline'});
  },

    //菜单收起展开
  onOpenChange: function(openKeys){
      const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
      if (this.state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
          this.setState({ openKeys });
      } else {
          this.setState({
              openKeys: latestOpenKey ? [latestOpenKey] : [],
          });
      }
  },
  render: function(){
    let {menuData,currentOpenKeys,currentHtml} = this.state;
    let resMenu = currentOpenKeys.length?(
        <Menu
            onClick={this.handleClick}
            mode={this.state.mode}
            selectedKeys={[currentHtml.uuid]}
            defaultOpenKeys={currentOpenKeys}
            openKeys={this.state.openKeys}
            onOpenChange={this.onOpenChange}
            style={{ height: '100%' }}
        >
            {menuData}
        </Menu>
    ):"";
  
    return(
      <div>
        <ServiceMsg ref='mxgBox' svcList={["helpCenter/getHelpCenterDatas"]}/>
          <Layout style={{height:"100%",width:"100%"}}>
            <Sider id="helpCenter-sider" 
              collapsible
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse}
              style={{backgroundColor:"#fff"}}
            >
              {resMenu}
            </Sider>
            <Content style={{backgroundColor:"#fff"}}>
              <div id="helpCenter_page" 
                style={{backgroundColor:"#ffffff",minWidth:"1110px",overflow:"auto",padding:"0 200px"}}
              >
              </div>
            </Content>
          </Layout>
      </div>
    )
  }
});

module.exports = TopComponent;