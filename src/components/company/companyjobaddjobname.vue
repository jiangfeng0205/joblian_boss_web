<template>
  <div id="memo" class="head">
    <mt-header fixed :title="title">
      <router-link to="/company/companyjobadd" slot="left" v-if="jobId == 0">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <router-link :to="'/company/companyjobDetail/'+jobId" slot="left" v-else>
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <mt-button slot="right" @click="saveMemo">保存</mt-button>
    </mt-header>
    <div class="content">
        <mt-field class="memo-content" maxlength="11" :placeholder="title" type="textarea" rows="8" v-model.trim="content"></mt-field>
    </div>
  </div>
</template>

<script>
    import Store from "../../js/userstore";

    export default {
        name: 'companyjobaddjobname',
        data(){
          return {
            title: '填写职位名',
            content: '',
            datetime: '',
            dateTimeText: '请选择提醒时间',
            isRemind: false,
            jobId : 0,
          }
        },
        created(){
            this.jobId = this.$route.params.jobId;
            this.getCompanyJobSaveData();

            var type = this.$route.params.type;
            this.setTitle(type);
        },
        methods: {
          getCompanyJobSaveData(){
              var type = this.$route.params.type;
              if (this.jobId == 0) {
                  companyJobSaveData = Store.get('companyJobSaveData',1);
              } else {
                  companyJobSaveData = Store.get('companyJobSaveData'+this.jobId,1);
              }
              if (companyJobSaveData) {
                  var companyJobSaveData = JSON.parse(companyJobSaveData);
                  if (type == 1) {
                      this.content = companyJobSaveData.jobname;
                  }
                  if (type == 2) {
                      this.content = companyJobSaveData.jobDescription;
                  }
                  if (type == 3) {
                      this.content = companyJobSaveData.jobDescription2;
                  }
              }
          },
          chooseDatetime(){
            this.$refs.picker.open();
          },
          confirm(val){
            this.dateTimeText = val.toLocaleString()
          },
          saveMemo(){
              var type = this.$route.params.type;
              var content = this.content;
              var companyJobSaveData = '';

              if (content) {
                  // companyJobSaveData = Store.get('companyJobSaveData',1);
                  if (this.jobId == 0) {
                      companyJobSaveData = Store.get('companyJobSaveData',1);
                  } else {
                      companyJobSaveData = Store.get('companyJobSaveData'+this.jobId,1);
                  }

                  if (companyJobSaveData) {
                      companyJobSaveData = JSON.parse(companyJobSaveData);

                      if (type == 1) {
                          companyJobSaveData.jobname = content;
                      }
                      if (type == 2) {
                          companyJobSaveData.jobDescription = content;
                      }
                      if (type == 3) {
                          companyJobSaveData.jobDescription2 = content;
                      }
                      companyJobSaveData = JSON.stringify(companyJobSaveData);
                  } else {
                      if (type == 1) {
                          companyJobSaveData = JSON.stringify({jobname:content});
                      }
                      if (type == 2) {
                          companyJobSaveData = JSON.stringify({jobDescription:content});
                      }
                      if (type == 3) {
                          companyJobSaveData = JSON.stringify({jobDescription2:content});
                      }
                  }

                  Store.doSave('companyJobSaveData', companyJobSaveData, 1);
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

              } else {
                  alert('职位名称不能为空');
              }
          },

          setTitle(type){
              if (type == 1) {
                 this.title = '请填写职位名称';
              }
              if (type == 2) {
                 this.title = '请填写职位描述';
              }
              if (type == 3) {
                 this.title = '请填写职位要求';
              }

          }

        }
  }

</script>

<style scoped>
  .content {
    margin-top: 40px;
    font-size: 1.9em;
  }

  .mint-cell {
    min-height: 40px;
  }

  .memo-content {
    border-bottom: 1px solid #b9def0;
    font-size: 1.5 em!important;
  }
  .head >>>.mint-header{
  font-size: 0.481481rem;
  padding: 0.69037rem 0;
  background: #53cac3;
  text-align: center;
  position: relative;
  color: #ffffff;
  }
  .head >>>.mint-header-button.is-right{
  margin-right: 0.3em;

  }
  .content >>> .mint-cell-wrapper{
  font-size: 0.9em!important;

  }
</style>