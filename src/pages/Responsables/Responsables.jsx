import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import style from "./Responsables.module.scss"
import axios from 'axios'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../../functions';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const Responsables = () => {
    const url = 'http://gesifar-api.test/responsablesController.php';
    
    const [responsables, setResponsables] = useState([]);

    const [id, setId] = useState('');
    const [dni, setDni] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');

    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [turno, setTurno] = useState('');

    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');
    const [searchDNI, setSearchDNI] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchLastname, setSearchLastname] = useState('');
    const [searchTel, setSearchTel] = useState('');
    const [searchDir, setSearchDir] = useState('');

    useEffect(() => {
        //console.log('getResponsables()');
        
        getResponsables();        
        //console.log(responsables);

        
    }, []);

    const getResponsables = async () => {
        const respuesta = await axios.get(url);
        setResponsables(respuesta.data);   
    }
    const openModal = (op, id, dni, nombre, apellido, telefono, direccion, turno) => {
        
        setId('');
        setDni('');
        setNombre('');
        setApellido('');
        setTelefono('');
        setDireccion('');
        setTurno('Seleccione');
        setOperation(op);
        if (op === 1) {
            setTitle('Registrar Responsable');
        }
        else if (op === 2) {
            setTitle('Editar Datos');

            setId(id);
            setDni(dni);
            setNombre(nombre);
            setApellido(apellido);
            setTelefono(telefono);
            setDireccion(direccion);            
            setTurno(turno);

        }
        window.setTimeout(function () {
            document.getElementById('dni').focus();
        }, 500);
    }
    const validar = () => {
        var parametros;
        var metodo;
        if (dni.trim() === '') {
            show_alerta('Escribe el DNI del responsable', 'warning');
        }
        else if (nombre.trim() === '') {
            show_alerta('Escribe el nombre del responsable', 'warning');
        }
        else if (apellido.trim() === '') {
            show_alerta('Escribe el apellido del responsable', 'warning');
        }
        else {
            if (operation === 1) {
                parametros = { dni: dni.trim(), nombre: nombre.trim(), apellido: apellido.trim(), telefono:telefono.trim(), direccion:direccion.trim(), turno:turno};
                metodo = 'POST';
            }
            else {
                parametros = { id: id, dni: dni.trim(), nombre: nombre.trim(), apellido: apellido.trim(),telefono: telefono.trim(), direccion:direccion.trim(), turno:turno };
                metodo = 'PUT';
            }
            enviarSolicitud(metodo, parametros);
        }
    }
    const enviarSolicitud = async (metodo, parametros) => {
        await axios({ method: metodo, url: url, data: parametros }).then(function (respuesta) {
            var tipo = respuesta.data[0];
            var msj = respuesta.data[1];
            show_alerta(msj, tipo);
            if (tipo === 'success') {
                document.getElementById('btnCerrar').click();
                getResponsables();
            }
        })
            .catch(function (error) {
                show_alerta('Error en la solicitud', 'error');
                console.log(error);
            });
    }

    const deleteProduct = (id, nombre) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: '¿Seguro de eliminar el profesional ' + nombre + ' ?',
            icon: 'question', text: 'No se podrá dar marcha atrás',
            showCancelButton: true, confirmButtonText: 'Si, eliminar', cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setId(id);
                enviarSolicitud('DELETE', { id: id });
            }
            else {
                show_alerta('Los datos del profesional NO fueron eliminados', 'info');
            }
        });
    }

    const generatePDF = async () => {
        const doc = new jsPDF({ orientation: "portrait" });

        doc.autoTable({
            html: ".table-to-print",
        });

        doc.save("responsables-registrados-GESIFAR.pdf");
    };

    return (
        <Layout title="Gestion de Responsables Solicitantes">
            <div className='container-fluid'>
                <div className=' mt-4'>
                    <div class="input-group" className='col-md-4 offset-8'>
                        <div className='d-grid mx-auto'>
                            <button onClick={() => openModal(1)} className='btn btn-lg btn-dark' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                <i className='fa-solid fa-circle-plus'></i> Añadir nuevo responsable
                            </button>
                        </div>
                    </div>
                    <div class="input-group" className='col-md-12'>
                        <h5>Consultar por campo:</h5>
                        <div class="row">

                            <div class="form-outline" className=' col-md-2' data-mdb-input-init>
                                <input type="search" id="form1" class="form-control" onChange={(e) => setSearchDNI(e.target.value)} />
                                <label class="form-label" for="form1">Consulta por DNI</label>
                            </div>
                            <div class="form-outline" className=' col-md-2' data-mdb-input-init>
                                <input type="search" id="form1" class="form-control" onChange={(e) => setSearchName(e.target.value)} />
                                <label class="form-label" for="form1">Consulta por Nombre</label>
                            </div>
                            <div class="form-outline" className=' col-md-2' data-mdb-input-init>
                                <input type="search" id="form1" class="form-control" onChange={(e) => setSearchLastname(e.target.value)} />
                                <label class="form-label" for="form1">Consulta por Apellido</label>
                            </div>
                            <div class="form-outline" className=' col-md-2' data-mdb-input-init>
                                <input type="search" id="form1" class="form-control" onChange={(e) => setSearchTel(e.target.value)} />
                                <label class="form-label" for="form1">Consulta por Telefono</label>
                            </div>
                            <div class="form-outline" className=' col-md-2' data-mdb-input-init>
                                <input type="search" id="form1" class="form-control" onChange={(e) => setSearchDir(e.target.value)} />
                                <label class="form-label" for="form1">Consulta por Direccion</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row mt-4'>
                    <div className='col-12 col-lg-12 offset-0'>
                        <div className='table-responsive container'>
                            <table className='table-to-print table table-bordered table-striped table-fixed'>
                                <thead class="sticky-top">
                                    <tr>
                                        <th>DNI</th>
                                        <th>NOMBRE</th>
                                        <th>APELLIDO</th>
                                        <th>TELEFONO</th>
                                        <th>DIRECCION</th>
                                        <th>TURNO</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {responsables.filter((item) =>
                                        item.dni.includes(searchDNI) && item.nombre.toLowerCase().includes(searchName) && item.apellido.toLowerCase().includes(searchLastname) && item.telefono.toLowerCase().includes(searchTel) && item.direccion.toLowerCase().includes(searchDir)
                                    ).map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.dni}</td>
                                            <td>{item.nombre}</td>
                                            <td>{item.apellido}</td>
                                            <td>{item.telefono}</td>
                                            <td>{item.direccion}</td>
                                            <td>{item.turno}</td>
                                            <td>
                                                <div className="btn-group" role="group">

                                                    <button onClick={() => openModal(2, item.id, item.dni, item.nombre, item.apellido, item.telefono, item.direccion, item.turno)}
                                                        className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                                        <i className='fa-solid fa-edit'></i> Editar
                                                    </button>
                                                    <button onClick={() => deleteProduct(item.id, item.nombre)} className='btn btn-danger'>
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
                                <span className='input-group-text'>DNI</span>
                                <input type='text' id='dni' className='form-control' placeholder='DNI' value={dni}
                                    onChange={(e) => setDni(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Nombre</span>
                                <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Apellido</span>
                                <input type='text' id='apellido' className='form-control' placeholder='Apellido' value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Telefono</span>
                                <input type='text' id='telefono' className='form-control' placeholder='Telefono' value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}></input>
          
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Direccion</span>
                                <input type='text' id='direccion' className='form-control' placeholder='Direccion' value={direccion}
                                    onChange={(e) => setDireccion(e.target.value)}></input>
                                
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Turno</span>                      
                                <select id='turno' value={turno}
                                    onChange={(e) =>{
                                        setTurno(e.target.value)                             
                                    }
                                    }>
                                    <option value="">Seleccione</option>
                                    <option value="Mañana">Mañana</option>
                                    <option value="Tarde">Tarde</option>
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

export default Responsables