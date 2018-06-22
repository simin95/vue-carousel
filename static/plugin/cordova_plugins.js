cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
{
        "file": "jsplugins/PluginInterface.js",
        "id": "com.gree.codovaplugin.PluginInterface",
        "clobbers": [
            "navigator.PluginInterface"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.2"
};
// BOTTOM OF METADATA
});