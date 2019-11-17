import { SimpleSubject } from "./simple-subject"
import { Handler, HandlerFunc } from "./handler"

export class Observable<T> {
  private onRun = new SimpleSubject<T>()
  private onComplete = new SimpleSubject<void>()

  constructor(
    observerFunc: (observer: { emit: (value: T) => void, complete: () => void }) => void,
  ) {
    observerFunc({
      emit: this.emit.bind(this),
      complete: this.complete.bind(this),
    })
  }

  handler(cb: HandlerFunc) {
    return new Handler(
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

  private emit(value: T) {
    this.onRun.emit(value)
  }

  private complete() {
    this.onComplete.emit()
  }
}
