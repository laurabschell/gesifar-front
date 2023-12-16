import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import style from "./Solicitudes.module.scss"
import axios from 'axios'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../../functions';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment-timezone';
import Select from 'react-select'


export const Solicitudes = () => {
    const urlSolicitudes = 'http://gesifar-api.test/solicitudesController.php';
    const urlPersonas = 'http://gesifar-api.test/personasController.php';
    const urlProfesionales = 'http://gesifar-api.test/profesionalesController.php';
    const urlAreas = 'http://gesifar-api.test/areasController.php';

    const [solicitudes, setSolicitudes] = useState([]);
    const [personas, setPersonas] = useState('');
    const [profesionales, setProfesionales] = useState('');
    const [areas, setAreas] = useState('');

    const [id, setId] = useState('');
    const [persona, setPersona] = useState('');
    const [profesional, setProfesional] = useState('');
    const [area, setArea] = useState('');
    const [fecha, setFecha] = useState(new Date());
    const [estado, setEstado] = useState('');

    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');

    useEffect(() => {
        getSolicitudes();
        getPersonas();
        getProfesionales();
        getAreas();

    }, []);

    const getSolicitudes = async () => {
        const respuesta = await axios.get(urlSolicitudes);
        setSolicitudes(respuesta.data);
    }
    const getPersonas = async () => {

        const response = await axios.get(urlPersonas);
        const aPersonas = response.data.map(p => ({
            "label": p.nombre + " " + p.apellido,
            "value": p.id
        }))
        const aPersonas2 = [
            {
                "label": "Seleccione",
                "value": ""
            },
            ...aPersonas];

        setPersonas(aPersonas2);

    }
    const getProfesionales = async () => {

        const response = await axios.get(urlProfesionales);
        //setProfesiones(response.data);
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

    const openModal = (op, id, persona, profesional, area, fecha, estado) => {
        console.log('openmodal:', op);

        setId('');
        setPersona('');
        setProfesional('');
        setArea('');
        setFecha(null);
        setEstado('')
        setOperation(op);
        if (op === 1) {

            let d = new Date(new Date().toDateString());

            console.log('d.getMinutes()', d.getMinutes())
            console.log('d.getTimezoneOffset()', d.getTimezoneOffset())

            console.log('adjusted d:', d)
            setFecha(new Date());

            setTitle('Registrar Solicitud');
        }
        window.setTimeout(function () {
            //document.getElementById('tipo').focus();
        }, 500);
    }

    const validar = () => {
        var parametros;
        var metodo;

        if (operation === 1) {
            let x = moment(fecha).format('YYYY-MM-DD');
            console.log('----x:', x);

            parametros = { persona: persona, profesional: profesional, area: area, fecha: x, estado: estado };
            metodo = 'POST';
        }

        console.log('parametros');
        console.log(parametros)

        enviarSolicitud(metodo, parametros);
    }

    const enviarSolicitud = async (metodo, parametros) => {

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


    return (
        <Layout title="Gestion de Solicitudes">
            {/* <div className={style.title}>Gestion de Solicitudes</div> */}
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
                                        {/* <th>id</th> */}
                                        <th>PERSONAL</th>
                                        <th>PROFESIONAL</th>
                                        <th>AREA</th>
                                        <th>FECHA</th>
                                        <th>ESTADO</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {solicitudes.map((solicitud, i) => (
                                        <tr key={solicitud.id}>
                                            {/* <td>{(i + 1)}</td> */}
                                            <td>{solicitud.personal_resp}</td>
                                            <td>{solicitud.profesional_solicitante}</td>
                                            <td>{solicitud.area}</td>
                                            <td>{solicitud.fecha}</td>
                                            <td>{solicitud.estado}</td>
                                            <td>

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
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{title}</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='id'></input>
                            <div className='input-group mb-3' >'

                                <span className='input-group-text'>Personal</span>

                                <Select id='persona' options={personas} className={style.selectinput}

                                    onChange={(e) => {
                                        console.log(e);
                                        console.log(e.label);

                                        setPersona(e.label)
                                    }}

                                />
                            </div>

                            <div className='input-group mb-3' >

                                <span className='input-group-text'>Profesional</span>

                                <Select id='profesional' options={profesionales} className={style.selectinput}

                                    onChange={(e) => {
                                        console.log(e);
                                        console.log(e.label);

                                        setProfesional(e.label)
                                    }}

                                />
                            </div>
                            <div class="w-100"></div>

                            <div className='input-group mb-3' >

                                <span className='input-group-text'>Area</span>

                                <Select id='area' options={areas} className={style.selectinput}

                                    onChange={(e) => {
                                        console.log(e);
                                        console.log(e.label);

                                        setArea(e.label)
                                    }}

                                />
                            </div>

                            <div className='input-group mb-3' >
                                <span className='input-group-text'>Fecha</span>
                                <DatePicker
                                    dateFormat="yyyy-MM-dd"
                                    selected={fecha}
                                    onChange={(date) => setFecha(date)}
                                />
                            </div>
                            <div class="w-100"></div>

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