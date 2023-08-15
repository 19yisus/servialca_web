import React from 'react';
import { Doughnut, Pie } from 'react-chartjs-2';


export function Dona(props) {

  return (
    <div>
      <Doughnut data={props.data} />
      <div className="col-xl-4 col-sm-4 col-12 mb-4">
        <div className="card">
          <div className="card-body bg-card-info">
            <div className="d-flex justify-content-between px-md-1">
              <div className="align-self-center">
                <i className="fas fa-users  fa-3x" />
              </div>
              <div className="text-end">
                <p className="mb-0 fw-bold">Total Expendedores</p>
                <h2>{props.total}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Torta(props) {

  return (
    <div className='row col-md-12' style={{ margin:0 }}>
      <div className='col-md-12 mb-4'>
      <Pie legend={props.legend} height={props.height}  options={props.options} data={props.data} />
      </div>
      <table className="table tablet-responsive table-striped">
        <tbody>
          
          {props.datos && props.datos.map((item, index) => (
                <tr key={index} ><td style={{backgroundColor: item.color,border :'#000000 1px solid', width:'20px', fontSize: '10px', margin: 0, padding: 0}}></td><td style={{border :'#000000 1px solid', fontSize: '10px', margin: 0, padding: 0, paddingLeft: '3px'}}>{item.nombre}</td><td style={{border :'#000000 1px solid', textAlign:'end', fontSize: '10px', margin: 0, padding: 0, paddingRight: '3px'}}>{item.valor}</td></tr>
              ))}

        </tbody>
      </table>
      
{/*       <div className="row col-md-12" style={{margin: 0,padding:0, overflow:'auto', border :'#000000 1px solid', }}>
              {props.datos && props.datos.map((item, index) => (
                <div key={index} className='row col-12' style={{borderBottom: props.datos.length === index+1 ? 'none' : '#000000 1px solid', margin: 0, padding: '2px', height:'20px'}}><div className='col-1' style={{fontSize: '10px', backgroundColor: item.color, height:'90%'}}></div><div style={{fontSize: '10px', height:'20px' }} className='col-10'>{item.nombre}</div><div className='col-1' style={{fontSize: '10px', textAlign: 'end', height:'20px' }}>{item.valor}</div></div>
              ))}
      </div> */}
    </div>
  );
}


