import Vue from 'vue'
import Router from 'vue-router'
import Storage from '../components/Storage.vue';

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			redirect: '/storage'
		},
		{
			path: '/storage/:id?',
			component: Storage
		}
	]
})
