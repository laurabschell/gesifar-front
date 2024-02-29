import React, { useEffect, useRef, useState } from 'react'
import style from './Estadisticas.module.scss'
import Layout from '../../components/Layout/Layout'
import axios from 'axios';
import { BarChart, PieChart } from '@mui/x-charts';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { red } from '@mui/material/colors';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';

const Estadisticas = () => {
    // const url = 'http://gesifar-api.test/profesionalesController.php';
    // const [professionals, setProfessionals] = useState([]);

    // useEffect(() => {
    //     getProfessionals();
    // }, []);

    // const getProfessionals = async () => {
    //     const respuesta = await axios.get(url);
    //     setProfessionals(respuesta.data);
    // }

    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    });


    const data = [
        { label: 'Pendiente', value: 3, color: '#ED6C02' },
        { label: 'Entregado', value: 16, color: '#2E7D32' },
    ];

    const chartSetting = {
        xAxis: [
            {
                label: 'stock (por unidad)',
            },
        ],
        width: 400,
        height: 300,
    }; const dataset = [
        {
            stock: 810,
            material: 'Sertal',
        },
        {
            stock: 256,
            material: 'Ibuprofeno',
        },
        {
            stock: 342,
            material: 'Cofias',
        },
        {
            stock: 899,
            material: 'Jeringas',
        },

        {
            stock: 907,
            material: 'Aspirinas',
        },
        {
            stock: 932,
            material: 'Paracetamol',
        }

    ];

    const valueFormatter = (value) => `${value} unidades`;

    function createData(
        nombre,
        noviembre,
        diciembre,
        enero,
        total,
    ) {
        return { nombre, noviembre, diciembre, enero, total };
    }

    const rows = [
        createData('Sertal', 159, 230, 324, 456),
        createData('Aspirina', 237, 234, 176, 367),
        createData('Ibuprofeno', 262, 260, 242, 634),
    ];

    const rows2 = [
        createData('Sertal', 159, 230, 324, 456),
        createData('Aspirina', 237, 234, 176, 367),
        createData('Ibuprofeno', 262, 260, 242, 634),
        createData('Sertal', 159, 230, 324, 456),
        createData('Aspirina', 237, 234, 176, 367),
        createData('Ibuprofeno', 262, 260, 242, 634),
    ];

    return (
        <Layout title="Estadisticas">
            <div ref={componentRef}>


                <div className={style.container}>
                    <h6>Los materiales mas solicitados los ultimos 3 meses</h6>
                    <div className={style.containerChart}>
                        <div className={style.Graph}>

                            <BarChart
                                xAxis={[{ scaleType: 'band', data: ['Noviembre', 'Diciembre', 'Enero'] }]}
                                series={[{ data: [234, 309, 520] }, { data: [533, 168, 323] }, { data: [232, 390, 406] }]}
                                width={450}
                                height={200}
                            />
                        </div>
                        <div className={style.Text}>
                            <p>En los ultimos 3 meses se registró un total de:</p>
                            <p> <i class=" fa-solid fa-square" style={{ color: "#2E96FF" }}></i> <strong>360</strong> solicitudes de Sertal</p>
                            <p> <i class=" fa-solid fa-square" style={{ color: "#B800D8" }}></i> <strong>205</strong> solicitudes de Ibuprofeno</p>
                            <p> <i class=" fa-solid fa-square" style={{ color: "#02B2AF" }} ></i>  <strong>132</strong> solicitudes de Aspirina</p>
                        </div>
                        <div className={style.Table}>

                            <TableContainer component={Paper} >
                                <Table sx={{ maxWidth: 650 }} size="small" aria-label="a dense table">
                                    <TableHead >
                                        <TableRow>
                                            <TableCell>Material</TableCell>
                                            <TableCell align="left">Noviembre (cant)</TableCell>
                                            <TableCell align="left">Diciembre (cant)</TableCell>
                                            <TableCell align="left">Enero (cant)</TableCell>
                                            <TableCell align="left">Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <TableRow
                                                key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.nombre}
                                                </TableCell>
                                                <TableCell align="left">{row.noviembre}</TableCell>
                                                <TableCell align="left">{row.diciembre}</TableCell>
                                                <TableCell align="left">{row.enero}</TableCell>
                                                <TableCell align="left">{row.total}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div >


                    <hr />
                    <div className={style.container2}>
                        <div className={style.container4}>
                            <h6>Solicitudes por estado</h6>
                            <div className={style.containerChart1}>
                                <PieChart
                                    series={[
                                        {
                                            paddingAngle: 5,
                                            innerRadius: 60,
                                            outerRadius: 80,
                                            data,
                                        },
                                    ]}
                                    margin={{ right: 5 }}
                                    width={200}
                                    height={200}
                                    legend={{ hidden: true }}
                                />
                                <div className={style.Text}>
                                    <p> <i class=" fa-solid fa-square" style={{ color: "#2E7D32" }}></i> <strong>16</strong> solicitudes en ENTREGADO</p>
                                    <p> <i class=" fa-solid fa-square" style={{ color: "#ED6C02" }}></i> <strong>3</strong> solicitudes en PENDIENTE</p>
                                </div>

                            </div>
                        </div>
                        <div style={{ borderLeft: '1px solid #2525254f', height: 300 }}></div>
                        <div className={style.container3}>
                            <h6 style={{ paddingLeft: '5rem' }}>Materiales con mayor inventario</h6>
                            <div className={style.containerChart}>

                                <BarChart
                                    dataset={dataset}
                                    yAxis={[{ scaleType: 'band', dataKey: 'material', }]}
                                    series={[{ dataKey: 'stock', label: 'Inventario', valueFormatter }]}
                                    layout="horizontal"
                                    {...chartSetting}
                                />
                                <div className={style.Table2}>

                                    <TableContainer component={Paper} >
                                        <Table sx={{ maxWidth: 600 }} size="small" aria-label="simple table">
                                            <TableHead >
                                                <TableRow>
                                                    <TableCell>Material</TableCell>
                                                    <TableCell align="left">Total (unidades)</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {rows2.map((row) => (
                                                    <TableRow
                                                        key={row.name}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {row.nombre}
                                                        </TableCell>
                                                        <TableCell align="left">{row.total}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >

            </div>
            <button type="button" onClick={handlePrint} data-toggle="tooltip" data-placement="right" title="Generar Archivo con Reportes y Estadisticas" class="btn btn-success btn-lg"><i class="fa-regular fa-file-pdf"></i> Imprimir Reporte de Estadisticas</button>



        </Layout >
    )
}

export default Estadisticas