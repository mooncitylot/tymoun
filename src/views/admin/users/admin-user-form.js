import { LitElement, html, css } from 'lit-element'
import { updateUser } from '../../../services/users.js'
import { toast } from '../../../shared/toast.js'
import globalStyles from '../../../styles/global-styles.js'
import { getDateInputValue, getDisplayDate } from '../../../shared/date-util.js'

class AdminUserDetailElement extends LitElement {
  static properties = {
    user: { type: Object },
  }

  constructor() {
    super()

    /** @type {User} */
    this.user = null
  }

  /** @param {FormEvent} e */
  updateUser(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    updateUser(
      Object.assign(this.user, {
        phone: String(formData.get('phone')),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        address: formData.get('address'),
        address2: formData.get('address2'),
        city: formData.get('city'),
        state: formData.get('state'),
        zip: formData.get('zip'),
      })
    )
      .then(() => {
        this.dispatchEvent(new CustomEvent('save', { bubbles: true, composed: true }))
        toast('User updated')
      })
      .catch((error) => {
        toast('There was a problem updating the user', true)
        console.error(error)
      })
  }

  render() {
    return html`
      <form @submit=${this.updateUser}>
        <label>First Name:</label>
        <input type="text" .value=${this.user.firstName || ''} name="firstName" />
        <label>Last Name:</label>
        <input type="text" .value=${this.user.lastName || ''} name="lastName" />
        <label> Address:</label>
        <input type="text" .value=${this.user.address || ''} name="address" />
        <label>Address 2:</label>
        <input type="text" .value=${this.user.address2 || ''} name="address2" />
        <label>City:</label>
        <input type="text" .value=${this.user.city || ''} name="city" />
        <label>State:</label>
        <input type="text" .value=${this.user.state || ''} name="state" />
        <label>Zip:</label>
        <input type="text" .value=${this.user.zip || ''} name="zip" />
        <input type="tel" .value=${this.user.phone || ''} name="phone" />
        <button type="submit">Save</button>
        <button
          @click=${(/** @type {Event} */ e) => {
            e.preventDefault()
            this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }))
          }}
        >
          Cancel
        </button>
      </form>
    `
  }

  static styles = [globalStyles, css``]
}

customElements.define('admin-user-form', AdminUserDetailElement)
