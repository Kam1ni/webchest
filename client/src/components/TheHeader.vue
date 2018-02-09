<template>
  	<v-toolbar app fixed clipped-left class="primary" dark>
		<v-toolbar-side-icon @click.stop="drawerClicked"></v-toolbar-side-icon>
		<span class="hidden-xs-only">WebChest</span>
	</v-toolbar>
</template>

<script>
	export default {
		methods:{
			drawerClicked(){
				this.$emit("drawer")
			}
		}
	}
</script>
