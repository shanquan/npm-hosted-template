const deepClone = function(source, hash = new WeakMap()){
  if(typeof source != 'object'|| !source) return source;
  if(hash.has(source)) return hash.get(source)
  const target = Array.isArray(source) ? [] : {};
  hash.set(source, target);
  for( let key in source){
    if(Object.prototype.hasOwnProperty.call(source, key)){
    target[key] = deepClone(source[key], hash)
  }
}
return target;
}
const getBuffer = function(s) {
  let buf = new ArrayBuffer(s.length);
  let view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}
const getImageBase64 = function(file){
  return new Promise(function(resolve, reject) {
  let reader = new FileReader();
  let imgResult = "";
  reader.readAsDataURL(file);
  reader.onload = function() {
      imgResult = reader.result;
  };
  reader.onerror = function(error) {
      reject(error);
  };
  reader.onloadend = function() {
      resolve(imgResult);
  };
  });
}
/**
 * generateRandom 产生任意长度随机字母数字组合
 * randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
 */
const generateRandom = function(randomFlag, min, max) {
  var str = "",
      range = min,
      arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  // 随机产生
  if (randomFlag) {
      range = Math.round(Math.random() * (max - min)) + min;
  }
  for (var i = 0; i < range; i++) {
      var pos = Math.round(Math.random() * (arr.length - 1));
      str += arr[pos];
  }
  return str;
}
const validIp = function(ip){
  return /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/.test(ip) || /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/.test(ip)
}
const checkParams = function(formParam){
  for (let key in formParam) {
  let notEmptyArray = (formParam[key] instanceof Array)&&formParam[key].length;
  let notEmpty = !(formParam[key] instanceof Object)&&(formParam[key]||formParam[key]===0||formParam[key]===false);
  if(notEmptyArray||notEmpty){
      return true
  }
  }
  return false||Object.keys(formParam).length==0
}
export {deepClone,getBuffer,getImageBase64,generateRandom,validIp,checkParams}