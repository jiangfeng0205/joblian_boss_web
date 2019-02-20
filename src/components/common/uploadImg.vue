<template>
    <li class="headImg">
    	<div class="upImg">上传头像</div>
    	<div class="imgBox">
	        <input type="file"  id ="headFile" @change="loadImage()"/>
	        <img @click="trigerFileInput()"  id="default" :src="oldImage"/>
    	</div>
    </li>
</template>

<script>
	import units from '../../js/units';
	import Store from "../../js/userstore";
    import axios from "axios";
    import { mapState,mapGetters,mapMutations } from 'vuex';

	export default{
		computed: {
            ...mapGetters([
                'oldImage'
            ])
        },

		props:{
			uploadApi:{
				type:String,
			},
		},

		data(){
			return {
				headerImg : '/static/images/header.png',
		        imgData : {
		            accept: 'image/gif, image/jpeg, image/png, image/jpg',
		        }
			}
		},

		watch : {

		},

		methods:{
			...mapMutations({
	            saveOldImage: 'saveOldImage',
	        }),

			trigerFileInput(){
		        document.getElementById("headFile").click();
		    },

		    loadImage(){
		    	var _self    = this;
		        var file     = document.getElementById("headFile").files[0];
		        var filename = file.name;
		        var type     = file.type;
		        var size     = file.size;

		        if (this.imgData.accept.indexOf(type) == -1) {
		            alert('请选择我们支持的图片格式！');
		            return false;
		        }

		        if (size > 3145728) {
		            alert('请选择3M以内的图片！');
		            return false;
		        }

	            var reader = new FileReader();
	            reader.onload = function(){
	                _self.saveOldImage({headerImg:this.result});

	            	_self.$emit("uploadImgData", _self.oldImage);
	            }

	            reader.readAsDataURL(file);
		    },

		},

		mounted() {

		},
	}
</script>

<style lang="stylus" scoped>
	.headerImg{
		position:relative;
	}
	.upImg{
		display:inline-block;
		color:white;
		width:20%;
		position: absolute;
    	top: 0;
	}

	#headFile{
		display:none;
	}

	#default{
		margin-left:10%;
		width: 37%;
    	height: 85px;
    	border-radius:50%;
	}

	.imgBox{
		display:inline-block;
		width:75%;
		position: absolute;
    	top: 0;
    	left:30%;
	}
</style>