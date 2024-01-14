import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import style from "./Solicitudes.module.scss"
import axios from 'axios'
import { show_alerta } from '../../functions';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment-timezone';
import Select from 'react-select'
import Table from "../../components/table"
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { Chip } from '@mui/material';

export const Solicitudes = () => {
    const urlSolicitudes = 'http://gesifar-api.test/solicitudesController.php';
    const urlResponsables = 'http://gesifar-api.test/responsablesController.php';
    const urlProfesionales = 'http://gesifar-api.test/profesionalesController.php';
    const urlAreas = 'http://gesifar-api.test/areasController.php';
    const urlMateriales = 'http://gesifar-api.test/materialesController.php';
    const urlItems = 'http://gesifar-api.test/solicitudItemsController.php';

    const [solicitudes, setSolicitudes] = useState([]);
    const [responsables, setResponsables] = useState([]);
    const [profesionales, setProfesionales] = useState([]);
    const [areas, setAreas] = useState([]);
    const [materiales, setMateriales] = useState([]);

    const [id, setId] = useState('');
    const [responsable, setResponsable] = useState('');
    const [profesional, setProfesional] = useState('');
    const [area, setArea] = useState('');
    const [fecha, setFecha] = useState(new Date());
    const [estado, setEstado] = useState('');

    const [material, setMaterial] = useState('');
    const [cantidad, setCantidad] = useState('');

    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');

    const [rows, initRow] = useState([]);

    const addRowTable = () => {

        console.log("material:", material)

        const data = {
            material: material,
            cantidad: cantidad,
        };

        initRow([...rows, data]);
        // setDetalle([...rows, data]);
        // console.log("detalle:", detalle);
    };

    const tableRowRemove = (index) => {
        const dataRow = [...rows];
        dataRow.splice(index, 1);
        initRow(dataRow);
    };

    useEffect(() => {
        getSolicitudes();
        getResponsables();
        getProfesionales();
        getAreas();
        getMateriales();
    }, []);

    const getSolicitudes = async () => {
        const respuesta = await axios.get(urlSolicitudes);
        setSolicitudes(respuesta.data);
    }
    const getResponsables = async () => {

        const response = await axios.get(urlResponsables);
        const aResponsables = response.data.map(p => ({
            "label": p.nombre + " " + p.apellido,
            "value": p.id
        }))
        const aResponsables2 = [
            {
                "label": "Seleccione",
                "value": ""
            },
            ...aResponsables];

        setResponsables(aResponsables2);

    }
    const getProfesionales = async () => {

        const response = await axios.get(urlProfesionales);

        const aProfesionales = response.data.map(p => ({
            "label": p.nombre + " " + p.apellido,
            "value": p.id
        }))
        const aProfesionales2 = [
            {
                "label": "Seleccione",
                "value": ""
            },
            ...aProfesionales];

        setProfesionales(aProfesionales2);

    }

    const getAreas = async () => {
        const response = await axios.get(urlAreas);

        const aAreas = response.data.map(a => ({
            "label": a.descripcion,
            "value": a.id
        }))
        const aAreas2 = [
            {
                "label": "Seleccione",
                "value": ""
            },
            ...aAreas];

        setAreas(aAreas2);
    }

    const getMateriales = async () => {
        const response = await axios.get(urlMateriales);

        const aMateriales = response.data.map(a => ({
            "label": a.nombre,
            "value": a.id
        }))
        const aMateriales2 = [
            {
                "label": "Seleccione",
                "value": ""
            },
            ...aMateriales];

        setMateriales(aMateriales2);
    }

    const getItems = async (id) => {
        const respuesta = await axios.get(urlItems + '?id_solicitud='+id);
        initRow(respuesta.data);

    }

    const openModal = (op, id, responsable, profesional, area, fecha, estado, rows) => {

        setId('');
        setResponsable('Seleccione');
        setProfesional('Seleccione');
        setArea('Seleccione');
        setFecha(null);
        setEstado('')
        setMaterial('Seleccione');
        setCantidad('0');
        setOperation(op);

        if (op === 1) {
            setTitle('Registrar Solicitud');
            setFecha(new Date());
            initRow([]);
            
        } else if (op === 2) {
            setTitle('Editar Datos - Solicitud ' + id.toString());
            setId(id);
            setResponsable(responsable);
            setProfesional(profesional);
            setArea(area);
            //setFecha(fecha);
            let d = new Date(fecha);
            d.setMinutes(d.getMinutes() + d.getTimezoneOffset());          
            setFecha(d);              
            setEstado(estado);
            //set rows
            getItems(id); 
 
        }
        window.setTimeout(function () {
            document.getElementById('responsable').focus();
        }, 500);
    }

    const validar = () => {
        var parametros;
        var metodo;

        if (responsable.trim() === '') {
            show_alerta('Indique el Responsable', 'warning');
        }
        else if (profesional.trim() === '') {
            show_alerta('Indique el Profesional', 'warning');
        }
        else if (area.trim() === '') {
            show_alerta('Indique el Area', 'warning');
        }
        else if (estado.trim() === '') {
            show_alerta('Indique el Estado', 'warning');
        }
        else if (rows.length === 0) {
            show_alerta('Añada un material', 'warning');
        }
        else {
            let x = moment(fecha).format('YYYY-MM-DD');
            if (operation === 1) {
                
                parametros = {
                    responsable: responsable,
                    profesional: profesional, area: area, fecha: x, estado: estado, rows: rows
                };
                metodo = 'POST';
            }
            else {
                parametros = {
                    id: id, responsable: responsable,
                    profesional: profesional, area: area, fecha: x, estado: estado,rows: rows
                };
                metodo = 'PUT';
            }
            console.log('parametros:',parametros)
            enviarSolicitud(metodo, parametros);
        }
    }

    const enviarSolicitud = async (metodo, parametros) => {
        //console.log("detalle:", detalle);
        console.log(parametros)
        await axios({ method: metodo, url: urlSolicitudes, data: parametros }).then(function (respuesta) {

            var tipo = respuesta.data[0];
            var msj = respuesta.data[1];
            show_alerta(msj, tipo);

            if (tipo === 'success') {
                document.getElementById('btnCerrar').click();
                getSolicitudes();
            }
        })
            .catch(function (error) {
                show_alerta('Error en la solicitud', 'error');
                console.log(error);
            });
    };

    const deleteProduct = (id) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: '¿Seguro de eliminar la solictud?',
            icon: 'question', text: 'No se podrá dar marcha atrás',
            showCancelButton: true, confirmButtonText: 'Si, eliminar', cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setId(id);
                enviarSolicitud('DELETE', { id: id });
            }
            else {
                show_alerta('Los datos de la solicitud NO fueron eliminados', 'info');
            }
        });
    }


    return (
        <Layout title="Gestion de Solicitudes">

            <div className='container-fluid'>
                <div className='row mt-4'>
                    <div className='col-md-4 offset-md-8'>
                        <div className='d-grid mx-auto'>
                            <button onClick={() => openModal(1)} className='btn btn-lg btn-dark' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                <i className='fa-solid fa-circle-plus'></i> Añadir nueva Solicitud
                            </button>
                        </div>
                    </div>
                </div>
                <div className='row mt-4'>
                    <div className='col-12 col-lg-12 offset-0'>
                        <div className='table-responsive'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>Personal Responsable</th>
                                        <th>Profesional Solicitante</th>
                                        <th>Area</th>
                                        <th>Fecha</th>
                                        <th>Estado</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {solicitudes.map((solicitud) => (
                                        <tr key={solicitud.id}>
                                            {/* <td>{(i + 1)}</td> */}
                                            <td>{solicitud.personal_resp}</td>
                                            <td>{solicitud.profesional_solicitante}</td>
                                            <td>{solicitud.area}</td>
                                            <td>{solicitud.fecha}</td>
                                            <td>
                                                {solicitud.estado === "PENDIENTE" ?
                                                    <Chip label={solicitud.estado} color="warning" /> :
                                                    <Chip label={solicitud.estado} color="success" />}
                                            </td>
                                            <td>
                                                <div className="btn-group" role="group">

                                                    <button onClick={() => openModal(2, solicitud.id, solicitud.personal_resp, solicitud.profesional_solicitante, solicitud.area, solicitud.fecha, solicitud.estado, solicitud.detalle)}
                                                        className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                                        <i className='fa-solid fa-edit'></i> Editar
                                                    </button>
                                                    <button onClick={() => deleteProduct(solicitud.id)} className='btn btn-danger'>
                                                        <i className='fa-solid fa-trash'></i> Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalProducts' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog modal-lg'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{title}</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <div class="row">

                                <div className="col">


                                    <input type='hidden' id='id'></input>
                                    <div className='input-group mb-3' >'

                                        <span className='input-group-text'>Personal Responsable</span>

                                        <Select id='responsable' options={responsables}
                                            className={style.selectinput}
                                            value={responsables.find(item => item.label === responsable)}

                                            onChange={(e) => {
                                                console.log(e);
                                                console.log(e.label);

                                                setResponsable(e.label)
                                            }}

                                        />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className='input-group mb-3' >
                                        <span className='input-group-text'>Fecha</span>
                                        <DatePicker
                                            dateFormat="yyyy-MM-dd"
                                            selected={fecha}
                                            onChange={(date) => setFecha(date)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row" width="100%">
                                <div className="col">
                                    <div className='input-group mb-3 ' >
                                        <span className='input-group-text'>Profesional Solicitante</span>
                                        <Select id='profesional' options={profesionales}
                                            className={style.selectinput}
                                            value={profesionales.find(item => item.label === profesional)}

                                            onChange={(e) => {
                                                console.log(e);
                                                console.log(e.label);

                                                setProfesional(e.label)
                                            }}

                                        />
                                    </div>
                                    <div class="w-100"></div>
                                </div>
                                <div className="col">
                                    <div className='input-group mb-3' >
                                        <span className='input-group-text'>Area</span>
                                        <Select id='area' options={areas}
                                            className={style.selectinput}
                                            value={areas.find(item => item.label === area)}

                                            onChange={(e) => {
                                                console.log(e);
                                                console.log(e.label);

                                                setArea(e.label)
                                            }}

                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="w-100"></div>

                            <h5>Materiales Solicitados:</h5>
                            <div className='input-group mb-3' width="100%">
                                <span className='input-group-text'>Nombre del Material</span>
                                <Select id='material' 
                                    
                                    options={materiales}
                                    className={style.selectinput30}

                                    value={materiales.find(item => item.label === material)}

                                    onChange={(e) => {
                                        setMaterial(e.label)
                                    }}
                                />
                                <span className='input-group-text'>Cantidad</span>
                                <input type='text' id='cantidad'
                                    placeholder='Cantidad'
                                    className={style.selectinput20}
                                    text={cantidad}
                                    value={cantidad}
                                    onChange={(e) => setCantidad(e.target.value)}>

                                </input>
                                <button className="btn btn-danger" onClick={addRowTable}>
                                    Insertar
                                </button>

                                <Table m={{ material, cantidad }}
                                    rows={rows}
                                    addRowTable={addRowTable}
                                    tableRowRemove={tableRowRemove}
                                />

                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Estado</span>
                                <select id='estado' value={estado}
                                    onChange={(e) => {

                                        console.log('e:', e)
                                        console.log('e.target.value:', e.target.value)
                                        setEstado(e.target.value)
                                        console.log('estado:', estado)

                                    }
                                    }>
                                    <option value="-">Seleccione</option>
                                    <option value="PENDIENTE">PENDIENTE</option>
                                    <option value="ENTREGADO">ENTREGADO</option>
                                </select>
                            </div>

                            <div className='d-grid col-6 mx-auto'>
                                <button onClick={() => validar()} className='btn btn-success'>
                                    <i className='fa-solid fa-floppy-disk'></i> Guardar
                                </button>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    )
}

export default Solicitudes