/* eslint-disable no-var */
import { useEffect } from 'react'

export default function ChatBot() {
  useEffect(() => {
    ;(function (d, m) {
      var kommunicateSettings = {
        appId: '155014ae5a3767e28c1f6c180df2af573',
        popupWidget: true,
        automaticChatOpenOnNavigation: true
      }
      var s = document.createElement('script')
      s.type = 'text/javascript'
      s.async = true
      s.src = 'https://widget.kommunicate.io/v2/kommunicate.app'
      var h = document.getElementsByTagName('head')[0]
      h.appendChild(s)
      window.kommunicate = m
      m._globals = kommunicateSettings
    })(document, window.kommunicate || {})
  }, [])
  return <div></div>
}
