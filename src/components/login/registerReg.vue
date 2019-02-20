<template>
    <div class="login-bg">
      <div id="login">
        <form action="">
          <h3>已有账号验证</h3>
          <ul class="info-login">
            <li><b>{{lable}}<i class="icon-down"></i></b><input type="text" v-model="user.account" placeholder="用户名"></li>
            <li><span></span><input type="password" v-model="user.password" placeholder="密码"><b>获取验证码</b></li>
            <li><input @click.prevent="login" type="submit" value="确定"></li>
          </ul>
        </form>
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
    </div>
</template>

<script>
    import Store from "../../js/userstore"
    import units from '../../js/units'
    import axios from "axios"
    import qs from "qs"
    import { Toast } from 'mint-ui';

    export default {
        data () {
            return {
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
                    {'name':'注册为候选人','method':this.selectMemberRole},
                    {'name':'注册为HR','method':this.selectHrRole},
                    {'name':'注册为顾问','method':this.selectAdminRole},
                ],
                loginUsers:{},
            }
        },
        components:{
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
        methods: {
          infologin(){
              let _self=this;
              let users=Store.fetch();
              users.forEach(function (i) {
                if(_self.user.account===i.account&&_self.user.password===i.password){
                    _self.$router.push({
                      path:"/home"
                    });
                    //console.log(_self.$router);
                    //console.log("登录成功");
                }else{
                    alert("用户名与密码不匹配！")
                }
              });
          },

          selectAdminRole(){
              Store.save(this.loginUsers.uid);
              Store.doSave('isRegsterAdminMemberId',this.loginUsers.id);
              Store.saveUserType(3);
              Store.doSave('registerRole', 3);

              this.userOnlineLoginout(this.loginUsers.uid,3);
              // let instance = Toast('登陆成功');
              setTimeout(() => {
                  this.sheetVisible = false;

                  this.$router.push({path:"/register2"});

                  // this.$router.push({path:"/home"});
              }, 500);
          },

          selectMemberRole(){
              Store.save(this.loginUsers.uid);
              Store.doSave('isRegsterAdminMemberId',this.loginUsers.id);
              Store.saveUserType(1);
              Store.doSave('registerRole', 1);

              this.userOnlineLoginout(this.loginUsers.uid,1);
              // let instance = Toast('登陆成功');
              setTimeout(() => {
                  this.sheetVisible = false;
                  this.$router.push({path:"/register2"});
              }, 500);
          },

          selectHrRole(){
              Store.save(this.loginUsers.uid);
              Store.doSave('isRegsterAdminMemberId',this.loginUsers.id);
              Store.saveUserType(2);
              Store.doSave('registerRole', 2);

              this.userOnlineLoginout(this.loginUsers.uid,2);
              // let instance = Toast('登陆成功');
              setTimeout(() => {
                  this.sheetVisible = false;
                  this.$router.push({path:"/register2"});
              }, 500);
          },

          userOnlineLoginout(userId,userType){
              this.$socket.emit('userOnlineLoginout',{
                  'userId' : userId,
                  'userType' : userType,
              })
          },

          login(){
              let _self = this;
              var data = {
                  username: _self.user.account,
                  password: _self.user.password,
              };

              axios({
                  method: 'post',
                  url: units.domain('login/login'),
                  // data: qs.stringify(data),
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

                  if (result.code == 202 || result.code == 200) {
                      var userTypes = result.data.usertype;
                      if (userTypes.length > 0) {
                          if (userTypes.length == 3) {
                              alert('您的账号下已经没有其他类型了');
                               _self.actions = [];
                          } else {
                              userTypes.forEach(function (value, key) {
                                  console.log('registerReg--', value)

                                  _self.actions.splice(value-1, 1);

                              });
                          }
                      }


                      _self.loginUsers = result.data;
                      _self.sheetVisible = true;
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
              if(_self.isNhad && _self.user.account && _self.user.password){
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
          }
        },
        mounted(){
            //加载之前先给一个可以登录的用户
            if (window.sessionStorage.getItem('user-id')) {
                location.href = '/home';
            }

            let _self=this;
            let admin={
              account:"顾猎头",
              password:"123456"
            };
            _self.userlist.push(admin);
            _self.user.account=admin.account;
            _self.user.password=admin.password;
          //console.log("aaa");
        }
    }

</script>

<style lang="stylus" scoped>

</style>