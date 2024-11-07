import { LitElement, html, css } from 'lit'
import globalStyles from '../../styles/global-styles.js'
class AdminContainer extends LitElement {
  constructor() {
    super()
  }
  render() {
    return html` <h1>Admin</h1> `
  }

  static styles = [globalStyles, css``]
}
customElements.define('admin-container', AdminContainer)
export default AdminContainer
