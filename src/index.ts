
import { getLodop as _getLodop } from './util'
import type { Lodop } from './util'

let lodop:Lodop|undefined

export const getLodop = ()=>{
    lodop = lodop || _getLodop() as Lodop;
    return lodop
}



export const printView = ()=>{

}