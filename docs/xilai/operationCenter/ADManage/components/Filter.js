import React from 'react';
import { Form,Col,Row,Input } from 'antd';
var Reflux = require('reflux');
const FormItem = Form.Item;
import ModalForm from '../../../../lib/Components/ModalForm';
import ADDictSelect from '../components/ADDictSelect';
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
var ADManageStore = require('../data/ADManageStore');
var ADManageActions = require('../action/ADManageActions');
let FormDef = require('./ADManageForm');
let Filter = React.createClass({
    getInitialState: function () {
        return {
            filter: {
                typeID:'',
                type:'',
                stateID:'',
                state:'',
            },
            typeSet:[],
            stateSet:[]
        }
    },

    mixins: [Reflux.listenTo(ADManageStore, "onServiceComplete"), ModalForm('filter', true)],
    componentDidMount: function () {
        this.clear();
    },
    componentWillMount: function () {
        ADManageActions.getSelectOptions({});
    },
    onServiceComplete: function(data) {
        this.setState({loading: false});
        if(data.errMsg){
            return;
        }
        if(data.operation === 'query_tab'){
            let data1 = data.recordSet|| [];
            let typeData = [];
            data1.map(item=>{
                if(item.typeList){
                    typeData.push(item.typeList[0]);
                }
            });
            let typeSet = typeData ? typeData :[],  stateSet =data1[0].stateList ? data1[0].stateList :[];
            typeSet.map(item=>{
                item.id = item.typeID,
                item.name = item.type
            });
            stateSet.map(item=>{
                item.id = item.stateID,
                item.name = item.state
            });
            this.setState({
                typeSet,
                stateSet
            }, ()=>{
                if(this.typeSelect){
                   this.typeSelect.showOptions(typeSet);
                }
                if(this.stateSelect){
                   this.stateSelect.showOptions(stateSet);
                }
           });
        }
    },
    getFilter:function () {
        let obj = this.state.filter;
        return obj;
    },
    
    clear:function(){
       this.setState({
        loading:false,
        filter: {
            typeID:'',
            type:'',
            stateID:'',
            state:'',
        },
       });
    },
    onSelected:function(selectedType, value){
        let typeSet = this.state.typeSet, stateSet = this.state.stateSet,obj={id:'',name:''}, filter = Utils.deepCopyValue(this.state.filter);
        if(value){
            if(selectedType === 'type'){
                obj =  typeSet.find(item => item.id === value);
            }else if(selectedType === 'state'){
                obj =  stateSet.find(item => item.id === value);
            } 
        }
       
        if(selectedType === 'type'){
            filter.typeID = obj.id;
            // filter.type = obj.name;
        }else if(selectedType === 'state'){
                filter.stateID = obj.id;
                // filter.state = obj.name;
        }
        this.setState({filter});
    },
    render: function () {
    let layout = 'horizontal';
    let  attrList = [
      {
        name:'type',
        id:'type',
        key:'typeSelect',
        object: <ADDictSelect  
        name="type" 
        id="type" 
        value={this.state.filter.typeID}   
         onSelect={this.onSelected.bind(this, 'type')} 
         opts={this.state.typeSet}  ref={ref=>this.typeSelect = ref}  />

      },
      {
        name:'state',
        id:'state',
        key:'stateSelect',
        object: <ADDictSelect  
        name="state" 
        id="state" 
        value={this.state.filter.stateID}   
         onSelect={this.onSelected.bind(this, 'state')} 
         opts={this.state.stateSet}  ref={ref=>this.stateSelect = ref}  />
      },
     
    ];
    let  items  = FormDef.getFilterForm(this, this.state.filter, attrList);
  
        return (
            <div className='filter-wrap'>
                <Form layout={layout}>
                     { items }
                </Form>
            </div>  
        );
    }
});

module.exports = Filter;