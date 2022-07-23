export async function returnThisWithTimeOut<T>(value: T, delay: number) {
  return await new Promise<T>((resolve, reject) => setTimeout(() => resolve(value), delay));
}

export async function throwThisWithTimeOut<T>(value: T, delay: number) {
  return await new Promise<T>((resolve, reject) => setTimeout(() => reject(value), delay));
}
