"use client"

import { useState, useEffect } from "react"
import styles from "./Messages.module.css"

const Messages = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("http://localhost:3000/user-messages", {
          credentials: "include",
        })
        if (response.ok) {
          const data = await response.json()
          setMessages(data)
        } else {
          throw new Error("Failed to fetch messages")
        }
      } catch (error) {
        console.error("Error fetching messages:", error)
        alert("Failed to load messages. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  if (loading) {
    return <div className={styles.loading}>Loading messages...</div>
  }

  return (
    <div className={styles.messagesContainer}>
      <h1>Messages</h1>
      {messages.length === 0 ? (
        <p>You have no messages.</p>
      ) : (
        <ul className={styles.messageList}>
          {messages.map((message) => (
            <li key={message._id} className={styles.messageItem}>
              <div className={styles.messageHeader}>
                <span className={styles.messageSender}>{message.sender}</span>
                <span className={styles.messageDate}>{new Date(message.createdAt).toLocaleString()}</span>
              </div>
              <p className={styles.messageContent}>{message.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Messages

