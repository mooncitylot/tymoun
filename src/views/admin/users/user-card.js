import { html, css, LitElement } from 'lit'
import { approveUser, deleteUser, setAdmin } from '../../../services/users.js'
import globalStyles from '../../../styles/global-styles.js'
import { deleteIcon, pencilSquareIcon } from '../../../styles/icons/action-icons.js'

export class UserCard extends LitElement {
  static properties = {
    user: { type: Object },
  }

  constructor() {
    super()
    /** @type {User} */
    this.user = null
  }

  editUser() {
    this.dispatchEvent(new CustomEvent('edit', { bubbles: true, composed: true, detail: this.user.userId }))
  }

  async deleteUser() {
    deleteUser(this.user.userId)
    this.dispatchUpdateEvent()
  }

  async approveUser() {
    await approveUser(this.user.userId)
    this.dispatchUpdateEvent()
  }

  async setAdmin() {
    await setAdmin(this.user.userId)
    this.dispatchUpdateEvent()
  }

  dispatchUpdateEvent() {
    this.dispatchEvent(new CustomEvent('update'))
  }

  render() {
    const { firstName, lastName, email, phone, approved, kind } = this.user

    return html`
      <div class="card">
        <h1>${firstName} ${lastName}</h1>
        <div><b>Email:</b> ${email}</div>
        <div><b>Phone:</b> ${phone}</div>
        <div class="actions">
          <div class="permissions">
            ${!approved ? html`<button class="outline" @click=${this.approveUser}>Approve</button>` : ''}
            ${kind !== 'Administrator' ? html`<button @click=${this.setAdmin}>Make Admin</button>` : ''}
          </div>
          <div class="icons">
            <div class="icon" @click=${this.editUser}>${pencilSquareIcon}</div>
            <div class="delete icon" @click=${this.deleteUser}>${deleteIcon}</div>
          </div>
        </div>
      </div>
    `
  }

  static styles = [
    globalStyles,
    css`
      :host {
        display: block;
        margin: 10px;
      }
      .actions {
        display: flex;
        justify-content: space-between;
      }
      .icons {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 16px;
      }
      .delete > svg {
        --fill-color: red;
        color: red;
      }
      .icon:hover > svg {
        opacity: 0.7;
        cursor: pointer;
      }
      @media screen and (max-width: 480px) {
        .actions {
          flex-direction: column;
          gap: 24px;
        }
        .icons {
          justify-content: flex-end;
        }
      }
    `,
  ]
}

customElements.define('user-card', UserCard)
export default UserCard
