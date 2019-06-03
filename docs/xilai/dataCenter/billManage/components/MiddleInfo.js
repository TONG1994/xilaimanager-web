/**
 *   Create by Malson on 2018/4/19
 */
import React from 'react';
import '../css/style.scss';


const MiddleInfo=({data})=>{

    return(
        <div>
            <ul className="middle-list">
                {data.map((item,i)=>{
                    return <li className="middle-warp">
                                <div className="middle-warp-title">{item.title}</div>
                                <div className="middle-warp-content">{item.content}</div>
                            </li>
                })}
            </ul>
        </div>
    )
}
export default MiddleInfo;