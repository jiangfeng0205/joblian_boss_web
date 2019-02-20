<template>
    <div class="login-bg">
      <div id="login" v-show="loginBox == true">
          <h3>完善资料</h3>
          <ul class="info-login">
              <li class="selectClass" @click.prevent="tabChange(1)">
                  <input v-if="hangyeTitle.length == 0"  type="submit" value="请选择行业" class="role">
                  <input v-else type="submit" value="已选择行业" class="role">
                  <div v-if="hangyeTitle.length > 0">
                      <div class="flag" v-for="(value, index) in hangyeTitle" >
                          <span class='flagContent'>{{value.name}}</span>
                          <!-- <span class="deleteFlagBtn" @click.prevent="delecteJobClassTitle(index,'hangye')">x</span> -->
                      </div>
                  </div>
              </li>
              <li class="selectClass"></li>
              <li class="selectClass" @click.prevent="tabChange(0)">
                  <input v-if="jobTitle.length == 0" type="submit" value="请选择职能" class="role">
                  <input v-else type="submit" value="已选择职能" class="role">
                  <div v-if="jobTitle.length > 0">
                      <div class="flag" v-for="(value, index) in jobTitle" >
                          <span class='flagContent'>{{value.name}}</span>
                          <!-- <span class="deleteFlagBtn" @click.prevent="delecteJobClassTitle(index,'job')">x</span> -->
                      </div>
                  </div>
              </li>
              <li class="selectClass" @click.prevent="tabChange(2)">
                  <input v-if="cityTitle.length == 0" type="submit" value="请选择地域" class="role">
                  <input v-else type="submit" value="已选择地域" class="role">
                  <div v-if="cityTitle.length > 0">
                      <div class="flag" v-for="(value, index) in cityTitle" >
                          <span class='flagContent'>{{value.parentName[0]}}-{{value.parentName[1]}}-{{value.name}}</span>
                          <!-- <span class='flagContent'>{{value.name}}</span> -->
                          <!-- <span class="deleteFlagBtn" @click.prevent="delecteJobClassTitle(index,'city')">x</span> -->
                      </div>
                  </div>
              </li>
              <li class="selectClass" >
                  <input  type="submit" value="自我描述" class="role">
                  <textarea v-model="description" placeholder="请输入自我描述" class='introduction'></textarea>
              </li>
              <li style="float:left;width:30%;"><input  type="submit" value="完成注册" @click="saveClass()"></li>
              <li class="registerBtn" ><router-link to="/register3" class="flex_child"><span style="color:#fff;">继续完善</span></router-link></li>
          </ul>
      </div>
      <!--底部-->
      <div class="login-footer flex_parent">
        <router-link to="" class="flex_child"><span>用户协议</span></router-link>
        <router-link to="/login" class="flex_child"><span>登录</span></router-link>
      </div>
      <!-- selected role -->
      <mt-actionsheet
        :actions="actions"
        v-model="sheetVisible">
      </mt-actionsheet>
          <!-- <colunmLabs ref="judge" :loginBox="loginBox" :tableTitle="tableTitle" :tabData="tabData1" :nowIndex="nowIndex" @hide="hide" @indexData="indexData" @btnSure="btnSure" v-show="showHide"></colunmLabs> -->
    </div>
</template>

<script>
    import Store from "../../js/userstore"
    import units from '../../js/units'
    import axios from "axios"
    import qs from "qs"
    import { Toast } from 'mint-ui';
    import colunmLabs from '@/components/common/table';
    import { mapState,mapGetters,mapMutations } from 'vuex'

    export default {
        components: {
            colunmLabs
        },
        data () {
            return {
                loginBox : true,
                tableTitle : '',
                titleData: [{ title: "融资",id:1 }, { title: "规模",id:2 }, { title: "行业",id:3 }],
                InfoData: [],
                nowIndex: [0],
                indexSub: [[0], [0], [0]],
                tableIndex: 0,
                showHide: false,
                tabData1: [],
                tabData: [
                        [],
                        [
                          "全部",
                          "0-20人",
                          "20-99人",
                          "100-499人",
                          "500-999人",
                          "1000-9999人",
                          "10000以上"
                        ],
                        [
                          "全部",
                          "非互联网行业",
                          "健康医疗",
                          "生活服务",
                          "旅游",
                          "金融",
                          "信息安全",
                          "广告营销",
                          "数据服务",
                          "智能硬件",
                          "文化娱乐",
                          "网络招聘",
                          "分类信息",
                          "电子商务",
                          "企业服务",
                          "移动互联网",
                          "社交网络",
                          "教育培训",
                          "游戏",
                          "O2O",
                          "互联网",
                          "媒体",
                          "IT软件"
                        ]
                      ],




                isNhad:false,
                userlist:[],
                //1用户信息
                user:{
                  account:"",
                  password:""
                },
                lable:"+86",
                sheetVisible:false,
                actions:[
                    {'name':'我是顾问','method':this.selectAdminRole},
                    {'name':'我是HR','method':this.selectMemberRole},
                    {'name':'我是候选人','method':this.selectMemberRole},
                ],
                loginUsers:{},
                jobTitle  : [],
                cityTitle : [],
                hangyeTitle : [],
                description : '',
            }
        },
        watch:{
          '$route' (to, from) {
            const toDepth = to.path.split('/').length
            const fromDepth = from.path.split('/').length
            this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
          },
          // userlist:{
          //   handler:function(items){
          //     Store.save(items);
          //   },
          //   deep:true
          // }
        },
        // components:{
        // },
        methods: {
          infologin(){
              let _self=this;
              let users=Store.fetch();
              users.forEach(function (i) {
                if(_self.user.account===i.account&&_self.user.password===i.password){
                    // _self.$router.push({
                    //   path:"/home"
                    // });
                    //console.log(_self.$router);
                    //console.log("登录成功");
                }else{
                    alert("用户名与密码不匹配！")
                }
              });
          },

          selectAdminRole(){
              Store.save(this.loginUsers.uid);
              Store.saveUserType(3);

              this.userOnlineLoginout(this.loginUsers.uid,3);
              let instance = Toast('登陆成功');
              setTimeout(() => {
                  this.sheetVisible = false;
                  instance.close();
                  var login_jump_url = Store.get('login_jump_url');
                  if (login_jump_url) {
                      this.$router.push({path:login_jump_url});
                  } else {
                      this.$router.push({path:"/home"});
                  }
                  // this.$router.push({path:"/home"});
              }, 500);
          },

          selectMemberRole(){
              Store.save(this.loginUsers.uid);
              Store.saveUserType(1);

              this.userOnlineLoginout(this.loginUsers.uid,1);
              let instance = Toast('登陆成功');
              setTimeout(() => {
                  this.sheetVisible = false;
                  instance.close();
                  // this.$router.push({path:"/home"});
                  var login_jump_url = Store.get('login_jump_url');
                  if (login_jump_url) {
                      this.$router.push({path:login_jump_url});
                  } else {
                      this.$router.push({path:"/home"});
                  }
              }, 500);
          },

          selectHrRole(){
              Store.save(this.loginUsers.uid);
              Store.saveUserType(2);

              this.userOnlineLoginout(this.loginUsers.uid,2);
              let instance = Toast('登陆成功');
              setTimeout(() => {
                  this.sheetVisible = false;
                  instance.close();
                  // this.$router.push({path:"/home"});
                  var login_jump_url = Store.get('login_jump_url');
                  if (login_jump_url) {
                      this.$router.push({path:login_jump_url});
                  } else {
                      this.$router.push({path:"/home"});
                  }
              }, 500);
          },

          tabChange(index) {
              if (index == 0) {
                  this.$router.push({'path':'/registerHy'});
              }
              if (index == 1) {
                  this.$router.push({'path':'/registerZn'});
              }
              if (index == 2) {
                  this.$router.push({'path':'/registerCity'});
              }
              //调用子组件的方法
          },
          hide() {
              this.showHide = false;
          },
          indexData() {
            this.nowIndex = [0];
          },
          btnSure(number, indexData, loginBox) {
            console.log('dasdsad--',number)
            console.log('dasdsad2--',indexData)
            console.log('dasdsad3--',loginBox)
            this.loginBox = loginBox;
            this.indexSub[this.tableIndex] = indexData;
            let title = this.titleData[this.tableIndex].title;
            if (number != 0) {
              this.titleData[this.tableIndex].title =
                title.replace(/[^\u4e00-\u9fa5]+/, "") + "(" + number + ")";
            } else {
              this.titleData[this.tableIndex].title = title.replace(
                /[^\u4e00-\u9fa5]+/,
                ""
              );
            }

            this.showHide = false;
          },

          userOnlineLoginout(userId,userType){
              this.$socket.emit('userOnlineLoginout',{
                  'userId' : userId,
                  'userType' : userType,
              })
          },

          getCityOrhy(table, keyid){
              let _self = this;
              var data = {
                  table: table,
                  keyid: keyid,
              };

              axios({
                  method: 'post',
                  url: units.domain('pushJobList/getHyAndCityName'),
                  data: data,
              }).then(function (response) {
                  var result = response.data;
                  console.log('register3--',result)
                  if (result.code == 402) {
                      alert(result.message);
                  }

                  if (result.code == 200) {
                      console.log('getHyAndCityName--', result)
                      var arr = result.data;
                      arr.unshift({
                          content:null,
                          id:35,
                          keyid:0,
                          name:"全部",
                          sort:0,
                      })
                      _self.tabData1 = arr;
                  }
              })
              .catch(function (error) {
                  alert('网络连接失败');
              });
          },
          adduser(){
              //注册用户，如果已经被注册
              let _self=this;
              _self.haduser();
              if(_self.isNhad&&_self.user.account&&_self.user.password){
                  _self.userlist.push({
                      account:_self.user.account,
                      password:_self.user.password
                  });
                  console.log(_self.userlist)
              }
          },
          // 过滤注册的用户是否已经存在
          haduser(){
              let _self=this;
              let items=Store.fetch();
              let len=items.length;
              items.forEach(function (i) {
                  if(_self.user.account!==i.account){
                      _self.isNhad=true;
                  }else{
                    _self.isNhad=false;
                  }
               //console.log(i.account);
              });
          },

          selectRole(userType){
              Store.doSave('registerRole', userType);
              this.$router.push({path:"/register2"});
          },

          delecteJobClassTitle(index, classType) {
              if (classType == 'job') {
                  this.jobTitle.splice(index, 1);
                  Store.doSave('jobClassTitle', JSON.stringify(this.jobTitle), 1);
              }

              if (classType == 'hangye') {
                  this.hangyeTitle.splice(index, 1);
                  Store.doSave('hangyeClassTitle', JSON.stringify(this.hangyeTitle), 1);
              }

              if (classType == 'city') {
                  this.cityTitle.splice(index, 1);
                  Store.doSave('cityClassTitle', JSON.stringify(this.cityTitle), 1);
              }
          },

          getJobClassTitle(){
              var jobTitle = Store.get('jobClassTitle', 1);
              var cityTitle = Store.get('cityClassTitle', 1);
              var hangyeTitle = Store.get('hangyeClassTitle', 1);

              if (jobTitle) {
                  this.jobTitle = JSON.parse(jobTitle);
              }
              if (cityTitle) {
                  this.cityTitle = JSON.parse(cityTitle);
              }
              if (hangyeTitle) {
                  this.hangyeTitle = JSON.parse(hangyeTitle);
              }
          },

          saveClass(){
              let _self = this;
              var jobClassTitle    = Store.get('jobClassTitle', 1);
              var cityClassTitle   = Store.get('cityClassTitle', 1);
              var hangyeClassTitle = Store.get('hangyeClassTitle', 1);
              var uid              = Store.get('user-id');
              var userType         = Store.get('registerRole');
              var adminMemberId    = Store.get('admin_member_id');
              var errorMessage     = '';

              if (!jobClassTitle || jobClassTitle == '[]') {
                  errorMessage += '职能不能为空 ';
              }
              if (!cityClassTitle || cityClassTitle == '[]') {
                  errorMessage += '地域不能为空 ';
              }
              if (!hangyeClassTitle || hangyeClassTitle == '[]') {
                  errorMessage += '行业不能为空 ';
              }

              if (errorMessage != '') {
                  alert(errorMessage);
                  return;
              }


              var data = {
                  jobClassTitle    : JSON.parse(jobClassTitle),
                  cityClassTitle   : JSON.parse(cityClassTitle),
                  hangyeClassTitle : JSON.parse(hangyeClassTitle),
                  description      : this.description,
                  uid              : uid,
                  userType         : userType,
                  adminMemberId    : adminMemberId,
              };

              var isRegsterAdminMemberId = Store.get('isRegsterAdminMemberId');

              if (isRegsterAdminMemberId) {
                  data.isRegsterAdminMemberId = isRegsterAdminMemberId
              }

              axios({
                  method: 'post',
                  url: units.domain('login/saveClass'),
                  data: data,
              }).then(function (response) {
                  var result = response.data;

                  if (result.code == 200) {

                      setTimeout(() => {

                          var register_jump_url = Store.get('register_jump_url');

                          if (register_jump_url) {
                              _self.$router.push({path:register_jump_url});
                          } else {
                              _self.$router.push({path:"/home"});
                          }
                      }, 500);
                  }
              })
              .catch(function (error) {
                  alert('网络连接失败');
              });
          },

        },

        computed: {
            ...mapGetters([
                'count',
                'jobClassId',
                'lastJobClassId',
                'jobClassNames',
                'jobClassBaner',
                'jobClassBanerId',
                'jobClassTitle',
                'cityClassTitle',
                'hangyeClassTitle',
                'jobClassTitleId',
            ])
        },
        mounted(){
            // 清空标签导航
            console.log('vuex--', this)
            this.$store.commit({
                type: 'clearClass',
                name: [],
            });

            this.getJobClassTitle();
            console.log('jobtitle--',this.jobClassTitle);

            //加载之前先给一个可以登录的用户
            if (window.sessionStorage.getItem('user-id')) {
                // location.href = '/home';
            }

            let _self=this;
            let admin={
              account:"顾猎头",
              password:"123456"
            };
            _self.userlist.push(admin);
            _self.user.account=admin.account;
            _self.user.password=admin.password;
        }
    }

</script>

<style lang="stylus" scoped>
    #login .role{
        // background:red;
    }

    .flag{
        margin-top: 0.3rem;
        margin-left: 0.346666rem;
        display: inline-block;
        min-width: 1.7rem;
        padding:0.213333rem 0.133333rem;
        margin-bottom: 0.32rem;
        text-align: center;
        border: 1px solid #CECECE;
        border-radius: 10px;
        margin-right: 0.346666rem;
        background: #FFFFFF;
        position:relative;

        span {
          display:block;
        }

        .flagContent{
          float:left;
        }

        .deleteFlagBtn {
          float:right;
          position:absolute;
          top:-10px;
          right:-10px;
          color:red;
          padding:2px;
        }
    }

    .info-login {
        .selectClass{
            height:auto;
        }

        li{
            line-height:normal;
        }
        .registerBtn{
            float:right;
            width:30%;
            text-align: center;
            line-height:1.2rem;
            background:#53cac3;
            cursor: pointer;
            border-radius: 0.8rem;
            font-size: 0.4rem;
            color:#fff;
        }
    }

    .introduction{
        width: 100%;
        height: 2.5rem;
        margin-top: 0.3rem;
    }


</style>