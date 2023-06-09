import './App.css';
import { useState } from "react"
import { tickers } from './tickers'
import LoadingBar from 'react-top-loading-bar'

function App() {
  const [query, setQuery] = useState("")
  const [response, setResponse] = useState("Search for a stock ticker")
  const [progress, setProgress] = useState(0)
  const mobile = window.innerWidth < 768
  let counter = 0

  console.log(window.innerWidth, mobile)

  function getButtons() {
    return (
      <div className='buttongroup'>
          <button className="resetbutton" onClick={() => {
          setResponse("Search for a stock ticker")
          setQuery("")
          setProgress(0)
        }}>Reset</button>
        <button className="resetbutton" onClick={() => {
          makeApiCall(query)
        }}>Search</button>
      </div>
    )
  }

  function makeApiCall(ticker) {
    setResponse("Loading...")
    setProgress(0)
    console.log("about to set interval")
    
    let intervalVar = setInterval(() => {
      console.log(`current progress: ${counter}`)
      if (counter < 100) counter += 0.1
      else counter = 0
      setProgress(counter)
    }, 100);

    fetch(`https://know-your-trend.herokuapp.com/${ticker}`)
    .then(response => response.json())
    .then(responsejson => {
      if (responsejson["message"].includes("error getting mboum finance response")) setResponse("Unfortunately, that ticker is not supported yet. Please try another :)")
      else setResponse("Performance Snapshot:\n\n" + responsejson.message)
      setProgress(100)
      clearInterval(intervalVar)
    })
  }

  return (
    <div className="app"> 

      <h2><a href='https://know-your-trend-frontend.pages.dev/'>Know Your Trend</a></h2> <br/>

      <div>
        <LoadingBar
          color='blue'
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />
     </div>

      <div id="displayResponse" className="response">{response}</div>
      <br/><br/>
      
      <div className="searchandreset">
        <input type="text" placeHolder="Search..." className="search" onChange={e => setQuery(e.target.value)}/>
        {mobile ? null : getButtons()}
      </div>
      <br/><br/>

      <h4>Or try one of these:</h4>
      <ul className="list">
        {
          tickers
            .filter(ticker => ticker.Symbol.includes(query.toUpperCase()) || ticker["Company Name"].toLowerCase().includes(query.toLowerCase()))
            .map((ticker) => (
                <li key={ticker.Symbol} className="listItem" onClick={() => makeApiCall(ticker.Symbol)}>{ticker.Symbol} - {ticker["Company Name"]}</li>            
            ))
            .slice(0, mobile ? 5 : 10)
        }
      </ul>


    </div>
  );
}

export default App;
