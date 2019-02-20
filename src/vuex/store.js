
import Vue from 'vue'
import Vuex from 'vuex'
import Store from "../js/userstore"

Vue.use(Vuex)

const state = {
    count:10,
    jobClassId:[],
    lastJobClassId:[],
    jobClassNames:[],
    jobClassBaner:[],
    jobClassBanerId:[],
    jobClassTitle:[],
    jobClassTitleId:[],
    cityClassTitle:[],
    cityClassTitleId:[],
    hangyeClassTitle:[],
    hangyeClassTitleId:[],

    oldImage : '/static/images/header.png',
}

const mutations = {
    add(state,n){
        state.count+=n;
    },

    minus(state){
        state.count--;
        state.jobClassId;
        state.jobClassNames;
    },

    saveJobClassNames (state, name) {
        var isNameExist = state.jobClassNames.indexOf(name);

        if (isNameExist > -1) {
            state.jobClassNames.splice(isNameExist,1);
        } else {
            state.jobClassNames.push(name);
        }
    },

    saveJobClassBaner (state, obj) {
        console.log('banner--', obj)
        console.log('jobClassBaner--', state.jobClassBaner)
        console.log('jobClassTitle--', state.jobClassTitle)

        if (obj.type === 'beforLayer') {
            state.jobClassBaner = [];
            state.jobClassBanerId = [];
            state.jobClassBaner.push(obj.name);
            state.jobClassBanerId.push(obj.id);

        } else {
            var isNameExist = state.jobClassBaner.indexOf(obj.name);

            if (isNameExist > -1 && obj.classType != 'city') {
                state.jobClassBaner.splice(isNameExist,1);
                state.jobClassBanerId.splice(isNameExist,1);
            } else {
                if (state.jobClassBaner.indexOf(obj.name) == -1 || obj.classType == 'city') {
                    state.jobClassBaner.push(obj.name);
                }
                if (state.jobClassBanerId.indexOf(obj.keyid) == -1 || obj.classType == 'city') {
                    // if (state.jobClassBanerId.length == 2) {
                    //     // state.jobClassBanerId.splice(1,1);
                    // }
                    state.jobClassBanerId.push(obj.keyid);
                }
            }
        }
    },

    saveJobClassTitle (state, obj, classType) {

        console.log('saveJobClassTitleObj2--', obj);
        console.log('titit---', state.jobClassTitle);
        console.log('jobClassBanerId---', state.jobClassBanerId);

        if (obj.keyid == -1) {
            console.log(111);
            var newTitle = [];
            var newTitleId = [];
            var type = 0;

            state.jobClassTitle.forEach(function(value, key){
                var num = value.parent.length - 1;

                if (state.jobClassBanerId.length == 2) {

                    if (value.parent[num] != state.jobClassBanerId[num] || value.parent[0] != state.jobClassBanerId[0]) {
                        newTitle.push({name:value.name, id:value.id, parent:value.parent});
                    }
                }

                if (state.jobClassBanerId.length == 1) {
                    if (value.parent[0] != state.jobClassBanerId[0]) {
                        newTitle.push({name:value.name, id:value.id, parent:value.parent});
                    }
                }
            });

            state.jobClassTitle=[];
            state.jobClassTitle = newTitle;

            if (state.jobClassId.indexOf(obj.parentId) == -1) {
                if (state.jobClassBanerId[1]+'-all' == obj.parentId) {
                    state.jobClassTitle.push({name:obj.name,id:obj.parentId, parent:state.jobClassBanerId});
                } else {
                    state.jobClassBanerId.splice(1,10000);
                    state.jobClassTitle.push({name:obj.name,id:obj.parentId, parent:[state.jobClassBanerId[0]]});
                }
            }
        } else {
            var parentName = state.jobClassBaner[state.jobClassBaner.length - 1];
            var parentName2 = state.jobClassBaner[0];

            var fieldArr = [];
            state.jobClassTitle.forEach(function(value, key){
                var num = value.parent.length - 1;

                if (value.name == parentName+'(全部)' || value.name == parentName2+'(全部)') { //拆掉同级【全部】，和上级【全部】
                    var index = key;
                    state.jobClassTitle.splice(index,1);
                } else if(value.name == obj.name) {
                    state.jobClassTitle.splice(key,1);
                }

                fieldArr.push(value.name);
            });

            if (fieldArr.indexOf(obj.name) == -1) {
                state.jobClassTitle.push({name:obj.name, id:obj.keyid, parent:state.jobClassBanerId.sort()});
            }

            // if (state.jobClassTitle.length == 0) {
            //     console.log(888)
            //     state.jobClassTitle.push({name:obj.name, id:obj.keyid, parent:state.jobClassBanerId.sort()});
            // }

        }
    },

    saveCityClassTitle (state, obj, classType) {

        console.log('saveJobClassTitleObj--', obj);
        console.log('titit---', state.cityClassTitle);
        console.log('jobClassBanerId---', state.jobClassBanerId);
        console.log('jobClassBaner---', state.jobClassBaner);

        if (obj.keyid == -1) {
            console.log(111);
            var newTitle = [];
            var newTitleId = [];
            var type = 0;

            state.cityClassTitle.forEach(function(value, key){
                var num = value.parent.length - 1;

                if (state.jobClassBanerId.length == 2) {
                    if (value.parent[num] != state.jobClassBanerId[num] || value.parent[0] != state.jobClassBanerId[0]) {
                        newTitle.push({name:value.name, id:value.id, parent:value.parent, parentName:value.parentName});
                    }
                }

                if (state.jobClassBanerId.length == 1) {
                    if (value.parent[0] != state.jobClassBanerId[0]) {
                        newTitle.push({name:value.name, id:value.id, parent:value.parent, parentName:value.parentName});
                    }
                }
            });

            state.cityClassTitle.splice(0,10000);
            state.cityClassTitle = newTitle;

            if (state.jobClassId.indexOf(obj.parentId) == -1) {
                if (state.jobClassBanerId[1]+'-all' == obj.parentId) {
                    state.cityClassTitle.push({name:obj.name,id:obj.parentId, parent:state.jobClassBanerId, parentName:state.jobClassBaner});
                } else {
                    state.jobClassBanerId.splice(1,10000);
                    state.cityClassTitle.push({name:obj.name,id:obj.parentId, parent:[state.jobClassBanerId[0]], parentName:[state.jobClassBaner[0]]});
                }
            }
        } else {
            var parentName = state.jobClassBaner[state.jobClassBaner.length - 1];
            var parentName2 = state.jobClassBaner[0];

            var fieldArr = [];
            state.cityClassTitle.forEach(function(value, key){
                var num = value.parent.length - 1;

                if (value.name == parentName+'(全部)' || value.name == parentName2+'(全部)') { //拆掉同级【全部】，和上级【全部】
                    console.log(555)
                    var index = key;
                    state.cityClassTitle.splice(index,1);
                } else if(value.name == obj.name) {
                    console.log(666)
                    state.cityClassTitle.splice(key,1);
                }

                fieldArr.push(value.name);
            });

            if (fieldArr.indexOf(obj.name) == -1) {
                state.cityClassTitle.push({name:obj.name, id:obj.keyid, parent:state.jobClassBanerId.sort(), parentName:state.jobClassBaner});
            }

            // if (state.jobClassTitle.length == 0) {
            //     console.log(888)
            //     state.jobClassTitle.push({name:obj.name, id:obj.keyid, parent:state.jobClassBanerId.sort()});
            // }

        }
    },

    saveHangyeClassTitle (state, obj, classType) {

        console.log('saveJobClassTitleObj--', obj);
        console.log('titit---', state.hangyeClassTitle);
        console.log('jobClassBanerId---', state.jobClassBanerId);

        if (obj.keyid == -1) {
            console.log(111);
            var newTitle = [];
            var newTitleId = [];
            var type = 0;

            state.hangyeClassTitle.forEach(function(value, key){
                var num = value.parent.length - 1;

                if (state.jobClassBanerId.length == 2) {
                    if (value.parent[num] != state.jobClassBanerId[num] || value.parent[0] != state.jobClassBanerId[0]) {
                        newTitle.push({name:value.name, id:value.id, parent:value.parent});
                    }
                }

                if (state.jobClassBanerId.length == 1) {
                    if (value.parent[0] != state.jobClassBanerId[0]) {
                        newTitle.push({name:value.name, id:value.id, parent:value.parent});
                    }
                }
            });

            state.hangyeClassTitle.splice(0,10000);
            state.hangyeClassTitle = newTitle;

            if (state.jobClassId.indexOf(obj.parentId) == -1) {
                if (state.jobClassBanerId[1]+'-all' == obj.parentId) {
                    state.hangyeClassTitle.push({name:obj.name,id:obj.parentId, parent:state.jobClassBanerId});
                } else {
                    state.jobClassBanerId.splice(1,10000);
                    state.hangyeClassTitle.push({name:obj.name,id:obj.parentId, parent:[state.jobClassBanerId[0]]});
                }
            }
        } else {
            var parentName = state.jobClassBaner[state.jobClassBaner.length - 1];
            var parentName2 = state.jobClassBaner[0];

            var fieldArr = [];
            state.hangyeClassTitle.forEach(function(value, key){
                var num = value.parent.length - 1;

                if (value.name == parentName+'(全部)' || value.name == parentName2+'(全部)') { //拆掉同级【全部】，和上级【全部】
                    console.log(555);
                    var index = key;
                    state.hangyeClassTitle.splice(index,1);
                } else if(value.name == obj.name) {
                    console.log(666)
                    state.hangyeClassTitle.splice(key,1);
                }

                fieldArr.push(value.name);
            });

            if (fieldArr.indexOf(obj.name) == -1) {
                state.hangyeClassTitle.push({name:obj.name, id:obj.keyid, parent:state.jobClassBanerId.sort()});
            }
        }
    },

    saveJobClassId (state, obj) {
        var isKeyidExist = state.jobClassId.indexOf(obj.id);

        if (obj.keyid == -1) {
            if (isKeyidExist > -1) {
                state.jobClassId.splice(isKeyidExist,1);
            } else {
                var index = Number(obj.id.split('-all')[0]);
                state.jobClassId.splice(state.jobClassId.indexOf(index) + 1, 10000);
                state.jobClassId.push(obj.id);
            }

        } else {
            var isAllExist = state.jobClassId.indexOf(obj.keyid + '-all');

            if (isAllExist > -1) {
                state.jobClassId.splice(isAllExist,1);
            }
            if (isKeyidExist > -1) {
                state.jobClassId.splice(isKeyidExist,1);
            } else {
                state.jobClassId.push(obj.id);
            }
        }
    },

    clearClass (state, obj) {
        state.jobClassBaner = obj.name;
        state.jobClassBanerId = [];
    },

    beforeClass (state, obj) {
        console.log('beforeClass--', obj);
        // state.jobClassBaner.splice(0, 10000);
        // state.jobClassBanerId.splice(0, 10000);
        state.jobClassBaner = [];
        state.jobClassBanerId = [];
        state.jobClassBaner.push(obj.name);
        state.jobClassBanerId.push(obj.id);
    },

    initJobClassTitle (state, obj) {
        var titleLength = obj.data.length;

        if (titleLength > 0) {
            if (obj.classType == 'job') {
                state.jobClassTitle = obj.data;
            }
            if (obj.classType == 'hangye') {
                state.hangyeClassTitle = obj.data;
            }
            if (obj.classType == 'city') {
                state.cityClassTitle = obj.data;
            }
        }
    },

    saveOldImage (state, obj) {
        state.oldImage = obj.headerImg;
    }
}

const actions = {

}

const getters = {
    count : function(state){
        return state.count += 100;
    },

    jobClassId : function(state){
        return state.jobClassId;
    },
    lastJobClassId : function(state){
        return state.lastJobClassId;
    },
    jobClassBanerId : function(state){
        return state.jobClassBanerId;
    },
    jobClassTitleId : function(state){
        return state.jobClassTitleId;
    },

    jobClassNames : function(state){
        return state.jobClassNames.join('-');
    },
    jobClassBaner : function(state){
        return state.jobClassBaner.join('-');
    },
    jobClassTitle : function(state){
        // return state.jobClassTitle.join('-');
        return state.jobClassTitle;
    },
    cityClassTitle : function(state){
        return state.cityClassTitle;
    },
    hangyeClassTitle : function(state){
        return state.hangyeClassTitle;
    },
    oldImage : function(state){
        return state.oldImage;
    }
}

export default new Vuex.Store({
    state,
    mutations,
    getters
})