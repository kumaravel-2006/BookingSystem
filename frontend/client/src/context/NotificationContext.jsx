import { createContext, useContext, useState } from 'react'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {

  const [notifications, setNotifications] = useState([])

  const addNotification = (message, type = 'success') => {
    const id = Date.now()
    setNotifications((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      removeNotification(id)
    }, 3000)
  }


  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }


  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  return useContext(NotificationContext)
}