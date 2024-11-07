import { LitElement, html, css } from 'lit'

import { getUser } from '../../services/users.js'
import globalStyles from '../../styles/global-styles.js'
import { getSessionUser } from '../../session/session.js'
import '../../styles/icons/dashboard-icons.js'

class DashboardContainer extends LitElement {
  static properties = {
    user: { type: Object },
  }

  constructor() {
    super()

    /** @type {User} */
    this.user = null
  }

  async routeEnter() {
    try {
      this.user = await getUser(getSessionUser()?.userId)
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    return html`
      <h1>Welcome ${this.user.firstName}</h1>
      <p>This is a dashboard for a session user.</p>
    `
  }

  static styles = [globalStyles, css``]
}
customElements.define('dashboard-container', DashboardContainer)
export default DashboardContainer
