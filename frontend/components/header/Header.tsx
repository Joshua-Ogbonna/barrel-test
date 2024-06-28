import React from 'react'
import styles from './Header.module.css'

const Header = () => {
  return (
    <div className={styles.header}>
        <h3 className={styles.main__font}>Welcome back, User 👋</h3>
        <p className={styles.tagline}>Your order details</p>
    </div>
  )
}

export default Header