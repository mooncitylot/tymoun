import { LitElement, html, css } from 'lit'
import globalStyles from '../../styles/global-styles.js'

import './login-form.js'

import routes from '../../router/routes.js'
import { go } from '../../router/router-mixin.js'
import { clearSession, getSessionUser, sessionIsExpired } from '../../session/session.js'

/** @type {ViewElement} */
class LoginContainerElement extends LitElement {
  static properties = {
    email: { type: String },
  }

  /** @param {RouteEnterArgs} next */
  routeEnter({ context }) {
    if (context.params?.email) this.email = context.params.email

    if (!sessionIsExpired()) {
      const user = getSessionUser()
      if (user?.kind === 'Administrator') return go(routes.ADMIN.path)
      if (user?.kind === 'Client') return go(routes.DASHBOARD.path)
    }

    clearSession()
  }

  render() {
    return html` <login-form .email=${this.email}></login-form>`
  }

  static styles = [
    globalStyles,
    css`
      :host {
        display: block;
        background-color: gray;
      }
    `,
  ]
}

customElements.define('login-container', LoginContainerElement)
export default LoginContainerElement
