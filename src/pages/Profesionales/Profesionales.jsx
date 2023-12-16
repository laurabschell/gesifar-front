import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import axios from 'axios'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../../functions';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Select from 'react-select'

export const Profesionales = () => {
    const url = 'http://gesifar-api.test/profesionalesController.php';
    const urlProfesiones = 'http://gesifar-api.test/profesionesController.php';
    const urlAreas = 'http://gesifar-api.test/areasController.php';
    
    const [professionals, setProfessionals] = useState([]);
    const [profesiones, setProfesiones] = useState([]);
    const [areas, setAreas] = useState([]);

    const [id, setId] = useState('');
    const [dni, setDni] = useState('');
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');

    const [profesion, setProfesion] = useState('');
    const [area, setArea] = useState('');

    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');
    const [searchDNI, setSearchDNI] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchLastname, setSearchLastname] = useState('');
    const [searchArea, setSearchArea] = useState('');
    const [searchProf, setSearchProf] = useState('');
    // const [filteredProfessionals, setFilteredProfessionals] = useState(professionals);

    useEffect(() => {
        getProfessionals();
        getProfesiones();
        getAreas();
        
        
    }, []);

    const getProfessionals = async () => {
        const respuesta = await axios.get(url);
        setProfessionals(respuesta.data);
    }
    const getProfesiones  = async () => {
        const response = await axios.get(urlProfesiones);
        //setProfesiones(response.data);
        const aProfesiones = response.data.map(p => ({
               "label": p.descripcion,
               "value": p.id
        }))
        const aProfesiones2 = [
            {
                "label": "Seleccione",
                "value": ""
            },
            ...aProfesiones];
    
        setProfesiones(aProfesiones2);
    }
    const getAreas  = async () => {
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
    const openModal = (op, id, dni, name, lastname, profesion, area) => {
        console.log(profesiones);

        setId('');
        setDni('');
        setName('');
        setLastname('');
        setProfesion('');
        setArea('');
        setOperation(op);
        if (op === 1) {
            setTitle('Registrar Profesional');
        }
        else if (op === 2) {
            setTitle('Editar Datos');
            setId(id);
            setDni(dni);
            setName(name);
            setLastname(lastname);
            setProfesion(profesion);
            setArea(area);
        }
        window.setTimeout(function () {
            document.getElementById('nombre').focus();
        }, 500);
    }
    const validar = () => {
        var parametros;
        var metodo;
        if (dni.trim() === '') {
            show_alerta('Escribe el DNI del profesional', 'warning');
        }
        else if (name.trim() === '') {
            show_alerta('Escribe el nombre del profesional', 'warning');
        }
        else if (lastname.trim() === '') {
            show_alerta('Escribe el apellido del profesional', 'warning');
        }
        else {
            if (operation === 1) {
                parametros = { dni: dni.trim(), name: name.trim(), lastname: lastname.trim() , profesion, area};
                metodo = 'POST';
            }
            else {
                parametros = { id: id, dni: dni.trim(), name: name.trim(), lastname: lastname.trim(), profesion, area };
                metodo = 'PUT';
            }
            envarSolicitud(metodo, parametros);
        }
    }
    const envarSolicitud = async (metodo, parametros) => {
        await axios({ method: metodo, url: url, data: parametros }).then(function (respuesta) {
            var tipo = respuesta.data[0];
            var msj = respuesta.data[1];
            show_alerta(msj, tipo);
            if (tipo === 'success') {
                document.getElementById('btnCerrar').click();
                getProfessionals();
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
            title: '¿Seguro de eliminar el profesional ' + name + ' ?',
            icon: 'question', text: 'No se podrá dar marcha atrás',
            showCancelButton: true, confirmButtonText: 'Si, eliminar', cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setId(id);
                envarSolicitud('DELETE', { id: id });
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

        doc.save("profesionales-registrados-GESIFAR.pdf");
    };

    return (
        <Layout title="Gestion de Profesionales Solicitantes">
            <div className='container-fluid'>
                <div className=' mt-4'>
                    <div class="input-group" className='col-md-4 offset-8'>
                        <div className='d-grid mx-auto'>
                            <button onClick={() => openModal(1)} className='btn btn-lg btn-dark' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                <i className='fa-solid fa-circle-plus'></i> Añadir nuevo profesional
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
                                <input type="search" id="form1" class="form-control" onChange={(e) => setSearchProf(e.target.value)} />
                                <label class="form-label" for="form1">Consulta por Profesion</label>
                            </div>
                            <div class="form-outline" className=' col-md-2' data-mdb-input-init>
                                <input type="search" id="form1" class="form-control" onChange={(e) => setSearchArea(e.target.value)} />
                                <label class="form-label" for="form1">Consulta por Area</label>
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
                                        <th>PROFESION</th>
                                        <th>AREA</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {professionals.filter((item) =>
                                        item.dni.toLowerCase().includes(searchDNI) && item.name.toLowerCase().includes(searchName) && item.lastname.toLowerCase().includes(searchLastname) && item.profesion.toLowerCase().includes(searchProf) && item.area.toLowerCase().includes(searchArea)
                                    ).map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.dni}</td>
                                            <td>{item.name}</td>
                                            <td>{item.lastname}</td>
                                            <td>{item.profesion}</td>
                                            <td>{item.area}</td>
                                            <td>
                                                <div className="btn-group" role="group">

                                                    <button onClick={() => openModal(2, item.id, item.dni, item.name, item.lastname, item.profesion, item.area)}
                                                        className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                                        <i className='fa-solid fa-edit'></i> Editar
                                                    </button>
                                                    <button onClick={() => deleteProduct(item.id, item.name)} className='btn btn-danger'>
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
                                <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={name}
                                    onChange={(e) => setName(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Apellido</span>
                                <input type='text' id='apellido' className='form-control' placeholder='Apellido' value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Profesion</span>
                                <Select id='profesion' options={profesiones}
                                
                                    onChange={(e) => {
                                        console.log(e);
                                        console.log(e.label);
                                        
                                        setProfesion(e.label)
                                    }}

                                />
          
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Area</span>
                                <Select id='area' options={areas}
                                
                                onChange={(e) => {
                                    console.log(e);
                                    console.log(e.label);
                                    
                                    setArea(e.label)
                                }}

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

export default Profesionales