<template>
  <div id="memo" class="head">
    <mt-header fixed title="选择学历">
      <router-link to="companyjobadd" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <mt-button slot="right" >保存</mt-button>
    </mt-header>
    <div class="content">
      <mt-picker :slots="slots" @change="onValuesChange()"></mt-picker>
    </div>
    
  </div>
</template>
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
  .content >>> .picker-slot{
  font-size: 0.44rem!important;
  
  }
</style>
<script>
    export default {
        name: 'companyjobaddedu',
        data(){
          return {
            slots: [
              {
                flex: 1,
                values: ['大专', '本科', '硕士', '博士', '高中', '中专'],
                className: 'slot1',
                textAlign: 'center'
              }
            ]
          };
        },

        created(){

          let _footer = this.$store.state.footerVisible;
          if (_footer) {
            this.$store.commit('TOGGLE_FOOTER');
          }
        },
        
        methods: {
          onValuesChange(picker, values) {
           
              picker.setSlotValue(1, values[0]);
            
          },

          
        }
    }

</script>