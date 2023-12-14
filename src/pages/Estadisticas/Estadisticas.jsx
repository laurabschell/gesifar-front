import React, { useEffect, useState } from 'react'
import style from './Estadisticas.module.scss'
import Layout from '../../components/Layout/Layout'
import axios from 'axios';
import { BarChart, PieChart } from '@mui/x-charts';

const Estadisticas = () => {
    const url = 'http://gesifar-api.test/estadisticasController.php';
    //const [professionals, setProfessionals] = useState([]);
    const [dataArea, setDataArea] = useState([]);
    const [dataProfesion, setDataProfesion] = useState([]);
    const [dataProfesionCant, setDataProfesionCant] = useState([]);
    
    useEffect(() => {
        //getProfessionals();
        getEstadisticas();
       
    }, []);

    /*const getProfessionals = async () => {
        const respuesta = await axios.get(url);
        setProfessionals(respuesta.data);
    }*/
    const getEstadisticas = async () => {

        let response;
        response = await axios.get(url + "?chartId=1");
        console.log(url + "?chartId=1");
        console.log(response);

        const aDataArea = response.data.map(a => ({
            "id": a.id,
            "value": a.cant,
            "label": a.descripcion
        }))

        setDataArea(aDataArea);

        response = await axios.get(url + "?chartId=2");
        const aDataProfesion = response.data.map(a => ({
            "label": a.descripcion
        }))
        const aDataProfesionCant = response.data.map(a => ({
            "value": a.cant
        }))

        setDataProfesion(aDataProfesion);
        setDataProfesionCant(aDataProfesionCant);
        
    }
    console.log("dataArea");
    console.log(dataArea);
    
    console.log(dataProfesion);
    console.log(dataProfesionCant);


    return (
        <Layout title="Estadisticas">
            <div className={style.container} >
                <div className={style.containerChart}>
                    <h4>Profesionales registrados por Area</h4>
                        
                    <PieChart
                        series={[
                            {
                                data:dataArea
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
                                data:dataProfesion,			
                                scaleType: 'band',
                            },
                        ]}
                        series={[
                            {
                                /*data:dataProfesionCant,*/
                                data: [
                                    3,
                                    1,
                                    5,
                                    2
                                ],
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