/* eslint-disable @typescript-eslint/no-unused-vars */
import './App.css'
import useRouteElements from './useRouteElements'

function App() {
  const routeElements = useRouteElements()
  return <div>{routeElements}</div>
}

export default App
