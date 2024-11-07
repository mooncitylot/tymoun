import { LitElement, html, css } from 'lit'
import './signup-form.js'
class SignupContainer extends LitElement {
  constructor() {
    super()
  }
  render() {
    return html` <signup-form></signup-form> `
  }

  static styles = [
    css`
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 100px;
      }
      signup-form {
        width: 400px;
      }
    `,
  ]
}
customElements.define('signup-container', SignupContainer)
export default SignupContainer
