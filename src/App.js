import { useState } from "react"
import './App.css';
import { tickers } from './tickers'

function App() {
  const [query, setQuery] = useState("")
  const [response, setResponse] = useState("Search for a stock ticker")

  function makeApiCall(ticker) {
    setResponse("Loading...")
    fetch(`https://know-your-trend.herokuapp.com/${ticker}`)
    .then(response => response.json())
    .then(responsejson => {
      if (responsejson["message"].includes("error message")) setResponse("Unfortunately, that ticker is not supported yet. Please try another :)")
      else setResponse("Performance Snapshot:\n\n" + responsejson.message)
    })
  }

  return (
    <div className="app"> 
      <h2>Know Your Trend</h2> <br/>
      <div id="displayResponse" className="response">{response}</div>
      <br/><br/>
      <div className="searchandreset">
        <input type="text" placeHolder="Search..." className="search" onChange={e => setQuery(e.target.value)}/>
        <button className="resetbutton" onClick={() => {
          setResponse("Search for a stock ticker")
          setQuery("")
        }}>Reset</button>
        <button className="resetbutton" onClick={() => {
          makeApiCall(query)
        }}>Search</button>
      </div>
      <br/><br/>
      <h4>Or try one of these:</h4>
      <ul className="list">
        {tickers.filter(ticker => ticker.Symbol.includes(query.toUpperCase()) || ticker["Company Name"].toLowerCase().includes(query.toLowerCase())).map((ticker) => (
            <li key={ticker.Symbol} className="listItem" onClick={() => makeApiCall(ticker.Symbol)}>{ticker.Symbol} - {ticker["Company Name"]}</li>            
        ))}
      </ul>
    </div>
  );
}

export default App;
