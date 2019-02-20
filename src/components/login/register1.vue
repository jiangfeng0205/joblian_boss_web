<template>
    <div class="login-bg">
      <div id="login">
        <form action="">
          <h3>JOBLIAN 注册</h3>
          <ul class="info-login">
              <li><input @click.prevent="selectRole(3)" type="submit" value="我是顾问" class="role"></li>
              <li><input @click.prevent="selectRole(1)" type="submit" value="我是候选人" class="role"></li>
              <li><input @click.prevent="selectRole(2)" type="submit" value="我是公司HR" class="role"></li>
              <li><input @click.prevent="selectRole(4)" type="submit" value="已有一个类型身份" class="role"></li>
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
                    {'name':'我是顾问','method':this.selectAdminRole},
                    {'name':'我是HR','method':this.selectMemberRole},
                    {'name':'我是候选人','method':this.selectMemberRole},
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

                  if (result.code == 202) {
                      var userTypes = result.data.usertype;
                      if (userTypes.length > 0) {
                          if (userTypes.length == 2) {
                              _self.actions.pop();
                          }
                          userTypes.forEach(function (value, key) {
                              if (value == 3) {
                                  _self.actions[key].name = '我是顾问';
                                  _self.actions[key].method = _self.selectAdminRole;
                              }

                              if (value == 2) {
                                  _self.actions[key].name = '我是HR';
                                  _self.actions[key].method = _self.selectHrRole;
                              }

                              if (value == 1) {
                                  _self.actions[key].name = '我是候选人';
                                  _self.actions[key].method = _self.selectMemberRole;
                              }
                          });
                      }


                      _self.loginUsers = result.data;
                      _self.sheetVisible = true;
                  }

                  if (result.code == 200) {
                      _self.userOnlineLoginout(result.data.uid,result.data.userType);
                      Store.save(result.data.uid);
                      Store.saveLoginJump('/company');
                      Store.saveUserType(result.data.userType);
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

              if (userType == 4) {
                  this.$router.push({path:"/registerReg"});
              } else {
                  this.$router.push({path:"/register2"});
              }
          },

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
    #login .role{
        // background:red;
    }
</style>