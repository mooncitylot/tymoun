import { LitElement, html, css } from 'lit'

import '../../shared/components/app-error.js'
import '../../shared/components/app-dialog.js'

import globalStyles from '../../styles/global-styles.js'
import { signupUser } from '../../services/users.js'
import { go } from '../../router/router-mixin.js'
import { routes } from '../../router/routes.js'

class SignupForm extends LitElement {
  static properties = {
    email: { type: String },
    success: { type: Boolean },
    error: { type: String },
    password: { type: String },
  }

  constructor() {
    super()
    this.email = ''
    this.error = ''
    this.success = false
    this.password = ''
  }

  /** @param {Event & {target: HTMLFormElement}} e */
  async handleFormSubmit(e) {
    e.preventDefault()

    this.error = null
    const data = /** @type {UserSignup} */ (/** @type {*} */ (Object.fromEntries(new FormData(e.target).entries())))
    data.email = data.email.toLowerCase()

    try {
      await signupUser(data)
      this.success = true
    } catch (error) {
      this.error =
        'There was a problem creating your account. Try again later. If this keeps happening, please let us know.'
    }
  }

  /** @param {FormInputEvent} e */
  handlePasswordKeyup(e) {
    this.password = e.target.value
  }

  // TODO: implement password validation

  render() {
    if (this.success)
      return html` <app-dialog logoHeader .closeButton=${false}>
        <div slot="body">
          <p>Your account has been created.</p>
          <p>You will recieve an email once your account has been approved.</p>
          <button @click=${() => go(routes.LOGIN.path)}>Go To Login</button>
        </div>
      </app-dialog>`

    // TODO: update password validation to match backend and what client wants
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
          <label show-required for="firstName">First Name</label>
          <input autocomplete="on" type="text" name="firstName" required />
          <label show-required for="lastName">Last Name</label>
          <input autocomplete="on" type="text" name="lastName" required />
          <label show-required for="phone">Phone</label>
          <input autocomplete="on" type="text" name="phone" required />
          <label show-required for="email">Email</label>
          <input
            autocomplete="on"
            @invalid="this.setCustomValidity('Please enter your email')"
            type="email"
            value=${this.email}
            name="email"
            required
          />
          <label show-required for="password">Password</label>
          <input
            @keyup=${this.handlePasswordKeyup}
            autocomplete="on"
            @invalid="this.setCustomValidity('Please enter a valid password')"
            pattern="^.{8}$"
            title="Must be 8 characters long and contain at least one number, one uppercase and one lowercase letter."
            type="password"
            name="password"
            required
          />
          <em
            >Passwords must be 8 characters long and contain at least one number, one uppercase and one lowercase
            letter.
          </em>
          <label show-required for="password">Confirm Password</label>
          <input autocomplete="on" type="password" name="confirm-password" required />
          ${this.error ? html` <app-error>${this.error}</app-error> ` : null}
          <div class="buttons">
            <button type="submit" id="submit-button">Sign Up</button>
            <button class="secondary outline" @click=${() => go(routes.LOGIN.path)}>Go To Login</button>
          </div>
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
      p {
        font-size: 1rem;
      }
      form {
        padding: 0px;
      }
      input {
        height: 35px;
      }
      app-dialog {
        --app-dialog-header-padding: 0px;
      }
      .buttons {
        display: flex;
        flex-direction: column;
      }
      app-error {
        display: block;
        width: 100%;
        text-align: center;
      }
    `,
  ]
}

customElements.define('signup-form', SignupForm)
export default SignupForm
