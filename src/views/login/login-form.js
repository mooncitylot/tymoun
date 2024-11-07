import { LitElement, html, css } from 'lit'
import globalStyles from '../../styles/global-styles.js'

import '../../shared/components/app-dialog.js'
import '../../shared/components/app-error.js'

import { routes } from '../../router/routes.js'
import { go } from '../../router/router-mixin.js'
import { getUserById, loginUser } from '../../services/users.js'
import { setSessionData, setSessionUser } from '../../session/session.js'

import permissionTypes from '../../permissions/permissions.js'

class LoginForm extends LitElement {
  static properties = {
    email: { type: String },
    error: { type: String },
  }
  constructor() {
    super()
    this.email = ''
    this.error = ''
  }
  /** @param {Event & {target: HTMLFormElement}} e */
  async handleFormSubmit(e) {
    e.preventDefault()
    try {
      const data = /** @type {{email: string, password: string}} */ (
        /** @type {*} */ (Object.fromEntries(new FormData(e.target).entries()))
      )
      // enforce lower case
      // TODO: handle this in the api
      data.email = data.email.toLowerCase()

      const { expiry, token, userId } = await loginUser({ email: data.email, password: data.password })
      setSessionData({ expiry, token })
      const user = await getUserById(userId)
      setSessionUser(user)

      if (user.kind === permissionTypes.SUPERUSER) return go(routes.ADMIN.path)
      if (user.kind === permissionTypes.ADMIN) return go(routes.ADMIN.path)
      if (user.kind === permissionTypes.CLIENT) return go(routes.DASHBOARD.path)

      go(routes.MAP.children.SERVICES.path)
    } catch (error) {
      // TODO: make sure this is the error the client wants. Does the app require approval?
      this.error =
        'There was a problem logging in. Please try again. If this is your first login, your account might not have been approved yet.'

      // @ts-ignore
      this.shadowRoot.querySelector('input[name="password"]').value = ''
    }
  }

  /** @param {FormInputEvent} e */
  handleEmailKeyup(e) {
    e.preventDefault()
    this.email = e.target.value
  }

  render() {
    return html`
      <app-dialog logoHeader .closeButton=${false}>
        <form
          slot="body"
          autocomplete="on"
          @submit=${this.handleFormSubmit}
          @keypress=${(/** @type {*} */ e) => {
            if (e.key === 'Enter')
              // @ts-ignore
              this.shadowRoot.querySelector('#submit-button').click()
          }}
        >
          <input
            autocomplete="on"
            @keyup=${this.handleEmailKeyup}
            @invalid="this.setCustomValidity('Please enter your email')"
            type="text"
            value=${this.email}
            name="email"
            placeholder="Email"
            required
          />
          <input
            autocomplete="on"
            @invalid="this.setCustomValidity('Please enter a valid password')"
            title="Must be 8 characters long and contain at least one number, one uppercase and one lowercase letter."
            type="password"
            name="password"
            placeholder="Password"
            required
          />

          ${this.error ? html`<app-error>${this.error}</app-error>` : null}
          <button type="submit" id="submit-button">Log In</button>
          <div class="separator-bar">
            <span class="separator-text">OR</span>
          </div>
          <button class="secondary outline" @click=${() => go(routes.SIGNUP.path)}>Sign Up</button>
          <a @click=${() => go(routes.LOGIN.children.FORGOT_PASSWORD.path, this.email ? { email: this.email } : {})}
            >Forgot Password?</a
          >
        </form>
      </app-dialog>
    `
  }

  static styles = [
    globalStyles,
    css`
      :host {
        display: block;
      }
      app-dialog {
        --app-dialog-header-padding: 0px;
      }
      .separator-bar {
        border-top: 1px solid #cbd2d6;
        position: relative;
        margin-top: 20px;
        margin-bottom: 10px;
        height: 15px;
        font-size: 83.34%;
        text-align: center;
      }
      .separator-text {
        background-color: #fff;
        padding: 0 0.5em;
        position: relative;
        color: #6c7378;
        top: -0.7em;
      }
      .sign-up-button:hover {
        background-color: var(--forest);
        color: white;
      }
      /** input plcaeholder black */
      input::-webkit-input-placeholder {
        color: black;
        opacity: 0.5;
      }
      button {
        margin: 0px;
        width: 100%;
      }
    `,
  ]
}

customElements.define('login-form', LoginForm)
export default LoginForm
