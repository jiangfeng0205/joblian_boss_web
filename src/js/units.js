/**
 * Created by jfeng on 2018/12/06.
 */

const CryptoJS = require('crypto-js');  //引用AES
const key = CryptoJS.enc.Utf8.parse("1234123412ABCDEF");  //密钥
const iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412');   //密钥偏移量

let Common={
    // 解密方法AES-256-CBC算法
    decrypt:function(word) {
        let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
        let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        return decryptedStr.toString();
    },

    //加密方法（采用AES-256-CBC算法）
    encrypt:function(word) {
        let srcs = CryptoJS.enc.Utf8.parse(word);
        let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        return encrypted.ciphertext.toString().toUpperCase();
    },

    /**
     * 将url的get加密参数转化成解密后的数组
     * @param  string urlQuery url加密参数
     */
    urlParamsToArray:function(urlQuery){
        var decryptToken = this.decrypt(urlQuery);
        var params = [];

        if (decryptToken && this.debugConfig()) {
            var arrays = urlQuery.split("&");
        } else {
            var arrays = decryptToken.split("&");
        }

        for (var key in arrays) {
            var arr = arrays[key].split('=');
            params[arr[0]] = arr[1];
        }

        return params;
    },

    // 设置debug模式，debug模式下参数无加密，生产模式下参数全部加密
    debugConfig:function(){
        return false; // true为生产模式
    },

    goto:function(url){
        if (this.debugConfig()) {
            var secretUrl = url;
            window.location.href = '/chat?' + secretUrl;
        } else {
            var secretUrl = this.encrypt(url);
            window.location.href = '/chat?t=' + secretUrl;
        }

    },

    host:function () {
        // return 'http://ceshi.joblian.cn'; //线上环境
        return 'http://localhost:8090'; //本地
    },

    picHost:function(){//图片链接地址
        // return 'http://ceshi.joblian.cn';
        return 'http://localhost:8090'; //本地
    },

    domain:function(url, type=0){
    	if (type == 1) {
    		return this.host()+ '/' + url;
    	} else {
    		return '/apis/' + url;
    	}
    },

    arrayUnshiftSort:function(array, fieldArr){
        var init = 1;
        if(array.length > 0){
            for (var i = 0; i < array.length; i++) {
                var arr = array[i];
                if (arr['fromId'] == fieldArr.fromId && arr['toId'] == fieldArr.toId && (arr['jobId'] == fieldArr.matchOptionId || arr['matchOptionId'] == fieldArr.matchOptionId)) {
                    ++arr['noread'];      // 未读数量加1
                    array.splice(i++, 1); // 如果数据组存在该元素，则把该元素删除
                    array.unshift(arr);   // 再添加到第一个位置
                    init = 0;
                    break;
                }
            }

            if (init == 1) {
                array.unshift(fieldArr);
            }
        } else {
            array.unshift(fieldArr);
        }

        return array;
    }

};

export default Common;
