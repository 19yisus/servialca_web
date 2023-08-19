import React from 'react';

function CartasBancos(props) {

    return (
  <div className="row">
  <div className="col-xl-4 col-sm-4 col-12 mb-4">
    <div className="card">
      <div className="card-body bg-card-info" style={{height:'120px'}}>
        <div className="d-flex justify-content-between px-md-1">
          <div className="align-self-center">
            <i className="fas fa-users  fa-3x" />
          </div>
          <div className="text-end">
            <p className="mb-0 fw-bold">Total {props.nombre}</p>
            <h2>{props.total}</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="col-xl-4 col-sm-4 col-12 mb-4">
   {/*  <div className="card">
      <div className="card-body bg-card-warnir" style={{height:'120px'}}>
        <div className="d-flex justify-content-between px-md-1">
          <div className="align-self-center">
            <i className="fas fa-user-check fa-3x" />
          </div>
          <div className="text-end">
            <p className="mb-0 fw-bold">Total Activos</p>
            <h2>{props.activos}</h2>
          </div>
        </div>
      </div>
    </div> */}
  </div>
  <div className="col-xl-4 col-sm-4 col-12 mb-4">
   {/*  <div className="card">
      <div className="card-body bg-danger" style={{height:'120px'}}>
        <div className="d-flex justify-content-between px-md-1">
          <div className="align-self-center">
            <i className="fas fa-user-times fa-3x" />
          </div>
          <div className="text-end">
            <p className="mb-0 fw-bold">Total Inactivos</p>
            <h2>{props.inactivos}</h2>
          </div>
        </div>
      </div>
    </div> */}
  </div>
</div>

  );
}

export default CartasBancos;