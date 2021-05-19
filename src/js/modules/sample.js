export default class Sample {
  constructor(el) {
    this.el = el
    this.setVars()
    this.bindEvents()
  }

  setVars() {
    this.btn = this.el.querySelector('.btn')
    this.counter = this.el.querySelector('.counter')
    this.message = 'a click!'
    this.count = 0
  }

  bindEvents() {
    this.btn.addEventListener('click', this.myMethod)
  }

  /**
   * IMPORTANT:
   * Clean up anything HMR will need to reload
   * This is required for HMR to work correctly
   */
  cleanUp() {
    this.btn.removeEventListener('click', this.myMethod)
  }

  calculateStuff(a, b) {
    return a + b
  }

  myMethod = () => {
    this.count += 1
    this.counter.innerHTML = this.count

    if (this.count === 1) {
      alert(this.message)
    }
  }
}
