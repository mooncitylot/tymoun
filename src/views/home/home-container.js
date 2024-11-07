import { LitElement, html, css } from 'lit'

class HomeContainer extends LitElement {
  static styles = css`
    .home-container {
      text-align: center;
      padding: 20px;
    }
    .home-header {
      font-size: 24px;
      margin-bottom: 20px;
    }
    .home-content {
      font-size: 18px;
      margin-bottom: 20px;
    }
    .home-footer {
      font-size: 14px;
      color: gray;
    }
  `

  render() {
    return html`
      <div class="home-container">
        <header class="home-header">
          <h1>Tyler's Stuff</h1>
        </header>
        <main class="home-content">
          <p>Content TBD</p>
        </main>
        <footer class="home-footer">
          <p>© 2023 Your Company</p>
        </footer>
      </div>
    `
  }
}

customElements.define('home-container', HomeContainer)
