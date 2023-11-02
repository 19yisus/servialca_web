var municipio = 'sarep';
var host;

switch (municipio) {

  case 'sarep':

    //host = 'http://192.168.88.76'
    // host = 'http://localhost' 
    // host = 'http://localhost' 
    host = 'http://localhost:80/servialca_web/backend'
    //host = 'https://servialcarcv.com/servialca_web/backend'
    
    // host = 'http://192.168.0.110'
    module.exports = {
      url: host,
      conexion: host,
      servidor: host,
      municipio: 'sistema tributario',
      intra: host + ':2300',
      cne: host + ':2200',
      imagenes: host + ':2300',
      color: '#007bff',
      reportes: host + ':4000/sarep?',
      email: 'http://localhost:5000',
      alcaldia: 'Alcaldía del Municipio Guanare',
      correo: 'alcaldiadelmunicipioguanare@gmail.com',
      rif: 'G-20002730-4'
    }

    break;

  default:
    break;
}
