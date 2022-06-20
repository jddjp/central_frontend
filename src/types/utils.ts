export type Overwrite<T, R> = Omit<T, keyof R> & R;
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;