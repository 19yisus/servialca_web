import { gql } from '@apollo/client';


export const FETCH_ALLCOMERCIO_QUERY = gql`
  query allComercios {
    allComercios(orderBy: RITM_ASC) {
  
    nodes {
        codigocatastral
        idcomercio
        nombre
        rif
        ritm
        reprelegal
      }
    
  }
}
`;

export const FETCH_COMERCIO_QUERY = gql`
 query comercioByIdcomercio($idcomercio: BigInt!, $reprelegal: BigInt!) {
    comercioByIdcomercio(idcomercio: $idcomercio) {
        acreditacion
        actualizado
        aniopridecla
        capitalpagado
        capitalsuscrito
        carretera
        clasecontribuyente
        codigocatastral
        codigopatente
        convenio
        correccional
        credito
        cuartel
        cuenta
        declara
        deportivo
        direccion
        educacional
        email
        esagentereten
        exonintereses
        exonmultas
        exonrecargos
        fechadeclaracion
        fechaemisionpate
        fechainscripcion
        fechaultimopago
        hospital
        idactividad
        idcomercio
        idinmueble
        licencialicores
        idtipoexpendio
        mercado
        mespridecla
        montoaseo
        montoaviso
        montodeclarado
        montopatente
        motivolicores
        motivopublicidad
        nombre
        notificado
        numempleados
        numerochequesdevuelto
        numerolicencia
        numobreros
        numregistro
        numtecnicos
        observacionstatus
        penal
        permiso
        porcentajeretencion
        porcopas
        propietario
        recactaconstitutiva
        recbalacecomprobacion
        recbalaceganancias
        recbalacegeneral
        reccedularep
        recdeclaracionisrl
        recregcomercio
        recrif
        recsolvenciamunicipal
        reprelegal
        retenciones
        rif
        ritm
        sectorcatastral
        sectorurbano
        status
        telefono
        templo
        tipoactividad
        tipocontribuyente
        tiponegocio
        ultimaemision
  }
  allPersonas(condition: {cedula: $reprelegal}) {
    nodes {
      correoe
      tlf1
      tlf2
      fnacimiento
      nacionalidad
      sexo
      cedula
      apellidos
      direccion
      nombres
    }
  }
  
}
`;

export const FETCH_ACTIVIDADXCOMERCIO_COMERCIO_QUERY = gql`
  mutation seleccionarActividadxcomercioComercio($idcomer: BigInt!, $anioefi: Int!){
  __typename
  seleccionarActividadxcomercioComercio(input: {idcomer: $idcomer, anioefi: $anioefi}) {
    results {
        alicuota
        codigoactividad
        codigociu
        descripcion
        idactividad
        minimo
    }
  }
}
`;

export const FETCH_ACTIVIDAD_QUERY = gql`
  query allActividads($idactividad: BigInt!) {
    allActividads(condition: {idactividad: $idactividad}) {
  
    nodes {
      actualizada
      alicuota
      anios
      codigoactividad
      codigociu
      descripcion
      idactividad
      minimo
    }
    
  }
}
`;

export const FETCH_USUARIOWEB_COMERCIO_QUERY = gql`
  mutation seleccionarUsuariowebComercio($idcomer: BigInt!){
  __typename
  seleccionarUsuariowebComercio(input: {idcomer: $idcomer}) {
    results {
        idusuarioweb
        login
        nombre
    }
  }
}
`;

export const FETCH_USUARIOWEB_QUERY = gql`
  query usuariowebByIdusuarioweb($idusuarioweb: BigInt!) {
    usuariowebByIdusuarioweb(idusuarioweb: $idusuarioweb) {

      bitacora
      cedula
      direccion
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

export const FETCH_CATALOGO_ACTIVIDAD_QUERY = gql`
query allActividads($anios: BigInt!, $order: [ActividadsOrderBy!]) {
  allActividads (orderBy: $order, condition: {anios: $anios}) {
  
    nodes {
      alicuota
      anios
      codigoactividad
      codigociu
      descripcion
      idactividad
      minimo
      actualizada
    }
    
  }
}
`;

export const FETCH_SELECCIONAR_INMUEBLE_COMERCIO_QUERY = gql`
  query allInmuebles($idinmueble: BigInt!) {
    allInmuebles (condition: {idinmueble: $idinmueble}) {
      nodes {
        codigocatastral
        idinmueble
        nombrepropie
      }
  }
}
`;

export const FETCH_DEUDA_COMERCIO_QUERY = gql`
mutation seleccionarDeudaComercio($espiritu: Int!, $fechasis: Date!, $idcontri: BigInt!){
  __typename
  seleccionarDeudaComercio(input: {espiritu: $espiritu, fechasis: $fechasis, idcontri: $idcontri}) {
    results {
        acreditacion
        anio
        estatus
        fechapago
        iddeudacom
        idfact
        intmoradeu
        mes
        mondescue
        mondeu
        multa
        nmes
        numreci
        recargodeu
        retencion
        subtotal
        verrecibo
        estatusfac
        tipotransaccion
    }
  }
}

`;


export const FETCH_PAGOSWEB_COMERCIO_QUERY = gql`
  mutation seleccionarPagoswebComercio($idcontri: BigInt!){
  __typename
  seleccionarPagoswebComercio(input: {idcontri: $idcontri}) {
    results {
      banco
      fecha
      monto
      numdocumento
      numfactura
      periodo
      status
      tippago
    }
  }
}
`;

export const FETCH_FACTURAS_CONTRIBUYENTE_QUERY = gql`
  mutation seleccionarFacturasContribuyente($idcontri: BigInt!, $nomtab: String!){
  __typename
  seleccionarFacturasContribuyente(input: {idcontri: $idcontri, nomtab: $nomtab}) {
    results {
      asignado
      codgestor
      descripcion
      fechaemision
      idfactura
      nombregestor
      numfactura
      status
    }
  }
}
`;

export const FETCH_RETENCIONES_AGENTE_QUERY = gql`
  mutation seleccionarRetencionesAgente($idcomer: BigInt!){
  __typename
  seleccionarRetencionesAgente(input: {idcomer: $idcomer}) {
    results {
      agenteretencion
      descristatus
      fechaenterami
      idfactura
      montorete
      numrete
      periodo
      status
    }
  }
}
`;

export const FETCH_ELIMINAR_RETENCIONES_AGENTE_QUERY = gql`
  mutation eliminarRetencionesAgente($idcomer: BigInt!, $peri: String!){
  __typename
  eliminarRetencionesAgente(input: {idcomer: $idcomer, peri: , $peri}) {
    results {
      agenteretencion
      descristatus
      fechaenterami
      idfactura
      montorete
      numrete
      periodo
      status
    }
  }
}
`;

export const FETCH_CONFIGURACION_INDUSTRIA_QUERY = gql`
  mutation seleccionarConfiguracionIndustria{
  __typename
  seleccionarConfiguracionIndustria(input: {}) {
    results {
      declaweb
      factorcalculo
      factormulta
      mesdesdequincena
      mesesdecladefi
      numpago
      peripago
      porinteres
      porrecargo
      tipointe
      valormulta
      valorpetro
      valorporce
      valorut
      valorutMulta
    }
  }
}
`;

export const REGISTRAR_ACTIVIDAD = gql`
  mutation actividadAct($arg0: Int!, $arg1: BigInt!, $arg2: String!, $arg3: String!, $arg4:BigFloat!, $arg5: BigFloat!, 
      $arg6: Boolean!, $arg7: BigInt!, $arg8: String!){
  __typename
  actividadAct(input: {arg0: $arg0, arg1: $arg1, arg2: $arg2, arg3: $arg3, arg4: $arg4, arg5: $arg5, 
      arg6: $arg6, arg7: $arg7, arg8: $arg8}) {

      bigInt
        
    }
  }

`;

export const REGISTRAR_COMERCIO = gql`
  mutation comercioActualizar($come: JSON!, $operacion: Int!, $operacionper: Int!, $declaweb: Boolean! 
    $fechasis: Date!, $idusu: BigInt!, $ingresa: BigInt!, $actixcome: JSON!, $repre: JSON!){
  __typename
  comercioActualizar(input: {come: $come, operacion: $operacion, operacionper: $operacionper, declaweb: $declaweb, 
    fechasis: $fechasis, idusu: $idusu, ingresa: $ingresa, actixcome: $actixcome, repre: $repre}) {

        idcomer
        
    }
  }

`;

export const ACTUALIZAR_CAMPOS_COMERCIO = gql`
  mutation actualizarCamposComercio($come: JSON!, $operacionper: Int!, $declaweb: Boolean! 
    $repre: JSON!){
  __typename
  actualizarCamposComercio(input: {come: $come, operacionper: $operacionper, declaweb: $declaweb, 
    repre: $repre}) {

        idcomer
        
    }
  }

`;

export const DATOS_CALCULO_DECLA = gql`
mutation seleccionarDatosCalculoDecla($idcomer: BigInt!, $anio: BigInt!, $mes: BigInt!, $tipo: String!){
__typename
seleccionarDatosCalculoDecla(input: {idcomer: $idcomer, anio: $anio, mes: $mes, tipo: $tipo}) {
  results {
    acredit
    acreditacion
    credito
    diasvencido
    diavendeudareg
    factorcalculo
    factormulta
    montoestimado
    porcebenef
    porcenimpuesto
    porcentajeinteres
    porcentajerecargo
    valormulta
    valorut
    valorutmulta
  }
}
}
`;

/*export const FETCH_VALOR_UT_QUERY = gql`
  mutation seleccionarValorUt($nanio: BigInt!, $nmes: BigInt!){
  __typename
  seleccionarValorUt(input: {nanio: $nanio, nmes: $nmes}) {
    results {
      factorcalculo
      valorut
    }
  }
}
`;*/

export const FETCH_VALORUT_QUERY = gql`
  mutation seleccionarValorUt($idcomer: BigInt!, $anio: BigInt!, $mes: BigInt!, $tipo: String!, $fecha: Date!, $espiritu: Int!, $totdeuda: String!){
  __typename
  seleccionarValorUt(input: {idcomer: $idcomer, anio: $anio, mes: $mes, tipo: $tipo, fecha: $fecha, espiritu: $espiritu, totdeuda: $totdeuda}) {
    results {
      factorcalculo
      factormulta
      valormulta
      valorpetro
      valorut
      valorutmulta
    }
  }
}
`;

export const FETCH_DJURADA_QUERY = gql`
  mutation seleccionarDjuradaComercio($idcomer: BigInt!, $nanio: Int!, $cmes: String!, $tipodec: Int!){
  __typename
  seleccionarDjuradaComercio(input: {idcomer: $idcomer, nanio: $nanio, cmes: $cmes, tipodec: $tipodec}) {
    results {
      alicuota
      codigociu
      creditofavor
      creditofavor
      descripcion
      diferenciacredito
      fechadeclaracion
      idactividad
      idcomercio
      iddjurada
      idfactura
      interes
      liquidador
      mes
      montoapagar
      montodeclarado
      montodescuento
      montoestimado
      montopetro
      multa
      nummes
      porcedescuento
      recargo
      reintegro
      retenciones
      statuscredito
      temporal
      tipo
      totalanticipado
      totalbeneficiofiscal
      valorpetro
    }
  }
}
`;

export const REGISTRAR_DECLARACION = gql`
  mutation djuradaActualizar($actixcome: JSON!, $cadmes: String!, $declaweb: Boolean!, $dirip: String!, 
    $dirmac: String!, $fechasis: Date!, $idcomer: BigInt!, $idusu: BigInt!, $numpago: Int!, $peri: Int!, $txtrif: String!){
  __typename
  djuradaActualizar(input: {actixcome: $actixcome, cadmes: $cadmes, declaweb: $declaweb, dirip: $dirip, 
    dirmac: $dirmac, fechasis: $fechasis, idcomer: $idcomer, idusu: $idusu, numpago: $numpago, peri: $peri, txtrif: $txtrif}) {

      iddeuda
        
    }
  }

`;

export const ELIMINAR_DECLARACION = gql`
  mutation djuradaEliminar($cmes: String!, $declaweb: Boolean!, $dirip: String!, 
    $dirmac: String!, $fechasis: Date!, $idcomer: BigInt!, $idusu: BigInt!, 
    $montotot: BigFloat!,$nanio: Int!, $nmes: Int!, $tipodec: Int!){
  __typename
  djuradaEliminar(input: {cmes: $cmes, declaweb: $declaweb, dirip: $dirip, 
    dirmac: $dirmac, fechasis: $fechasis, idcomer: $idcomer, idusu: $idusu, 
    montotot: $montotot, nanio: $nanio, nmes: $nmes, tipodec: $tipodec}) {

      idcomercio
        
    }
  }

`;

export const FETCH_ELIMINAR_PAGO_WEB_QUERY = gql`
  mutation eliminarPagoWeb($declaweb: Boolean!, $idcomer: BigInt!, $nfactura: String!, $peri: String!){
  __typename
  eliminarPagoWeb(input: {declaweb: $declaweb, idcomer: $idcomer, nfactura: $nfactura, peri: , $peri}) {
    results {
      banco
      fecha
      monto
      numdocumento
      numfactura
      periodo
      status
      tippago
    }
  }
}
`;

export const FETCH_SELECCIONAR_ALLVERIFICACION_QUERY = gql`
  mutation seleccionarVerificacionesTodas {
  __typename
  seleccionarVerificacionesTodas(input: {}) {
  
    results {
      fechaverificacion
      idtipoingreso
      idverificacion
      idverificador
      liquidador
      montototal
      prefactura
      status
    }
    
  }
}
`;

export const FETCH_VERIFICACION_QUERY = gql`
  query allVerificacions($idverificacion: BigInt!) {
    allVerificacions(condition: {idverificacion: $idverificacion}) {
  
    nodes {
      contribuyente
      cuentabancaria
      deudas
      fecha
      fechaverificacion
      hora
      idcontribuyente
      idcuentabancaria
      idfactura
      idpagoweb
      idtipoingreso
      idverificacion
      idverificador
      monto
      montodeducible
      montoimpuesto
      montointereses
      montomulta
      montorecargo
      montototal
      nrodocumento
      nrofactura
      periodo
      status
      tabla
      tipo
    }
    
  }
}
`;

export const FETCH_SELECCIONAR_LIQUIDADOR_QUERY = gql`
mutation seleccionarLiquidador($idveri: BigInt!){
  __typename
  seleccionarLiquidador(input: {idveri: $idveri}) {
  
    results {
      cedula
      codigo
      liquidador
    }
    
  }
}
`;

export const FETCH_TIPOIMPUESTO_PAGOWEB_QUERY = gql`
  query allTipoimpuestos($pagosweb: BigInt!) {
    allTipoimpuestos(condition: {pagosweb: $pagosweb}) {
  
    nodes {
      descripcion
      idtipoingreso
      idtipoimpuesto
      pagosweb
      tabla
      tipofacturacion
    }
    
  }
}
`;


export const FETCH_SELECCIONAR_VERRIFY_QUERY = gql`
mutation seleccionarPagosAVerify($condic: String!, $id: String!){
  __typename
  seleccionarPagosAVerify(input: {condic: $condic, id: $id}) {
  
    results {
      contribuyente
      cuentabancaria
      fecha
      idcontribuyente
      idcuentabancaria
      idfactura
      idpagoweb
      idpublicidad
      idtipoingreso
      monto
      montodeducible
      montoimpuesto
      montointereses
      montomulta
      montorecargo
      nrodocumento
      nrofactura
      periodo
      tabla
      tipo
      tipotransaccion
    }
    
  }
}
`;