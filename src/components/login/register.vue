<template>
    <div class="login">
        <div class="login_box" style="top:-40px">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                <ul class="login_form">
                    <li>
                        <div class="login_input">
                            <div class="login_input_left">
                                +86
                            </div>
                            <div class="line"></div>
                            <div class="login_input_right">
                                <el-form-item prop="phone">
                                    <el-input v-model="ruleForm.phone" placeholder="请输入手机号" style="width:260px" @blur="userPhoneExist()" @focus="cleanPhoneExist()"></el-input>
                                    <p v-show="isReg === true" style="color:red;font-size:12px;position: absolute;top: 30px;">手机号已被注册!</p>
                                </el-form-item>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="login_input">
                            <div class="login_input_left iconfont icon-mima" style="text-align: center">
                            </div>
                            <div class="line"></div>
                            <div class="login_input_right">
                                <el-form-item prop="password">
                                    <el-input type='password' v-model="ruleForm.password" placeholder="请输入密码" style="width:260px"></el-input>
                                </el-form-item>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="login_input">
                            <div class="login_input_left iconfont icon-bianji" style="text-align: center">
                            </div>
                            <div class="line"></div>
                            <div class="login_input_right">
                                <el-form-item prop="nickName">
                                    <el-input v-model="ruleForm.nickName" placeholder="请输入昵称" style="width:170px"></el-input>
                                </el-form-item>
                            </div>
                        </div>
                        <p class="error"></p>
                    </li>
                    <li>
                        <div class="login_input" style="width:218px;float:left">
                            <div class="login_input_left iconfont icon-anquan" style="text-align: center">
                            </div>
                            <div class="line"></div>
                            <div class="login_input_right" style="width:170px">
                                <el-form-item prop="verticalCode">
                                    <el-input v-model="ruleForm.verticalCode"  style="width:170px"></el-input>
                                </el-form-item>
                            </div>
                        </div>
                        <el-button style="margin:0 0 0 10px" v-show="show" @click="sendCode()" class="btn_code" >发送验证码</el-button>
                        <el-button style="margin:0 0 0 10px;padding:0 10px" v-show="!show" disabled class="btn_code"><el-input disabled v-model="this.count" class="sendCodeNum"></el-input>秒后重发</el-button>
                        <p class="error"></p>
                    </li>
                    <li>
                        <div class="login_input" style='width:104px;float:left'>
                            <div class="login_input_left iconfont icon-xingbie" style="text-align: center">
                            </div>
                            <div class="line"></div>
                            <div class="login_input_right" style="width:60px">
                              <el-form-item prop="sex">
                                <input type="text" placeholder="性别" v-model="ruleForm.sex" style="width:62px;text-align:left" disabled>
                              </el-form-item>
                            </div>
                        </div>
                        <div class="sex_radio">
                            <label for="" v-if = "ruleForm.sex === '男'" @click="clickSex1()"><span class="iconfont icon-yixuanzhong"></span><input type="radio" value="男">男</label>
                            <label for="" v-else @click="clickSex1()"><span class="iconfont icon-weixuanzhong"></span><input type="radio" value="男">男</label>
                            <label for="" v-if = "ruleForm.sex === '女'" @click="clickSex2()"><span class="iconfont icon-yixuanzhong"></span><input type="radio" value="女">女</label>
                            <label for="" v-else @click="clickSex2()"><span class="iconfont icon-weixuanzhong"></span><input type="radio" value="女">女</label>
                        </div>
                        <p class="error"></p>
                    </li>
                </ul>
                <div class="lrbtn login_btn" @click="submitForm('ruleForm')" >注册</div>
                <p class="regmsg">注册即表示同意[SANTE] <router-link to="" class="linkto">服务条款</router-link> 和 <router-link to=""  class="linkto">隐私条款</router-link></p>
                <p class="regthird"><a href="#" class="linkto" style="border-bottom:none"><span class="iconfont icon-weixin"></span> 使用社交账号快速登录</a></p>
                <div class="login_close" @click="close"></div>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  name: 'register',
  props: ['userreg'],
  mounted: function () {
  },
  data () {
    return {
      ajaxPhoneUrl: '', // 验证手机号是否存在
      ajaxSendCodeUrl: '', // 发送验证码
      ajaxRegisterUrl: '', // 注册提交表单
      show: true, //是否显示发送验证码的按钮
      isReg: '', // 手机号是否存在的判定验证,最后在提交表单里还需要再次验证
      isCodeCorrect: false, // 如果是分步骤的，需要判断手机号的验证码是否正确
      GetCode: {},  //  如果是分步骤的，需要验证手机号的验证码是否正确
      count: '', // 发送验证码的计时器变量
      timer: null, // 是否已存在计时器
      ruleForm: { // 表单内容
        nickName: '',
        phone: '',
        password: '',
        verticalCode: '',
        sex: ''
      },
      rules: { // 表单规则
        nickName: [
          {required: true, message: '请输入昵称', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符'},
          {pattern: /^[\u4E00-\u9FA5A-Za-z]+$/, message: '只能输入中文和英文'}
        ],
        phone: [
          {required: true, message: '请输入注册手机号', trigger: 'blur'},
          {pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '只能输入11位手机号'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {pattern: /^[A-Za-z]+[0-9]+[A-Za-z0-9]*|[0-9]+[A-Za-z]+[A-Za-z0-9]*$/, message: '密码必须由6-16个英文字母和数字的字符串组成！'}
        ],
        verticalCode: [
          {required: true, message: '请输入验证码', trigger: 'blur'},
          // {pattern: /^[0-9]{6}$/, message: '验证码必须为6位数字'}
        ],
        sex: [
          {required: true, message: '请选择性别', trigger: 'blur'},
        ]
      }
    }
  },
  methods: {
    close () {
      this.$emit('listenToChildEvent', false)
    },
    login () {
      this.$emit('changestate', [0, true, false])
    },
    clickSex1 () {
      this.ruleForm.sex = '男'
    },
    clickSex2 () {
      this.ruleForm.sex = '女'
    },
    // 失去焦点后, 判断用户手机号是否存在, POST失败
    userPhoneExist () {
      this.$ajax.get(this.ajaxPhoneUrl, {
        params: {phone: this.ruleForm.phone}
      })
        .then((res) => {
          if (res.data.status === 1) {
            // 可以注册
            this.isReg = false
          } else {
            // 已经被注册
            this.isReg = true
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 清除新增加判定手机号是否存在的提示
    cleanPhoneExist () {
      this.isReg = ''
    },
    // 验证码获得
    getCode () {
      // 发送手机号验证码
      this.$ajax.get(this.ajaxSendCodeUrl, {
        params: {phone: this.ruleForm.phone}
      })
        .then((res) => {
          if (res.data.status === 1) {
            this.isCodeCorrect = true
            this.$message.success('验证码发送成功')
          } else {
            this.isCodeCorrect = false
            this.$message.error('验证码发送失败')
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 点击发送验证码
    sendCode () {
      // 倒计时
      // 先判断手机号是否填写正确
      var re = /^[1][3,4,5,7,8][0-9]{9}$/
      if ((re.test(this.ruleForm.phone)) & (this.isReg === false)) {
        // 填写正确后，开始发送信息，倒计时
        const TIME_COUNT = 60
        // 判断时间计时是否存在,不存在则赋值60,不显示发送验证码按钮,计时器启动循环
        if (!this.timer) {
          this.count = TIME_COUNT
          this.show = false
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              if (this.count === 60) {
                // 发送手机号到后台
                this.getCode()
              }
              this.count--
            } else {
              // 计时器为0的时候显示发送验证码按钮，清空计时器
              this.show = true
              clearInterval(this.timer)
              this.timer = null
              return false
            }
          }, 1000)
        }
      } else {
        // 手机号存在,或者手机号没有正确填写
        this.show = true
        this.$message.error('请填写正确手机号！')
      }
    },
    // 总表单提交
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 判断手机号是否被注册,是否发送过验证码
          if (this.isReg === false && this.isCodeCorrect === true) {
            // 验证通过,提交注册信息
            console.log('提交了呢！')
            this.$ajax.get(this.ajaxRegisterUrl, {
              params: {regForm: this.ruleForm}})
              .then((res) => {
                if (res.status === 1) {
                  this.$message.success('恭喜您,注册成功！')
                  // 跳转提交状态页面,可不添加
                  this.formSubmit = true
                } else if (res.status === 2) {
                  this.$message.error('验证码错误，请重新注册！')
                }
              })
          } else {
            // 验证未通过
            this.$message.error('未通过验证,注册失败！')
            return false
          }
        } else {
          this.$message.error('提交资料有误,注册失败！')
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>