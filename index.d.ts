declare module '@kykjsoft/lodop' {
    getCLodop
}

interface Lodop{
    CVERSION:string
    VERSION:string
    PREVIEW:()=>voide
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

declare var CLODOP:CLodop | undefined;
declare var getCLodop: (()=>Lodop)|undefined;