/**
 * @author: wang.weili
 * @since: 2023/04/11
 * @description: source from: https://github.com/sunlanda/vconsole-outputlog-plugin/
 */
import VConsole from 'vconsole';
// import copy from 'copy-to-clipboard';
 
class VConsoleOutputLogsPlugin {
  constructor(vConsole) {
    this.vConsole = vConsole;
    this.$ = vConsole.$;
    this.dom = null;
    return this.init();
  }

  init() {
    const vConsoleExportLogs = new VConsole.VConsolePlugin(
      "ExportLog",
      "ExportLog"
    );

    vConsoleExportLogs.on("ready", () => {
      // console.log('[vConsole-exportlog-plugin] -- load');
    });
    vConsoleExportLogs.on("renderTab", (callback) => {
      const html = `<div class="vconsole-exportlog">
      </div>`;
      callback(html);
    });
    vConsoleExportLogs.on("addTool", (callback) => {
      const buttons = [
        {
          name: "exportLogs",
          onClick: this.export,
        },
        {
          name: "copyLogs",
          onClick: this.copyText,
        },
        {
          name: "uploadLogs",
          onClick: this.upload,
        },
      ];
      callback(buttons);
    });
    this.vConsole.addPlugin(vConsoleExportLogs);
    return vConsoleExportLogs;
  }
  getTabLog = ()=>{ // 获取Log当前Tab下的内容
    let nodeArr = document.querySelectorAll(".vc-log-row .vc-log-val")
    let _str = ''
    for (let i = 0; i < nodeArr.length; i++) {
      const ele = nodeArr[i];
      _str+=`${ele.textContent}\n`
    }
    return _str
  }
  funDownload = (content, filename) => {
    var eleLink = document.createElement("a");
    eleLink.download = filename;
    eleLink.style.display = "none";
    var blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
  }
  export = () => {
    this.funDownload(this.getTabLog(),`${new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()}.log`)
  }
  copyText = () => {
    let $ipt = document.getElementById("copyIpt");
    $ipt.value = this.getTabLog();
    $ipt.select();
    document.execCommand("Copy");
  }
  upload = ()=>{
    // @todo
    // console.log(this.getTabLog())
  }
}

export default VConsoleOutputLogsPlugin;