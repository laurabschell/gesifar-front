import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import style from "./Materiales.module.scss"
import axios from 'axios'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../../functions';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment-timezone';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const Materiales = () => { 

    const url = 'http://gesifar-api.test/materialesController.php';
    const [materiales, setMateriales] = useState([]);
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState('');
    const [forma, setForma] = useState('');
    const [presentacion, setPresentacion] = useState('');
    const [fecha_venc, setFecha_venc] = useState(new Date());

    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');
    
    const [searchNombre, setSearchNombre] = useState('');
    const [searchTipo, setSearchTipo] = useState('');
    const [searchForma, setSearchForma] = useState('');
    const [searchPres, setSearchPres] = useState('');
    const [searchFecha, setSearchFecha] = useState('');

    const [isDisabled, setIsDisabled] = useState(false);
    //handleChangeTipo
    const handleChangeTipo = e => {
        //console.log('Label 👉️', e.target.selectedOptions[0].label);
        console.log(e.target.value);
        setTipo(e.target.value);
        setIsDisabled(e.target.value==="Insumo");
        if (e.target.value==="Insumo") {
            setForma("");
            setPresentacion("");
        }                      
      }; 
      

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        const respuesta = await axios.get(url);
        setMateriales(respuesta.data);
    }
    const openModal = (op, id, nombre, tipo, forma, presentacion, fecha_venc) => {

        setId('');
        setNombre('');
        setTipo('');
        setForma('');
        setPresentacion('');
        setFecha_venc(null);
        setOperation(op);

        if (op === 1) {

            let d = new Date(new Date().toDateString());
            
            console.log('d.getMinutes()', d.getMinutes())
            console.log('d.getTimezoneOffset()', d.getTimezoneOffset())          
   
            console.log('adjusted d:',d)
            setFecha_venc(new Date());            
            console.log('**fecha_venc:', fecha_venc)
            console.log( JSON.stringify(fecha_venc) );
            
            setTitle('Registrar Material');
        }
        else if (op === 2) {
         
            setTitle('Editar Datos');
            setId(id);
            setNombre(nombre);
            setTipo(tipo);
            setForma(forma);
            setPresentacion(presentacion);

            let d = new Date(fecha_venc);
            d.setMinutes(d.getMinutes() + d.getTimezoneOffset());          
            setFecha_venc(d);     
            setIsDisabled(tipo==="Insumo");

        }
        window.setTimeout(function () {
            document.getElementById('nombre').focus();
        }, 500);
    }
    const validar = () => {
        var parametros;
        var metodo;

        if (nombre.trim() === '') {
            show_alerta('Escriba el nombre', 'warning');
        }
        else if (tipo.trim() === '') {
            show_alerta('Indique el Tipo', 'warning');
        }
        else if (forma.trim() === '' && !isDisabled) {
            show_alerta('Escriba la Forma Farmaceutica', 'warning');
        }
        else if (presentacion.trim() === '' && !isDisabled) {
            show_alerta('Escriba la Presentacion', 'warning');
        }
        else {
            if (operation === 1) {
                let x = moment(fecha_venc).format('YYYY-MM-DD');
                console.log('----x:',x);
                
                parametros = { nombre: nombre.trim(), tipo: tipo.trim(), forma: forma.trim(), presentacion: presentacion.trim(), fecha_venc: x };
                metodo = 'POST';
            }
            else {
                
                let d = new Date(fecha_venc);   
                d.setMinutes(d.getMinutes() + d.getTimezoneOffset());               
                                      
                setFecha_venc(d);
                let x = moment(fecha_venc).format('YYYY-MM-DD');
              
                parametros = { id: id, nombre: nombre.trim(), tipo: tipo.trim(), forma: forma.trim(), presentacion: presentacion.trim(), fecha_venc: x };
                metodo = 'PUT';
            }
            enviarSolicitud(metodo, parametros);
        }
    }
    const enviarSolicitud = async (metodo, parametros) => {
        
        console.log(parametros)
        await axios({ method: metodo, url: url, data: parametros }).then(function (respuesta) {
            
            var status = respuesta.data[0];
            var msj = respuesta.data[1];
            show_alerta(msj, tipo);
            if (status === 'success') {
                document.getElementById('btnCerrar').click();
                getProducts();
            }
        })
            .catch(function (error) {
                show_alerta('Error en la solicitud', 'error');
                console.log(error);
            });
    }

    const deleteProduct = (id, name) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: '¿Seguro de eliminar el material ?',
            icon: 'question', text: 'No se podrá dar marcha atrás',
            showCancelButton: true, confirmButtonText: 'Si, eliminar', cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setId(id);
                enviarSolicitud('DELETE', { id: id });
            }
            else {
                show_alerta('Los datos del Material NO fueron eliminados', 'info');
            }
        });
    }

    const generatePDF = async () => {
        const doc = new jsPDF({ orientation: "portrait" });

        doc.autoTable({
            html: ".table-to-print",
        });

        doc.save("materiales-registrados-GESIFAR.pdf");
    };

    return (
        <Layout>
            <div className={style.title}>Gestion de Materiales</div>
            <div className='container-fluid'>
                <div className='row mt-4'>
                    <div className='col-md-4 offset-md-9'>
                        <div className='d-grid mx-auto'>
                            <button onClick={() => openModal(1)} className='btn btn-lg btn-dark' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                <i className='fa-solid fa-circle-plus'></i> Añadir nuevo Material
                            </button>
                        </div>
                    </div>

                    <div class="input-group" className='col-md-12'>
                        <h5>Consultar por campo:</h5>
                        <div class="row">

                            <div class="form-outline" className=' col-md-2' data-mdb-input-init>
                                <input type="search" id="form1" class="form-control" onChange={(e) => setSearchNombre(e.target.value)} />
                                <label class="form-label" for="form1">Consulta por Nombre</label>
                            </div>
                            <div class="form-outline" className=' col-md-2' data-mdb-input-init>
                                <input type="search" id="form1" class="form-control" onChange={(e) =>
                                    setSearchTipo(e.target.value)} />
                                <label class="form-label" for="form1">Consulta por Tipo</label>
                            </div>
                            <div class="form-outline" className=' col-md-2' data-mdb-input-init>
                                <input type="search" id="form1" class="form-control" onChange={(e) => setSearchForma(e.target.value)} />
                                <label class="form-label" for="form1">Consulta por Forma</label>
                            </div>
                            <div class="form-outline" className=' col-md-2' data-mdb-input-init>
                                <input type="search" id="form1" class="form-control" onChange={(e) => setSearchPres(e.target.value)} />
                                <label class="form-label" for="form1">Consulta por Presentacion</label>
                            </div>
                            <div class="form-outline" className=' col-md-2' data-mdb-input-init>
                                <input type="search" id="form1" class="form-control" onChange={(e) => setSearchFecha(e.target.value)} />
                                <label class="form-label" for="form1">Consulta por Fecha</label>
                            </div>
                        </div>
                    </div>
                    

                </div>
                <div className='row mt-4'>
                    <div className='col-12 col-lg-12 offset-0'>
                        <div className='table-responsive'>
                        <table className='table-to-print table table-bordered table-striped table-fixed'>
                                <thead class="sticky-top">
                                    <tr>
                                        {/* <th>id</th> */}
                                        <th>Nombre</th>
                                        <th>Tipo</th>
                                        <th>Forma</th>
                                        <th>Presentacion</th>
                                        <th>Fecha Venc</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {materiales.filter((materiales) =>
                                        materiales.nombre.toLowerCase().includes(searchNombre.toLowerCase()) && materiales.tipo.toLowerCase().includes(searchTipo.toLowerCase()) && materiales.forma.toLowerCase().includes(searchForma.toLowerCase()) && materiales.presentacion.toLowerCase().includes(searchPres.toLowerCase()) && materiales.fecha_venc.toLowerCase().includes(searchFecha)
                                    ).map((material, i) => (
                                        <tr key={material.id}>
                                            <td>{material.nombre}</td>
                                            <td>{material.tipo}</td>
                                            <td>{material.forma}</td>
                                            <td>{material.presentacion}</td>
                                            <td>{material.fecha_venc}</td>
                                            <td>
                                            <div className="btn-group" role="group">

                                            <button onClick={() => openModal(2,
                                                material.id,
                                                material.nombre,
                                                material.tipo,
                                                material.forma,
                                                material.presentacion,
                                                material.fecha_venc)}
                                                className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                                        <i className='fa-solid fa-edit'></i> Editar
                                                    </button>
                                                    <button onClick={() => deleteProduct(material.id)} className='btn btn-danger'>
                                                    <i className='fa-solid fa-trash'></i>
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
            <button type="button" onClick={generatePDF} data-toggle="tooltip" data-placement="right" title="Generar listado filtrado en formato PDF" class="btn btn-success btn-lg"><i class="fa-regular fa-file-pdf"></i> Imprimir Resultados</button>

            <div id='modalProducts' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{title}</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='id'></input>

                            <div className='input-group mb-3'>
                                <span className='input-group-text'>nombre</span>
                                <input type='text' id='nombre' className='form-control' placeholder='nombre' value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}></input>
                            </div>

                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Tipo</span>                      
                                <select id='tipo' value={tipo}
                                    
                                    onChange={handleChangeTipo}
                                        
                                >
                                    <option value="">Seleccione</option>
                                    <option value="Medicamento">Medicamento</option>
                                    <option value="Insumo">Insumo</option>
                                </select>
                            </div>
                       
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Forma</span>
                                <input type='text' id='forma' className='form-control' placeholder='Forma' value={forma}
                                    onChange={(e) => setForma(e.target.value)}
                                    disabled={isDisabled}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Presentacion</span>
                                <input type='text' id='presentacion' className='form-control' placeholder='Presentacion' value={presentacion}
                                    onChange={(e) => setPresentacion(e.target.value)}
                                    disabled={isDisabled}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Fecha Venc</span>
                                <DatePicker                                                   
                                    dateFormat="yyyy-MM-dd"
                                    selected={fecha_venc}                                  
                                    onChange={(date) => setFecha_venc(date)}                                  
                                />
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

export default Materiales