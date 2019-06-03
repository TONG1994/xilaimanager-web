var $ = require('jquery');
var Promise = require('promise');
var FindNameActions = require('../../lib/action/FindNameActions');
import {message,Modal} from 'antd';
var fetch = require('isomorphic-fetch');
module.exports = {
    initConf: function(conf) {
        this.hostList = [];
        for (var name in conf) {
            try {
                var value = conf[name];
                this[name] = value;

                if (value.startsWith('http')) {
                    this.hostList.push(value);
                }
            } catch (E) {}
        }

        // console.log(this);
    },

    // 服务器地址
    hostList: [],

    // 调用服务的序号
    actionFlowNo: 1,

    // LzSelect 选择项
    lzOptions: {},
    lzOptionsWait: {},
    loadOptions: function(appName2, optName, callback) {
        var opt = this.lzOptions[appName2];
        if (opt === null || typeof(opt) === 'undefined') {
            var lst = this.lzOptionsWait[appName2];
            if (lst !== null && typeof(lst) !== 'undefined') {
                lst.push({ name: optName, func: callback });
                return;
            }

            lst = [{ name: optName, func: callback }];
            this.lzOptionsWait[appName2] = lst;

            var self = this;
            var fileName = '';
            if (this.localDict) {
                fileName = this.paramUrl + '../dict/' + appName2 + '.js';
            } else {
                fileName = this.paramUrl + 'app-info/dict?appName=' + encodeURI(appName2);
            }

            $.getScript(fileName, function() {
                var itemMap = {};
                if (dict !== null) {
                    dict.map((node, i) => {
                        itemMap[node.indexName] = node;
                    });
                }

                // console.log(itemMap);
                self.lzOptions[appName] = itemMap;

                lst = self.lzOptionsWait[appName2];
                lst.map((nd, i) => {
                    var values = itemMap[nd.name];
                    if (nd.func !== null) {
                        nd.func((values === null || typeof(values) === 'undefined') ? [] : values, nd.name);
                    }
                });

                self.lzOptionsWait[appName2] = null;
            });
        } else {
            var values = opt[optName];
            if (callback !== null) {
                callback((values === null || typeof(values) === 'undefined') ? [] : values);
            }

            return values;
        }
    },
    getOptionName: function(appName2, optName, value, showCode, page) {
        var opt = this.lzOptions[appName2];
        if (opt === null || typeof(opt) === 'undefined') {
            var callback = null;
            var lst = this.lzOptionsWait[appName2];
            if (lst === null || typeof(lst) === 'undefined') {
                callback = function() { page.setState({ loading: page.state.loading }); };
            }

            this.loadOptions(appName2, optName, callback);
            return value;
        }

        var opts = opt[optName];
        if (opts !== null && typeof(opts) !== 'undefined') {
            var cc = opts.codeData.length;
            for (var i = 0; i < cc; i++) {
                var node = opts.codeData[i];
                if (node.codeValue === value) {
                    return ((showCode && value !== node.codeDesc) ? value + '-' + node.codeDesc : node.codeDesc);
                }
            }
        }

        return value;
    },
    getOptionName2: function(opts, value, showCode) {
        var text = '';
        var optsObj = {};
        var opts = opts.split(';');
        opts.map((opt, i) => {
            var pos = opt.indexOf('=');
            if (pos > 0) {
                var value = opt.substr(0, pos);
                var desc = opt.substr(1 + pos);
                if (showCode && value !== desc) {
                    text = value + '-' + desc;
                } else {
                    text = value;
                }
            } else {
                text = value;
            }
        });

        return text;
    },
    findRecordName: function(uuid, recordSet, fieldName, resName) {
        var len = recordSet.length;
        for (var i = 0; i < len; i++) {
            var obj = recordSet[i];
            if (obj.uuid === uuid) {
                FindNameActions.findName(resName, uuid, obj[fieldName]);
                return;
            }
        }

        FindNameActions.findName(resName, uuid, uuid);
    },

    sessionID: '',
    saveSessionID: function(result, self) {
        // console.log(result);
        if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
            self.sessionID = result.object.sessionId;
            window.sessionStorage.setItem('sessionID', self.sessionID);
            window.localStorage.setItem('sessionID', self.sessionID);
            window.localStorage.setItem('ssoToken', result.object.ssoToken);
        }
    },
    getSessionID: function() {
        if (this.sessionID === '') {
            this.sessionID = window.sessionStorage.getItem('sessionID');
        }

        return this.sessionID;
    },
    fz_setCookie: function(name, value, daysExpire) {
        var e = '';
        if (daysExpire) {
            var expires = new Date();
            expires.setTime(expires.getTime() + 1000 * 60 * 60 * 24 * daysExpire);
            e = ';expires=' + expires.toGMTString();
        }

        document.cookie = name + '=' + ((value == null) ? '' : escape(value)) + e + ';path=/';
    },
    fmtGetUrl: function(url) {
        var idx = url.indexOf('corp');
        if (idx >= 0) {
            return url;
        }

        if (window.loginData === undefined) {
            return url;
        }

        var compUser = window.loginData.compUser;
        if (compUser === null || compUser.corpUuid === '' || compUser.corpUuid === undefined) {
            return url;
        }

        idx = url.indexOf('?');
        if (idx >= 0) {
            url = url + '&corp=' + compUser.corpUuid;
        } else {
            url = url + '?corp=' + compUser.corpUuid;
        }

        return url;
    },
    getFlowNo: function() {
        var id = window.sessionStorage.getItem('serialID');
        if (id) {
            id = '' + (parseInt(id) + 1);
        } else {
            id = '100000';
        }

        window.sessionStorage.setItem('serialID', id);
        return id;
    },
    ajaxBody: function(url, data, self) {
        /*var sid = this.getSessionID();
        if( sid !== null ){
        	this.fz_setCookie('SESSION', sid, 1);
        }*/

        data.term = 'web';
        data.flowNo = this.getFlowNo();
        if (typeof(window.loginData) !== 'undefined') {
            var compUser = window.loginData.compUser;
            data.corp = (compUser === null) ? '' : compUser.corpUuid;
        } else {
            data.corp = '';
        }

        return {
            type: 'post',
            url: url,
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(data),
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true
        };
    },
    loginService: function(url, data) {
        var self = this;
        var promise = new Promise(function(resolve, reject) {
            var record = {
                flowNo: self.getFlowNo(),
                term: 'web',
                object: data
            };

            $.ajax({
                type: 'post',
                url: url,
                contentType: 'application/json; charset=UTF-8',
                data: JSON.stringify(record),
                dataType: 'json',
                success: function(result, status, xhr) {
                    self.saveSessionID(result, self);
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true
            }).done(resolve).fail(reject);
        });

        return promise;
    },
    doDeployService: function(url, data) {
        var self = this;
        var promise = new Promise(function(resolve, reject) {
            $.ajax({
                type: 'post',
                url: url,
                contentType: 'application/json; charset=UTF-8',
                data: JSON.stringify(data),
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true
            }).done(resolve).fail(reject);
        });

        return promise;
    },


    fetch: function(url) {
        var promise = new Promise(function(resolve, reject) {
            $.get(url).done(resolve).fail(reject);
        });

        return promise;
    },

    doJsonService: function(url, data) {
        var req = this.ajaxBody(url, data);
        var promise = new Promise(function(resolve, reject) {
            $.ajax(req).done(resolve).fail(reject);
        });

        return promise;
    },

    doGetService: function(url) {
        url = this.fmtGetUrl(url);
        var promise = new Promise(function(resolve, reject) {
            $.get(url).done(resolve).fail(reject);
        });

        return promise;
    },
    warning: function() {
        Modal.warning({
            title: '提示',
            content: '你的账号已在新设备上登录，请重新登录。',
            okText: '确认',
            onOk(){
                window.location.href = window.location.origin +'/index.html';
            },
        });
    },
    warning1: function() {
        Modal.warning({
            title: '提示',
            content: '您还没有登录，请登录后再试!',
            okText: '确认',
            onOk(){
                window.location.href = window.location.origin +'/index.html';
            },
        });
    },
    handleServer: function(errCode){
        if (errCode === 'AUTH11') {
            //跳转到登陆页面
            this.warning();
        }else if(errCode === 'AUTH09'){
            //跳转到登陆页面
            this.warning1();
        }
    },

    doRetrieveService: function(url, filter, startPage, pageRow, totalRow) {
        var query = {
            pageRow: pageRow,
            startPage: startPage,
            totalRow: totalRow,
            object: filter
        };
        var filter2 = {
            flowNo: '0',
            object: query
        };

        var req = this.ajaxBody(url, filter2);
        var promise = new Promise(function(resolve, reject) {
            $.ajax(req).done(resolve).fail(reject);
        });

        return promise;
    },

    doGetRecordService: function(url, uuid) {
        var record = {
            flowNo: '0',
            object: uuid
        };

        var req = this.ajaxBody(url, record);
        var promise = new Promise(function(resolve, reject) {
            $.ajax(req).done(resolve).fail(reject);
        });

        return promise;
    },

    doCreateService: function(url, data) {
        var record = {
            flowNo: '0',
            object: data
        };

        var req = this.ajaxBody(url, record);
        var promise = new Promise(function(resolve, reject) {
            $.ajax(req).done(resolve).fail(reject);
        });

        return promise;
    },

    doUpdateService: function(url, data) {
        var record = {
            flowNo: '0',
            object: data
        };

        var req = this.ajaxBody(url, record);
        var promise = new Promise(function(resolve, reject) {
            $.ajax(req).done(resolve).fail(reject);
        });

        return promise;
    },

    doRemoveService: function(url, data) {
        var filter = {
            flowNo: '0',
            object: data
        };

        var req = this.ajaxBody(url, filter);
        var promise = new Promise(function(resolve, reject) {
            $.ajax(req).done(resolve).fail(reject);
        });

        return promise;
    },
    doPromiseService: function(func, url, data) {
        var promise = new Promise(function(resolve, reject) {
            func(url, data).then(function(result) {
                if (result) {
                    if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                        resolve(result.object);
                    } else {
                        reject('处理错误[' + result.errCode + '][' + result.errDesc + ']');
                    }
                } else {

                    reject('查询数据时错误');
                }
            }, function(value) {
                reject(JSON.stringify(value));
            });
        });

        return promise;
    },
    doUploadService: function(url, data, fileList) {
        let formData = new FormData();

        var req = {
            flowNo: '0',
            object: data
        };

        req.term = 'web';
        if (typeof(window.loginData) !== 'undefined') {
            var compUser = window.loginData.compUser;
            req.corp = (compUser === null) ? '' : compUser.corpUuid;
        } else {
            req.corp = '';
        }

        formData.append('reqObject', JSON.stringify(req));

        var index = 0;
        for (var item of fileList) {
            formData.append('file_' + index, item);
            index++;
        }

        /*var sid = this.getSessionID();
        if( sid !== null ){
        	this.fz_setCookie('SESSION', sid, 1);
        }*/

        var ajaxBody = {
            type: 'post',
            url: this.fmtGetUrl(url),
            data: formData,
            dataType: 'json',
            cache: false,
            contentType: false,
            //contentType: 'application/json; charset=UTF-8',
            processData: false,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
        };

        return new Promise(function(resolve, reject) {
            $.ajax(ajaxBody).done(resolve).fail(reject);
        });
    },

    copyValue: function(fromObj, toObj) {
        for (var name in fromObj) {
            try {
                toObj[name] = fromObj[name];
            } catch (E) {}
        }
    },
    copyStrValue: function(fromObj, toObj) {
        for (var name in fromObj) {
            try {
                var str = fromObj[name];
                if (typeof str !== 'object') {
                    toObj[name] = str;
                }
            } catch (E) {}
        }
    },
    //深度拷贝对象
    deepCopyValue: function(source) {
        var sourceCopy = source instanceof Array ? [] : {};
        for (var item in source) {
            if (source[item] !== null) {
                sourceCopy[item] = typeof source[item] === 'object' ? this.deepCopyValue(source[item]) : source[item];
            } else {
                sourceCopy[item] = source[item] = null;
            }
        }
        return sourceCopy;
    },
    compareTo: function(fromObj, toObj) {
        if (typeof fromObj === 'string' || typeof toObj === 'string') {
            return (fromObj === toObj);
        }

        for (var name in fromObj) {
            try {
                if (toObj[name] !== fromObj[name]) {
                    return false;
                }
            } catch (E) {
                return false;
            }
        }

        for (var name in toObj) {
            try {
                if (toObj[name] !== fromObj[name]) {
                    return false;
                }
            } catch (E) {
                return false;
            }
        }

        return true;
    },

    findRecord: function(store, uuid) {
        // console.log(store, uuid);
        for (var x = store.recordSet.length - 1; x >= 0; x--) {
            if (store.recordSet[x].uuid === uuid) {
                return x;
            }
        }

        return -1;
    },

    getResErrMsg: function(value) {
        if (value !== undefined && value !== null) {
            var res = value.responseJSON;
            if (res !== undefined && res !== null) {
                var msg = res.message;
                if (msg !== undefined && msg !== null) {
                    return msg;
                }
            }
        }

        return '调用服务错误';
    },
    // !!! 不要修改 !!!
    recordCreate: function(store, data, url, syncRecord) {
        var util = this;
        var self = store;
        this.doCreateService(url, data).then(function(result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                if (syncRecord === undefined || syncRecord === null) {
                    var type = typeof(result.object.list);
                    if (type === 'object' && result.object.list.constructor === Array) {
                        var len = result.object.list.length;
                        for (var i = 0; i < len; i++) {
                            self.recordSet.push(result.object.list[i]);
                        }
                    } else {
                        self.recordSet.push(result.object);
                    }
                } else {
                    syncRecord(self, result.object, data);
                }

                self.totalRow = self.totalRow + 1;
                self.fireEvent('create', '', self);
            } else {
                util.handleServer(result.errCode);
                self.fireEvent('create', '处理错误[' + result.errCode + '][' + result.errDesc + ']', self);
            }
        }, function(value) {
            self.fireEvent('create', util.getResErrMsg(value), self);
        });
    },

    // !!! 不要修改 !!! 新加数据unshift
    recordCreateUnshift: function(store, data, url, syncRecord) {
        var util = this;
        var self = store;
        this.doCreateService(url, data).then(function(result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                if (syncRecord === undefined || syncRecord === null) {
                    var type = typeof(result.object.list);
                    if (type === 'object' && result.object.list.constructor === Array) {
                        var len = result.object.list.length;
                        for (var i = 0; i < len; i++) {
                            self.recordSet.unshift(result.object.list[i]);
                        }
                    } else {
                        self.recordSet.unshift(result.object);
                    }
                } else {
                    syncRecord(self, result.object, data);
                }

                self.totalRow = self.totalRow + 1;
                self.fireEvent('create', '', self);
            } else {
                util.handleServer(result.errCode);
                self.fireEvent('create', '处理错误[' + result.errCode + '][' + result.errDesc + ']', self);
            }
        }, function(value) {
            self.fireEvent('create', util.getResErrMsg(value), self);
        });
    },

    // !!! 不要修改 !!!
    recordUpdate: function(store, data, url, syncRecord) {

        var util = this;
        var self = store;
        var idx = this.findRecord(store, data.uuid);
        // console.log(store, data, url);
        if (idx < 0) {
            self.fireEvent('update', '没有找到记录[' + data.uuid + ']', self);
            return;
        }

        // 数据没有变更
        if (this.compareTo(self.recordSet[idx], data)) {
            console.log('数据没有变更');
            self.fireEvent('update', '', self);
            return;
        }

        var util = this;
        this.doUpdateService(url, data).then(function(result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                if (syncRecord === undefined || syncRecord === null) {
                    util.copyValue(result.object, self.recordSet[idx]);
                } else {
                    syncRecord(self, self.recordSet[idx], result.object, data);
                }

                self.fireEvent('update', '', self);
            } else {
                util.handleServer(result.errCode);
                self.fireEvent('update', '处理错误[' + result.errCode + '][' + result.errDesc + ']', self);
            }
        }, function(value) {
            self.fireEvent('update', util.getResErrMsg(value), self);
        });
    },
    recordDeleteUsedForLog: function(store, data, url, syncRecord) {
        var self = store,
            uuid = data.uuid;
        var idx = this.findRecord(store, uuid);

        if (idx < 0) {
            self.fireEvent('remove', '没有找到记录[' + uuid + ']', self);
            return;
        }

        var util = this;
        this.doRemoveService(url, data).then(function(result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.recordSet.splice(idx, 1);
                self.totalRow = self.totalRow - 1;
                if (syncRecord) {
                    syncRecord(self, uuid);
                }

                self.fireEvent('remove', '', self);
            } else {
                util.handleServer(result.errCode);
                self.fireEvent('remove', '处理错误[' + result.errCode + '][' + result.errDesc + ']', self);
            }
        }, function(value) {
            self.fireEvent('remove', util.getResErrMsg(value), self);
        });
    },
    // !!! 不要修改 !!!
    recordDelete: function(store, uuid, url, syncRecord) {
        var self = store;
        var idx = this.findRecord(store, uuid);

        if (idx < 0) {
            self.fireEvent('remove', '没有找到记录[' + uuid + ']', self);
            return;
        }

        var util = this;
        this.doRemoveService(url, uuid).then(function(result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.recordSet.splice(idx, 1);
                self.totalRow = self.totalRow - 1;
                if (syncRecord) {
                    syncRecord(self, uuid);
                }

                self.fireEvent('remove', '', self);
            } else {
                util.handleServer(result.errCode);
                self.fireEvent('remove', '处理错误[' + result.errCode + '][' + result.errDesc + ']', self);
            }
        }, function(value) {
            self.fireEvent('remove', util.getResErrMsg(value), self);
        });
    },

    // !!! 批量删除 !!!
    recordBatchDelete: function(store, uuid, url) {
        var self = store;
        var index = [];
        for (var i = 0; i < uuid.length; i++) {
            for (var j = 0; j < store.recordSet.length; j++) {
                if (uuid[i] == store.recordSet[j].uuid) {
                    store.recordSet.splice(j, 1);
                    index.push(j);
                }
            }
        }

        var util = this;
        this.doRemoveService(url, uuid).then(function(result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.totalRow = self.totalRow - index.length;
                self.fireEvent('remove', '', self);
            } else {
                util.handleServer(result.errCode);
                self.fireEvent('remove', '处理错误[' + result.errCode + '][' + result.errDesc + ']', self);
            }
        }, function(value) {
            self.fireEvent('remove', util.getResErrMsg(value), self);
        });
    },

    doRetrieve: function(url, filter, startPage, pageRow, totalRow) {
        var util = this;
        var promise = new Promise(function(resolve, reject) {
            util.doRetrieveService(url, filter, startPage, pageRow, totalRow).then(function(result) {
                if (result) {
                    if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                        resolve(result.object);
                    } else {
                        reject('处理错误[' + result.errCode + '][' + result.errDesc + ']');
                    }
                } else {
                    reject('查询数据时错误');
                }
            }, function(value) {
                reject(JSON.stringify(value));
            });
        });

        return promise;
    },
    doGetRecord: function(url, uuid) {
        return this.doPromiseService(this.doGetRecordService.bind(this), url, uuid);
    },
    doCreate: function(url, data) {
        return this.doPromiseService(this.doCreateService.bind(this), url, data);
    },
    doUpdate: function(url, data) {
        return this.doPromiseService(this.doUpdateService.bind(this), url, data);
    },
    doRemove: function(url, data) {
        return this.doPromiseService(this.doRemoveService.bind(this), url, data);
    },

    // 菜单权限
    selModName: '', // 查找菜单
    selectedApp: null, // 查找角色
    menuMap: {},
    getAppMenu: function(appName) {
        // 先检查菜单是否已经下载
        var loadedMenu = window.sessionStorage.getItem('loadedMenu');
        if (loadedMenu === null || loadedMenu === undefined || loadedMenu === '') {
            return null;
        }

        var isLoaded = false;
        var list = loadedMenu.split(',');
        for (var x = list.length - 1; x >= 0; x--) {
            if (appName === list[x]) {
                isLoaded = true;
                break;
            }
        }

        if (!isLoaded) {
            return null;
        }

        var m = this.menuMap[appName];
        if (m !== undefined && m !== null) {
            return m;
        }

        var ms = window.sessionStorage.getItem('menu.' + appName);
        if (ms !== undefined && ms !== null) {
            m = JSON.parse(ms);
            this.menuMap[appName] = m;

            this.selModName = appName;
            window.sessionStorage.setItem('activeMenu', appName);
            return m;
        }

        return null;
    },
    setSelectedApp: function(appCode) {
        this.selectedApp = null;

        if (typeof(window.loginData) === 'undefined') {
            return;
        }

        var appList = null;
        var compUser = window.loginData.compUser;
        if (compUser === null) {
            var user = window.loginData.authUser;
            if (user.userName === 'admin') {
                appList = [{ appCode: 'MA' }];
            } else {
                return;
            }
        } else {
            appList = compUser.appAuthList;
        }

        if (appList !== null) {
            if (appCode.charAt(0) === '*') {
                appCode = appCode.substr(1);
            }

            var len = appList.length;
            for (var x = 0; x < len; x++) {
                var app2 = appList[x];
                if (app2.appCode === appCode) {
                    this.selectedApp = app2;
                    window.sessionStorage.setItem('activeApp', appCode);
                    break;
                }
            }
        }
    },
    saveAppMenu: function(appName, menuList) {
        if (menuList === undefined || menuList === null) {
            menuList = [];
        }

        var m = {};
        menuList.map((node, i) => {
            m[node.menuPath] = node.roleName;
        });

        this.menuMap[appName] = m;
        window.sessionStorage.setItem('menu.' + appName, JSON.stringify(m));

        var loadedMenu = window.sessionStorage.getItem('loadedMenu');
        if (loadedMenu === null || loadedMenu === undefined || loadedMenu === '') {
            loadedMenu = appName;
        } else {
            loadedMenu = loadedMenu + ',' + appName;
        }

        window.sessionStorage.setItem('loadedMenu', loadedMenu);
    },
    setActiveMenuName: function(menuName) {
        this.selModName = menuName;
        window.sessionStorage.setItem('activeMenu', menuName);
    },
    // 检查权限：0=生产没有，1=有，2=测试没有
    checkMenuPriv: function(menuPath) {
        if (this.selectedApp === null) {
            // 页面刷新
            var appCode = window.sessionStorage.getItem('activeApp');
            if (appCode !== null && appCode !== undefined) {
                this.setSelectedApp(appCode);
            }

            var menuName = window.sessionStorage.getItem('activeMenu');
            if (menuName !== null && menuName !== undefined) {
                this.getAppMenu(menuName);
            }
        }

        if (this.selModName === '') {
            // 首页面
            return 1;
        }

        var m = this.menuMap[this.selModName];
        if (m === undefined || m === null) {
            return this.checkRole ? 0 : 2;
        }

        var role = m[menuPath];
        if (role === undefined || role === null) {
            // console.log('menuPath', menuPath)
            //            return 1;   // 禁止权限
            return this.checkRole ? 0 : 2;
        }

        if (role.indexOf('*') >= 0) {
            return 1;
        }

        // APP授权
        if (this.selectedApp === null) {
            return this.checkRole ? 0 : 2;
        }

        // 维护功能
        var compUser = window.loginData.compUser;
        if (compUser === null) {
            if ('MA' === this.selectedApp.appCode) {
                var user = window.loginData.authUser;
                if (user.userName === 'admin') {
                    return 1;
                }
            }
        }

        // 用户权限
        var roles = this.selectedApp.roleList;
        if (roles === null || roles === undefined) {
            return this.checkRole ? 0 : 2;
        }

        var list = roles.split(',');
        for (var x = list.length - 1; x >= 0; x--) {
            var rn = ',' + list[x] + ',';
            if (role.indexOf(rn) >= 0) {
                return 1;
            }
        }

        return this.checkRole ? 0 : 2;
    },
    checkAppPriv: function(appCode) {
        // console.log('this.checkRole', this.checkRole)
        if (typeof(window.loginData) === 'undefined') {
            return this.checkRole ? 0 : 2;
        }

        var compUser = window.loginData.compUser;
        if (compUser === null) {
            if ('MA' === appCode) {
                var user = window.loginData.authUser;
                if (user.userName === 'admin') {
                    return 1;
                }
            }

            return this.checkRole ? 0 : 2;
        }

        if (appCode.charAt(0) === '*') {
            // 无权限控制
            return 1;
        }

        // console.log('compUser.appAuthList', compUser.appAuthList)
        if (compUser.appAuthList !== null) {
            var len = compUser.appAuthList.length;
            for (var x = 0; x < len; x++) {
                var app2 = compUser.appAuthList[x];
                // console.log('app2', app2, appCode)
                if (app2.appCode === appCode) {
                    return 1;
                }
            }
        }

        //        return 1;
        return this.checkRole ? 0 : 2;
    },

    // 下载菜单
    downAppMenu: function(menuName, roleApp) {
        var self = this;
        var promise = new Promise(function(resolve, reject) {
            var m = self.getAppMenu(menuName);
            if (m) {
                self.setSelectedApp(roleApp);
                self.setActiveMenuName(menuName);
                resolve(m);
                return;
            }

            // 先下载菜单
            var url = self.authUrl + 'fnt-app-menu/appName';
            self.doCreateService(url, menuName).then(function(result) {
                if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                    self.saveAppMenu(menuName, result.object);

                    self.setSelectedApp(roleApp);
                    self.setActiveMenuName(menuName);
                    resolve(result.object);
                } else {
                    reject('下载菜单错误[' + result.errCode + '][' + result.errDesc + ']');
                }
            }, function(value) {
                reject('下载菜单错误');
            });
        });

        return promise;
    },

    formatRoutes: function(routes) {
        var url = window.location.href;
        if (url.startsWith('file:///')) {
            var pos = url.lastIndexOf('/');
            url = url.substr(0, pos);
            window.rootPath = url;

            var url2 = url.substr(7);
            routes.map((item, i) => {
                item.path = url2 + item.path;
            });
        } else {
            var pos = url.indexOf('?href=');
            var pos2 = url.indexOf('?linkid=');
            if (pos > 0 && pos2 > 0) {
                // alert('formatRoutes==' + url);
                routes.map((item, i) => {
                    if (!item.path.endsWith('.html')) {
                        item.path = '/safe' + item.path;

                        if (item.childRoutes) {
                            item.childRoutes.map((item2, i) => {
                                if (item2.path.charAt(0) === '/') {
                                    item2.path = '/safe' + item2.path;
                                }
                            });
                        }
                    }
                });
            }

            // console.log('routes', routes)
        }
    },
    showPage: function(href) {
        var url = window.location.href;
        if (window.rootPath) {
            if (href.startsWith('/index.html')) {
                href = href.replace(/index.html/g, 'electron.html');
            }

            document.location.href = window.rootPath + href;
        } else {
            document.location.href = href;
        }
    },

    downAppJson: function(appPage) {
        var self = appPage;
        var file = '/app.json';
        if (window.rootPath) {
            file = window.rootPath + file;
        }

        var util = this;
        var promise = new Promise(function(resolve, reject) {
            $.get(file).then(function(result) {
                resolve(result.appList);
            }, function(value) {
                reject('下载[' + file + ']错误');
            });
        });

        return promise;
    },

    // 下载菜单
    loadAuthMenu: function(modCode) {
        var file = '/auth/' + modCode + '.json';
        if (window.rootPath) {
            file = window.rootPath + file;
        }

        var util = this;
        var promise = new Promise(function(resolve, reject) {
            $.get(file).then(function(result) {
                resolve(result);
            }, function(value) {
                reject('下载[' + file + ']错误');
            });
        });

        return promise;
    },

    // 通过fetch方式处理文件流
    downloadExcelFile: function(url, params, callback, $this) {
        let formData = new FormData();

        var req = {
            flowNo: '0',
            object: params
        };

        req.term = 'web';
        if (typeof(window.loginData) !== 'undefined') {
            var compUser = window.loginData.compUser;
            req.corp = (compUser === null) ? '' : compUser.corpUuid;
        } else {
            req.corp = '';
        }

        formData.append('reqObject', JSON.stringify(req));

        let filename = '';

        fetch(this.fmtGetUrl(url), {
            method: 'POST',
            // 携带cookie信息
            credentials: 'include',
            body: formData,
            cache: 'no-cache'
        }).then(response => {
            if (response.ok) {

                // 后台返回的response有两种类型，文件流和json数据，只有导出出错的时候才会返回json
                let disp = response.headers.get('content-disposition');
                if (disp && disp.search('attachment') !== -1) {
                    let t = disp.split(';');

                    // content-disposition中包含文件名信息
                    // 格式为:attachment; filename=details.xls
                    if (t.length === 2 && t[1].indexOf('=') !== -1) {
                        try {
                            filename = decodeURIComponent(t[1].split('=')[1].split('.')[0].substring(1)) + '.xlsx';
                        } catch (err) {}
                    }


                    // 处理filename取不到或者扩展名不对的情况
                    // 如果扩展名为xls时，用Excel打开文件会出现警告，所以统一处理为xlsx
                    if (filename && filename.indexOf('xlsx') === -1) {
                        filename = '文件.xlsx';
                    }
                    return response.blob();
                } else {
                    return response.json();
                }
            } else {
                $this.setState({ loading: false });
                message.error(`服务通信异常status:${response.status}`);
            }
        }).then(resolve => {
            // 如果是blob类型，必然会有type属性
            if (resolve.type != null) {
                // 处理IE浏览器的情况
                if (navigator.msSaveBlob) {
                    $this.setState({ loading: false });
                    return navigator.msSaveBlob(resolve, filename);
                }

                let a = document.createElement('a');
                a.href = URL.createObjectURL(resolve);
                a.download = filename;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                //去除主页面的按钮loading
                $this.setState({ loading: false });
                a.remove();
                // 记得释放对象，否则会影响性能
                URL.revokeObjectURL(a.href);
            } else {
                $this.setState({ loading: false });
                // 说明当前返回json，导出异常，通过回调函数处理错误信息
                callback(resolve);
            }

        }).catch(err => {
            // 服务器通讯异常
            console.error(err);
        });
    },

    //获取当天日期
    getDefualtEnd:function(){
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var day = date.getDate();
        if(month<10)
        {
            month="0"+month;
        }
        if(day<10)
        {
            day="0"+day;
        }
        var defualtEnd = year+'-'+month+'-'+day;
        return defualtEnd;
    },

    //获取当天前一个月的日期
    getDefualtStart:function(){
        var date = new Date();
        var daysInMonth = new Array([0],[31],[28],[31],[30],[31],[30],[31],[31],[30],[31],[30],[31]);
        var strYear = date.getFullYear();
        var strDay = date.getDate();
        var strMonth = date.getMonth()+1;
        if(strYear%4 == 0 && strYear%100 != 0){
            daysInMonth[2] = 29;
        }
        if(strMonth - 1 == 0)
        {
            strYear -= 1;
            strMonth = 12;
        }
        else
        {
            strMonth -= 1;
        }
        strDay = Math.min(strDay,daysInMonth[strMonth]);
        if(strMonth<10)
        {
            strMonth="0"+strMonth;
        }
        if(strDay<10)
        {
            strDay="0"+strDay;
        }
        var defualtStart = strYear+"-"+strMonth+"-"+strDay;
        return defualtStart;
    },

    //获取昨天的日期
    getYesterday:function(){
        var date = new Date();
        var preDate = new Date(date.getTime() - 24*60*60*1000); //前一天
        var year = preDate.getFullYear();
        var month = preDate.getMonth()+1;
        var day = preDate.getDate();
        if(month<10)
        {
            month="0"+month;
        }
        if(day<10)
        {
            day="0"+day;
        }
        var defualtEnd = year+'-'+month+'-'+day;
        return defualtEnd;
    },

};