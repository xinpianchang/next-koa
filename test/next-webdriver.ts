declare global {
  namespace NodeJS {
    interface Global {
      sharedWD: (port: number, path: string) => Promise<any>
    }
  }
}

export default global.sharedWD