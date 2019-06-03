/**
 *   Create by Malson on 2018/9/12
 */

import React from 'react';
var Reflux = require('reflux');
import { Carousel } from 'antd';
import LogActions from '../action/LogActions';
import LogStores from '../data/LogStores';

let CarouselPage= React.createClass({
    getInitialState: function () {
        return {
            WebManageSet: {
                recordSet:[],
                errMsg : ''
            },
            loading: false,
        };
    },

    mixins: [Reflux.listenTo(LogStores, "onServiceComplete")],
    onServiceComplete: function(data) {
        if (data.operation === 'queryWebAd') {
            this.setState({
                loading: false,
                WebManageSet: Object.assign({}, this.state.WebManageSet, data)
            });
        }
    },
    componentDidMount : function(){
    },
    getAdBanner(){
      let obj ={};
      obj.stateID = "1";
      obj.typeID = "WebManage";
      this.setState({loading: true});
      LogActions.getWebManage(obj);
    },
    render: function () {
        let recordSet = this.state.WebManageSet.recordSet || [];
        let CarouselHtml = recordSet.length?<Carousel autoplay>
            {recordSet.map(item=>{
                let innerH = item.link?< a  href={item.link} target="_blank">< img src={item.picture} alt=""/></ a>:<a>< img src={item.picture} alt=""/></ a>;
                return <div className="banner-image" key={item.uuid}>{innerH}</div>
            })}
        </Carousel>:'';
        return (
            <div style={{width: '100%',height:'100%'}}>
                {CarouselHtml}
            </div>
        );
    }
});

module.exports = CarouselPage;