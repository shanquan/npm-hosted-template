export const sysProject = {
    created(){
        this.getSysProjectPromise = this.getSysProjectList()
    },

    data(){
        return{
            form: {
                sysCode:process.env.VUE_APP_CODE,
                projectId:'',
            },
            sysProjectList:[],
            sysCodeDictList:[],
            projectDictList:[],
            allProjectsList:[],
            sysProjectIdSysNameDictList:[],
            subForm: {
                sysCode:process.env.VUE_APP_CODE,
                projectId:'',
            },
            queryForm: {
                sysCode:process.env.VUE_APP_CODE,
                projectId:'',
            },
            subProjectDictList:[],
            queryProjectDictList:[],
            getSysProjectPromise: null,
            showSys: process.env.VUE_APP_CODE == 'BYD_OMP' // 是否开放系统和项目选择权限
        }
    },

    mounted(){

    },

    watch: {
        'form.sysCode': {
            handler(newVal, oldVal) {
            //   this.form.projectId=''
               var data=this.sysProjectList
                if(newVal){
                    data=this.sysProjectList.filter(it=>it.sysCode==newVal)
                }
                var projectDictListArr=[]
                data.forEach(it => {
                    projectDictListArr.push({'dictValue': it.projectId||it.id, 'dictLabel': it.projectName})
                })
                const projectMap = new Map();
                this.projectDictList = projectDictListArr.filter((arr) => !projectMap.has(arr.dictValue) && projectMap.set(arr.dictValue, 1));
            },
            deep: true,
            immediate: true
        },


        'queryForm.sysCode': {
            handler(newVal, oldVal) {
                this.queryForm.projectId=''
                var data=this.sysProjectList
                if(newVal){
                    data=this.sysProjectList.filter(it=>it.sysCode==newVal)
                }
                var projectDictListArr=[]
                data.forEach(it => {
                    projectDictListArr.push({'dictValue': it.projectId||it.id, 'dictLabel': it.projectName})
                })
                const projectMap = new Map();
                this.queryProjectDictList = projectDictListArr.filter((arr) => !projectMap.has(arr.dictValue) && projectMap.set(arr.dictValue, 1));
            },
            deep: true,
            immediate: true
        },
        'subForm.sysCode': {
            handler(newVal, oldVal) {
                this.subForm.projectId=''
                var data=this.sysProjectList
                if(newVal){
                    data=this.sysProjectList.filter(it=>it.sysCode==newVal)
                }
                var projectDictListArr=[]
                data.forEach(it => {
                    projectDictListArr.push({'dictValue': it.projectId||it.id, 'dictLabel': it.projectName})
                })
                const projectMap1 = new Map();
                this.subProjectDictList= projectDictListArr.filter((arr) => !projectMap1.has(arr.dictValue) && projectMap1.set(arr.dictValue, 1));
            },
            deep: true,
            immediate: true
        }
    },

    methods:{
          getSysProjectList() {
            return new Promise(resolve=>{
                this.getSysProject().then(response => {
                    var data = response
                    if (data) {
                        this.sysProjectList=data
                        var dataFilter=data
                        var dataFilterSub=data
                        var dataFilterQuery=data
                        if(this.form.sysCode){
                            dataFilter=this.sysProjectList.filter(it=>it.sysCode==this.form.sysCode)
                        }
                        if(this.subForm.sysCode){
                            dataFilterSub=this.sysProjectList.filter(it=>it.sysCode==this.subForm.sysCode)
                        }
                        if(this.queryForm.sysCode){
                            dataFilterQuery=this.sysProjectList.filter(it=>it.sysCode==this.queryForm.sysCode)
                        }

                        var sysDictListArr=[]
                        var projectDictListArr=[]
                        var projectListArr=[]
                        var projectDictListArrSub=[]
                        var projectDictListArrQuery=[]
                        var sysProjectIdSysNameDictListArr=[]
                        data.forEach(it => {
                            sysProjectIdSysNameDictListArr.push({'dictValue': it.projectId||it.id, 'dictLabel': it.sysName})
                        })
                        data.forEach(it => {
                            sysDictListArr.push({'dictValue': it.sysCode, 'dictLabel': it.sysName})
                            projectListArr.push({'dictValue': it.projectId||it.id, 'dictLabel': it.projectName})
                        })
                        dataFilter.forEach(it => {
                            projectDictListArr.push({'dictValue': it.projectId||it.id, 'dictLabel': it.projectName})
                        })
                        dataFilterSub.forEach(it => {
                            projectDictListArrSub.push({'dictValue': it.projectId||it.id, 'dictLabel': it.projectName})
                        })
                        dataFilterQuery.forEach(it => {
                            projectDictListArrQuery.push({'dictValue': it.projectId||it.id, 'dictLabel': it.projectName})
                        })
                        const sysProjectIdSysNameMap = new Map();
                        this.sysProjectIdSysNameDictList = sysProjectIdSysNameDictListArr.filter((arr) => !sysProjectIdSysNameMap.has(arr.dictValue) && sysProjectIdSysNameMap.set(arr.dictValue, 1));

                        const sysMap = new Map();
                        this.sysCodeDictList = sysDictListArr.filter((arr) => !sysMap.has(arr.dictValue) && sysMap.set(arr.dictValue, 1));

                        const projectMap = new Map();
                        this.projectDictList = projectDictListArr.filter((arr) => !projectMap.has(arr.dictValue) && projectMap.set(arr.dictValue, 1));
                        const projectMap2 = new Map();
                        this.allProjectsList = projectListArr.filter((arr) => !projectMap2.has(arr.dictValue) && projectMap2.set(arr.dictValue, 1));
                        
                        const projectMapSub = new Map();
                        this.subProjectDictList = projectDictListArrSub.filter((arr) => !projectMapSub.has(arr.dictValue) && projectMapSub.set(arr.dictValue, 1));

                        const projectMapQuery= new Map();
                        this.queryProjectDictList = projectDictListArrQuery.filter((arr) => !projectMapQuery.has(arr.dictValue) && projectMapQuery.set(arr.dictValue, 1));
                    }
                    resolve(true);
                })
            })
             
        },
    },

}





