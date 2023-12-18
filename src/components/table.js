import React, { useState } from "react";
function TableRows({ rows, tableRowRemove, onValUpdate }) {
  return rows.map((rowsData, index) => {
    const { material, cantidad } = rowsData;
    return (
      <tr key={index}>
        <td>
          <input readOnly
            type="text"
            value={material}
            onChange={(event) => onValUpdate(index, event)}
            name="material"
            className="form-control"
          />
        </td>
        <td>
          <input readOnly
            type="text"
            value={cantidad}
            onChange={(event) => onValUpdate(index, event)}
            name="cantidad"
            className="form-control"
          />
        </td>
        
        <td>
          <button
            className="btn btn-dark"
            onClick={() => tableRowRemove(index)}
          >
            Quitar
          </button>
        </td>
      </tr>
    );
  });
}

/*function Table({ m }) {
  
  const m = {material:"IBU",cantidad:2};

  const [rows, initRow] = useState([]);*/

function Table({ rows, addRowTable, tableRowRemove }) {
 
  return (
    <>
      
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Material</th>
            <th>Cantidad</th>
            
            <th>
              <button className="btn btn-danger" onClick={addRowTable}>
                Insertar
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <TableRows
            rows={rows}
            tableRowRemove={tableRowRemove}
            
          />
        </tbody>
      </table>
    </>
  );
}
export default Table;