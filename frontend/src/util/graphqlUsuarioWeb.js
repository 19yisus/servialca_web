import { gql } from '@apollo/client';


export const FETCH_USUARIOS_QUERY = gql`
mutation getusuariosweb {
  getusuariosweb(input: {}) {
    results {
      idusuarioweb
      login
      email2
      estatus
      cedula
      nombre
      direccion
      telefono
      rif
      dirip
      bitacora
      nacionalidad
      agenteretencion
      idcomercio
    }
  }
}


`;

export const FETCH_USUARIO_QUERY = gql`
 query usuariowebByIdusuarioweb($idusuarioweb: BigInt!){
  usuariowebByIdusuarioweb(idusuarioweb: $idusuarioweb) {
    agenteretencion
    bitacora
    direccion
    cedula
    dirip
    email2
    estatus
    idcomercio
    idusuarioweb
    login
    nacionalidad
    nombre
    passwd
    rif
    telefono
  }
}
`;

export const FETCH_DELETE_QUERY = gql`
 mutation deleteUsuariowebByIdusuarioweb($idusuarioweb: BigInt!) {
  deleteUsuariowebByIdusuarioweb(input: {idusuarioweb: $idusuarioweb}) {
    deletedUsuariowebId
  }
}

`;

export const FETCH_TRIBUTOS_QUERY = gql`
 query allMistributos($idusuarioweb: BigInt!) {
  allMistributos(condition: {idusuarioweb: $idusuarioweb}) {
    nodes {
      idtributo
      idusuarioweb
      tributo
    }
  }
}

`;

export const FETCH_DELETE_TRIBUTOS = gql`
 mutation eliminarTributo($idusuarioweb: BigInt!) {
  eliminarTributo(input: {idusuario: $idusuarioweb}) {
    respuestas
  }
}

`;

export const FETCH_DELETE_TRIBUTO = gql`
 mutation eliminarTrib($idtributo: BigInt!) {
  eliminarTrib(input: {idtributo: $idtributo}) {
    respuestas
  }
}

`;

export const FETCH_UPDATE_USUARIOS = gql`
mutation updateUsuariowebByIdusuarioweb($cedula: BigInt!, $idusuarioweb: BigInt!, $direccion: String!, $email2: String!, $login: String!, $nacionalidad: String!, $nombre: String!, $telefono: String!) {
  updateUsuariowebByIdusuarioweb(
    input: {usuariowebPatch: {telefono: $telefono, cedula: $cedula, direccion: $direccion, nacionalidad: $nacionalidad, email2: $email2, login: $login, nombre: $nombre}, idusuarioweb: $idusuarioweb}
  ) {
    usuarioweb {
      idusuarioweb
    }
  }
}


`;

export const FETCH_UPDATE_CLAVE = gql`
 mutation updateUsuariowebByIdusuarioweb($idusuarioweb: BigInt!, $passwd: String!) {
  updateUsuariowebByIdusuarioweb(
    input: {usuariowebPatch: {passwd: $passwd}, idusuarioweb: $idusuarioweb}
  ) {
    usuarioweb {
      idusuarioweb
    }
  }
}

`;


export const FETCH_USUARIO_ID = gql`
 mutation getusuarioweb($idusuarioweb: BigInt!) {
  getusuarioweb(input: {idusuario: $idusuarioweb}) {
    results {
      idusuarioweb
      login
      email2
      estatus
      cedula
      nombre
      direccion
      telefono
      rif
      dirip
      bitacora
      nacionalidad
      agenteretencion
      idcomercio
      idtributo
      tributo
    }
  }
}

`;

export const FETCH_USUARIO_CD = gql`
 mutation getusuariocedula($cedula: BigInt!) {
  getusuariocedula(input: {cedu: $cedula}) {
    results {
      idusuarioweb
      login
      email2
      estatus
      cedula
      nombre
      direccion
      telefono
      rif
      dirip
      bitacora
      nacionalidad
      agenteretencion
      idcomercio
      idtributo
      tributo
    }
  }
}

`;

export const FETCH_TRIBUTOS = gql`
 mutation getributos($idusuarioweb: BigInt!) {
  hComer(input: {idusuariow: $idusuarioweb}) {
  results {
    numerolicencia
    porcenbeneficiore
    ritm
    rif
    email
    direccion
    nombre
    reprelegal
    status
    esagentereten
    idcomercio
  }
}

seleccionarInmuebleUsuarioweb(input: {idusuariow: $idusuarioweb}) {
  results {
    idinmueble
    nombre
    direccion
    rif
  }
}

seleccionarVehiculosUsuarioweb(input: {idusuariow: $idusuarioweb}) {
    results {
      idvehiculo
      placa
      marca
      modelo
      anio
      cedulapropie
      nombrepropie
    }
  }
}

`;

export const FETCH_COMERCIO = gql`
 mutation cargarComercio($codigo: BigInt!) {
  cargarComercio(input: {codigo: $codigo}) {
    results {
      rif
      direccion
      nombre
      reprelegal
      idcomercio
    }
  }
}

`;

export const FETCH_COMERCIOS = gql`
 mutation cargarcomercios {
  cargarcomercios(input: {}) {
  results {
    rif
    direccion
    nombre
    reprelegal
    idcomercio
  }
}
}

`


export const FETCH_INMUEBLES = gql`
 mutation cargarinmuebles {
  cargarinmuebles(input: {}) {
    results {
      idinmueble
      nombre
      direccion
      rif
    }
  }
 }

`;

export const FETCH_INMUEBLE = gql`
 mutation cargarInmueble($codigo: BigInt!) {
  cargarInmueble(input: {codigo: $codigo}) {
    results {
      idinmueble
      nombre
      direccion
      rif
    }
  }
}

`;

export const FETCH_VEHICULO = gql`
 mutation cargarVehiculo($codigo: BigInt!) {
  cargarVehiculo(input: {codigo: $codigo}) {
    results {
      idvehiculo
      cedulapropie
      nombrepropie
      direccionpropie
    }
  }
}

`;

export const FETCH_VEHICULOS = gql`
 mutation cargarvehiculos {
  cargarvehiculos(input: {}) {
    results {
      idvehiculo
      cedulapropie
      nombrepropie
      direccionpropie
    }
  }
}

`;

export const VALIDAR_TRIBUTO = gql`
mutation validartributo($codigo: BigInt!){
  validartributo(input: { codigo: $codigo}) {
    respuestas
  }
}

`;

export  const AGREGAR_TRIBUTO = gql`
mutation createMistributo( $idusuarioweb: BigInt!, $tributo: String!, $idtributo: BigInt! ){
  createMistributo(
    input: {mistributo: {idusuarioweb: $idusuarioweb, tributo: $tributo, idtributo: $idtributo}}
  ) {
    mistributo {
      idtributo
      idusuarioweb
      tributo
    }
  }
}

`;



export const FETCH_QUERY_INMUEBLE = gql`
 query allInmuebles{
  allInmuebles {
    nodes {
      cedulapropie
      nombrepropie
      dirpropie
      idinmueble
    }
  }
}

`;

