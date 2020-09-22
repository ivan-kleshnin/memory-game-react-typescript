import "../styles/reset.css"
import "../styles/index.css"

function App({ Component, pageProps }) {
  return <div id="root">
    <Component {...pageProps} />
  </div>
}

export default App
