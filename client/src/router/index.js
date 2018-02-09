import Vue from 'vue'
import Router from 'vue-router'
import Storage from '../components/storage/Storage.vue';
import Settings from '../components/settings/Settings.vue';
import Users from '../components/users/Users.vue';

Vue.use(Router)

export default new Router({
	mode: "history",
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
		},
		{
			path: '/users',
			component: Users
		}
	]
})
