/**
 *   Create by Malson on 2018/4/19
 */
import React from 'react';
import '../css/style.scss';


const TableInfo=({data})=>{

  return(
      <div>
         <ul className="bill-list">
           {data.map((item,i)=>{
             return <li className="bill-warp">
                         <div className="bill-title">{item.title}<span className="bill-content">{item.content}</span></div>
                     </li>
           })}
         </ul>
      </div>
  )
}
export default TableInfo;