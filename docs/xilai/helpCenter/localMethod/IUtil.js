import { Menu, Icon, Switch ,Button ,Layout ,Spin } from 'antd';
const SubMenu = Menu.SubMenu;

module.exports= {

  /**
   * 说明
   * 1.列表数据转换成树形数据
   * 2.列表中的每条数据必须有自己的唯一标识uuid
   * 3.列表数据需要有隐形树结构，即每条数据需要有自己父级的唯一标识---->parentUuid
   * 4.列表数据必须要有唯一根节点，且它的parentUuid为null
   */
  buildTree: function(data){
      let root= data.filter((item,i)=>{ return item.parentUuid == null });
      let resultTree = this.toBuildTree(root,data);
      return resultTree;
  },

  toBuildTree: function(fatherdata,oriData){
      let self = this , arr=[];
      if(fatherdata.length===0){
          return arr;
      }
      fatherdata.map((fItem,i)=>{
          let nextFather=oriData.filter((item,i)=>{ return  item.parentUuid === fItem.uuid });
          fItem.children = self.toBuildTree(nextFather,oriData);
          arr.push(fItem);
      })
      return arr;
  },

  /**
   * 说明
   * 1.数据为树形结构
   * 2.树形结构数据转化成菜单栏（Menu）
   * 3.树形结构，父类以children包含子类（数组）
   * 4.数据需要有type来辨别他否是叶子节点
   */

  // treeToBuildMenu: function(data){
  //   let self = this;
  //   return data.map((item,i)=>{
  //     console.log(item);
  //     if(item.children.length != 0 && item.type === "1"){
  //       console.log(item);
  //       return <SubMenu key={item.name} title={<span><Icon type="folder-add" />{item.name}</span>}>
  //               {self.treeToBuildMenu(item.children)}
  //             </SubMenu>

  //     }else{
  //       return <Menu.Item key={item.uuid} title={item.name}><span><Icon type="file-text" />{item.name}</span></Menu.Item>;
  //     }
  //   })
  // }

}
