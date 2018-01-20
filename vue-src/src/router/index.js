import Vue from 'vue'
import Router from 'vue-router'
import Storage from '../components/Storage.vue';
import Profile from '../components/Profile.vue';

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
			path: '/profile',
			component: Profile
		}
	]
})
