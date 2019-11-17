import { SimpleSubject } from "./simple-subject"

export type HandlerFunc<T = any> = (value: T, done: () => void) => void

export class Handler<T> {
  private complete = false
  private emitting = false

  constructor(
    private onRun: SimpleSubject<T>,
    private onComplete: SimpleSubject<void>,
    private handlerFunc: HandlerFunc = () => {},
    private lastValue: T | undefined = undefined,
  ) {
    const $1 = this.onRun.subscribe((value) => {
      if (
        this.emitting === false ||
        this.complete === true) {
        return
      }
      this.lastValue = value
      this.handlerFunc(
        value, 
        () => this.onComplete.emit()
      )
    })
    const $2 = this.onComplete.subscribe(() => {
      this.complete = true
      $1()
      $2()
    })
  }

  handler(handlerFunc: HandlerFunc): Handler<T> {
    return new Handler<T>(
      this.onRun, 
      this.onComplete, 
      handlerFunc,
      this.lastValue,
    )
  }

  subscribe(handlerFunc: HandlerFunc): Handler<T> {
    this.start()
    return this.handler(handlerFunc)
  }

  start() {
    this.emitting = true
    return this
  }

  stop() {
    this.emitting = false
    return this
  }

  toPromise() {
    return new Promise(res => {
      this.start()
      if (this.complete === true) {
        res(this.lastValue)
        return
      }
      const $ = this.onComplete.subscribe(() => {
        res(this.lastValue)
        $()
      })
    })
  }
}