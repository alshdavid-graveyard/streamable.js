import { SimpleSubject } from "./simple-subject"
import { Handler, HandlerFunc } from "./handler"

export class BehaviorSubject<T> {
  private onRun = new SimpleSubject<T>()
  private onComplete = new SimpleSubject<void>()

  constructor(
    private value: T
  ) {}

  handler(cb: HandlerFunc) {
    const handler = new Handler(
      this.onRun,
      this.onComplete,
      cb,
      this.value,
    )
    cb(this.value, () => this.onComplete.emit())
    return handler
  }

  subscribe(handlerFunc: HandlerFunc): Handler<T> {
    const handler = this.handler(handlerFunc)
    handler.start()
    return handler
  }

  emit(value: T) {
    this.value = value
    this.onRun.emit(this.value) 
  }
  
  complete() {
    this.onComplete.emit()
  }
}
