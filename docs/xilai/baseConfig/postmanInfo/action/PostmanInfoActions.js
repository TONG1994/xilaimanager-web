'use strict';
var  Reflux = require('reflux');
var PostmanInfoActions = Reflux.createActions([
    'retrievePostmanInfo',
    'createPostmanInfo',
    'updatePostmanInfo',
    'deletePostmanInfo',

    'getBranchList',
    'getPostmanNameOrId',

]);
module.exports=PostmanInfoActions;