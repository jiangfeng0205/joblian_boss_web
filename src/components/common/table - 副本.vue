<template>
	<div class="tableBox">
		<div>
			<!-- <mt-header fixed :title="tableTitle"></mt-header> -->
		</div>
		<div class="job_header clear">
            <div class="job_header_left">
                <span>{{tableTitle}}</span>
            </div>
        </div>
		<div class="tablecontent">
			<!-- <div >{{isSelected}}</div> -->
			<div >{{lastFlags}}</div>
			<h6 v-for="(value,k) in oldSelected">{{value}}</h6>
			<ul class="clear">
				<!-- <li v-for="(item,index) in tabData" :key="index" :class="{active:checkActive(index)}" @click.prevent="addClass(index,item.id,item.name)" :keyid="item.id">{{item.name}}</li> -->
				<li v-for="(item,index) in tabData" :key="index" :class="{active:checkActive(item.id)}" @click.prevent="addClass(index,item.id,item.name,item.keyid)" :keyid="item.id">{{item.name}}</li>
			</ul>
		</div>
		<div class="bottom">
			<ul class="clear">
				<li @click="refesh">上一层</li>
				<li @click="btnSure">定义其他</li>
			</ul>
		</div>
		<div class="zhezhao" @click="hide">

		</div>
	</div>
</template>

<script>
	import units from '../../js/units';
    import axios from "axios";
    import { mapState,mapGetters,mapMutations } from 'vuex'
	export default{
		mounted(){
			// this.nowIndex.push(0);
			// console.log(this.count)
		},
		computed: {
		   // 使用对象展开运算符将 getter 混入 computed 对象中
		    ...mapGetters([
		      'count',
		    ])
		},
		props:{
			tabData:{
				type:Array,
				default:[]
			},
			nowIndex:{
				type:Array
			},
			tableTitle:{
				type:String
			},
		},
		data(){
			return {
				btnsure:"确认",
				isLoginBox:true,
				isSelected : '',
				oldSelected:[],
				flagSelceted : [],
				lastFlag : [],
				lastFlags : '',
			}
		},

		watch : {
			'flagSelceted' : {
		        handler(newName, oldName) {
		        	var _self = this;
		            this.isSelected = this.flagSelceted.join('-');
		        },
		        deep: true, // 深度监听
		    },

		    'lastFlag' : {
		        handler(newName, oldName) {
		        	var _self = this;
		            this.lastFlags = this.lastFlag.join('-');
		        },
		        deep: true, // 深度监听
		    }
		},

		methods:{
			hide(){
				this.$emit("indexData");
				this.$emit("hide");
			},
			checkActive(index){
				// console.log('active--', this.nowIndex);
				// console.log('active2--', index);
				return this.nowIndex.indexOf(index) != -1;
			},
			judgeIndex(idx){
				let number=idx.length;
				if(number==1){
					if(idx[0]==0){
						this.btnsure="确认";
					}else{
						this.btnsure="确认("+idx.length+")";
					}
				}else{
					this.btnsure="确认("+idx.length+")";
				}
				return true;
			},
			addClass2(index,keyid,name){
				console.log('index---',index);
				console.log('nowIndex---',this.nowIndex);
				console.log('indexOf---',this.nowIndex.indexOf(0));
				console.log('keyid---',keyid);
				console.log('flagSelceted---',this.flagSelceted);
				if(index!=0){
					//当选择了其它标签时把【全部】标签的active类名去掉
					if(this.nowIndex.indexOf(0)!=-1){
						console.log(1111);
						this.nowIndex.splice(0,1);
					}
					//需要把  全部  上的active类名去掉----结束
					if(this.nowIndex.indexOf(index)==-1){
						console.log(2222)
						this.nowIndex.push(index);
						this.flagSelceted.push(name);
					}else{
						console.log(33333)
						this.nowIndex.forEach((el,ind)=>{
							if(index==this.nowIndex[ind]){
								this.nowIndex.splice(ind,1);
								this.flagSelceted.splice(ind,1);
							}
						})
					}

					this.btnsure="确认("+this.nowIndex.length+")";
				}else{
					console.log('0000')
					if(this.nowIndex.indexOf(index) == -1){
						this.nowIndex.push(index);
						this.$emit("indexData");
						this.btnsure="确认";
					}
				}

				//这里需要判断用户是否把选的都取消了,是就让其默认为全部
				if(this.nowIndex.length==0){
					this.$emit("indexData");
					this.btnsure="确认";
				}
				this.isSelected = this.isSelected + name;
				this.getCityOrhy2('edwinbj_job_class', keyid, name, 2);

			},

			addClass(index,keyid,name,parentId){
				console.log('index---',index);
				console.log('nowIndex---',this.nowIndex);
				console.log('indexOf---',this.nowIndex.indexOf(0));
				console.log('keyid---',keyid);
				console.log('flagSelceted---',this.flagSelceted);
				console.log('count--', this.count)

				if(keyid != 0){
					//当选择了其它标签时把【全部】标签的active类名去掉
					if(this.nowIndex.indexOf(0) > -1 ){ // 已选中【全部】情况下
						console.log(1111);
						this.nowIndex.splice(0,1);

						this.flagSelceted.splice(this.flagSelceted.indexOf(name),1);
						this.lastFlag.splice(this.lastFlag.indexOf(name),1);
						this.nowIndex.splice(this.nowIndex.indexOf(0),1);
						// this.lastFlag.push(name);
					}

					if(this.nowIndex.indexOf(keyid) == -1){
						console.log(2222);
						// this.nowIndex.splice(0,1);
						this.isSelected = this.isSelected + name;

						this.nowIndex.push(keyid);
						this.flagSelceted.push(name);
						this.lastFlag.push(name);
					}else{
						console.log(33333);
						console.log('ab',this.nowIndex.length)
						if (this.nowIndex.length > 1) {
							console.log('a')
							this.nowIndex.forEach((el,ind)=>{
								// console.log('foreavh---', el)
								// console.log('forind---', ind)
								if(keyid==this.nowIndex[ind]){
									this.nowIndex.splice(ind,1);
									this.flagSelceted.splice(ind,1);
									this.lastFlag.splice(ind,1);
								}
							})
						} else {
							console.log('b')
							this.nowIndex.splice(0,10000);
							this.nowIndex.push(0);
							this.lastFlag.splice(0,10000);
							this.lastFlag.push(this.tabData[0]['name']);
						}
					}

					this.btnsure="确认("+this.nowIndex.length+")";
				}else{
					console.log('0000--',keyid)
					this.isSelected = name;

						this.flagSelceted.splice(0,10000);
						this.flagSelceted.push(name);

						this.lastFlag.splice(0,10000);
						this.lastFlag.push(name);

					this.nowIndex.splice(0,10000);
					this.nowIndex.push(keyid);
					console.log('clear--', this.nowIndex);
					this.$emit("indexData");
					this.btnsure="确认";
				}

				//这里需要判断用户是否把选的都取消了,是就让其默认为全部
				if(this.nowIndex.length==0){
					this.$emit("indexData");
					this.btnsure="确认";
				}
				// this.isSelected = this.isSelected + name;
				this.getCityOrhy2('edwinbj_job_class', keyid, name, parentId, 2);
			},

			refesh(){
				this.$emit("indexData");
				this.btnsure="确认";
			},
			btnSure(){
				let number=this.nowIndex.length;
				if(number == 1){
					if(this.nowIndex[0]==0){
						number = 0;
					}
				}
				this.$emit("btnSure",number,this.nowIndex,this.isLoginBox);
			},

			getCityOrhy2(table, keyid, name, parentId, num=2){
              	let _self = this;
              	var data = {
                  	table: table,
                  	keyid: keyid,
              	};

              	if (parentId > -1) {
	              	axios({
	                  	method: 'post',
	                  	url: units.domain('pushJobList/getHyAndCityName'),
	                  	data: data,
	              	}).then(function (response) {
	                  	var result = response.data;
	                  	// console.log('register3--',result)

	                  	if (result.code == 200) {
	                      	var arr = result.data;
	                      	if (num != 1 && arr.length > 0) {
	                          	// arr.unshift({
	                           //    	content:null,
	                           //    	id:keyid,
	                           //    	keyid:keyid,
	                           //    	name: name + "(全部)",
	                           //    	aliseName:name,
	                           //    	sort:0,
	                          	// });
	                          	arr.unshift({
	                              	content:null,
	                              	id:0,
	                              	keyid:-1,
	                              	name: name + "(全部)",
	                              	aliseName:name,
	                              	sort:0,
	                          	})
	                      		_self.$emit("changeList", arr);
	                      		// _self.lastFlag.push[name + '全部'];
	                      		_self.nowIndex.push(0);
	                      		_self.lastFlag.splice(0,10000);
	                      		_self.lastFlag.push(name + '(全部)');
	                      	} else {
	                      		// _self.oldSelected.push(_self.isSelected);
	                      	}

	                  	}
	              	})
              	}
            },
		}
	}
</script>

<style lang="stylus" scoped>
	.tableBox{
		dispaly:block !important;
		background: #F8F8F8;
		padding-top: 0.013333rem;
		// background: rgba(0,0,0,0.5);
		position: relative;
		top: 0;
		left: 0;
		z-index: 999;
		width: 100%;
		height: 100%;
	}
	.zhezhao2{
		position: fixed;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.5);
	}
	.tablecontent{
		margin-top: 10%;
		padding: 0.506666rem 0.48rem 1.093333rem 0.48rem;
		ul{
			list-style: none;
			/*display: flex;
			justify-content: space-between;
			flex-wrap: wrap;*/
			margin-left: 0.346666rem;
			li{
				display: inline-block;
				min-width: 1.7rem;
				padding:0.213333rem 0.133333rem;
				margin-bottom: 0.32rem;
				text-align: center;
				border: 1px solid #CECECE;
				border-radius: 10px;
				margin-right: 0.346666rem;
				background: #FFFFFF;
			}
			.active{
				background: #53CAC3;
				color: #fff;
			}
		}
	}
	.bottom{
		ul{
			position : absolute;
			// bottom : 0;
			width : 100%;
			list-style: none;
			li{
				float: left;
				width: 50%;
				padding: 0.346666rem 0;
				text-align: center;
			}
			li:nth-child(1){
				background: #fff;
				border-top: 1px solid #DCDCDC;
			}
			li:nth-child(2){
				background: #53CAC3;
				color: #fff;
			}
		}
	}
</style>