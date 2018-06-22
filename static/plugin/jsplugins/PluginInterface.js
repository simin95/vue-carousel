cordova.define("com.gree.codovaplugin.PluginInterface", function (require, exports, module) {
    var exec = require('cordova/exec');
    module.exports = {
        /**
         * Causes the device to beep.
         * On Android, the default notification ringtone is played "count" times.
         *
         * @param {Integer} type       The Toast type.
         */
        showToast: function (msg, type) {
            exec(null, null, "PluginInterface", "showToast", [msg, type]);
        },
        editDevice: function (mac) {
            exec(null, null, "PluginInterface", "editDevice", [mac]);
        },
        timerListDevice: function (mac) {
            exec(null, null, "PluginInterface", "timerListDevice", [mac]);
        },
        sendDataToDevice: function (mac, json, isFollowSysVibration, callback) {
            exec(callback, null, "PluginInterface", "sendDataToDevice", [mac, json, isFollowSysVibration]);
        },
        sendDataToDevicePublic: function (mac, json, isFollowSysVibration, callback) {
            exec(callback, null, "PluginInterface", "sendDataToDevicePublic", [mac, json, isFollowSysVibration]);
        },
        sendDataToDeviceDayPublic: function (mac, json, isFollowSysVibration, callback) {
            exec(callback, null, "PluginInterface", "sendDataToDeviceDayPublic", [mac, json, isFollowSysVibration]);
        },
        closePage: function (result) {
            exec(null, null, "PluginInterface", "closePage", [result]);
        },
        getCCcmd: function (mac, cmd, remarks, dat) {
            exec(null, null, "PluginInterface", "getCCcmd", [mac, cmd, remarks, dat]);
        },
        getInfo: function (mac, callback) {
            exec(callback, null, "PluginInterface", "getInfo", [mac]);
        },
        changeBarColor: function (color, callback) {
            exec(callback, null, "PluginInterface", "changeBarColor", [color]);
        },
        voiceDevice: function (mac) {
            exec(null, null, "PluginInterface", "voiceDevice", [mac]);
        }, updateStates: function (mac, states, callback) {
            exec(callback, null, "PluginInterface", "updateStates", [mac, states]);
        }, newPage: function (url, callback) {
            exec(callback, null, "PluginInterface", "newPage", [url]);
        }, onCallBack: function (callback) {
            exec(callback, null, "PluginInterface", "onCallBack", []);
        }, showTimePicker: function (type, callback) {
            exec(callback, null, "PluginInterface", "showTimePicker", [type]);
        }, showAlert: function (title, msg, callback) {
            exec(callback, null, "PluginInterface", "showAlert", [title, msg]);
        }, showConfirm: function (title, msg, callback) {
            exec(callback, null, "PluginInterface", "showConfirm", [title, msg]);
        }, showMenuDialog: function (mac, callback) {
            exec(callback, null, "PluginInterface", "showMenuDialog", [mac]);
        }, addStore: function (mac, key, val, callback) {
            exec(callback, null, "PluginInterface", "addStore", [mac, key, val]);
        }, updateStore: function (mac, key, val,callback) {
            exec(callback, null, "PluginInterface", "updateStore", [mac, key, val]);
        }, deleteStore: function (mac, key,callback) {
            exec(callback, null, "PluginInterface", "deleteStore", [mac, key]);
        }, queryStore: function (mac, key, callback) {
            exec(callback, null, "PluginInterface", "queryStore", [mac, key]);
        }, queryAllStore: function (mac, callback) {
            exec(callback, null, "PluginInterface", "queryAllStore", [mac]);
        }, deleteAllStore: function (mac,callback) {
            exec(callback, null, "PluginInterface", "deleteAllStore", [mac]);
        }, feedbackCommit: function (mac) {
            exec(null, null, "PluginInterface", "feedbackCommit", [mac]);
        }, startVoice: function (callback) {
            exec(callback, null, "PluginInterface", "startVoice", []);
        }, startSpeak: function (text) {
            exec(null, null, "PluginInterface", "startSpeak", [text]);
        }, stopSpeak: function () {
            exec(null, null, "PluginInterface", "stopSpeak", []);
        }, translateValue: function (jsonData) {
            exec(null, null, "PluginInterface", "translateValue", [jsonData]);
        }, pluginTranslateData: function (url, jsonData, callback) {
            exec(callback, null, "PluginInterface", "pluginTranslateData", [url, jsonData]);
        }, saveUserInfo: function (key, value) {
            exec(null, null, "PluginInterface", "saveUserInfo", [key, value]);
        }, getUserInfo: function (key, value, callback) {
            exec(callback, null, "PluginInterface", "getUserInfo", [key, value]);
        }, backToHomePage: function () {
            exec(null, null, "PluginInterface", "backToHomePage", []);
        }, sendDataToDeviceNoCallback: function (mac, json, isFollowSysVibration) {
            exec(null, null, "PluginInterface", "sendDataToDeviceNoCallback", [mac, json, isFollowSysVibration]);
        }, pluginHttpPost: function (url, paramsStr, headersStr, callback) {
            exec(callback, null, "PluginInterface", "pluginHttpPost", [url, paramsStr, headersStr]);
        }, startListening: function (callback) {
            exec(callback, null, "PluginInterface", "startListening", []);
        }, addStoreList: function (val, callback) {
            exec(callback, null, "PluginInterface", "addStoreList", [val]);
        }, getAllTimerList: function (subMac, mainMac, callback) {
            exec(callback, null, "PluginInterface", "getAllTimerList", [subMac, mainMac]);
        }, getAllSubDevices: function (subMac, mainMac, callback) {
            exec(callback, null, "PluginInterface", "getAllSubDevices", [subMac, mainMac]);
        }, finishLoad: function () {
            exec(null, null, "PluginInterface", "finishLoad", []);
        }, searchSubBLE: function (isStart,mac,callback) {
            exec(callback,null,"PluginInterface", "searchSubBLE", [isStart,mac]);
        }, BLEAddMESH: function (mac,subCount,hashList,callback) {
            exec(callback,null,"PluginInterface", "BLEAddMESH", [mac,subCount,hashList]);
        }, BLEDelMESHSubDev: function (mac,subCount,hashList,callback) {
            exec(callback, null, "PluginInterface", "BLEDelMESHSubDev", [mac,subCount,hashList]);
        },sendDataToDevicebyPower: function (mac, json, isFollowSysVibration, callback) {
            exec(callback, null, "PluginInterface", "sendDataToDevicebyPower", [mac, json, isFollowSysVibration]);
        },callNumber: function (num) {
            exec(null, null, "PluginInterface", "callNumber", [num]);
        },toWebPage: function (url,title) {
            exec(null, null, "PluginInterface", "toWebPage", [url,title]);
        },thirdPlatformRequest: function (json,url,callback) {
            exec(callback, null, "PluginInterface", "thirdPlatformRequest", [json,url]);
        },getCurrentMode: function (callback) {
            exec(callback, null, "PluginInterface", "getCurrentMode", []);
        },showLoading: function () {
            exec(null, null, "PluginInterface", "showLoading", []);
        },hideLoading: function () {
            exec(null, null, "PluginInterface", "hideLoading", []);
        },faceControl: function (mac,did) {
            exec(null, null, "PluginInterface", "faceControl", [mac,did]);
        }, securityControl: function (mac,did) {
            exec(null, null, "PluginInterface", "securityControl", [mac,did]);
        }
    };
});
