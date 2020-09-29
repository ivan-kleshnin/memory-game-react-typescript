import "../styles/reset.css"

function App({ Component, pageProps }) {
  return <>
    <div id="root">
      <Component {...pageProps} />
    </div>
    <style jsx global>{`
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
  </>
}

export default App
