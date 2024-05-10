/* eslint-disable @typescript-eslint/no-unused-vars */
import './App.css'
import ChatBot from './components/ChatBot/ChatBot'
import useRouteElements from './useRouteElements'

function App() {
  const routeElements = useRouteElements()
  return (
    <div>
      {routeElements}
      <ChatBot />
    </div>
  )
}

export default App
