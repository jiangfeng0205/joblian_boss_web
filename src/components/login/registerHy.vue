<template>
    <div class="login-bg">
        <colunmLabs ref="judge" :loginBox="loginBox" :classType="classType"  :tableTitle="tableTitle" :tabData="tabData1" :nowIndex="nowIndex" @hide="hide" @indexData="indexData" @changeList="changeList" @btnSure="btnSure" @getCityOrhy="getCityOrhy" v-show="showHide"></colunmLabs>
    </div>
</template>

<script>
    import Store from "../../js/userstore"
    import units from '../../js/units'
    import axios from "axios"
    import qs from "qs"
    import colunmLabs from '@/components/common/table';

    export default {
        components: {
            colunmLabs
        },
        data () {
            return {
                loginBox : true,

                tableTitle : '请选择职能',
                classType  : 'job',
                titleData: [{ title: "融资",id:1 }, { title: "规模",id:2 }, { title: "行业",id:3 }],
                InfoData: [],
                nowIndex: [0],
                indexSub: [[0], [0], [0]],
                tableIndex: 0,
                showHide: true,
                tabData1: [],
                tabData: [
                        [],
                        [],
                        []
                ],
            }
        },
        watch:{

        },

        methods: {
          hide() {
              this.showHide = true;
          },
          indexData() {
            this.nowIndex = [0];
          },
          changeList(list){
              // console.log('listlll---',list);
              this.tabData1 = list
          },
          btnSure(number, indexData, loginBox) {
            console.log('dasdsad--',number)
            console.log('dasdsad2--',indexData)
            console.log('dasdsad3--',loginBox)
            this.loginBox = loginBox;
            this.indexSub[this.tableIndex] = indexData;
            let title = this.titleData[this.tableIndex].title;
            if (number != 0) {
              this.titleData[this.tableIndex].title =
                title.replace(/[^\u4e00-\u9fa5]+/, "") + "(" + number + ")";
            } else {
              this.titleData[this.tableIndex].title = title.replace(
                /[^\u4e00-\u9fa5]+/,
                ""
              );
            }

            // this.showHide = false;
          },

          getCityOrhy(table, keyid,num=1){
              let _self = this;
              var data = {
                  table: table,
                  keyid: keyid,
              };

              axios({
                  method: 'post',
                  url: units.domain('pushJobList/getHyAndCityName'),
                  data: data,
              }).then(function (response) {
                  var result = response.data;
                  console.log('register3--',result)
                  if (result.code == 402) {
                      alert(result.message);
                  }

                  if (result.code == 200) {
                      console.log('getHyAndCityName--', result)
                      var arr = result.data;
                      if (num != 1) {
                          arr.unshift({
                              content:null,
                              id:keyid+'-all',
                              keyid:-1,
                              name: num,
                              sort:0,
                          })
                      }
                      _self.tabData1 = arr;
                  }
              })
              .catch(function (error) {
                  alert('网络连接失败');
              });
          },

        },
        mounted(){
            let _self=this;
            _self.getCityOrhy('edwinbj_job_class', 0);

        }
    }

</script>

<style lang="stylus" scoped>
    #login .role{
        // background:red;
    }
</style>