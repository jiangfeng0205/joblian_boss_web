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

		<div class="selectedBox" v-show="jobClassTitle.length > 0 && classType == 'job'">
			<div class="flag" v-for="(value, index) in jobClassTitle" >
				<span class='flagContent'>{{value.name}}</span>
				<span class="deleteFlagBtn" @click.prevent="delecteJobClassTitle(index)">x</span>
			</div>
			<span class="save_btn_small" @click.prevent="saveClassTitle()">保存</span>
		</div>

		<div class="selectedBox" v-show="hangyeClassTitle.length > 0 && classType == 'hangye'">
			<div class="flag" v-for="(value, index) in hangyeClassTitle" >
				<span class='flagContent'>{{value.name}}</span>
				<span class="deleteFlagBtn" @click.prevent="delecteJobClassTitle(index)">x</span>
			</div>
			<span class="save_btn_small" @click.prevent="saveClassTitle()">保存</span>
		</div>

		<div class="selectedBox" v-show="cityClassTitle.length > 0 && classType == 'city'">
			<div class="flag" v-for="(value, index) in cityClassTitle" >
				<span class='flagContent'>{{value.name}}</span>
				<span class="deleteFlagBtn" @click.prevent="delecteJobClassTitle(index)">x</span>
			</div>
			<span class="save_btn_small" @click.prevent="saveClassTitle()">保存</span>
		</div>

		<div class="tablecontent">
            <div class="tab" v-if="jobClassBaner">{{jobClassBaner}}</div>
			<ul class="clear">
				<li v-for="(item,index) in tabData" :key="index" :class="{active:checkActive(item.id)}" @click.prevent="addClass(index,item.id,item.name,item.keyid)" :keyid="item.id">{{item.name}}</li>
			</ul>
		</div>

		<div class="bottom">
			<ul class="clear">
				<li @click="defineOtherClass(classType, 'beforLayer')" plain>上一层</li>
				<li @click="defineOtherClass(classType, 0)">定义其他</li>
				<!-- <li ><router-link :to="{ name: 'register3'}" style="color:white;">定义其他</router-link></li> -->
			</ul>
			<div class="save_btn_big" @click.prevent="saveClassTitle()">保存</div>
		</div>

		<div class="zhezhao" @click="hide">

		</div>
	</div>
</template>

<script>
	import units from '../../js/units';
	import Store from "../../js/userstore"
    import axios from "axios";
    import { mapState,mapGetters,mapMutations } from 'vuex'
	export default{
		mounted(){
			// this.nowIndex.push(0);
			// console.log(this.count)
		},

		computed: {
		    ...mapGetters([
		      	'count',
		      	'jobClassId',
		      	'lastJobClassId',
		      	'jobClassNames',
		      	'jobClassBaner',
		      	'jobClassBanerId',
		      	'jobClassTitle',
		      	'cityClassTitle',
		      	'hangyeClassTitle',
		      	'jobClassTitleId',
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
			classType:{
				type:String
			},
			dericteUrl:{
				type:String
			}
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
				layer : 0,
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
		    },

		},

		methods:{
			...mapMutations({
			    test:'minus',
			    saveJobClassNames : 'saveJobClassNames',
			    saveJobClassBaner : 'saveJobClassBaner',
			    saveJobClassTitle : 'saveJobClassTitle',
			    saveJobClassId    : 'saveJobClassId',
			    clearClass        : 'clearClass',
			    beforeClass       : 'beforeClass',
			    initJobClassTitle : 'initJobClassTitle',
			    saveCityClassTitle: 'saveCityClassTitle',
			    saveHangyeClassTitle: 'saveHangyeClassTitle',
			}),

			hide(){
				this.$emit("indexData");
				this.$emit("hide");
			},

			checkActive(index){
				var ids = [];
				if (this.classType == 'job') {
					var titleData = this.jobClassTitle;
				}
				if (this.classType == 'city') {
					var titleData = this.cityClassTitle;
				}
				if (this.classType == 'hangye') {
					var titleData = this.hangyeClassTitle;
				}

				if (titleData.length > 0) {

					titleData.forEach(function(value, key){
						ids.push(value.id);
						value.parent.filter(function(v){
							ids.push(v);
						})
					})
				}

				return ids.indexOf(index) != -1;
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

			addClass(index,keyid,name,parentId){
				var limitNum = 5;

				if (this.classType == 'job') {
					var table = 'edwinbj_job_class';
					var classTitle = this.jobClassTitle;
				}
				if (this.classType == 'city') {
					var table = 'edwinbj_city_class';
					var classTitle = this.cityClassTitle;
				}

				if (this.classType == 'hangye') {
					var table = 'edwinbj_job_class';
					var classTitle = this.hangyeClassTitle;
					limitNum = 3;
				}

				var titles = [];

				classTitle.forEach(function(value, key){
					titles.push(value.id);
                	var parentLength = value.parent.length;
                	if (parentLength == 2 || parentLength == 3) {
						titles.push(value.parent[0]);
						titles.push(value.parent[1]);
						titles.push(value.parent[0]+'-all');
						titles.push(value.parent[1]+'-all');
						titles.push(value.parent[parentLength-1]+'-all');
                	}

                	if (parentLength == 1) {
                		titles.push(value.parent[0]);
                		titles.push(value.parent[0]+'-all');
                	}

	            });

				if (classTitle.length >= limitNum && titles.indexOf(keyid) == -1) {
					alert('职能最多选择'+limitNum+'个');
					return;
				}

				this.saveJobClassNames(name);


				this.getCityOrhy2(table, keyid, name, parentId, 2);

			},

			delecteJobClassTitle(index) {
				if (this.classType == 'job') {
					this.jobClassTitle.splice(index, 1);
				}
				if (this.classType == 'city') {
					this.cityClassTitle.splice(index, 1);
				}
				if (this.classType == 'hangye') {
					this.hangyeClassTitle.splice(index, 1);
				}
			},

			defineOtherClass(table, keyid) {
				if (table === 'city') {
					table = 'edwinbj_city_class';
				} else {
					table = 'edwinbj_job_class';
				}

				var key = this.jobClassBaner.split('-').length;

				if (keyid === 'beforLayer' && key == 2) {
					var kid = this.jobClassBanerId[0];
					var bname = this.jobClassBaner.split('-');

					this.$emit("getCityOrhy", table, kid, bname[0]+'(全部)');

					this.saveJobClassBaner({name:bname[0],id:kid,type:keyid,classType:this.classType});

				} else {
					keyid = 0;
					this.$emit("getCityOrhy", table,keyid);
					this.clearClass({name:[]});
				}
			},

			saveClassTitle () {
				if (this.classType == 'job') {
					var saveDataName = 'jobClassTitle';
					var saveData     = this.jobClassTitle;
				}
				if (this.classType == 'city') {
					var saveDataName = 'cityClassTitle';
					var saveData     = this.cityClassTitle;
				}
				if (this.classType == 'hangye') {
					var saveDataName = 'hangyeClassTitle';
					var saveData     = this.hangyeClassTitle;
				}

				Store.doSave(saveDataName, JSON.stringify(saveData), 1);
				var dericteUrl = this.dericteUrl;
				if (dericteUrl) {
					this.$router.push({'path':dericteUrl});
				} else {
					this.$router.push({'path':'/register3'});
				}
			},

			getHistoryClassTitle () {
				if (this.classType == 'job') {
					var saveDataName = 'jobClassTitle';
					var data         = this.jobClassTitle;
				}
				if (this.classType == 'city') {
					var saveDataName = 'cityClassTitle';
					var data         = this.cityClassTitle;
				}
				if (this.classType == 'hangye') {
					var saveDataName = 'hangyeClassTitle';
					var data         = this.hangyeClassTitle;
				}

				var historyClassTitle = Store.get(saveDataName, 1);

				if (historyClassTitle && data.length == 0) {
					historyClassTitle = JSON.parse(historyClassTitle);
					this.initJobClassTitle({data:historyClassTitle, classType: this.classType});
				}

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

              	if (parentId > -1 && _self.classType != 'hangye') {
	              	axios({
	                  	method: 'post',
	                  	url: units.domain('pushJobList/getHyAndCityName'),
	                  	data: data,
	              	}).then(function (response) {
	                  	var result = response.data;

	                  	if (result.code == 200) {
	                      	var arr = result.data;

	                      	if (num != 1 && arr.length > 0) {
	                          	arr.unshift({
	                              	content:null,
	                              	id:keyid + '-all',
	                              	keyid:-1,
	                              	name: name + "(全部)",
	                              	aliseName:name,
	                              	sort:0,
	                          	})
	                      		_self.$emit("changeList", arr);

	                      		_self.lastFlag.push(name + '(全部)');

	                      		_self.saveJobClassBaner({name:name,keyid:keyid,parentId:parentId,classType:_self.classType});

	                      	} else {
	                      		if (_self.classType == 'job') {
	                      			_self.saveJobClassTitle({name:name,keyid:keyid,parentId:parentId,classType:_self.classType});
	                      		}
	                      		if (_self.classType == 'hangye') {
	                      			_self.saveHangyeClassTitle({name:name,keyid:keyid,parentId:parentId,classType:_self.classType});
	                      		}
	                      		if (_self.classType == 'city') {
	                      			_self.saveCityClassTitle({name:name,keyid:keyid,parentId:parentId,classType:_self.classType});
	                      		}
	                      	}

	                  	}
	              	})
              	} else {
              		if (_self.classType == 'job') {
              			_self.saveJobClassTitle({name:name,keyid:parentId,parentId:keyid,classType:_self.classType});
              		}
              		if (_self.classType == 'hangye') {
              			_self.saveHangyeClassTitle({name:name,keyid:keyid,parentId:parentId,classType:_self.classType});
              		}
              		if (_self.classType == 'city') {
              			_self.saveCityClassTitle({name:name,keyid:parentId,parentId:keyid,classType:_self.classType});
              		}


              	}

              	this.saveJobClassId({id:keyid,keyid:parentId});

            },
		},

		created() {
			this.getHistoryClassTitle();
		},
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
	.selectedBox{
		padding: 0.506666rem 0.48rem 1.093333rem 0.48rem;
		border:1px solid #ccc;
		position:relative;
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
	}
	.tablecontent .tab{
		margin-left: 0.346666rem;
		padding-bottom:15px;
		border-bottom:1px solid #3e3e3e;
		margin-bottom:15px;
	}
	.tablecontent{
		// margin-top: 10%;
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
	.save_btn_big{
		position : fixed;
		bottom : 0;
		width : 100%;
		text-align:center;
		background:#53cac3;
		color:#fff;
		padding: 0.346666rem 0;
		z-index:50;

	}
	.save_btn_small{
		position : absolute;
		bottom : 2%;
		right : 5%;
		width : 15%;
		text-align:center;
		background:#53cac3;
		color:#fff;
		padding: 0.246666rem 0;
	}
</style>