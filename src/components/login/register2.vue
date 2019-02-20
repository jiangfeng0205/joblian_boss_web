<template>
    <div class="login-bg">
      <div id="login">
          <h3>JOBLIAN 注册</h3>
          <ul class="info-login">
              <li>
                  <b>{{lable}}</b>
                  <input type="text" v-model="user.phone" placeholder="请输入手机号" @change="userPhoneExist()">
                  <p v-show="isPhoneReg.boole == true"  class="inputerror">{{isPhoneReg.msg}}</p>
              </li>
              <li v-show="isCodeShow"><span></span><input type="password" v-model="user.code" placeholder="请输入验证码"><b>获取验证码</b></li>
              <li>
                  <b><span>{{flag[0]}}</span></b>
                  <input type="text" v-model="user.username" placeholder="用户名" v-bind:disabled="oldUsername != '' ">
                  <p v-show="isUsernameReg.boole == true"  class="inputerror">{{isUsernameReg.msg}}!</p>
              </li>
              <li>
                  <b><span>{{flag[1]}}</span></b>
                  <input type="text" v-model="user.password" placeholder="密码" v-bind:disabled="oldPassword != '' ">
                  <p v-show="isPasswordReg.boole == true"  class="inputerror">{{isPasswordReg.msg}}!</p>
              </li>
              <!-- <li><b><span>{{flag[2]}}</span></b><input type="text" v-model="user.password2" placeholder="密码"></li> -->
              <li>
                  <b><span>{{flag[3]}}</span></b>
                  <input type="text" v-model="user.email" placeholder="邮箱">
                  <p v-show="isheaderImgReg.boole == true"  class="inputerror">{{isheaderImgReg.msg}}</p>
              </li>
              <uploadImg :oldImage="user.headerImg" @uploadImgData="uploadImgData"></uploadImg>
              <p v-show="isEmailReg.boole == true"  class="inputerror">{{isEmailReg.msg}}</p>
              <li style="float:left;width:30%; margin-top:1.2rem;"><input  type="submit" value="完成注册" @click="register('')"></li>
              <li class="registerBtn flex_child" @click="register('/register3')"><span style="color:#fff;">完善资料</span></li>

          </ul>
      </div>
      <!--底部-->
      <div class="login-footer flex_parent">
        <router-link to="" class="flex_child"><span>用户协议</span></router-link>
        <router-link to="/login" class="flex_child"><span>登陆</span></router-link>
      </div>
      <!-- selected role -->
      <mt-actionsheet
        :actions="actions"
        v-model="sheetVisible">
      </mt-actionsheet>
    </div>
</template>

<script>
    import Store from "../../js/userstore"
    import units from '../../js/units'
    import axios from "axios"
    import qs from "qs"
    import { Toast } from 'mint-ui';
    import uploadImg from '@/components/common/uploadImg';
    import { mapState,mapGetters,mapMutations } from 'vuex';

    export default {
        computed: {
            ...mapGetters([
                'oldImage'
            ])
        },

        data () {
            return {
                isNhad:false,
                isPhoneReg:{boole:false,msg:""},
                isUsernameReg:{boole:false,msg:""},
                isPasswordReg:{boole:false,msg:""},
                isEmailReg:{boole:false,msg:""},
                isheaderImgReg:{boole:false,msg:""},
                userlist:[],
                //1用户信息
                user:{
                    phone:"",
                    username:"",
                    password:"",
                    password2:"",
                    code:"",
                    email:"",
                    headerImg:"",
                    // header:"",
                },
                lable:"手机号",
                flag:['用户名','密码','确认密码','邮箱'],
                sheetVisible:false,
                actions:[
                    {'name':'我是顾问','method':this.selectAdminRole},
                    {'name':'我是HR','method':this.selectMemberRole},
                    {'name':'我是候选人','method':this.selectMemberRole},
                ],
                loginUsers:{},
                uploadApi:'login/uploadHeaderImg',
                imgData:'',
                isCodeShow : true,
                oldPhone : '',
                oldUsername : '',
                oldPassword : '',
            }
        },

        components: {
            uploadImg
        },
        watch:{
          '$route' (to, from) {
              const toDepth = to.path.split('/').length;
              const fromDepth = from.path.split('/').length;
              this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
          },
          // userlist:{
          //   handler:function(items){
          //     Store.save(items);
          //   },
          //   deep:true
          // }
        },
        methods: {
          ...mapMutations({
              saveOldImage: 'saveOldImage',
          }),

          uploadImgData(imgData){
              this.imgData = imgData,
              this.user.headerImg = imgData;
          },

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

          userOnlineLoginout(userId,userType){
              this.$socket.emit('userOnlineLoginout',{
                  'userId' : userId,
                  'userType' : userType,
              })
          },

          register(url){
              let _self = this;
              var data = _self.user;
              data.userType = Store.get('registerRole');

              var isRegsterAdminMemberId = Store.get('isRegsterAdminMemberId');
              if (isRegsterAdminMemberId) {
                  data.isRegsterAdminMemberId = isRegsterAdminMemberId
              }

              if (url != '') {
                  Store.saveLoginJump(url);
              }

              var fieldResult = this.filedColunm();

              if (fieldResult) {
                  axios({
                      method: 'post',
                      url: units.domain('login/register'),
                      data: data,
                  }).then(function (response) {
                      var result = response.data;
                      console.log('login--',result)
                      if (result.code == 502) {
                          alert(result.message);
                      }

                      if (result.code == 402) {
                          alert(result.message);
                      }

                      if (result.code == 202) {
                          switch (result.type) {
                              case 'username':
                                  _self.isUsernameReg.msg = result.message;
                                  _self.isUsernameReg.boole = true;
                              break;
                              case 'phone':
                                  _self.isPhoneReg.msg = result.message;
                                  _self.isPhoneReg.boole = true;
                              break;
                          }
                      }

                      if (result.code == 200) {
                          Store.save(result.data.uid);
                          Store.doSave('admin_member_id', result.data.admin_member_id);
                          // Store.saveLoginJump('/company');
                          Store.saveUserType(result.data.usertype[0]);
                          let instance = Toast(result.message);
                          setTimeout(() => {
                              instance.close();
                              var login_jump_url = Store.get('login_jump_url');

                              if (login_jump_url) {
                                  _self.$router.push({path:login_jump_url});
                              } else {
                                  _self.$router.push({path:"/home"});
                              }
                          }, 500);
                      }
                  })
                  .catch(function (error) {
                      alert('网络连接失败');
                  });

              }
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
          userPhoneExist(){
              console.log('asdasdasdasd');
              this.checkCodeShow();
          },
          filedColunm(){
              var user = this.user;
              var returnResult = true;
              var isRegsterAdminMemberId = Store.get('isRegsterAdminMemberId');

              this.isEmailReg.boole = false;
              this.isPhoneReg.boole = false;
              this.isUsernameReg.boole = false;
              this.isPasswordReg.boole = false;
              var phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
              var emailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
              if(user.phone == ""){
                  this.isPhoneReg.msg = "手机号不能为空";
                  this.isPhoneReg.boole = true;
                  returnResult = false;
              }else if(!phoneReg.test(user.phone)){
                  this.isPhoneReg.msg = "手机号格式错误";
                  this.isPhoneReg.boole = true;
                  returnResult = false;
              }
              if(user.email == ""){
                  this.isEmailReg.boole = true;
                  this.isEmailReg.msg = "邮箱不能为空";
                  returnResult = false;
              }else if(!emailReg.test(user.email)){
                  this.isEmailReg.msg = "邮箱格式错误";
                  this.isEmailReg.boole = true;
                  returnResult = false;
              }
              if(user.username == "" && !isRegsterAdminMemberId){
                  this.isUsernameReg.msg = "用户名不能为空";
                  this.isUsernameReg.boole = true;
                  returnResult = false;
              }
              if(user.password == "" && !isRegsterAdminMemberId){
                  this.isPasswordReg.msg = "密码不能为空";
                  this.isPasswordReg.boole = true;
                  returnResult = false;
              }
              if(user.headerImg == ""){
                  alert('请上传头像');
                  returnResult = false;
              }

              return returnResult;

          },

          getUserDetail(){
              var isRegsterAdminMemberId = Store.get('isRegsterAdminMemberId');
              var _self = this;
              if (isRegsterAdminMemberId) {
                  axios({
                      method: 'post',
                      url: units.domain('user/getAdminMemberDetail'),
                      data: {isRegsterAdminMemberId:isRegsterAdminMemberId},
                  }).then(function (response) {
                      var result = response.data;
                      var userType = Store.get('userType');

                      if (result.code == 200) {
                          _self.user.phone     = result.data.phone[0].content;
                          _self.user.username  = result.data.username;
                          _self.user.password2 = result.data.password2;
                          _self.user.email     = result.data.email[0].content;
                          _self.user.headerImg = result.data.headerImg[0].content;
                          _self.imgData        = result.data.headerImg[0].content,
                          _self.user.headerImg = result.data.headerImg[0].content;
                          _self.oldPhone       = result.data.phone[0].content;

                          _self.saveOldImage({headerImg:result.data.headerImg[0].content});
                          _self.checkCodeShow();
                          _self.oldPassword  = 'isExist';
                          _self.oldUsername  = result.data.username;

                      }

                  })
                  .catch(function (error) {
                      alert('网络连接失败');
                  });
              }
          },

          checkCodeShow(){
              var phone = this.user.phone;
              var oldPhone = this.oldPhone;

              if (phone == '') {
                  this.isCodeShow = true;
              } else {
                  this.isCodeShow = false;
              }

              if (phone != oldPhone ) {
                  this.isCodeShow = true;
              } else {
                  this.isCodeShow = false;
              }
          }

        },

        mounted(){
            //加载之前先给一个可以登录的用户
            if (window.sessionStorage.getItem('user-id')) {
                // location.href = '/home';
            }

            let _self=this;
            let admin={
              account:"",
              password:""
            };
            _self.userlist.push(admin);
            _self.user.account=admin.account;
            _self.user.password=admin.password;
            this.getUserDetail();
        }
    }

</script>

<style lang="stylus" scoped>
    .inputerror{
        color:red;
        font-size:12px;
        position: absolute;
        top: 30px;left:30%;
    }
    .registerBtn{
        float:right;
        width:30%;
        text-align: center;
        background:#53cac3;
        cursor: pointer;
        border-radius: 0.8rem;
        font-size: 0.4rem;
        color:#fff;
        margin-top:1.2rem;
    }
</style>