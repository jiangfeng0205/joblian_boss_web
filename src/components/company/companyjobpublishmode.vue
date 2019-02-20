<template>
  <div class="company-list">
    <div class="top">
      <div class="ahead">
      </div>
      <div class="head clear" v-if="jobId == 0">
        <router-link to="/company/companyjobadd" style="float:left;margin-left: 23px;"><span class="icon-left"></span></router-link>添加职位发布方式
      </div>
      <div class="head clear" v-else>
        <router-link to="/company/companyjobadd" style="float:left;margin-left: 23px;"><span class="icon-left"></span></router-link>添加职位发布方式
      </div>
    </div>
    <div class="content">
      <!-- 消息列表 -->
      <div class="meschat">
          <h4 class="clear"> {{jobname}}</h4>
          <div class="fields">
            <p>
                <span>发布方式:</span>
                <select v-model="pulish"  @change="changeSelect($event,1)">
                    <option  v-for="(item, key) in pulishmode"  :value="JSON.stringify(pulishmode[key])" >{{item.name}}</option>
                </select>
            </p>
            <p v-show="payAction">
                <span>合作价值:</span>
                <input type="number" v-model="payNum" min="1" max="10" />
            </p>
            <p v-show="payAction">
                <span>兑现方式:</span>
                <select v-model="pay" @change="changeSelect($event,2)">
                    <option  v-for="(item, key) in payMode"  :value="JSON.stringify(payMode[key])" >{{item.name}}</option>
                </select>
            </p>
            <p>
                <span>顾问认证:</span>
                <select v-model="consultant" @change="changeSelect($event,3)">
                    <option  v-for="(item, key) in consultantMode"  :value="JSON.stringify(consultantMode[key])" >{{item.name}}</option>
                </select>
            </p>

            <mt-field label="顾问推荐" placeholder="填写推荐意见" type="textarea" rows="4" v-model.trim="tuijian"></mt-field>
          </div>
      </div>
      <div class="will_chat">
          <a class="flex_child" @click="savePlishMode"><span>保存</span></a>
      </div>
    </div>

  </div>
</template>

<script>
import Store from "../../js/userstore";

export default {
  name: 'companyjobpublishmode',
  data () {
      return {
          payAction  : false,
          pulish     : '',
          payNum     : '',
          pay        : '',
          consultant : '',
          tuijian     : '',
          pulishmode:[
              {
                  name:'请选择',
                  value:0
              },
              {
                  name:'只是发布',
                  value:1
              },
              {
                  name:'寻求合作',
                  value:2
              },
          ],

          payMode:[
              {
                  name:'请选择',
                  value:0
              },
              {
                  name:'Offer支付20%,转正80%',
                  value:1
              },
              {
                  name:'Offer支付30%,转正70%',
                  value:2
              },
              {
                  name:'供候选人,不问结果支付',
                  value:3
              },
          ],

          consultantMode:[
              {
                  name:'请选择',
                  value:0
              },
              {
                  name:'身份证认证',
                  value:1
              },
              {
                  name:'公司认证',
                  value:2
              },
              {
                  name:'支付保证金',
                  value:3
              },
          ],

          jobname : '职位发布方式',
          localCompanyJobSaveData : {},
          jobId : 0,
      }
  },
  methods:{
      getCompanyJobSaveData(){
          // companyJobSaveData = Store.get('companyJobSaveData',1);
          if (this.jobId == 0) {
              companyJobSaveData = Store.get('companyJobSaveData',1);
          } else {
              companyJobSaveData = Store.get('companyJobSaveData'+this.jobId,1);
          }

          this.pulish        = JSON.stringify(this.pulishmode[0]);
          this.pay           = JSON.stringify(this.payMode[0]);
          this.consultant    = JSON.stringify(this.consultantMode[0]);

          if (companyJobSaveData) {
              var companyJobSaveData = JSON.parse(companyJobSaveData);
              this.localCompanyJobSaveData = companyJobSaveData;

              if(companyJobSaveData.jobname){
                  this.jobname = companyJobSaveData.jobname;
              }
              if(companyJobSaveData.tuijian){
                  this.tuijian = companyJobSaveData.tuijian;
              }
              if(companyJobSaveData.payNum){
                  this.payNum = companyJobSaveData.payNum;
              }
              if(companyJobSaveData.pulishMode){
                  this.pulish = JSON.stringify(companyJobSaveData.pulishMode);
                  companyJobSaveData.pulishMode.value != 2 ? this.payAction = false : this.payAction = true;
              }
              if(companyJobSaveData.payMode){
                  this.pay = JSON.stringify(companyJobSaveData.payMode);
              }
              if(companyJobSaveData.consultantMode){
                  this.consultant = JSON.stringify(companyJobSaveData.consultantMode);
              }
          }
      },

      changeSelect($event, type){
          var pulish = this.pulish;

          if (pulish) {
              var pulish = JSON.parse(pulish);
              if (pulish.value == 2) {
                  this.payAction = true;
              } else {
                  this.payAction = false;
              }
          }

          if (type == 1) {
              this.pulish = $event.target.value;
          }
          if (type == 2) {
              this.pay = $event.target.value;
          }
          if (type == 3) {
              this.consultant = $event.target.value;
          }
      },

      savePlishMode(){
          var pulish = JSON.parse(this.pulish);
          var pay = JSON.parse(this.pay);
          var consultant = JSON.parse(this.consultant);
          var payNum = this.payNum;
          var tuijian = this.tuijian;
          var localCompanyJobSaveData = this.localCompanyJobSaveData ? this.localCompanyJobSaveData : {};

          if (pulish.value == 0) {
              alert('请选择发布方式');
              return;
          }

          if (this.payAction == true) {
              if (payNum == '' || payNum <= 0) {
                  alert('合作价值不能小有0');
                  return;
              }

              if (pay.value == 0) {
                  alert('请选择兑现方式');
                  return;
              }
          }

          if (consultant.value == 0) {
              alert('请选择顾问认证');
              return;
          }

          if (tuijian == '' ) {
              alert('请填写顾问推荐');
              return;
          }

          localCompanyJobSaveData.pulishMode = pulish;
          localCompanyJobSaveData.consultantMode = consultant;
          localCompanyJobSaveData.tuijian = tuijian;
          localCompanyJobSaveData.payNum = payNum;
          localCompanyJobSaveData.payMode = pay;

          var companyJobSaveData = JSON.stringify(localCompanyJobSaveData);

          // Store.doSave('companyJobSaveData', companyJobSaveData, 1);
          if (this.jobId == 0) {
              Store.doSave('companyJobSaveData', companyJobSaveData, 1);
          } else {
              Store.doSave('companyJobSaveData'+this.jobId, companyJobSaveData, 1);
          }

          if (this.jobId == 0) {
              this.$router.push({'path':'/company/companyjobadd'});
          } else {
              this.$router.push({'path':'/company/companyjobDetail/'+this.jobId});
          }
      }

  },

  mounted(){

  },

  created(){
      this.jobId = this.$route.params.jobId;
      this.getCompanyJobSaveData();

  }

}
</script>

<style lang="stylus" scoped>
.meschat{
    span:last-child {
              position: absolute;
              right: 0.185185rem;
              top: 0.292962rem;
            }
    .company{
      span:last-child {
              position: absolute;
              right: 0.185185rem;
              top: 0.292962rem;
            }
    }
    .zhangsan{
      span:last-child {
              position: absolute;
              right: 0.185185rem;
              top: 0.292962rem;
            }
    }
    .weui-check{
       width: 35px;
       height: 35px;
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
.loadStyle {
  text-align: center;
  color: rgb(118, 213, 207);
  font-size: 0.48rem;
}
.company-list {
  background: #e9efef;
  /* padding-bottom: 1.8rem; */
}
.top {
  position: fixed;
  width: 100%;
  z-index: 999;
}
.head {
  font-size: 0.481481rem;
  padding: 0.37037rem 0;
  background: #53cac3;
  text-align: center;
  position: relative;
  color: #ffffff;
  .a {
    position: absolute;
    font-size: 0.555555rem;
    left: 0.37037rem;
    top: 0.37037rem;
  }
}
.head-tab {
  background: #fff;
  color: #8d8d8d;
  position: relative;
  ul {
    list-style: none;
    padding: 0.37037rem 0;
    li {
      float: left;
      width: 33.3%;
      box-sizing: border-box;
      text-align: center;
      border-right: 1px solid #e5e5e5;
      span {
        vertical-align: middle;
      }
    }
  }
}
.content {
  .fields{ margin-top: 20px;}
  .fields>>>.mint-cell .mint-cell-wrapper{ font-size: 1.3em !important;line-height:3;}
  .fields>>>.mint-cell .mint-cell-wrapper .mint-cell-title{ width: 20% !important;margin-left: 1.6em;}
  .fields p {
    background-color: #fff;
    box-sizing: border-box;
    color: inherit;
    min-height: 32px;
    font-size: 0.43rem;
    display: line-block;
    overflow: hidden;
    position: relative;
    text-decoration: none;

  }
  .fields p>span{
    width: 20% !important;
    margin-left: 0.89rem;

  }
  .fields p>select{
       border: none;
       outline: none; //将select的宽高等于div的宽高
       width: 70%;
       height: 80px;
       line-height: 90px; //隐藏select的下拉图标
       appearance: none;
       -webkit-appearance: none;
       -moz-appearance: none; //通过padding-left的值让文字居中
       padding-left: 10px;
       font-size: 1.0em;
       color:#888;
    }
    .fields p>input{
       border: none;
       outline: none; //将select的宽高等于div的宽高
       width: 70%;
       height: 80px;
       line-height: 90px; //隐藏select的下拉图标
       appearance: none;
       -webkit-appearance: none;
       -moz-appearance: none; //通过padding-left的值让文字居中
       padding-left: 10px;
       font-size: 1.0em;
    }

  padding: 1.1rem 0.185185rem 1.8rem 0.185185rem;
  ul {
    list-style: none;
    li {
      padding: 0.185185rem 0 0 0;
      margin-bottom: 0.185185rem;
      background: #fff;
      position: relative;
      .right {
        padding: 0.185185rem;
        img {
          width: 2.185185rem;
          height: 2.185185rem;
        }
      }

      .left {
        margin-left: 0.185185rem;
        p {
          margin-bottom: 0.462962rem;
          color: #8d8d8d;
        }
        p:nth-child(1) {
          font-weight: bold;
          font-size: 0.481481rem;
          color: #333;
        }
        p:nth-child(3) span {
          padding-right: 0.092592rem;
        }
        /*p:nth-child(4){
            border-top: 1px solid #E5E5E5;
            padding: 0.37037rem 0;
            span{
              padding: 0 0.092592rem;
            }
          }*/
        div {
          border-top: 1px solid #e5e5e5;
          padding: 0.462962rem 0;
          /*min-width: 9.259259rem;*/
          span {
            padding: 0 0.092592rem;
          }
          span:last-child {
            position: absolute;
            right: 0.185185rem;
            bottom: 0.462962rem;
          }
        }
      }
    }
  }
}

/*动画效果*/
.slidedown-enter,
.slidedown-leave-active {
  opacity: 0;
  transform: translate3d(0, 0, 0);
}
.slidedown-enter-active,
.slidedown-leave-active {
  transition: all 0.5s ease-in;
}

</style>
