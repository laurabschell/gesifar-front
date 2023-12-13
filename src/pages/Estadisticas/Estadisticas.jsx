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
                                    { id: 0, value: 2, label: 'Traumatologia' },
                                    { id: 1, value: 1, label: 'Radiologia' },
                                    { id: 2, value: 5, label: 'Cirugia General' },
                                    { id: 3, value: 1, label: 'Internacion' },
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
                                data: ['Medico', 'Enfermero', 'Medica', 'Enfermera'],
                                scaleType: 'band',
                            },
                        ]}
                        series={[
                            {
                                data: [2, 3, 1, 2],
                            },
                        ]}
                        width={450}
                        height={200}
                    />
                </div>

            </div>
        </Layout>
    )
}

export default Estadisticas