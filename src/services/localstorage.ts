export const saveObj = (key: string, o: any) => {
  localStorage.setItem(key, JSON.stringify(o));
}

export const loadObj = <T>(key: string): T => {
  const data = localStorage.getItem(key);
  if(data === null) {
    throw new Error('Its not possible to get the element with the key ' + key);
  } else {
    return JSON.parse(data) as T;
  }
}