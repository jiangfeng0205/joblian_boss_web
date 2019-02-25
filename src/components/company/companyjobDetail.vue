<template>
  <div class="message-list" ref='box'>
    <div class="messge_bar clear "><div class="ahead">
    <router-link to="/home" class="flex_child"><span class="icon-left"></span></router-link></div>
      <div class="message_box">
          <span v-for="(nav,index) in messageNav" v-show="nav.titleShow"
           :class="{on:nav.isOn}"
           @click="toggleOn(nav,index)" :key="index">{{nav.title}}</span>
      </div>
    </div>
    <div class="message_show" v-if="companyJobDetail">
      <!-- 消息列表 -->
      <div class="meschat" v-show="messageNav[0].isOn">
          <h4 class="clear">修改职位</h4>
          <div class="chatlist">
            <ul class="code">
                <li class="clear">
                  <div>
                    <p class="clear company"><span class="name">公司信息</span><span class="name companyname"  style="float:right;margin-right:2.8%;">北京课程科技发展股份有限公司</span><span class="icon-right" style="float:right;"> </span></p>
                    <p class="clear ">
                    <div ><input type="checkbox"  class="weui-check"  v-on:click="Checkcompany(consultantcompany)" v-model="consultantcompany.state" name="checkbox" />
                          默认为猎头公司发布，单击取消</div>
                    </p>
                  </div>
                </li>
                <li class="clear">
                  <div>
                    <p class="clear">
                        <span class="name">职位名称</span>
                        <router-link :to="'/company/companyjobaddjobname/1/'+jobId">
                            <span class="name jobname"  style="float:right;margin-right: 2.8%;" v-if="companyJobSaveData.jobname">{{companyJobSaveData.jobname}}</span>
                            <span class="name jobname"  style="float:right;margin-right: 2.8%;" v-else>请填写</span>
                            <span class="icon-right " style="float:right;"> </span>
                        </router-link>
                    </p>
                  </div>
                </li>
                <li class="clear">
                    <div>
                        <p class="clear" @click.prevent="jumpUrl(1)">
                            <span class="name">职位类型</span>
                            <span class="name jobtype"  style="float:right;margin-right: 2.8%;" v-if="companyJobSaveData.jobClassTitle.length > 0">已选择</span>
                            <span class="name jobtype"  style="float:right;margin-right: 2.8%;" v-else>请选择</span>
                            <span class="icon-right " style="float:right;"> </span>
                        </p>
                    </div>
                    <div class="jobcontentFlag" v-if="companyJobSaveData.jobClassTitle.length > 0">
                        <div class="flag" v-for="item in companyJobSaveData.jobClassTitle">
                            <a class='flagContent'>{{item.name}}</a>
                        </div>
                    </div>
                </li>
                <li class="clear">
                  <div>
                    <p class="clear" @click="actionEdu"><span class="name">学历要求</span><span class="name edulevel"  style="float:right;margin-right: 2.8%;" >{{companyJobSaveData.edu.name}}</span><span class="icon-right " style="float:right;"> </span></router-link></p>
                  </div>
                </li>
                <li class="clear">
                  <div>
                    <p class="clear" @click="actionSheet"><span class="name">薪水范围</span><span class="name salaryscope"  style="float:right;margin-right: 2.8%;" >{{companyJobSaveData.salary.name}}</span><span class="icon-right " style="float:right;"> </span></p>
                  </div>
                </li>
                <li class="clear">
                    <div>
                        <p class="clear" @click.prevent="jumpUrl(2)">
                            <span class="name">工作地点</span>
                            <span class="name address"  style="float:right;margin-right: 2.8%;" v-if="companyJobSaveData.cityClassTitle.length > 0">已选择</span>
                            <span class="name address"  style="float:right;margin-right: 2.8%;" v-else>请选择</span>
                            <span class="icon-right " style="float:right;"> </span>
                        </p>
                    </div>
                    <div class="jobcontentFlag" v-if="companyJobSaveData.cityClassTitle.length > 0">
                        <div class="flag" v-for="item in companyJobSaveData.cityClassTitle">
                            <a class='flagContent'>{{item.name}}</a>
                        </div>
                    </div>
                </li>
                <li class="clear">
                  <div>
                      <router-link :to="'/company/companyjobaddjobname/2/'+jobId">
                          <p class="clear">
                              <span class="name">职位描述</span>
                              <span class="name"  style="float:right;margin-right: 2.8%;" v-if="companyJobSaveData.jobDescription">已填写</span>
                              <span class="name"  style="float:right;margin-right: 2.8%;" v-else>请填写</span>
                              <span class="icon-right " style="float:right;"> </span>
                          </p>
                      </router-link>
                  </div>
                  <div class="jobcontent" v-show="companyJobSaveData.jobDescription">{{companyJobSaveData.jobDescription}}</div>
                </li>
                <li class="clear">
                  <div>
                      <router-link :to="'/company/companyjobaddjobname/3/'+jobId">
                          <p class="clear">
                              <span class="name">职位要求</span>
                              <span class="name"  style="float:right;margin-right: 2.8%;" v-if="companyJobSaveData.jobDescription2">已填写</span>
                              <span class="name"  style="float:right;margin-right: 2.8%;" v-else>请填写</span>
                              <span class="icon-right " style="float:right;"> </span>
                          </p>
                      </router-link>
                  </div>
                  <div class="jobcontent" v-show="companyJobSaveData.jobDescription2">{{companyJobSaveData.jobDescription2}}</div>
                </li>
                <li class="clear">
                  <div class="zhangsan">
                    <p class="clear ">
                        <router-link :to="'/company/companyjobpublishmode/'+jobId">
                            <span class="name">发布方式</span>
                            <span class="name"  style="float:right;margin-right: 2.8%;" v-if="companyJobSaveData.pulishMode">已填写</span>
                            <span class="name"  style="float:right;margin-right: 2.8%;" v-else>请填写</span>
                            <span class="icon-right" style="float:right;"> </span>
                        </router-link>
                    </p>
                  </div>
                      <div class="jobcontent" v-show="companyJobSaveData.pulishMode">发布方式：{{companyJobSaveData.pulishMode.name}}</div>
                      <div class="jobcontent" v-show="companyJobSaveData.payNum">合作价值：{{companyJobSaveData.payNum}}</div>
                      <div class="jobcontent" v-show="companyJobSaveData.payMode.value != 0 && companyJobSaveData.payMode != ''">兑现方式：{{companyJobSaveData.payMode.name}}</div>
                      <br>
                      <div class="jobcontent" v-show="companyJobSaveData.consultantMode">顾问是否认证：{{companyJobSaveData.consultantMode.name}}</div>
                      <div class="jobcontent" v-show="companyJobSaveData.tuijian">顾问推荐：{{companyJobSaveData.tuijian}}</div>
                </li>
            </ul>
          </div>
      </div>
      <mt-actionsheet
        :actions= "data"
        v-model="sheetVisible">
       </mt-actionsheet>
       <mt-actionsheet
        :actions= "edulevel"
        v-model="sheetVisible2">
       </mt-actionsheet>
       <mt-actionsheet
        :actions= "jobType"
        v-model="sheetVisible3">
       </mt-actionsheet>
      <div class="will_chat" v-if="saveButtonShow">
          <a class="flex_child" @click.prevent="saveCompanyJob()"><span >保存</span></a>
      </div>
      <!-- 预览列表 -->
      <div class="info_list" v-show="messageNav[1].isOn">
        <div class="job_detial">
          <!---->
          <div class="top_detial_bg">
            <div class="top_detial">

              <h3>{{companyJobSaveData.jobname}}
                  <span v-if="companyJobSaveData.payNum && companyJobSaveData.pulishMode.value==2">【{{companyJobSaveData.payNum}}】</span>
                  <span v-else>【{{companyJobSaveData.salary.name}}】</span>
                  <span class="wxshare" @click="sendWxshare()">分享</span>
              </h3>
              <p>
                <span><i class="icon-position"></i><span v-for="provice in companyJobSaveData.cityClassTitle">{{provice.name}} </span></span>
                <span><i class="icon-seniority"></i>{{companyJobSaveData.salary.name}}</span>
                <span><i class="icon-education"></i>{{companyJobSaveData.edu.name}}</span>
              </p>
              <!-- <ul class="goos_tips">
                <li >顾问推荐：软件工程师</li>
              </ul> -->
              <div class="comp_info">
                <div class="comp_img">
                  <img src="/static/images/company2.jpg">
                </div>
                <div class="comp_msg">
                  <h3>联想集团科技股份有限公司</h3>
                  <p><span >50人</span></p>
                </div>
                <div class="comp_icon">
                  <i class="icon-right"></i>
                </div>
              </div>
              <div class="comp_detial_place">
                <p><span>北京市海淀区</span>*软件路38号</p>
                <i class="icon-position"></i>
              </div>
            </div>
          </div>
          <!--职位详情-->
          <div class="top_detial_bg">
            <h3><i class="iconfont icon-jianli"></i><span>职位详情</span></h3>
            <div class="job_repon">
              <p >{{companyJobSaveData.jobDescription.substring(0,80)}}</p>
            </div>
            <div class="job_require" v-show="isMore">
              <p >{{companyJobSaveData.jobDescription.substring(80,companyJobSaveData.jobDescription.length)}}</p>
            </div>
            <div class="toggle_more">
              <p v-if="isMore" class="toggle-up"><i class="icon-top" @click="toggleMore"></i></p>
              <p v-else class="toggle-down"><i class="icon-down" @click="toggleMore"></i></p>
            </div>
          </div>
          <!--技能要求-->
          <div class="top_detial_bg">
            <h3><i class="iconfont icon-liwuhe"></i><span>岗位要求</span></h3>
            <ul class="skills">
                <li >{{companyJobSaveData.jobDescription2}}</li>
            </ul>
          </div>
          <!--合作信息-->
          <div class="top_detial_bg" >
            <h3><i class="icon-me"></i><span>合作信息</span></h3>
            <div class="team"><p class="team-info">
                  <div class="jobcontent" v-show="companyJobSaveData.pulishMode">发布方式：{{companyJobSaveData.pulishMode.name}}</div>
                      <div class="jobcontent" v-show="companyJobSaveData.payNum">合作价值：{{companyJobSaveData.payNum}}</div>
                      <div class="jobcontent" v-show="companyJobSaveData.payMode.value != 0 && companyJobSaveData.payMode != ''">兑现方式：{{companyJobSaveData.payMode.name}}</div>
                      <div class="jobcontent" v-show="companyJobSaveData.consultantMode">顾问是否认证：{{companyJobSaveData.consultantMode.name}}</div>
                      <!-- <div class="jobcontent" v-show="companyJobSaveData.tuijian">顾问推荐：{{companyJobSaveData.tuijian}}</div> -->
               </p></div>

          </div>
          <!--顾问推荐意见-->
          <div class="top_detial_bg compare">
            <h3><i class="iconfont icon-gongsi"></i><span>顾问的推荐意见</span><b>查看完整数据 <i class="icon-right"></i></b></h3>
            <p id="tuijian">{{companyJobSaveData.tuijian}}</p>
              <!-- <p>目前共有<span>***</span>个牛人沟通过该职位,您是第<span>***</span>个</p>
              <p>您在当前竞聘者中综合竞争力排名第<span>***</span>名。</p> -->
          </div>

          <!--温馨提示-->
          <div class="top_detial_bg good_tips">
            <h3><i class="icon-message"></i><span>温馨提示</span></h3>
            <p>该顾问承诺名下所有职位不向您收取费用，如有不实，请立即举报。</p>
          </div>
            <!--立即发布-->
          <div class="will_chat" v-if="chatButtonShow">
              <a class="flex_child" @click="clickShare()" ><span>沟通</span></a>
          </div>
        </div>
      </div>
    </div>

    <div class="zhezhao" v-show="isZhezhao">
        <!-- 微信内分享 -->
        <div class="share_help" v-if="shareType == 'wx'">
            <img alt="Scan me!" style="margin-top:-0.4rem;width:62%;"  src="/static/images/wxshare_help.png">
        </div>
        <div class="share_help" v-if="shareType == 'wx'">
            <img alt="Scan me!" style="margin-top:2%;margin-right:3%;width:50%"  src="/static/images/share_known.png" @click="closeZhezhao()">
        </div>
    </div>

    <!-- 浏览器分享 -->
    <div class="zhezhao_modal" v-show="isZhezhao">
        <div class="share_title" v-if="shareType == 'browser'">请扫描二维码分享</div>
        <div id="qrcode" v-if="shareType == 'browser'"></div>
        <div class="mint-msgbox-btns" v-if="shareType == 'browser'"><button class="mint-msgbox-btn mint-msgbox-confirm " @click="closeZhezhao()">确定</button></div>

    </div>
  </div>

</template>


<script >
import WeixinApi from "../../js/WeixinApi";
import Store from "../../js/userstore";
import units from '../../js/units';
import axios from "axios";
import wx from 'weixin-js-sdk';
import QRCode from 'qrcodejs2';
import { Toast } from 'mint-ui';
import { mapState,mapGetters,mapMutations } from 'vuex';

export default {
  name: 'companyjobDetail',
  sockets : {

  },

  data () {
    return {
      apiUrl:"",
      isMore:false,
      boss_img:'/static/images/header.png',
      messageNav:[
        {title:'编辑',isOn:false,titleShow:false},
        {title:'预览',isOn:true,titleShow:true}
      ],
      chatButtonShow : false,
      saveButtonShow : true,
      consultantcompany:[],
      // 1、消息数据
      meschatData:{},
      selectedName:'请选择',
      // 2、互动切换
      listBar:[
        {
          title:"对我感兴趣",
          isHad:true
        },
        {
          title:"看过我",
          isHad:false
        },
        {
          title:"新职位",
          isHad:false
        }
      ],
      tempIndex:0,
      //4.0 总数据
      interactData:[],
      //4.1 要渲染的指定的互动数据
      lists:[],
      data: [{
        name: '5000以下',
        method : this.setJobSalary1
      }, {
        name: '5000-8000',
        method : this.setJobSalary2
      }],
      // action sheet 默认不显示，为false。操作sheetVisible可以控制显示与隐藏
      sheetVisible: false,
      edulevel: [
          {
            name: '本科',
            method : this.setJobEdu1
          },
          {
            name: '硕士',
            method : this.setJobEdu2
          },
          {
            name: '博士',
            method : this.setJobEdu3
          }
      ],
      jobType: [
          {
            name: '全职',
            method : this.setJobType1
          },
          {
            name: '兼职',
            method : this.setJobType2
          },
      ],
      // action sheet 默认不显示，为false。操作sheetVisible可以控制显示与隐藏
      sheetVisible2: false,
      sheetVisible3: false,
      companyJobSaveData:{
          jobname         : '',
          edu             : {id:0, name:'请选择'},
          salary          : {id:0, name:'请选择'},
          jobType         : {id:0, name:'请选择'},
          jobDescription  : '',
          jobDescription2 : '',
          pulishMode      : '',
          payMode         : '',
          consultantMode  : '',
          tuijian         : '',
          payNum          : '',
          jobClassTitle       : [],
          cityClassTitle      : [],
      },

      localCompanyJobSaveData:{},
      jotId : 0,
      companyJobDetail : {},
      isZhezhao : false,
      shareType : 'browser',

    }
  },
  methods:{
    ...mapMutations({
        clearClass  : 'clearClass',
    }),

    jobBelong(companyJobDetail){
        var userId   = Store.get('user-id');
        var userType = Store.get('userType');
        var userName = Store.get('userName');

        if (companyJobDetail.userId == userId && companyJobDetail.userType == userType) {
            this.messageNav = [
                {title:'编辑',isOn:false,titleShow:true},
                {title:'预览',isOn:true,titleShow:true}
            ];
        } else {
            this.chatButtonShow = true;
            this.saveButtonShow = false;
            this.messageNav = [
                {title:'编辑',isOn:false,titleShow:false},
                {title:'职位详情',isOn:true,titleShow:true}
            ];
        }
    },

    getCompanyJobSaveData(){
        var companyJobSaveData = Store.get('companyJobSaveData'+this.jobId,1);
        var jobClassTitle      = Store.get('jobClassTitle',1);
        var cityClassTitle     = Store.get('cityClassTitle',1);

        if (jobClassTitle) {
            var jobClassTitle = JSON.parse(jobClassTitle);
            this.companyJobSaveData.jobClassTitle = jobClassTitle;
        }

        if (cityClassTitle) {
            var cityClassTitle = JSON.parse(cityClassTitle);
            this.companyJobSaveData.cityClassTitle = cityClassTitle;
        }

        if (companyJobSaveData) {
            var companyJobSaveData = JSON.parse(companyJobSaveData);
            this.localCompanyJobSaveData = companyJobSaveData;
            if(companyJobSaveData.jobname){
                this.companyJobSaveData.jobname = companyJobSaveData.jobname;
            }
            if (companyJobSaveData.edu) {
                this.companyJobSaveData.edu = companyJobSaveData.edu;
            }
            if (companyJobSaveData.salary) {
                this.companyJobSaveData.salary = companyJobSaveData.salary;
            }
            if (companyJobSaveData.jobDescription) {
                this.companyJobSaveData.jobDescription = companyJobSaveData.jobDescription;
            }
            if (companyJobSaveData.jobDescription2) {
                this.companyJobSaveData.jobDescription2 = companyJobSaveData.jobDescription2;
            }
            if (companyJobSaveData.jobType) {
                this.companyJobSaveData.jobType = companyJobSaveData.jobType;
            }
            if (companyJobSaveData.pulishMode) {
                this.companyJobSaveData.pulishMode = companyJobSaveData.pulishMode;
            }
            if (companyJobSaveData.payMode) {
                this.companyJobSaveData.payMode = companyJobSaveData.payMode;
            }
            if (companyJobSaveData.consultantMode) {
                this.companyJobSaveData.consultantMode = companyJobSaveData.consultantMode;
            }
            if (companyJobSaveData.payNum) {
                this.companyJobSaveData.payNum = companyJobSaveData.payNum;
            }
            if (companyJobSaveData.tuijian) {
                this.companyJobSaveData.tuijian = companyJobSaveData.tuijian;
            }
        }
    },

    getCompanyJobDetail () {
        let _self = this;

        var data = {
            jobId : this.jobId,
        };

        axios({
            method: 'post',
            url: units.domain('pushJobList/getCompanyJobDetail'),
            data: data,
        }).then(function (response) {
            var result = response.data;

            if (result.code == 402) {
                alert(result.message);
                _self.companyJobDetail = false;
            }

            if (result.code == 200) {
                var companyJobSaveData = Store.get('companyJobSaveData'+_self.jobId,1);
                var jobClassTitle      = Store.get('jobClassTitle',1);
                var cityClassTitle     = Store.get('cityClassTitle',1);

                _self.companyJobDetail = result.data;
                _self.companyJobSaveData = result.data;
                _self.jobBelong(_self.companyJobDetail);
                if (companyJobSaveData) {
                    _self.companyJobSaveData = JSON.parse(companyJobSaveData);;

                    if (jobClassTitle) {
                        var jobClassTitle = JSON.parse(jobClassTitle);
                        _self.companyJobSaveData.jobClassTitle = jobClassTitle;
                    }

                    if (cityClassTitle) {
                        var cityClassTitle = JSON.parse(cityClassTitle);
                        _self.companyJobSaveData.cityClassTitle = cityClassTitle;
                    }
                } else {
                    _self.companyJobSaveData = result.data;
                    Store.doSave('companyJobSaveData' + _self.jobId, JSON.stringify(result.data), 1);
                }

                console.log(_self.companyJobSaveData)
            }
        })
        .catch(function (error) {
            // this.loading = false;
            console.log('网络连接失败');
            _self.companyJobDetail = false;
        });
    },

    // 3、消息和互动的切换
    toggleOn(nav,index){
      if(!nav.isOn){
        this.messageNav.filter( item=>{
          item.isOn=false;
        });
        nav.isOn=true;
      }
    },
    toggleTab(item,index){
      //4.4
      this.lists=this.interactData[index];
      // console.log(index);
      if(!item.isHad){
        this.listBar.filter( value=>{
          value.isHad=false;
        });
        item.isHad=true;
      }
    },
    //4、确定以猎头公司名义发布
    Checkcompany:function(consultantcompany){
            consultantcompany.state = !companyjobadd.state;
            console.log(this.consultantcompany);
        },
    actionSheet: function(){
      // 打开action sheet
      this.sheetVisible = true;
    },

    actionEdu: function(){
      // 打开action sheet
      this.sheetVisible2 = true;
    },

    actionType(){
        this.sheetVisible3 = true;
    },

    setJobEdu1: function(){
        var selectEdu = {id:1,name:'本科'};
        this.saveJobEdu(selectEdu);

    },
    setJobEdu2: function(){
        var selectEdu = {id:2,name:'硕士'};
        this.saveJobEdu(selectEdu);
    },
    setJobEdu3: function(){
        var selectEdu = {id:3,name:'博士'};
        this.saveJobEdu(selectEdu);
    },
    setJobSalary1(){
        var selectSalary = {id:1,name:'5000以下'};
        this.saveJobSalary(selectSalary);
    },
    setJobSalary2(){
        var selectSalary = {id:1,name:'5000-8000'};
        this.saveJobSalary(selectSalary);
    },
    setJobSalary3(){
        var selectSalary = {id:1,name:'8000-12000'};
        this.saveJobSalary(selectSalary);
    },
    setJobType1(){
        var selectJobType = {id:1,name:'全职'};
        this.saveJobType(selectJobType);
    },
    setJobType2(){
        var selectJobType = {id:2,name:'兼职'};
        this.saveJobType(selectJobType);
    },
    getLibrary: function(){
      console.log("打开相册")
    },
    getLibrary2: function(){
      console.log("打开相册2")
    },
    toggleMore(){
      this.isMore=!this.isMore;
    },
    toggleSelect(){
      this.isSelected=!this.isSelected;
    },
    saveJobEdu(value){
        this.companyJobSaveData.edu = value;
        this.localCompanyJobSaveData.edu = value;
        Store.doSave('companyJobSaveData'+this.jobId, JSON.stringify(this.localCompanyJobSaveData), 1);
    },
    saveJobSalary(value){
        this.companyJobSaveData.salary = value;
        this.localCompanyJobSaveData.salary = value;
        Store.doSave('companyJobSaveData'+this.jobId, JSON.stringify(this.localCompanyJobSaveData), 1);
    },
    saveJobType(value){
        this.companyJobSaveData.jobType = value;
        this.localCompanyJobSaveData.jobType = value;
        Store.doSave('companyJobSaveData'+this.jobId, JSON.stringify(this.localCompanyJobSaveData), 1);
    },
    jumpUrl(index) {
        this.clearClass({name:[]}); // 清空vuex的导航状态

        if (index == 1) {
            this.$router.push({'path':'/company/companyJobHy?jobId='+this.companyJobDetail.companyJobId});
        }
        if (index == 2) {
            this.$router.push({'path':'/company/companyJobCity?jobId='+this.companyJobDetail.companyJobId});
        }
    },

    clickShare(){
        console.log('nihao')
    },

    shareCompanyJob(){
        let _self = this;
        // var url = 'http://dd.feixingshenqi.com/company/companyjobDetail/' + this.jobId;
        var url = location.href;

        axios({
            method: 'post',
            // url: units.domain('wxApi/getWxSigin'),
            url: units.domain('wxApi/getWxConfig'),
            data: {url:url},
        }).then(function (response) {
            var wxConfig = response.data;
            console.log('wxConfig22--',wxConfig.data);
            wx.config({
                debug     : true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId     : wxConfig.data.appId, // 必填，公众号的唯一标识
                timestamp : wxConfig.data.timestamp, // 必填，生成签名的时间戳
                nonceStr  : wxConfig.data.nonceStr, // 必填，生成签名的随机串
                signature : wxConfig.data.signature,// 必填，签名
                jsApiList : [ // 必填，需要使用的JS接口列表
                    'onMenuShareAppMessage',
                    'onMenuShareTimeline'
                ]
            });

            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            wx.ready(function(){
                wx.onMenuShareAppMessage({
                    title: _self.companyJobSaveData.jobname, // 分享标题
                    desc: _self.companyJobSaveData.tuijian, // 分享描述
                    link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: 'http://weixin.joblian.cn/heiwuchang.jpg', // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户点击了分享后执行的回调函数
                        console.log('share');
                        var shareData = _self.companyJobDetail;
                        var userId   = Store.get('user-id');
                        var userType = Store.get('userType');
                        var userName = Store.get('userName');

                        if (userId && userType) {
                            shareData.shareUserId   = userId;
                            shareData.shareUserType = userType;
                            shareData.shareUserName = userName;

                            axios({
                                method : 'post',
                                url    : units.domain('pushJobList/saveWeixinShareJob'),
                                data   : shareData ,
                            }).then(function(response) {
                                console.log('share success');
                            }).catch(function (error) {
                                console.log('save share error');
                            });
                        }
                    }
                });

                wx.onMenuShareTimeline({
                    title: _self.companyJobSaveData.jobname, // 分享标题
                    link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: 'http://weixin.joblian.cn/heiwuchang.jpg', // 分享图标
                    success: function () {
                        // 设置成功
                        console.log('onMenuShareTimeline');
                    }
                });
            });

        })
        .catch(function (error) {
            alert('网络连接失败');
        });
    },

    getAccessToken(){
        axios({
            method: 'get',
            url: units.domain('wxApi/getAccessToken'),
            data: {jobId:this.jobId},
        }).then(function (response) {
            var wxConfig = response.data;
        })
        .catch(function (error) {
            alert('网络连接失败');
        });
    },

    getJsapiTicket(){
        axios({
            method: 'get',
            url: units.domain('wxApi/getJsapiTicket'),
            data: {jobId:this.jobId},
        }).then(function (response) {
            var wxConfig = response.data;
        })
        .catch(function (error) {
            alert('网络连接失败');
        });
    },

    saveCompanyJob(){
        var companyJobSaveData = this.companyJobSaveData;

        var validataResult = this.saveCompanyJobValidata(companyJobSaveData);

        if (validataResult) {
            let _self = this;
            validataResult.html = _self.$refs.box.innerHTML;

            axios({
                method: 'post',
                url: units.domain('pushJobList/saveCompanyJob'),
                data: validataResult,
            }).then(function (response) {
                var result = response.data;

                if (result.code == 402) {
                    alert(result.message);
                }

                if (result.code == 200) {
                    Store.delete('companyJobSaveData'+_self.jobId, 1);
                    Store.delete('jobClassTitle', 1);
                    Store.delete('cityClassTitle', 1);
                    alert(result.message);

                    setTimeout(function(){
                        _self.$router.push({'path':'/company'});
                    }, 2000);
                }
            })
            .catch(function (error) {
                alert('网络连接失败');
            });
        }

    },

    saveCompanyJobValidata(validata){
        var userId   = Store.get('user-id');
        var userType = Store.get('userType');
        var userName = Store.get('userName');

        if (!userId || !userType) {
            alert('您还没有登录，请先登录');

            setTimeout(function() {
                this.$router.push({'path':'/login'});
            }, 2000);
        }

        if (!validata.jobname){
            alert('职位名称不能为空');
            return false;
        }

        if (validata.jobClassTitle.length == 0){
            alert('职位类型不能为空');
            return false;
        }

        if (validata.edu.id == 0){
            alert('学历要求不能为空');
            return false;
        }

        if (validata.salary.id == 0){
            alert('薪水范围不能为空');
            return false;
        }

        if (validata.cityClassTitle.length == 0){
            alert('工作地点不能为空');
            return false;
        }

        if (!validata.jobDescription){
            alert('职位描述不能为空');
            return false;
        }

        if (!validata.jobDescription2){
            alert('职位要求不能为空');
            return false;
        }

        if (!validata.pulishMode){
            alert('发布方式不能为空');
            return false;
        }

        validata.userId = userId;
        validata.userType = userType;
        validata.userName = userName;
        validata.updateTime = Date.now();

        // return false;
        return validata;

    },

    browserType(){
        var ua = navigator.userAgent.toLowerCase();
        var isWeixin = ua.indexOf('micromessenger') != -1;
        if (isWeixin) {
            this.shareType = 'wx';
        } else {
            this.shareType = 'browser';
        }
    },

    qrcode() {
        document.getElementById('qrcode').innerHTML = '';

        let qrcode = new QRCode('qrcode', {
            width: 132,
            height: 132,
            text: location.href, // 二维码地址
            // text: 'http://weixin.joblian.cn/company/companyjobDetail/2', // 二维码地址
            colorDark : "#000",
            colorLight : "#fff",
        });

    },

    sendWxshare(){
        this.isZhezhao = true;

        if (this.shareType == 'browser') {
            this.qrcode();
        }
    },

    closeZhezhao(){
        this.isZhezhao = false;
    },

  },
  // 創建后挂载到root之后调用该钩子函数
  mounted(){
    console.log('获取html--', this);

  },
  // 该实例被创建还没挂载root之前，ajax可以在这里
  created(){
      console.log('location.href--',location.href);
      this.browserType();
      Store.saveLoginJump('/company/companyJobDetail/' + this.$route.params.jobId);
      if (units.debugConfig()) {
          this.jobId = units.decrypt(this.$route.params.jobId);
      } else {
          this.jobId = this.$route.params.jobId;
      }

      this.getCompanyJobDetail();
      this.getCompanyJobSaveData();
      // this.getAccessToken();
      // this.getJsapiTicket();
      this.shareCompanyJob();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.meschat{
    span:last-child {
      position: absolute;
      right: -0.185185rem;
      top: 0.352962rem;
    }
    .company{
      span:last-child {
              position: absolute;
              right: -0.185185rem;
              top: 0.352962rem;
            }
    }
    .zhangsan{
      span:last-child {
              position: absolute;
              right: -0.185185rem;
              top: 0.352962rem;
            }
    }
    .weui-check{
       width: 0.42rem;
       height: 0.42rem;
       overflow: hidden;
       background: #fff;
       -webkit-appearance: none;
       border: 1px solid #808080;
       outline: none;
       margin-left: 25px;
       margin-top: 10px;
    }
}
.page-button-group{
       float:right;

     }
.ahead{
    position: absolute;
    font-size: 0.8rem;
    color: #fff;
    left: -0.2rem;
    top: 50%;
    transform: translateY(-50%);
}
.jobcontent{
  font-size: 0.221rem;
  margin-top:30px;
  margin-left:70px;
  color: #5c5c5c;
}
.jobcontentFlag{
  font-size: 0.221rem;
  margin-top:10px;
  margin-left:10px;
  color: #5c5c5c;
}
.message_show>>>.mint-actionsheet-listitem{
height: 65px;
line-height: 66px;
font-size: 1.2em;
}
.message_show>>>.mint-actionsheet-button{
height: 65px;
line-height: 66px;
font-size: 1.2em;
}
.info_list>>>.job_detial{
padding-top: 0rem!important;
}
#tuijian{
  height:auto;
}
.flag{
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
      // border:1px solid red;
      // border-radius:60%;
    }
}
.wxshare{
    float: right;
    color: royalblue !important;
}
.zhezhao_modal{
    position: fixed;
    top: 50%;
    left: 50%;
    -webkit-transform: translate3d(-50%, -50%, 0);
    transform: translate3d(-50%, -50%, 0);
    background-color: #fff;
    width: 85%;
    border-radius: 3px;
    font-size: 16px;
    -webkit-user-select: none;
    overflow: hidden;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transition: .2s;
    transition: .2s;
    display:table-cell;
    text-align:center;
    vertical-align:middle;
    z-index:200;
}

.share_title{
    text-align: center;
    padding-bottom:0.5rem;
    margin-top: 0.5rem;
    font-size: 16px;
    font-weight: 700;
    color: #333;
}

#qrcode {
    display: inline-block;
    img {
      width: 132px;
      height: 132px;
      background-color: #fff; //设置白色背景色
      padding: 6px; // 利用padding的特性，挤出白边
    }
}

.share_help{
    text-align:right;
}

.zhezhao{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: #000;
    z-index:100;
}

</style>
