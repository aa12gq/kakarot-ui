export enum Strength {
    Empty,
    Weak,
    Normal,
    Strong
}

export const RegExpValidator = {
    'lowerCase': RegExp(/^(?=.*?[a-z])/),
    'allLowerCase': RegExp(/^[a-z]+$/),
    'upperCase': RegExp(/^(?=.*?[A-Z])/),
    'allUpperCase': RegExp(/^[A-Z]+$/),
    'digit': RegExp(/^(?=.*?[0-9])/),
    'allDigit': RegExp(/^[0-9]+$/),
    'specialChar': RegExp(/^(?=.*?[" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])/),
};
/**
 * 获取密码强度。
 * @param pwd
 * @constructor
 * @return 小于6位，或者全为大写，或全为小写，或全为数字则为弱密;包含特殊字符为强密码;为空返回empty;其他为一般；
 */
export const GetPasswordStrength = (pwd: string): Strength => {
    if(pwd.length < 1){
        return Strength.Empty;
    }
    if(pwd.length < 6) {
        return Strength.Weak;
    }
    if(pwd.length < 6 || pwd.search(RegExpValidator.allLowerCase) >= 0 || pwd.search(RegExpValidator.allUpperCase) >= 0 || pwd.search(RegExpValidator.allDigit) >= 0){
        return Strength.Weak;
    }
    if(pwd.search(RegExpValidator.specialChar) >=0 ){
        return Strength.Strong;
    }
    return Strength.Normal;
}