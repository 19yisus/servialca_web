import React from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';



  function panelLocal() {



 const options = {
    responsive: true,
   
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Bar Chart',
      },

  };
  
  const labels = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes ', 'Sabado', 'Domingo'];
  
   const data = {
    labels,
    datasets: [
      {
        label: 'Miembros',
        data: [12,4,34,54,7,12,78,],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    
    ],
  };


    return (

      <div className='col-sm-12 h-100 w-100 '>

          <div className="col-md-12 mx-auto bg-light row">
              <div className="col-md-6 h-100">

              </div>
              <div className="col-md-6 h-25">
              <Bar options={options} data={data} />
              </div>
              <div className="col-md-6 h-25">
                  
              </div>
             
          </div>
        
      </div>
    );
  }

  export default panelLocal;

