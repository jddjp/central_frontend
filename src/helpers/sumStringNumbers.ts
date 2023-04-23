function sumStr(str: string){

  let strArr = str.split(",");
  let sum = 0
  
  for(let i = 0; i < strArr.length; i++) {
    sum += Number(strArr[i])
  }

  return sum.toString();
}

export { sumStr }