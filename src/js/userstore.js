/**
 * Created by jian on 2017/3/26.
 */
//利用sesstionstorage存储简单注册信息~
const STORAGE_KEY="user-id";

let Store={
    save:function(items){
        return window.sessionStorage.setItem(STORAGE_KEY,JSON.stringify(items));
    },
    saveUserType:function(type){ // type 3顾问，2HR，1候选人
        return window.sessionStorage.setItem('userType',JSON.stringify(type));
    },
    saveLoginJump:function(url){
        return window.sessionStorage.setItem('login_jump_url',url);
    },
    doSave:function(key, value, type=0){
    	if (type == 0) {
        	return window.sessionStorage.setItem(key, value);
    	} else {
    		return window.localStorage.setItem(key, value);
    	}
    },
    fetch:function(){
        return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY)||'[]');
    },
    get:function(key, type = 0) {
    	if (type == 0) {
    		return window.sessionStorage.getItem(key);
    	} else {
    		return window.localStorage.getItem(key);
    	}
    },
    delete:function(key, type=0){
    	if (type == 1) {
    		return window.localStorage.removeItem(key);
    	} else {
    		return window.sessionStorage.removeItem(key);
    	}
    }
};
export default Store;
