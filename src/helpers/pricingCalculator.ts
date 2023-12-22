import { BrokenPrice, BrokenPriceM } from "types/brokenPrices";

export const pricingCalculator = (brokenPrices: BrokenPriceM, weight: number): {price: number, tag:number} => {

  let price = 0
  let tag = 0

  let newArray = brokenPrices?.sort((a,b) => (a.attributes.cantidad < b.attributes.cantidad ? -1:1))
  if (!weight) return { price: 0, tag: 0 }

  for (let i = 0; i < brokenPrices?.length; i++) {
    let joins = [newArray[i], newArray[i+1]]
    console.log(joins)
    if (weight > joins[0].attributes.cantidad && weight <= joins[1].attributes.cantidad) {
      console.log("..............");
      price = weight * Number(joins[1].attributes.precio) 
      tag = Number(joins[1].attributes.precio)
    }
  }

  return { price, tag }
}