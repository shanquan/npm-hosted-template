const dictKey=`${window.location.hostname}_${window.location.port}_${process.env.VUE_APP_CODE}_dict`
const sysProjectKey=`${window.location.hostname}_${window.location.port}_${process.env.VUE_APP_CODE}_sysProject`

function getSysProject(){
    return new Promise((resolve, reject) => {
        var list=JSON.parse(localStorage.getItem(this.sysProjectKey))||[];
        if(list&&list.length > 0) {
            resolve(list);
            return true;
        }
        this.$http.axios.post(`user/exi/mesSysProject/getList`,{}, {headers: {'showError': false,'token':''}}).then(res => {
            var data=res.DATA||[];
            localStorage.setItem(this.sysProjectKey,JSON.stringify(data))
            resolve(data);
            return true;
        }, err => {
            reject(err);
        }).catch(err => {
                reject(err);
            }
        )
    });
}
function getDictList(dictTypes){
    return new Promise((resolve, reject) => {
        var dict=JSON.parse(localStorage.getItem(this.dictKey))||{};
        let params = dictTypes.reduce((o, v, i) => {
            if(!dict[v]||dict[v].length == 0){
                o.push(v);
            }
            return o;
        },[]);
        if(params.length === 0) {
            resolve(dict);
            return true;
        }
        this.$http.getByDictTypes(params).then(res => {
                params.map(v => {
                    var data=res.DATA[v]||[];
                    dict[v]=data
                });
                localStorage.setItem(this.dictKey,JSON.stringify(dict))
                var result=JSON.parse(localStorage.getItem(this.dictKey));
                resolve(result);
                return true;
            }, err => {
                reject(err);
            }).catch(err => {
                    reject(err);
                }
            )
    });
}

function getLabelByType(dictType,dictValue){
        var dictLabel = dictValue
        var eops_dict= JSON.parse(localStorage.getItem(this.dictKey))
        if(!eops_dict||!eops_dict[dictType]||eops_dict[dictType].length==0){
            getDictList([dictType])
        }
        var list=eops_dict[dictType]
        dictLabel=getLabelByList(list,dictValue);
        return dictLabel;

}

function getLabelByList(list,dictValue){
    var dictLabel = dictValue;
    if (dictValue !== '' && list) {
        for (var i = 0; i < list.length; i++) {
            var map = list[i];
            if (map.dictValue == dictValue) {
                dictLabel = map.dictLabel;
                break;
            }
        }
    }
    return dictLabel;
}

function getDictByList(list,dictValue){
    var dictLabel = dictValue;
    if (dictValue !== '' && list) {
        for (var i = 0; i < list.length; i++) {
            var map = list[i];
            if (map.dictValue == dictValue) {
                dictLabel = map.dictLabel;
                break;
            }
        }
    }
    return dictLabel;
}

function getLabelByProjectId(list,dictValue){
    var dictLabel = dictValue;
    if (dictValue !== '' && list) {
      for (var i = 0; i < list.length; i++) {
        var map = list[i];
        if (map.dictValue == dictValue) {
          dictLabel = map.dictLabel;
          break;
        }
      }
    }
    return dictLabel;
}

export default {
    install(Vue,options){
        Vue.prototype.getDictList = getDictList;
        Vue.prototype.getLabelByType=getLabelByType;
        Vue.prototype.getLabelByList = getLabelByList;
        Vue.prototype.getDictByList = getDictByList;
        Vue.prototype.getLabelByProjectId = getLabelByProjectId;
        Vue.prototype.getSysProject = getSysProject;
        Vue.prototype.dictKey = dictKey;
        Vue.prototype.sysProjectKey = sysProjectKey;
    }
};

