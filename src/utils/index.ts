
export const reduceAddress = (e:string) => {
  const address = e.substring(0, 6) + "..." +e.substring(e.length-4, e.length)
  return address
}

