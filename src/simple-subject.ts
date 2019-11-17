const genKey = () => (Math.random() * Math.pow(10, 20)).toFixed(0).toString()

export class SimpleSubject<T> {
    subscribers: Record<string, (value: T) => void> = {}
  
    subscribe(cb: (value: T) => void): () => void {
      const key = genKey()
      this.subscribers[key] = cb
      return () => delete this.subscribers[key]
    }
  
    emit(value: T) {
      for (const key in this.subscribers) {
        this.subscribers[key](value)
      }
    }
  }