const sendRandomId = (items: number[]) => {
  return items[Math.floor(Math.random()*items.length)]
}

const sendRandomIdString = (items: string[]) => {
  return items[Math.floor(Math.random()*items.length)]
}

export { sendRandomId, sendRandomIdString }