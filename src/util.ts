export interface Lodop{
    CVERSION:string
    VERSION:string
    PREVIEW:()=>void
    SET_LICENSES:(s1:string,s2:string,s3:string,s4:string)=>void
    /**初始化打印页面 */
    PRINT_INITA:(left:number,top:number,width:number,height:number,id:string)=>void
    /**设置页面尺寸 */
    SET_PRINT_PAGESIZE:(left:number,top:number,width:number,height:string)=>void
    /**添加文本 */
    ADD_PRINT_TEXT:(left:number,top:number,width:number,height:number,text:string)=>void
    /**添加线条 */
    ADD_PRINT_LINE:(x1:number,y1:number,x2:number,y2:number,n1:number,n2:number)=>void
    /**设置样式 */
    SET_PRINT_STYLEA:(type:number,key:"FontSize"|"Bold",value:number)=>void
    
}

interface CLodop {
    CVERSION:string
}

declare global {
    interface Window {
        getCLodop: (()=>Lodop)|undefined
        CLODOP:CLodop | undefined
    }
}

//==本JS是加载Lodop插件或Web打印服务CLodop/Lodop7的综合示例，可直接使用，建议理解后融入自己程序==

//用双端口加载主JS文件Lodop.js(或CLodopfuncs.js兼容老版本)以防其中某端口被占:
const MainJS = "CLodopfuncs.js",
    URL_WS1 = "ws://localhost:8000/" + MainJS,                //ws用8000/18000
    URL_WS2 = "ws://localhost:18000/" + MainJS,
    URL_HTTP1 = "http://localhost:8000/" + MainJS,              //http用8000/18000
    URL_HTTP2 = "http://localhost:18000/" + MainJS,
    URL_HTTP3 = "https://localhost.lodop.net:8443/" + MainJS;   //https用8000/8443

let CreatedOKLodopObject: any, CLodopIsLocal: any, LoadJsState: any;

//==判断是否需要CLodop(那些不支持插件的浏览器):==
function needCLodop() {
    try {
        const ua = navigator.userAgent;
        if (ua.match(/Windows\sPhone/i) ||
            ua.match(/iPhone|iPod|iPad/i) ||
            ua.match(/Android/i) ||
            ua.match(/Edge\D?\d+/i))
            return true;
        const verTrident = ua.match(/Trident\D?\d+/i);
        const verIE = ua.match(/MSIE\D?\d+/i);
        const verOPR = ua.match(/OPR\D?\d+/i);
        const verFF = ua.match(/Firefox\D?\d+/i);
        const x64 = ua.match(/x64/i);
        if ((!verTrident) && (!verIE) && (x64)) return true;
        else if (verFF) {
            const verFF2 = verFF[0].match(/\d+/);
            if ((Number(verFF2?.[0]) >= 41) || (x64)) return true;
        } else if (verOPR) {
            const verOPR2 = verOPR[0].match(/\d+/);
            if (Number(verOPR2?.[0]) >= 32) return true;
        } else if ((!verTrident) && (!verIE)) {
            const verChrome = ua.match(/Chrome\D?\d+/i);
            if (verChrome) {
                const verChrome2 = verChrome[0].match(/\d+/);
                if (Number(verChrome2?.[0]) >= 41) return true;
            }
        }
        return false;
    } catch (err) {
        return true;
    }
}

//==检查加载成功与否，如没成功则用http(s)再试==
//==低版本CLODOP6.561/Lodop7.043及前)用本方法==
function checkOrTryHttp() {
    if (window.getCLodop) {
        LoadJsState = "complete";
        return true;
    }
    if (LoadJsState == "loadingB" || LoadJsState == "complete") return;
    LoadJsState = "loadingB";
    const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    const JS1 = document.createElement("script")
        , JS2 = document.createElement("script")
        , JS3 = document.createElement("script");
    JS1.src = URL_HTTP1;
    JS2.src = URL_HTTP2;
    JS3.src = URL_HTTP3;
    JS1.onload = JS2.onload = JS3.onload = JS2.onerror = JS3.onerror = function () { 
        LoadJsState = "complete"; 
    }
    JS1.onerror = function (_e) {
        if (window.location.protocol !== 'https:')
            head.insertBefore(JS2, head.firstChild); else
            head.insertBefore(JS3, head.firstChild);
    }
    head.insertBefore(JS1, head.firstChild);
}

//==加载Lodop对象的主过程:==
(function loadCLodop() {
    if (!needCLodop()) return;
    if(window.getCLodop) return;
    CLodopIsLocal = !!((URL_WS1 + URL_WS2).match(/\/\/localho|\/\/127.0.0./i));
    LoadJsState = "loadingA";
    if (!window.WebSocket && (window as any).MozWebSocket) window.WebSocket = (window as any).MozWebSocket;
    //ws方式速度快(小于200ms)且可避免CORS错误,但要求Lodop版本足够新:
    try {
        const WSK1 = new WebSocket(URL_WS1);
        WSK1.onopen = function (_e) { setTimeout(checkOrTryHttp, 200); }
        WSK1.onmessage = function (e) { if (!window.getCLodop) eval(e.data); }
        WSK1.onerror = function (_e) {
            const WSK2 = new WebSocket(URL_WS2);
            WSK2.onopen = function (_e) { setTimeout(checkOrTryHttp, 200); }
            WSK2.onmessage = function (e) { if (!window.getCLodop) eval(e.data); }
            WSK2.onerror = function (_e) { checkOrTryHttp(); }
        }
    } catch (e) {
        checkOrTryHttp();
    }
}());

//==获取LODOP对象主过程,判断是否安装、需否升级:==
export function getLodop(oOBJECT?: any, oEMBED?: any) {
    const strFontTag = "<br><font color='#FF00FF'>打印控件";
    const strLodopInstall = strFontTag + "未安装!点击这里<a href='install_lodop32.zip' target='_self'>执行安装</a>";
    const strLodopUpdate = strFontTag + "需要升级!点击这里<a href='install_lodop32.zip' target='_self'>执行升级</a>";
    const strLodop64Install = strFontTag + "未安装!点击这里<a href='install_lodop64.zip' target='_self'>执行安装</a>";
    const strLodop64Update = strFontTag + "需要升级!点击这里<a href='install_lodop64.zip' target='_self'>执行升级</a>";
    const strCLodopInstallA = "<br><font color='#FF00FF'>Web打印服务CLodop未安装启动，点击这里<a href='CLodop_Setup_for_Win32NT.zip' target='_self'>下载执行安装</a>";
    const strCLodopInstallB = "<br>（若此前已安装过，可<a href='CLodop.protocol:setup' target='_self'>点这里直接再次启动</a>）";
    const strCLodopUpdate = "<br><font color='#FF00FF'>Web打印服务CLodop需升级!点击这里<a href='CLodop_Setup_for_Win32NT.zip' target='_self'>执行升级</a>";
    const strLodop7FontTag = "<br><font color='#FF00FF'>Web打印服务Lodop7";
    const strLodop7HrefX86 = "点击这里<a href='Lodop7_Linux_X86_64.tar.gz' target='_self'>下载安装</a>(下载后解压，点击lodop文件开始执行)";
    const strLodop7HrefARM = "点击这里<a href='Lodop7_Linux_ARM64.tar.gz'  target='_self'>下载安装</a>(下载后解压，点击lodop文件开始执行)";
    const strLodop7Install_X86 = strLodop7FontTag + "未安装启动，" + strLodop7HrefX86;
    const strLodop7Install_ARM = strLodop7FontTag + "未安装启动，" + strLodop7HrefARM;
    const strLodop7Update_X86 = strLodop7FontTag + "需升级，" + strLodop7HrefX86;
    const strLodop7Update_ARM = strLodop7FontTag + "需升级，" + strLodop7HrefARM;
    const strInstallOK = "，成功后请刷新本页面或重启浏览器。</font>";
    let LODOP: Lodop | undefined;
    try {
        const isWinIE = (/MSIE/i.test(navigator.userAgent)) || (/Trident/i.test(navigator.userAgent));
        const isWinIE64 = isWinIE && (/x64/i.test(navigator.userAgent));
        const isLinuxX86 = (/Linux/i.test(navigator.platform)) && (/x86/i.test(navigator.platform));
        const isLinuxARM = (/Linux/i.test(navigator.platform)) && (/aarch/i.test(navigator.platform));

        if (needCLodop() || isLinuxX86 || isLinuxARM) {
            try {
                LODOP = window.getCLodop!();
            } catch (err) { }
            if (!LODOP && LoadJsState !== "complete") {
                if (!LoadJsState)
                    alert("未曾加载Lodop主JS文件，请先调用loadCLodop过程."); else
                    alert("网页还没下载完毕，请稍等一下再操作.");
                return;
            }
            let strAlertMessage:string = '';
            if (!LODOP) {
                if (isLinuxX86)
                    strAlertMessage = strLodop7Install_X86;
                else if (isLinuxARM)
                    strAlertMessage = strLodop7Install_ARM;
                else
                    strAlertMessage = strCLodopInstallA + (CLodopIsLocal ? strCLodopInstallB : "");
                document.body.innerHTML = strAlertMessage + strInstallOK + document.body.innerHTML;
                return;
            } else {
                if (isLinuxX86 && LODOP.CVERSION < "7.0.6.4")
                    strAlertMessage = strLodop7Update_X86;
                else if (isLinuxARM && LODOP.CVERSION < "7.0.6.4")
                    strAlertMessage = strLodop7Update_ARM;
                else if (window.CLODOP!.CVERSION < "6.5.7.2")
                    strAlertMessage = strCLodopUpdate;

                if (strAlertMessage)
                    document.body.innerHTML = strAlertMessage + strInstallOK + document.body.innerHTML;
            }
        } else {
            //==如果页面有Lodop插件就直接使用,否则新建:==
            if (oOBJECT || oEMBED) {
                if (isWinIE)
                    LODOP = oOBJECT;
                else
                    LODOP = oEMBED;
            } else if (!CreatedOKLodopObject) {
                LODOP = document.createElement("object") as any;
                (LODOP as any).setAttribute("width", 0);
                (LODOP as any).setAttribute("height", 0);
                (LODOP as any).setAttribute("style", "position:absolute;left:0px;top:-100px;width:0px;height:0px;");
                if (isWinIE)
                    (LODOP as any).setAttribute("classid", "clsid:2105C259-1E0C-4534-8141-A753534CB4CA");
                else
                    (LODOP as any).setAttribute("type", "application/x-print-lodop");
                document.documentElement.appendChild((LODOP as any));
                CreatedOKLodopObject = LODOP;
            } else
                LODOP = CreatedOKLodopObject;
            //==Lodop插件未安装时提示下载地址:==
            if ((!LODOP) || (!LODOP.VERSION)) {
                document.body.innerHTML = (isWinIE64 ? strLodop64Install : strLodopInstall) + strInstallOK + document.body.innerHTML;
                return LODOP;
            }
            if (LODOP.VERSION < "6.2.2.6") {
                document.body.innerHTML = (isWinIE64 ? strLodop64Update : strLodopUpdate) + strInstallOK + document.body.innerHTML;
            }
        }
        //===如下空白位置适合调用统一功能(如注册语句、语言选择等):=======================

        LODOP.SET_LICENSES("", "13528A153BAEE3A0254B9507DCDE2839", "EDE92F75B6A3D917F65910", "D60BC84D7CF2DE18156A6F88987304CB6D8");
        //===============================================================================
        return LODOP;
    } catch (err) {
        alert("getLodop出错:" + err);
    }
}

