import { LitElement, html, css } from 'lit'
import globalStyles from '../../styles/global-styles.js'

import '../../shared/components/app-error.js'
import { go } from '../../router/router-mixin.js'
import routes from '../../router/routes.js'
import { newPassword } from '../../services/users.js'

class NewPasswordContainerElement extends LitElement {
  static properties = {
    token: { type: String },
    error: { type: String },
    email: { type: String },
    success: { type: Boolean },
    password: { type: String },
    confirmPassword: { type: String },
  }
  constructor() {
    super()

    this.error = ''
    this.success = false
  }

  /** @param {RouteEnterArgs} args */
  routeEnter({ context }) {
    this.token = context.params.token
    this.email = context.params.email
  }

  onKeyup(/** @type {FormInputEvent} */ { target: { id, value } }) {
    if (id === 'password') {
      this.password = value
    } else {
      this.confirmPassword = value
    }
  }

  async submit(/** @type {Event} */ e) {
    e.preventDefault()
    this.error = ''
    const { password, email, token, confirmPassword } = this

    if (password !== confirmPassword) {
      this.error = 'Passwords do not match.'
      return
    }

    try {
      await newPassword({ email, password, token })
      this.success = true
    } catch (error) {
      this.error = 'There was a problem resetting your password. Please try again.'
    }

    this.error = ''
  }

  render() {
    return this.success
      ? html`
          <h1>Success!</h1>
          <p>Your password has been reset.</p>
          <br />
          <button class="secondary" @click=${() => go(routes.LOGIN.path)}>Go To Login</button>
        `
      : html`
          <h1>Reset Password</h1>
          <p>Must be 8 characters long and contain at least one number, one uppercase and one lowercase letter.</p>
          <form @submit=${this.submit}>
            <input
              required
              title="Must be 8 characters long and contain at least one number, one uppercase and one lowercase letter."
              type="password"
              @keyup=${this.onKeyup}
              id="password"
              placeholder="Enter new password"
            />

            ${this.password && this.password.length > 8
              ? html`
                  <input
                    type="password"
                    required
                    title="Must be 8 characters long and contain at least one number, one uppercase and one lowercase letter."
                    @keyup=${this.onKeyup}
                    id="confirmPassword"
                    placeholder="Confirm password"
                  />

                  ${this.error ? html`<app-error>${this.error}</app-error>` : null}
                  <button type="submit">Save New Password</button>
                `
              : null}
            <button class="secondary" @click=${() => go(routes.LOGIN.path)}>Go To Login</button>
          </form>
        `
  }

  static styles = [
    globalStyles,
    css`
      :host {
        display: block;
        padding: 10px 20px;
      }
      form {
        padding: 0px;
      }
      p {
        font-size: 16px;
      }
    `,
  ]
}
customElements.define('new-password-container', NewPasswordContainerElement)
export default NewPasswordContainerElement
