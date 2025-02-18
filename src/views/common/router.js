const router = [
	{
		path: '/commonSysConfig',
		name: 'commonSysConfig',
		meta: {
			newBar:true
		},
		component: () =>
			import('./SysConfigs.vue')
	}, {
		path: '/commonSysConfigAdv/:type/:id', // type: edit, detail
		name: 'commonSysConfigEdit',
		meta: {
			newBar:true
		},
		component: () =>
			import('./SysConfigAdv.vue')
	}, {
		path: '/commonSysConfigAdv/:type', // type: add
		name: 'commonSysConfigAdd',
		meta: {
			newBar:true
		},
		component: () =>
			import('./SysConfigAdv.vue')
	}, {
		path: '/commonSysConfig/:id',
		name: 'commonSysConfigSet',
		meta: {
			newBar:true
		},
		component: () =>
			import('./SysConfig.vue')
	}, {
		path: '/commonSysDictType',
		name: 'commonSysDictType',
		meta: {
			newBar:true
		},
		component: () =>
			import('./SysDictType.vue')
	}, {
		path: '/commonSysDictData',
		name: 'commonSysDictData',
		meta: {
			newBar:true
		},
		component: () =>
			import('./SysDictData.vue')
	}
]

export default {
	router
}
