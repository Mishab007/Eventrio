import Commonrouter from "./router/Commonrouter.jsx"
import { BrowserRouter } from "react-router-dom"
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
        <Route path='/*' Component={Commonrouter}></Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}
export default App
