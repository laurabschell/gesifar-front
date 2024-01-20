import { React } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import { Gestiones } from "./pages/Gestiones/Gestiones";
import { Solicitudes } from "./pages/Solicitudes/Solicitudes";
import { Profesionales } from "./pages/Profesionales/Profesionales";
import { Responsables } from "./pages/Responsables/Responsables";
import { Materiales } from "./pages/Materiales/Materiales";
import { Ordenes } from "./pages/Ordenes/Ordenes";

import { ProtectedRoute } from "./components/ProtectedRoute";
import Estadisticas from "./pages/Estadisticas/Estadisticas";


function App() {

  const user = JSON.parse(localStorage.getItem('user'));
  console.log('user en App', user);
  console.log('!!user :', !!user);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute isAllowed={user} />} >
          <Route path="/gestiones" element={<Gestiones />} />
          <Route path="/solicitudes" element={<Solicitudes />} />
          <Route path="/profesionales" element={<Profesionales />} />
          <Route path="/materiales" element={<Materiales />} />
          <Route path="/responsables" element={<Responsables />} />
          <Route path="/ordenes" element={<Ordenes />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
        </Route>
        <Route element={<ProtectedRoute
          /*isAllowed={!!user && !!user.role && user.role == 'ADMIN'*/
          isAllowed={!!user && !!user.roles && user.roles.includes('ADMIN')} />} >
          <Route path="/admin" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
