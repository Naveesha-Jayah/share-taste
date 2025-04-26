import React from "react"
import {Route,Routes} from "react-router-dom"

function App() {
  return (
    <div >
      <React.Fragment>
        <Routes>
        <Route path="/" element={<Home />} />
          
        </Routes>
      </React.Fragment>

    </div>
  );
}

export default App;
