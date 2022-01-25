import React from "react"
import { IoIosArrowBack } from "react-icons/io"
import { useNavigate } from "react-router-dom"
import styles from "./settings.module.scss"

function SettingsHeader() {
  const navigate = useNavigate()
  return (
    <div className={styles.settings__header__top}>
      <div className={styles.backArrow}>
        <button onClick={() => navigate("/")}><IoIosArrowBack /></button>
      </div>
      <h1>Settings</h1>
    </div>
  )
}
export default SettingsHeader;