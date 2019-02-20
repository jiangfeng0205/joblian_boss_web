<template>
  <div class="job_chat" id="scroll_bottom">
    <div class="job_detial_header">
      <router-link to="/home" class="flex_child"><span class="icon-left"></span></router-link>
      <h3>{{scrollInfo}}</h3>
      <div class="job_detial_icon">
        <i class="iconfont icon-aixin" :class="{ selected: isSelected }" @click="toggleSelect"></i>
        <i class="iconfont icon-fenxiang1"></i>
      </div>
    </div>
    <!---->
    <div class="top_detial_bg">
      <div class="top_detial">
        <h3>{{need_job}} <span>【{{job_money}}】</span></h3>
        <p>
          <span><i class="icon-position"></i>{{job_place}}</span>
          <span><i class="icon-seniority"></i>{{job_year}}</span>
          <span><i class="icon-education"></i>{{job_edu}}</span>
        </p>
        <ul class="goos_tips">
          <li >{{good_tip1}}</li>
          <li >{{good_tip2}}</li>
        </ul>
        <div class="comp_info">
          <div class="comp_img">
            <img :src="com_img" alt="">
          </div>
          <div class="comp_msg">
            <h3>{{com_name}}</h3>
            <p><span v-for="(list,index) in com_msgarr" :key="index">{{list}}</span></p>
          </div>
          <div class="comp_icon">
            <i class="icon-right"></i>
          </div>
        </div>
        <div class="comp_detial_place">
          <!-- <p><span>{{comp_address.front_road}}</span>*{{comp_address.front_detial}}</p> -->
          <p><span>{{comp_address}}</span></p>
          <i class="icon-position"></i>
        </div>
      </div>
    </div>

    <!--沟通信息-->
    <div class="top_detial_bg">
        <h3><i class="icon-me"></i><span>实时沟通</span></h3>
    </div>

    <div class="chat_message" id="msbox">
        <div v-for = "(history, index) in chatParams.chatHistoryList">
                <div class="message_left" v-if="history && history.fromId != userId">
                    <div class="header_img"><img :src="boss_img" alt=""></div>
                    <div class="message_content">
                      <p class="c_content">{{history.msg}}</p>
                      <p class="c_name"><span>{{boss_online}}</span></p>
                    </div>
                </div>
                <div class="message_right" v-if="history && history.fromId == userId">
                    <div class="header_img"><img :src="boss_img" alt=""></div>
                    <div class="message_content">
                        <p class="c_content">{{history.msg}}</p>
                        <p class="c_name">
                            <span class="text-left" v-if="history.isread == 0">未读</span>
                            <span class="text-left" v-if="history.isread == 1">已读</span>
                            <span>{{boss_online}}</span>
                        </p>
                    </div>
                </div>
        </div>
    </div>

    <!--立即沟通-->
    <div class="message_input" id="scroll_bottom_box">
          <input class="m_input" type="text" name="" v-model.trim="form.message" placeholder="" ><mt-button  type="primary" class="m_button" @click="sendMessage(form.message)">发送</mt-button>
          <!-- <router-link to="message" class="flex_child">
              <input type="text" name="" value="" placeholder="">
              <span>立即沟通</span>
          </router-link> -->
    </div>
  </div>
</template>

<script>

import Store from "../../js/userstore"
import units from '../../js/units'
import axios from "axios"
import qs from "qs"

export default {
  name: "sinian",

  //客户端监听服务端
  sockets: {
      //建立连接自动调用connect
      connect() {
          //与socket.io连接后回调
          console.log("socket connected--",this.$socket.id);
      },

      loginout(value){
          var _self = this;
          var userId   = Store.get('user-id');
          var userType = Store.get('userType');

          if (userId == value.userId && userType == value.userType) {
              Store.delete('user-id');
              Store.delete('userType');

              _self.$messagebox({
                  title: '提示',
                  message: '该账号已经在其它地方登录',
                  closeOnClickModal:false,
              }).then(action => {
                  _self.$router.push({path:"/login"});
              });
          }
      },

      initToUserOnline(value) {
          let _self = this;
          console.log('chatlist---',value);
          console.log('chatlist2---',_self.chatParams);

          if (value.initUserId == _self.chatParams.fromId) {
            console.log('这是初始化--')
              _self.toUserOnline = value.toUserOnline;
          }

      },

      pm(value){
          let _self = this;
          if (_self.chatParams.jobId == value.matchOptionId) {
              var oneHistory = {
                  // 参数信息
                  "userId": _self.userId,
                  "pushToid": _self.chatParams.fromId,
                  "fromId": value.fromId,
                  "fromName": value.fromName,
                  "provinceName": value.provinceName,
                  "toId": value.toId,
                  "toName": value.toName,
                  "matchType": "job",
                  "matchOptionId": value.matchOptionId,
                  "userAvatar": "img/123.jpg",
                  "updateType": [
                    "pushList",
                    "contractList"
                  ],
                  "msg": value.msg,
                  "createtime": Date.now(),
                  "updatetime": Date.now(),
                  "isread": value.isread,

              }
              _self.chatParams.chatHistoryList.push(oneHistory);

              if (value.type == "pmToSocket") {
              console.log('pmdata--',value)
                  this.$socket.emit('savePmData', {
                      'isread':1,
                      'fromId':value.fromId,
                      'toId':value.toId,
                      'jobId':value.matchOptionId,
                  });
              }
          }
      },

      chatHistoryIsreadAll(value){
          let _self = this;
          var chatHistorys = _self.chatParams.chatHistoryList;
          var chatParams = _self.chatParams;
          console.log('dfs---', value)
          // console.log('dfs2---', chatParams)
          if (  chatHistorys &&
                chatHistorys.length > 0 &&
                value.fromId == chatParams.fromId &&
                value.toId == chatParams.toId &&
                value.jobId == chatParams.jobId
             ) {

              if (_self.toUserOnline != 2) {
                  _self.toUserOnline = 1; //记录对方在线状态
              }

              for (var key in chatHistorys) {
                  if (chatHistorys[key]) {
                      _self.chatParams.chatHistoryList[key]['isread'] = 1;
                  }
              }
          }
      },
  },

  //数据更新时，向服务器端发送事件
  // updated(){
  //     this.$socket.emit("compile",'hello word2222'); //触发start
  // },

  data () {
    return {
      scrollInfo:"职位沟通",
      apiUrl: "",
      tempInfo:"",
      id:"",
      isSelected:false,
      // 匹配的新数据
      jobdetial:"",
      // 职位和薪资
      need_job:"",
      job_money:"",
      // 3
      job_place:"",
      job_year:"",
      job_edu:"",
      // 公司信息
      com_img:"",
      com_name:"",
      com_msgarr:[],
      // 地址
      comp_address:"",
      good_tips:[],
      good_tip1:"",
      good_tip2:"",
      // 工作职责
      job_respon:[],
      job_require:[],
      isMore:false,
      job_skills:[],
      // 是否团队信息
      // team_info.code=0不显示
      isTeam:false,
      team_info:"",
      // boss信息
      boss_img:"",
      boss_name:"",
      boss_title:"",
      boss_online:"",
      // 温馨提示都一样
      // 推荐职位
      recommend_jobs:[],

      //当前用户
      userId : '',
      userType : 3,

      // 发送消息
      form : {
          message:'',
      },
      // 构造通讯参数
      chatParams : {
          userId             : 2,
          fromId             : 2,
          fromUserType       : 3,
          toId               : 68,
          toUserType         : 3,
          fromName           : '',
          toName             : '',
          provinceName       : '',
          jobId              : 677,
          parent_uid         : 0,
          m_id               : 0,
          belongid           : 0,
          companyid          : 0,
          company_uid        : 0,
          company_parent_uid : 0,
          chatHistoryList    : [],
          sourceUrl          : '',
      },
      toUserOnline : 0, // 对方是否在线
      scrollBottom:0,
    }
  },
  watch:{
    '$route': 'fecthIndex',
    'chatParams':{
        handler(newName, oldName) {
          // console.log('333--',this.chatParams)
            this.$nextTick(() => {
                var div = this.$el.querySelector("#msbox");
                this.scrollBottom = div.scrollHeight;
                document.documentElement.scrollTop = this.scrollBottom;
                document.body.scrollTop = this.scrollBottom;
            });
        },
        deep: true, // 深度监听
        // immediate: true, 首次触发，数据改变时才监听
    }

  },
  computed:{

  },
  methods:{
    // 返回上一次路由
    // goBack(){
    //   this.$router.back();
    // },
    willscroll(){
        //2.1 使用定时器，防止频繁滚动
        if (window.scrollTime) {
            window.clearTimeout(window.scrollTime);
        }
        //2.2 定时器
        window.scrollTime = window.setTimeout(() => {
            const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            this.scrollInfo = (scrollTop > 30) ? this.need_job : "职位沟通";
            // console.log(scrollTop);
        }, 100);
    },
    toggleMore(){
      this.isMore=!this.isMore;
    },
    toggleSelect(){
      this.isSelected=!this.isSelected;
    },
    fecthIndex(){
      this.id=this.$route.params.jobId;
      // this.fetchData(this.id);
      // console.log(this.id);
    },
    initApiUrl(){
        // 线上
        // let domain="https://"+window.location.host+"/";
        // 本地
        let domain="http://"+window.location.host+"/";
        var str="static/data/joblist.json";
        this.apiUrl=domain+str;
        // console.log(this.apiUrl);
    },
    fetchData(index){
      let _this=this;
      this.$http.get(_this.apiUrl)
          .then(response => {
              if(response.data.code=="0"){
                  // 根据id匹配指定的信息列表
                  let nowlist=response.data.main[index];
                  _this.jobdetial=nowlist.detial;
                  _this.need_job=nowlist.need_job;
                  _this.job_money=nowlist.job_money;
                  // 3个
                  _this.job_place=nowlist.con_place;
                  _this.job_year=nowlist.seniority;
                  _this.job_edu=nowlist.education;
                  // 公司信息
                  _this.com_img=_this.jobdetial.com_img;
                  _this.com_name=nowlist.conmpany;
                  _this.com_msgarr=_this.jobdetial.com_msg;
                  // 详细地址
                  _this.comp_address=_this.jobdetial.com_address;
                  // 公司福利
                  _this.good_tips=_this.jobdetial.good_tips;
                  // 职责
                  _this.job_respon=_this.jobdetial.job_responsibility;
                  _this.job_require=_this.jobdetial.job_requirements;
                  _this.job_skills=_this.jobdetial.job_skill;
                  // 是否显示团队信息
                  var team_code=_this.jobdetial.team_info.code;
                  if(team_code!=0){
                    _this.isTeam=true;
                    _this.team_info=_this.jobdetial.team_info.team_msg;
                  }
                  // boss信息
                  _this.boss_img=nowlist.src;
                  _this.boss_name=nowlist.ceo;
                  _this.boss_title=nowlist.title;
                  _this.boss_online=nowlist.detial.boss_online;
                  // console.log(_this.jobdetial);
                  // 推荐职位
                  _this.recommend_jobs=nowlist.detial.recommend_jobs;
              }
          })
          .catch(error => {
              console.log(error);
      });
    },
    sendMessage(message){
        let _self = this;
        console.log('toUserOnline--', _self.toUserOnline)
        if (message == ''){
            alert('内容不能为空！');
            return false;
        }
        this.form.message = '';

        var oneHistory = {
            "userId": this.userId,
            "pushToid": _self.chatParams.fromId,
            "fromId": _self.chatParams.fromId,
            "fromUserType" : _self.chatParams.fromUserType,
            "fromName": _self.chatParams.fromName,
            "toId": _self.chatParams.toId,
            "toUserType" : _self.chatParams.toUserType,
            "toName": _self.chatParams.toName,
            "matchType": "job",
            "matchOptionId": _self.chatParams.jobId,
            "userAvatar": "img/123.jpg",
            "updateType": [
              "pushList",
              "contractList"
            ],
            "msg": message,
            "createtime": Date.now(),
            "updatetime": Date.now(),
            "isread": 0,
            // 职位信息
            "job" : _self.need_job,
            "salaryname" : _self.job_money,
            "expname" : _self.job_year,
            "eduname" : _self.job_edu,
            "hyname" : _self.good_tip1,
            "jobname" : _self.good_tip2,
            // 公司信息
            "com_img" : "/static/images/xueyou.png",
            "com_name" : _self.com_name,
            "com_msg" : _self.com_msgarr,
            // 详细地址
            "parent_uid" : _self.chatParams.parent_uid,
            "m_id" : _self.chatParams.m_id,
            "belongid" : _self.chatParams.belongid,
            "companyid" : _self.chatParams.companyid,
            "company_uid" : _self.chatParams.company_uid,
            "company_parent_uid" : _self.chatParams.company_parent_uid,
            "provinceName" : _self.chatParams.provinceName,
            "sourceUrl" : _self.chatParams.sourceUrl,
        }
        console.log('sendMessage--', oneHistory)
        this.$socket.emit('pm', oneHistory);
        console.log('toUserOnline2--',_self.toUserOnline);

        var userId = _self.chatParams.userId;
        var fromId = _self.chatParams.fromId;
        var fromUserType = _self.chatParams.fromUserType;
        var toId   = _self.chatParams.toId;
        var jobId  = _self.chatParams.jobId;

        if (_self.toUserOnline == 0) { // 对方不在沟通页面
            this.saveChatHistoryNoreadNum(userId,fromUserType, fromId, toId, jobId);
        }

        if (_self.toUserOnline == 1) { // 对方在沟通页面
            _self.toUserOnline = 2;
            this.saveChatHistoryNoreadNum(userId,fromUserType, fromId, toId, jobId,'init');
        }

    },

    getChatHistory(){
        let _self = this;

        var data = {
            userId : _self.chatParams.userId,
            fromId : _self.chatParams.fromId,
            toId   : _self.chatParams.toId,
            jobId  : _self.chatParams.jobId,
        };

        axios({
            method: 'post',
            url: units.domain('pushJobList/getChatHistory'),
            data: data,
        }).then(function (response) {
            var result = response.data;

            if (result.code == 502) {
                alert(result.message);
            }

            if (result.code == 202) {
                alert(result.message);
            }

            if (result.code == 200) {
                _self.chatParams.chatHistoryList = result.data;
            }
        })
        .catch(function (error) {
            console.log('网络连接失败');
        });
    },

    getJobDetail(){
        let _self = this;

        var data = {
            jobId  : _self.chatParams.jobId,
        };

        axios({
            method: 'post',
            url: units.domain('jobCommon/jobDetail'),
            // data: qs.stringify(data),
            data: data,
        }).then(function (response) {
            var result = response.data;

            if (result.code == 502) {
                alert(result.message);
            }

            if (result.code == 202) {
                alert(result.message);
            }

            if (result.code == 200) {

                let jobdetial=result.data;
                _self.jobdetial=jobdetial.detial;
                _self.need_job=jobdetial.name;
                _self.job_money=jobdetial.salaryname;
                // 3个
                _self.job_place=jobdetial.provincename;
                _self.job_year=jobdetial.expname;
                _self.job_edu=jobdetial.eduname;
                _self.good_tip1=jobdetial.hyname;
                _self.good_tip2=jobdetial.jobname;
                // 公司信息
                _self.com_img="/static/images/xueyou.png";
                _self.com_name=jobdetial.com_name;
                _self.com_msgarr=jobdetial.com_msg;
                // 详细地址
                _self.comp_address=jobdetial.provincename;
            }
        })
        .catch(function (error) {
            console.log('网络连接失败');
        });
    },

    createSocketUser(){
        if (this.userId == this.chatParams.fromId) {
            var toId = this.chatParams.toId
        } else {
            var toId = this.chatParams.fromId
        }

        var createUserInfo = {
            "userId": this.userId,
            "userType" : this.userType,
            "pushToid": this.chatParams.fromId,
            "fromId": this.chatParams.fromId,
            "toId": toId,
            // "fromName":"顾猎头", // 注意：这里不能接受带汉字的参数
            "matchType": "job",
            "matchOptionId": this.chatParams.jobId
        }

        this.$socket.emit('createUser', createUserInfo);
    },

    saveChatHistoryIsread(){
        let _self = this;

        var data = {
            userId : _self.chatParams.userId,
            fromId : _self.chatParams.fromId,
            toId   : _self.chatParams.toId,
            jobId  : _self.chatParams.jobId,
        };

        axios({
            method: 'post',
            url: units.domain('pushJobList/saveChatHistoryIsread'),
            // data: qs.stringify(data),
            data: data,
        }).then(function (response) {
            var result = response.data;

            if (result.code == 502) {
                alert(result.message);
            }

            if (result.code == 202) {
                alert(result.message);
            }

            if (result.code == 200) {
                console.log('soc--',data)
                _self.$socket.emit('enterChatSaveRead', data);
            }
        })
        .catch(function (error) {
            console.log('网络连接失败');
        });
    },

    // 对方不在线时保存未读消息数量
    saveChatHistoryNoreadNum(userId,userType, fromId, toId, jobId,init='add'){
        let _self = this;

        var data = {
            userId : userId,
            userType:userType,
            fromId : fromId,
            toId   : toId,
            jobId  : jobId,
            init   : init,
            sourceUrl : _self.chatParams.sourceUrl
        };

        axios({
            method: 'post',
            url: units.domain('pushJobList/saveChatHistoryNoreadNum'),
            // data: qs.stringify(data),
            data: data,
        }).then(function (response) {
            var result = response.data;

            if (result.code == 502) {
                alert(result.message);
            }

            if (result.code == 202) {
                alert(result.message);
            }

            if (result.code == 200) {
                console.log('soc1--',data)
            }
        })
        .catch(function (error) {
            console.log('网络连接失败');
        });
    },



    initUrlParams(){
        if (units.debugConfig()) {
            var urlParams = this.$route.query;
        } else {
            var t = this.$route.query.t;
            var urlParams = units.urlParamsToArray(t);
        }

        this.chatParams.userId = urlParams.userid;
        this.chatParams.fromId = urlParams.toId;
        this.chatParams.fromUserType = urlParams.toUserType;
        this.chatParams.fromName = urlParams.toName;
        this.chatParams.toId = urlParams.fromId;
        this.chatParams.toUserType = urlParams.fromUserType;
        this.chatParams.toName = urlParams.fromName;
        this.chatParams.provinceName = urlParams.provinceName;
        this.chatParams.jobId = urlParams.jobId;
        this.chatParams.parent_uid = urlParams.parent_uid;
        this.chatParams.m_id = urlParams.m_id;
        this.chatParams.belongid = urlParams.belongid;
        this.chatParams.companyid = urlParams.companyid;
        this.chatParams.company_uid = urlParams.company_uid;
        this.chatParams.company_parent_uid = urlParams.company_parent_uid;
        this.chatParams.sourceUrl = urlParams.sourceUrl;

    },


  },

  // 創建后挂载到root之后触发
  mounted(){
      var _self = this;
      window.addEventListener("scroll", this.willscroll);
      this.createSocketUser();
      this.saveChatHistoryIsread();
      this.saveChatHistoryNoreadNum(_self.chatParams.userId,_self.chatParams.fromUserType,_self.chatParams.toId,_self.chatParams.fromId,_self.chatParams.jobId,'init');
  },

  // 该实例被创建还没挂载root之前触发
  created(){
    let _self = this;

    this.userId = Store.get('user-id');
    this.userType = Store.get('userType');
    this.initUrlParams();
    this.initApiUrl();
    this.fecthIndex();
    this.getChatHistory();
    this.getJobDetail();
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
</style>
