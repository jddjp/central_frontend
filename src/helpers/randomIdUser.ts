const sendRandomId = (items: number[]) => {
  return items[Math.floor(Math.random()*items.length)]
}

export { sendRandomId }