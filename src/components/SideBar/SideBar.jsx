import React from 'react'
import style from './SideBar.module.scss'
import Logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';

const SideBar = () => {
  return (
    <div className={style.container}>
      <div className={style.imageBox}>
        <img className={style.imageBox_img} src={Logo} alt="Logo" />
      </div>
      <Link className={style.menu} to="/gestiones">
        <div className={style.menuButton}>
          <h1>Menu Principal</h1>
        </div>
      </Link>
    </div>
  )
}

export default SideBar