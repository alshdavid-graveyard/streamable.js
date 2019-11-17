import { SimpleSubject } from "./simple-subject"
import { Handler, HandlerFunc } from "./handler"

export class Subject<T> {
  private onRun = new SimpleSubject<T>()
  private onComplete = new SimpleSubject<void>()

  handler(cb: HandlerFunc) {
    return new Handler<T>(
      this.onRun,
      this.onComplete,
      cb,
    )
  }

  subscribe(handlerFunc: HandlerFunc): Handler<T> {
    const handler = this.handler(handlerFunc)
    handler.start()
    return handler
  }

  emit(value: T) {
    this.onRun.emit(value) 
  }
  
  complete() {
    this.onComplete.emit()
  }
}
