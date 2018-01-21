import Vue from 'vue'
import Router from 'vue-router'
import Storage from '../components/Storage.vue';
import Settings from '../components/Settings.vue';

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
		},
		{
			path: '/settings',
			component: Settings
		}
	]
})
