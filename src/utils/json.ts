import {StateTree} from "pinia";

/**
 * 解决json不能序列化包含bigint的对包含象(注意：超大的int数据会损失精度).
 * @param k
 * @param v
 */
export const stringifyReplacer = (k:string, v:any):any => {
    if(typeof v == "bigint"){
        return Number(v);
    }
    return v;
}

export const piniaSerializer = {
    serialize: (value: StateTree):string =>{
       return JSON.stringify(value, stringifyReplacer);
    },
    deserialize:(value: string):StateTree => {
        return JSON.parse(value);
    }
}