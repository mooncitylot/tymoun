import { LitElement, html, css } from 'lit-element'

import routes from '../../../router/routes.js'
import globalStyles from '../../../styles/global-styles.js'
import { go } from '../../../router/router-mixin.js'
import { resetPassword } from '../../../services/users.js'

class LoginForgotPasswordContainer extends LitElement {
  static get properties() {
    return {
      email: { type: String },
      success: { type: Boolean },
      error: { type: String },
    }
  }

  constructor() {
    super()
    this.email = ''
    this.error = ''
    this.success = false
  }

  /** @param {RouteEnterArgs} routeEnterArgs */
  routeEnter({ context: { params } }) {
    this.email = params.email
  }

  /** @param {FormEvent} event */
  async handleSubmit(event) {
    event.preventDefault()
    const email = new FormData(event.target).get('email').toString()

    try {
      await resetPassword({ email })
      this.success = true
    } catch (error) {
      this.error = 'There was a problem resetting your password.'
    }
  }

  render() {
    if (this.success)
      return html`
        <p>Your password reset has been initiated. Please check your email for further instructions.</p>
        <button @click=${() => go(routes.LOGIN.path)}>Go to Login</button>
      `
    return html`
      <form @submit=${this.handleSubmit}>
        <label>
          Email:
          <input type="email" name="email" .value=${this.email || ''} />
        </label>
        <button type="submit">Reset Password</button>
        <button @click=${() => go(routes.LOGIN.path)}>Go to Login</button>
        ${this.error ? html`<p>${this.error}</p>` : ''}
      </form>
    `
  }

  static styles = [globalStyles, css``]
}

customElements.define('login-forgot-password-container', LoginForgotPasswordContainer)
