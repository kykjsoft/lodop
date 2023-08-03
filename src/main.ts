import './style.css'
import { getLodop } from './index'

const btn1 = document.querySelector('#btn1')
btn1?.addEventListener('click', () => {
  const LODOP = getLodop()
  LODOP.PRINT_INITA(0, 0, 577, 10000, "打印控件功能演示_Lodop功能_不同高度幅面");
  LODOP.SET_PRINT_PAGESIZE(3, 1505, 45, "");
  LODOP.ADD_PRINT_TEXT(8, 136, 275, 30, "北京市东城区沃乐福商城收款票据");
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
  LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
  LODOP.ADD_PRINT_TEXT(50, 15, 100, 20, "商品编号");
  LODOP.ADD_PRINT_TEXT(50, 149, 100, 20, "商品名称");
  LODOP.ADD_PRINT_TEXT(50, 289, 100, 20, "商品数量");
  LODOP.ADD_PRINT_TEXT(50, 409, 100, 20, "单价(元)");
  LODOP.ADD_PRINT_LINE(45, 14, 43, 512, 0, 2);
  LODOP.ADD_PRINT_LINE(76, 14, 44, 16, 0, 2);
  LODOP.ADD_PRINT_LINE(76, 132, 44, 134, 0, 2);
  LODOP.ADD_PRINT_LINE(76, 270, 44, 272, 0, 2);
  LODOP.ADD_PRINT_LINE(76, 398, 44, 400, 0, 2);
  LODOP.ADD_PRINT_LINE(76, 512, 44, 514, 0, 2);
  LODOP.ADD_PRINT_LINE(78, 14, 76, 512, 0, 2);
  LODOP.ADD_PRINT_LINE(78, 14, 0, 400, 0, 2);

  //--行内容
  var j = Number((document.getElementById("rownumber")! as HTMLInputElement).value);
  for (let i = 0; i < j; i++) {
    LODOP.ADD_PRINT_TEXT(81 + 25 * i, 15, 81, 20, "000-" + i);
    LODOP.ADD_PRINT_TEXT(81 + 25 * i, 149, 81, 20, "商品A" + i);
    LODOP.ADD_PRINT_TEXT(81 + 25 * i, 289, 81, 20, "1.00");
    LODOP.ADD_PRINT_TEXT(81 + 25 * i, 409, 81, 20, "10.00");
    //--格子画线		
    LODOP.ADD_PRINT_LINE(101 + 25 * i, 14, 76 + 25 * i, 15, 0, 1);
    LODOP.ADD_PRINT_LINE(101 + 25 * i, 132, 76 + 25 * i, 133, 0, 1);
    LODOP.ADD_PRINT_LINE(101 + 25 * i, 270, 76 + 25 * i, 271, 0, 1);
    LODOP.ADD_PRINT_LINE(101 + 25 * i, 398, 76 + 25 * i, 399, 0, 1);
    LODOP.ADD_PRINT_LINE(101 + 25 * i, 512, 76 + 25 * i, 513, 0, 1);
    LODOP.ADD_PRINT_LINE(102 + 25 * i, 14, 101 + 25 * i, 512, 0, 1);
  }
  LODOP.ADD_PRINT_LINE(101 + 25 * j, 14, 102 + 25 * j, 510, 0, 1);
  LODOP.ADD_PRINT_TEXT(105 + 25 * j, 20, 300, 20, "打印时间：2015-12-15 12:19");
  LODOP.ADD_PRINT_TEXT(105 + 25 * j, 346, 150, 20, "合计金额：" + 10 * j);
  LODOP.PREVIEW();//打印预览	
})