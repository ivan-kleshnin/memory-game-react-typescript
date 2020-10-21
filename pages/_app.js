import "../styles/reset.css"
import "../styles/index.css"

function App({ Component, pageProps }) {
  return <div id="root">
    <Component {...pageProps} />
    <style jsx>{`
      body {
        overflow: hidden;
      }
      
      #root {
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: -25px;
      }
    `}</style>
  </div>
}

export default App
