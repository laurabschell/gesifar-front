import React, { useEffect, useState } from 'react'
import style from './Estadisticas.module.scss'
import Layout from '../../components/Layout/Layout'
import axios from 'axios';
import { BarChart, PieChart } from '@mui/x-charts';

const Estadisticas = () => {
    const url = 'http://gesifar-api.test/profesionalesController.php';
    const [professionals, setProfessionals] = useState([]);
    const [id, setId] = useState('');
    const [dni, setDni] = useState('');
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [profesion, setProfesion] = useState('');
    const [area, setArea] = useState('');
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        const respuesta = await axios.get(url);
        setProfessionals(respuesta.data);
    }


    return (
        <Layout>
            <div className={style.title}>Estadisticas</div>
            <div className={style.container} >
                <div className={style.containerChart}>
                    <h4>Profesionales registrados por Area</h4>
                    <PieChart
                        series={[
                            {
                                data: [
                                    { id: 0, value: 10, label: 'series A' },
                                    { id: 1, value: 15, label: 'series B' },
                                    { id: 2, value: 20, label: 'series C' },
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
                                data: ['bar A', 'bar B', 'bar C'],
                                scaleType: 'band',
                            },
                        ]}
                        series={[
                            {
                                data: [2, 5, 3],
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