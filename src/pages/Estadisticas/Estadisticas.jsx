import React, { useEffect, useState } from 'react'
import style from './Estadisticas.module.scss'
import Layout from '../../components/Layout/Layout'
import axios from 'axios';
import { BarChart, PieChart } from '@mui/x-charts';

const Estadisticas = () => {
    const url = 'http://gesifar-api.test/profesionalesController.php';
    const [professionals, setProfessionals] = useState([]);

    useEffect(() => {
        getProfessionals();
    }, []);

    const getProfessionals = async () => {
        const respuesta = await axios.get(url);
        setProfessionals(respuesta.data);
    }

    console.log(professionals);


    return (
        <Layout title="Estadisticas">
            <div className={style.container} >
                <div className={style.containerChart}>
                    <h4>Profesionales registrados por Area</h4>
                    <PieChart
                        series={[
                            {
                                data: [
                                    { id: 0, value: professionals.filter(item => item.area === 'Hematologia').length, label: 'Hematologia' },
                                    { id: 1, value: professionals.filter(item => item.area === "Nefrologia").length, label: 'Nefrologia' },
                                    { id: 2, value: professionals.filter(item => item.area === "Oncologia").length, label: 'Oncologia' },
                                    { id: 3, value: professionals.filter(item => item.area === "Neumologia").length, label: 'Neumologia' },
                                    { id: 4, value: professionals.filter(item => item.area === "Rehabilitacion").length, label: 'Rehabilitacion' },
                                    { id: 5, value: professionals.filter(item => item.area === "Cardiologia").length, label: 'Cardiologia' },
                                ],
                            },
                        ]}
                        width={400}
                        height={200}
                    />
                </div>
                <div className={style.containerChart}>
                    <h4>Profesionales registrados por Profesion</h4>
                    <BarChart
                        xAxis={[
                            {
                                id: 'barCategories',
                                data: ['Medico', 'Radiologo', 'Enfermero', 'Anestesista', 'Cirujano'],
                                scaleType: 'band',
                            },
                        ]}
                        series={[
                            {
                                data: [
                                    professionals.filter(item => item.profesion === "Medico").length,
                                    professionals.filter(item => item.profesion === "Radiologo").length,
                                    professionals.filter(item => item.profesion === "Enfermero").length,
                                    professionals.filter(item => item.profesion === "Anestesista").length,
                                    professionals.filter(item => item.profesion === "Cirujano").length,
                                ],
                            },
                        ]}
                        width={500}
                        height={200}
                    />
                </div>


            </div>
            <div className={style.banner}>
                <i class="fa-solid fa-chart-line"></i><p>En total hay <strong>{professionals.length}</strong> profesionales solicitantes registrados en la aplicacion</p>
            </div>
        </Layout>
    )
}

export default Estadisticas