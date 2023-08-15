import swal from 'sweetalert2';

export const MensajeMinimal = (titulo) => {

  const Toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', swal.stopTimer)
      toast.addEventListener('mouseleave', swal.resumeTimer)
    }
  })
  
  return Toast.fire({
    icon: 'success',
    title: titulo
  }) 
  


/*   return  Swal.fire({
          icon: icono,
          title: titulo,
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          },
          text: mensaje,
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonColor: '#d33',
          cancelButtonText: textoBoton,

        }) */

}

export const MensajeAlert = (titulo, mensaje, icono, textoBoton, color) => {


    return  (swal.fire({
            icon: icono,
            title: titulo,
            text: mensaje,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonColor: color,
            cancelButtonText: textoBoton,

          }).then((result) => {
            if (result.isConfirmed) {
              return true;
            }else{
              return false;
            }
            
          })
    );

}

 export const MensajeAlertSiNo = (titulo, mensaje, icono) => {

    return (
        swal.fire({
            title: titulo,
            text: mensaje,
            icon: icono,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar!'
          }).then((result) => {
            if (result.isConfirmed) {
              return true;
            }else{
              return false;
            }
            
          })
    );
} 
