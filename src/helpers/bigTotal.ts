import { ArrayNumbers } from "types/ArrayNums"

const bigTotal = (arr: ArrayNumbers[]) =>  {
  
  let totalBts = 0
  let totalKg = 0
  
  const separate = arr?.map((e: ArrayNumbers) => {
    return e.attributes.array_numeros.split('=')
  }).flat()
  
  const extract = separate?.filter(e => e.includes('Bts') || e.includes('Kg/L'))
  
  for(let i = 0; i < extract?.length; i++) {
    if(extract[i]?.includes('Bts')){
      let result = extract[i].replace(/[^0-9]/g,"");
      totalBts += Number(result)
    }
    
    if(extract[i]?.includes('Kg/L')){
      let result = extract[i].replace(/[^0-9]/g,"");
      totalKg += Number(result)
    }
  }
  
  return { totalBts, totalKg}
}

export { bigTotal }