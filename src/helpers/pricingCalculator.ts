import { BrokenPrice } from "types/brokenPrices";

export const pricingCalculator = (brokenPrices: BrokenPrice, weight: number): {price: number, tag:number} => {

  let price = 0
  let tag = 0

  if (!weight) return { price: 0, tag: 0 }

  for (let i = 0; i < brokenPrices?.length; i++) {
    let joins = [brokenPrices[i], brokenPrices[i+1]]

    if (weight > Object.values(joins[0])[0] && weight <= Object.values(joins[1])[0]) {
      price = weight * Number(Object.keys(joins[1])[0]) 
      tag = Number(Object.keys(joins[1])[0])
    }
  }

  return { price, tag }
}