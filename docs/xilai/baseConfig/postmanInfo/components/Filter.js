import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');

import {Form, Input, Row, Col} from 'antd';
const FormItem = Form.Item;
var Filter = React.createClass({
    getInitialState: function () {
        return {hints: {}, validRules: [], loading: false, employee: {}};
    },

    mixins: [ModalForm('employee')],
    componentDidMount: function () {
        this.state.validRules = [
            {
                id: 'userCode',
                desc: '快递员ID',
                max: 30
            }, {
                id: 'name',
                desc: '快递员姓名',
                max: 30
            }
        ];
        this.clear();
    },
    componentWillReceiveProps: function (newProps) {
        // this.clear();
    },
    clear: function () {
        this.state.hints = {};
        this.state.employee = {
            userCode: '',
            name: ''
        };
        this.setState({loading: false});
    },
    checkValue: function () {
        if (Common.validator(this, this.state.employee)) {
            return true;
        } else {
            this.setState({loading: false});
            return false;
        }
    },
    render: function () {
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout2 = {
            labelCol: ((layout == 'vertical')
                ? null
                : {
                    span: 8
                }),
            wrapperCol: ((layout == 'vertical')
                ? null
                : {
                    span: 16
                })
        };
        var hints = this.state.hints;
        return (
            <div className='filter-wrap'>

                <Form
                    layout={layout}
                   >
                    <Row gutter={24}>
                        <Col className="gutter-row" span={6}>

                            <FormItem
                                {...formItemLayout2}
                                className={layoutItem}
                                label='快递员ID'
                                required={false}
                                colon={true}
                                help={hints.userCodeHint}
                                validateStatus={hints.userCodeStatus}>
                                <Input
                                    type='text'
                                    name='userCode'
                                    id='userCode'
                                    placeholder='输入快递员ID'
                                    value={this.state.employee.userCode}
                                    onChange={this.handleOnChange}
                                    />

                            </FormItem>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <FormItem
                                {...formItemLayout2}
                                className={layoutItem}
                                label='快递员姓名'
                                required={false}
                                colon={true}
                                help={hints.nameHint}
                                validateStatus={hints.nameStatus}>
                                   <Input
                                    type='text'
                                    name='name'
                                    id='name'
                                    placeholder='输入快递员姓名'
                                    value={this.state.employee.name}
                                    onChange={this.handleOnChange}
                                    />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
});
module.exports = Filter;
