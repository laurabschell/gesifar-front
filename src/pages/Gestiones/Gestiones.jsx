import React from 'react'
import Layout from '../../components/Layout/Layout'
import style from './Gestiones.module.scss'
import { Link } from "react-router-dom";

export const Gestiones = () => {
  return (
    <Layout title="Bienvenido!">

      <div className={style.boxesContainer}>

        <Link className={style.box} to="/profesionales">
          <div className={style.boxTitle}>
            <h1>Gestion de Profesionales Solicitantes</h1>
          </div>
        </Link>

        <Link className={style.box} to="/solicitudes">
          <div className={style.boxTitle}>
            <h1>Gestion de Solicitudes</h1>
          </div>
        </Link>


        <Link className={style.box} to="/responsables">
          <div className={style.boxTitle}>
            <h1>Gestion de Personal Responsable</h1>
          </div>
        </Link>

        <Link className={style.box} to="/materiales">
          <div className={style.boxTitle}>
            <h1>Gestion de Stock</h1>
          </div>
        </Link>

        <Link className={style.box} to="/ordencompra">
          <div className={style.boxTitle}>
            <h1>Gestion de Orden de Compra</h1>
          </div>

        </Link>

        <Link className={style.box} to="/estadisticas">
          <div className={style.boxTitle}>
            <h1>Gestion de Estadisticas</h1>
          </div>

        </Link>

      </div>

    </Layout >
  )
}

export default Gestiones