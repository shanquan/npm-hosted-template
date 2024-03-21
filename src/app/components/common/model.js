/**
 * @author: wang.weili
 * @since : 2024/03/19
 * @description: 公共模板配置项
 */
const typeOptions = [{"label":"L10301","value":0},{"label":"L10302","value":1},{"label":"L10303","value":2}];
// common columns
const common = [
  {   
    "value": "name",
    "width": 150,
    "required": true,
    "queryable": true
  }, {
    "value": "version",
    "required": true,
    "queryable": true
  }, {
    "value": "description",
    "type": "textarea"
  }, {
    "value": "status",
    "required": true,
    "queryable": true,
    "type": "radio",
    "source": "statusOptions" // $root.statusOptions
  }, {
    "value": "currentVersion",
    "required": true,
    "type": "radio",
    "options": [{"value":"Y"},{"value":"N"}]
  }, {
    "value": "type",
    "label": "L10305",
    "required": true,
    "queryable": true,
    "type": "select",
    "options": typeOptions
  }, {
    "value": "sectionName",
    "required": true,
    "type": "select",
  }];
// suffix
const suffix = [{
  "value": "createName"
}, {
  "width": 150,
  "value": "createTime"
}, {
  "value": "updateName"
}, {
  "width": 150,
  "value": "updateTime"
}];

export default {
  typeOptions,
  common,
  suffix
}
