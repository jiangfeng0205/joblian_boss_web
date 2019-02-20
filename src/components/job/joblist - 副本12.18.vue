<template>
    <div id="main">
        <!--固定的顶部-->
        <div class="main_fixed_top">
            <div class="job_header clear">
                <div class="job_header_left">
                    <span>joblian 职位推荐</span>
                </div>
                <div class="inforight job_header_icon">
                    <span><i class="iconfont icon-jiahao"></i></span>
                    <b></b>
                    <span><i class="iconfont icon-sousuo"></i></span>
                </div>
            </div>
            <div class="job_nav">
                <ul class="flex_parent">
                    <li class="flex_child" v-for="(nav,index) in navlist"
                     :class="{ selected: nav.isSelected }"
                     @click="changeColor(nav,index)" :key="index">
                     {{nav.title}}<span class="icon-down"></span>
                    </li>
                </ul>
                <keep-alive>
                    <slideTabComp v-show="navlist[0].isSelected" @toParent="fromChild" @hide="hide" v-if="slideIndex==0" :slideTemp="slideTemp"></slideTabComp>
                    <selectCityComp v-show="navlist[1].isSelected" @hide="hide" v-else-if="slideIndex==1"></selectCityComp>
                    <compRequireComp v-show="navlist[2].isSelected" @hide="hide" v-else-if="slideIndex==2" :indexArr="indexArr[0]" :slideTemp="slideTemp"></compRequireComp>
                    <compRequireComp v-show="navlist[3].isSelected" @hide="hide" else="slideIndex==3" :indexArr="indexArr[1]" :slideTemp="slideTemp"></compRequireComp>
                </keep-alive>
            </div>
        </div>
        <!--列表-->
        <div class="job_content" id="jobcontent" ref="wrapper">
            <ul class="page-infinite-list job_lists" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="50">
                <li v-for="(job,index) in jobs" :key="index" @click="hrefs(job.id,job.fromId,job.toId,job.company_parent_uid,job.company_uid,job.companyid,job.m_id,job.parent_uid)">
                    <!-- <router-link v-if="job"  :to="{ name: 'chat', params: { jobId: job.id}}"> -->
                    <a v-if="job" >
                        <h4 class="clear">{{job.name}}<span class="inforight">{{job.salary}}</span>
                        </h4>
                        <p class="clear"><span></span>{{job.company}}</p>
                        <p class="clear">
                            <span class="icon-position"></span><span>{{job.provinceName}}</span>
                            <span class="icon-seniority"></span><span>{{job.exp}}</span>
                            <span class="icon-education"></span><span>{{job.edu}}</span>
                        </p>
                        <p class="clear title">
                            <!-- <img :src="job.src" alt="" class="infoleft"> -->
                            <img src="/static/images/xueyou.png" alt="" class="infoleft">
                            <span class="infoleft">{{job.fromName}}</span>
                            <!-- <span class="infoleft">{{job.toName}}</span> -->
                        </p>
                    </a>
                    <!-- </router-link> -->
                </li>
            </ul>
            <div v-show="loading" class="page-infinite-loading">
                <mt-spinner type="fading-circle"></mt-spinner>{{loadInit}}
            </div>
        </div>
        <!--返回顶部-->
        <!-- <img v-show="willshow" @click="gotop" src="/static/images/backTop.png" class="backTop" alt=""> -->
    </div>
</template>

<script>
    /*
    * 注=> : somename 向子组件传递数据
    *      @ some 接收子组件传递过来的自定义事件
    *说明：1、keep-alive子组件里的v-show为了点击自己切换自己下组件的显示和隐藏，v-if-else 是为了切换4个切换按钮 对应子组件的显示和隐藏
    * 2、组件内的 slideTemp是传到子组件的 数组数据(切换回变化)，selectCityComp内数据太多没向子组件传递
    * 3、@toParent是子组件传递给父组件的数据的自定义方法,在父组件自定义为：fromChild 方法
    * 4、@hide 子组件传递过来的自定义事件,在父组件自定义为：hide 方法
    * v-show只是单纯的切换css属性display的none和block，v-if 会移除和新建DO树！
    * 5、:indexArr 为了传递到子组件记录是否选中的状态
    *
    *
    *
    *
    **/
    // 推荐子组件
    import slideTabComp from './slideTabComp.vue'
    // 城市选择组件
    import selectCityComp from './selectCityComp.vue'
    // 公司和要求公用一个子组件
    import compRequireComp from './compRequireComp.vue'

    import Store from "../../js/userstore"
    import units from '../../js/units'
    import axios from "axios"
    import qs from "qs"

    export default {
        name: "sinian",
        sockets: {
            //不能改,建立连接自动调用connect
            connect() {
                //与socket.io连接后回调
                // console.log("socket connected--",this.$socket.id);
                // var createUserInfo = {
                //     "userId": 1,
                //     "pushToid": 2,
                //     "fromId": 1,
                //     // "fromName":"顾猎头",
                //     "toId": 2,
                //     "matchType": "job",
                //     "matchOptionId": 22
                // }

                // console.log('userInfo----', createUserInfo);
                // this.$socket.emit('createUser', createUserInfo);
            },

            pushNewJob (value) {
                console.log('pushJoc--',value)
                var job = {
                    "id": value.matchOptionId,
                    "name": value.name,
                    "company": value.company,
                    "provinceName": value.provinceName,
                    "salary": value.salary,
                    "fromName": value.fromName,
                    "title": "CTO",
                    "src": "/static/images/xueyou.png",
                    "exp": value.exp,
                    "edu": value.edu,
                    "fromId": value.fromId,
                    "userId": this.userId,
                    "fromName": value.fromName,
                    "toId": value.toId,
                    "toName": value.toName,
                    "matchType": "job",
                    "matchOptionId": value.matchOptionId,
                    "parent_uid": value.parent_uid,
                    "m_id": value.m_id,
                    "belongid": value.belongid,
                    "companyid": value.companyid,
                    "company_uid": value.company_uid,
                    "company_parent_uid": value.company_parent_uid,
                }

                this.jobs.unshift(job);

                // this.addPushListByJob(this.userId, job, value.time);
            },
        },

        updated(){
            // console.log('clientId--',this.$socket.id);
        },

        data () {
            return {
                navlist:[
                    {
                        title:"顾问",
                        isSelected:false,
                    },
                    {
                        title:"地域",
                        isSelected:false,
                    },
                    {
                        title:"行业",
                        isSelected:false,
                    },
                    {
                        title:"要求",
                        isSelected:false,
                    }
                ],
                slideIndex:"",
                isShowSlide:false,
                slideTemp:[],
                // 传递到 公司和 要求子组件 记录是否选中的状态
                indexArr:[[[0],[0],[0]],[[0],[0],[0]]],
                slideData:[
                    [
                        {
                            "name":"推荐",
                            "hadSelested":true
                        },
                        {
                            "name":"最新",
                            "hadSelested":false
                        }
                    ],
                    // 城市选择这项数据太多没用父子通信传递数据
                    [0,1],
                    [
                        {
                            title:"融资规模",
                            isCheckbox:true,
                            list:["全部","未融资","天使轮","A轮","B轮","C轮","D轮及以上","已上市","不需要融资"]
                        },
                        {
                            title:"团队规模",
                            isCheckbox:true,
                            list:["全部","0-20人","20-99人","100-499人","500-999人","1000-9999人","10000人以上"]
                        },
                        {
                            title:"行业",
                            isCheckbox:true,
                            list:["全部","非互联网行业","健康医疗","生活服务","旅游","金融","信息安全","广告营销","数据服务","智能硬件","文化娱乐","网络招聘",
                                "分类信息","电子商务","移动互联网","企业服务","社交网络","教育培训","O2O","游戏","互联网","媒体","IT软件"]
                        }
                    ],
                    [
                        {
                            title:"最低学历",
                            isCheckbox:true,
                            list:["全部","中专及以下","高中","大专","本科","硕士","博士"]
                        },
                        {
                            title:"经验",
                            isCheckbox:true,
                            list:["全部","应届生","1年以内","1-3年","3-5年","5-10年","10年以上"]
                        },
                        {
                            title:"薪资(单选)",
                            isCheckbox:false,
                            list:["全部","3k以下","3k-5k","5k-10k","10k-20k","20k-50k","50k以上"]
                        },
                    ]
                ],
                willshow: false,
                timer: null,
                mainscroll: null,
                apiUrl: "",
                jobs: [],
                jobPage:{
                    'page':1,
                    'limit':5,
                },
                temp:[],
                userId:'',
                jobId:"",
                loading: false,
                loadInit:'加载中......',
                allLoaded: false,
                wrapperHeight: 0,
                // socketIo:io.connect('http://localhost:3333/'),
            }
        },
        components:{
            slideTabComp,selectCityComp,compRequireComp
        },
        computed: {},
        methods: {
            // sub(){
            //     this.socketIo.on('vue',function(objData){
            //         console.log('dashabi--',obkData);
            //     }),
            // },
            // 3、接收子传来的选项
            fromChild(msg){
                this.navlist[0].title=msg;
                // console.log(msg);
            },
            ///4、接收子传来的是否隐藏
            hide(){
                // this.isShowSlide=false;
                this.navlist.filter(value =>{
                    value.isSelected=false;
                });
            },
            // 5、切换的时候动态改变要传递到子组件的数据：this.slideTemp
            changeColor(nav,index){
                let _this=this;
                this.slideIndex=index;
                this.slideTemp=this.slideData[index];
                if(nav.isSelected){
                    nav.isSelected=false;
                }else{
                    // 先清空所有选中效果
                    this.navlist.filter(value =>{
                        value.isSelected=false;
                    });
                    // 设置当前选中效果
                    nav.isSelected=true;
                }
                // console.log(this.slideIndex);
            },
            willscroll(){
                //2.1 使用定时器，防止频繁滚动
                if (window.scrollTime) {
                    window.clearTimeout(window.scrollTime);
                }
                //2.2 定时器
                window.scrollTime = window.setTimeout(() => {
                    const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                    this.willshow = (scrollTop > 300) ? true : false;
                    // console.log("滚动了");
                }, 100);
            },
            //3 返回顶部
            gotop(){
                this.willshow = !this.willshow;
                let d = document.documentElement;
                let b = document.body;
                // console.log(this.timer,d,b);
                this.timer = window.setInterval(() => {
                    d.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
                    b.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
                    //到达顶部清除定时器，重新绑定滚动事件
                    if ((d.scrollTop + b.scrollTop) === 0) clearInterval(this.timer, window.onscroll = this.willscroll);
                }, 10);
            },
            loadData(){
                let _this=this;
                this.$http.get(_this.apiUrl)
                    .then(response => {
                        if(response.data.code=="0"){
                            _this.jobs=response.data.main;
                            // 模擬每次下拉加載的10條假數據
                            _this.temp=response.data.main;
                            // console.log(response.data);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                });
            },
            hrefs(id,fromId,toId,company_parent_uid,company_uid,companyid,m_id,parent_uid){
                // window.location.href = "/chat/" + id;
                var debug = units.debugConfig();
                if (debug) {
                    this.$router.push({
                        'path' : '/chat',
                        'query' : {
                            'jobId' : id,
                            'userid' : toId,
                            'fromId' : fromId,
                            'toId' : toId,
                            'company_parent_uid' : company_parent_uid,
                            'company_uid' : company_uid,
                            'companyid' : companyid,
                            'm_id' : m_id,
                            'parent_uid' : parent_uid,
                        }
                    })
                } else {
                    console.log('加密解密算法');
                    var secretUrl = units.encrypt('jobId='+id+'&userid='+toId+'&fromId='+fromId+'&toId='+toId+'&company_parent_uid='+company_parent_uid+'&company_uid='+company_uid+'&companyid='+companyid+'&m_id='+m_id+'&parent_uid='+parent_uid+'');

                    window.location.href = '/chat?t=' + secretUrl;
                }

            },
            // 模擬無限下拉加載
            loadMore() {
                this.loading = true;

                setTimeout(() => {
                    this.jobPage.page++;
                    var page = this.jobPage.page;
                    var limit = this.jobPage.limit;
                    var endNum = page * limit;
                    var begianNum = endNum - limit + 1;

                    this.getPushListByJob(this.userId, begianNum,endNum,'loadmore');
                    if (this.temp == null ) {
                        this.loadInit = '没有更多';
                        return;
                    }

                    this.jobs=this.jobs.concat(this.temp);
                    this.loading = false;
                    // console.log(this.jobs);
                }, 500);
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
            // 4.1、阻止局部滚动到达边界后会造成页面继续滚动(不合适)
            stopScroll(){
                let container=document.getElementById("jobcontent");
                // console.log(container);
                container.addEventListener("touchmove",function(event){
                    event.preventDefault();
                },false);
            },
            // 4、2把阻止事件remove
            removeStopScroll(){
                let container=document.getElementById("jobcontent");
                container.removeEventListener("touchmove",function(event){
                    event.preventDefault();
                },false);
            },

            // get push job list
            getPushListByJob(userId, begianNum,endNum,type='jobs'){
                let _self = this;

                var data = {
                    userId : userId,
                    begianNum : begianNum,
                    endNum : endNum,
                };

                axios({
                    method: 'post',
                    url: units.domain('pushJobList/getPushListByJob'),
                    // data: qs.stringify(data),
                    data: data,
                }).then(function (response) {
                    var result = response.data;

                    if (result.code == 502) {
                        alert(result.message);
                    }

                    if (result.code == 402) {
                        alert(result.message);
                    }

                    if (result.code == 200) {
                        if (type == 'jobs') {
                            _self.jobs=result.data;
                        } else {
                            // 模擬每次下拉加載的10條假數據
                            if (result.data.length == 0) {
                                result.data = null;
                            }
                            _self.temp=result.data;
                        }
                    }
                })
                .catch(function (error) {
                    this.loading = false;
                    console.log('网络连接失败');
                });
            },

            // add pushListByJob
            addPushListByJob(userId, data, score){
                let _self = this;

                var data = {
                    userId : userId,
                    data : data,
                    score : score,
                };

                axios({
                    method: 'post',
                    url: units.domain('pushJobList/addPushListByJob'),
                    // data: qs.stringify(data),
                    data: data,
                }).then(function (response) {
                    var result = response.data;

                    if (result.code == 402 || result.code == 400) {
                        console.log(result.message);
                    }

                    if (result.code == 200) {
                        console.log('result.message')
                    }
                })
                .catch(function (error) {
                    this.loading = false;
                    console.log('系统繁忙');
                });
            },

            createSocketUser(){
                var createUserInfo = {
                    "userId": this.userId,
                }

                this.$socket.emit('createUser', createUserInfo);
            },

        },

        mounted(){
            // 去掉范湖底部事件监听
            // window.addEventListener("scroll", this.willscroll);
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
            // console.log(this.$refs.wrapper.getBoundingClientRect().top);


            this.createSocketUser();
        },

        created(){
            this.userId = Store.get('user-id');
            this.initApiUrl();
            // this.sub;
            this.$nextTick(function () {
                var page = this.jobPage.page;
                var limit = this.jobPage.limit;
                var endNum = page * limit;
                var begianNum = endNum - limit;

                this.getPushListByJob(this.userId, begianNum,endNum);

                // this.loadData();
            });
        }
    }

</script>
<style lang="stylus" scoped>
</style>
