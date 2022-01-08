export const isEmpty = (str) =>{
    str = str.replace(/\s/g,"").trim();
    return (!str || /^\s*$/.test(str));
}