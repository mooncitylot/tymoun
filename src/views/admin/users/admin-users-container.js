import { LitElement, html, css } from 'lit'
import { getAllUsers } from '../../../services/users.js'

import './user-card.js'
import '../../../shared/components/loading-spinner.js'
import './admin-user-form.js'

class AdminUsersContainer extends LitElement {
  static properties = {
    users: { type: Array },
    selectedUser: { type: String },
    loading: { type: Boolean },
  }

  constructor() {
    super()
    /** @type {User[]} */
    this.users = []
    /** @type {User} */
    this.selectedUser = null
    this.loading = false
  }

  connectedCallback() {
    super.connectedCallback()
    this.getUsers()
  }

  async getUsers() {
    this.loading = true

    try {
      this.users = await getAllUsers()
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      this.loading = false
    }
  }

  /** @param {CustomEvent} e */
  editUser(e) {
    this.selectedUser = this.users.find((u) => u.userId == e.detail)
  }

  editUserSave() {
    this.selectedUser = null
    this.getUsers()
  }

  cancelEdit() {
    this.selectedUser = null
  }

  render() {
    if (this.loading)
      return html` <div class="loading">
        <loading-spinner />
      </div>`

    if (this.selectedUser)
      return html`<admin-user-form
        @cancel=${this.cancelEdit}
        @save=${this.editUserSave}
        .user=${this.selectedUser}
      ></admin-user-form>`

    return html`
      <div class="list">
        ${this.users.map(
          (user) => html` <user-card @edit=${this.editUser} @update=${this.getUsers} .user=${user}></user-card>`
        )}
      </div>
    `
  }

  static styles = css`
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
    .list {
      display: block;
      overflow-y: scroll;
      padding-bottom: 400px;
    }
  `
}

customElements.define('admin-users-container', AdminUsersContainer)
