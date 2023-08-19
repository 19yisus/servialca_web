import { gql } from '@apollo/client';

export const FETCH_PLANILLAS_TIMBRES_QUERY = gql`
query Planillas {
  allPlanillatimbres {
    nodes {
      codplanillatimbre
      monto
      fechageneracion
      estatusplanillatimbre
      fechaactivacion
      usuarioactivacion
      inhabilitaciondia
      usuarioinhabilita
      motivoinhabilitacion
      idplanillatimbre
    }
  }
}


`;


export const FETCH_TIMBRES_QUERY = gql`
query Timbres {
  allTimbredetalles {
    nodes {
      idexpendio
      fechaasignacion
      estatustimbre
      estatusactivacion
      activaciondia
      validodia
      usuarioactivacion
      usodia
      usuariouso
      motivodesincorporacion
      desincorporaciondia
      ut
      idplanillatimbre
      idtimbredetalle
    }
  }
}

`;

export const FETCH_TIMBRE_DETALLE_QUERY = gql`
query MiTimbre($idtimbredetalle: BigInt!) {
  allTimbredetalles(condition: {idtimbredetalle: $idtimbredetalle}) {
    nodes {
      activaciondia
      desincorporaciondia
      estatusactivacion
      estatustimbre
      fechaasignacion
      idexpendio
      idplanillatimbre
      idtimbredetalle
      motivodesincorporacion
      usodia
      usuarioactivacion
      usuariouso
      ut
      validodia
    }
  }
}

`;

export const FETCH_GENERAR_PLANILLA_QUERY = gql`
mutation GenerarPlanilla($montoTimbre: BigFloat!) {
  generarTimbres(input: {montoTimbre: $montoTimbre}) {
    respuestas
  }
}
`;

export const FETCH_GESTINAR_PLANILLA_QUERY = gql`
query allPlanillatimbres($idplanillatimbre: BigInt!) {
  allPlanillatimbres(condition: {idplanillatimbre: $idplanillatimbre}) {
    nodes {
      codplanillatimbre
      monto
      fechageneracion
      estatusplanillatimbre
      fechaactivacion
      usuarioactivacion
      inhabilitaciondia
      usuarioinhabilita
      motivoinhabilitacion
      idplanillatimbre
    }
  }
}

`;

export const FETCH_EDITAR_PLANILLA_QUERY = gql`
mutation MyMutation($idplanillatimbre: BigInt!, $codplanillatimbre: String = "", $estatusplanillatimbre: Int = 10, $fechaactivacion: Date = "", $fechageneracion: Date = "", $inhabilitaciondia: Date = "", $monto: BigFloat = "", $motivoinhabilitacion: String = "", $usuarioactivacion: BigInt = "", $usuarioinhabilita: BigInt = "") {
  updatePlanillatimbreByIdplanillatimbre(
    input: {planillatimbrePatch: {codplanillatimbre: $codplanillatimbre, estatusplanillatimbre: $estatusplanillatimbre, fechaactivacion: $fechaactivacion, fechageneracion: $fechageneracion, inhabilitaciondia: $inhabilitaciondia, monto: $monto, motivoinhabilitacion: $motivoinhabilitacion, usuarioactivacion: $usuarioactivacion, usuarioinhabilita: $usuarioinhabilita}, idplanillatimbre: $idplanillatimbre}
  ) {
    planillatimbre {
      idplanillatimbre
    }
  }
}


`;

export const FETCH_GESTIONAR_TIMBRE_QUERY = gql`
query MyQuery($idtimbredetalle: BigInt!) {
  allTimbredetalles(condition: {idtimbredetalle: $idtimbredetalle}) {
    nodes {
      idexpendio
      fechaasignacion
      estatustimbre
      estatusactivacion
      activaciondia
      validodia
      usuarioactivacion
      usodia
      usuariouso
      motivodesincorporacion
      desincorporaciondia
      ut
      idtimbredetalle
      idplanillatimbre
    }
  }
}

`;

export const FETCH_EDITAR_TIMBRE_QUERY = gql`
mutation MyMutation($idtimbredetalle: BigInt!, $activaciondia: Date = "", $desincorporaciondia: Date = "", $estatusactivacion: Int, $estatustimbre: Int, $fechaasignacion: Date = "", $idexpendio: BigInt = "", $idplanillatimbre: BigInt = "", $motivodesincorporacion: String = "", $usodia: Date = "", $usuarioactivacion: BigInt = "", $usuariouso: BigInt = "", $ut: BigFloat = "", $validodia: Date = "") {
  updateTimbredetalleByIdtimbredetalle(
    input: {timbredetallePatch: {activaciondia: $activaciondia, desincorporaciondia: $desincorporaciondia, estatusactivacion: $estatusactivacion, estatustimbre: $estatustimbre, fechaasignacion: $fechaasignacion, idexpendio: $idexpendio, idplanillatimbre: $idplanillatimbre, motivodesincorporacion: $motivodesincorporacion, usodia: $usodia, usuarioactivacion: $usuarioactivacion, usuariouso: $usuariouso, ut: $ut, validodia: $validodia}, idtimbredetalle: $idtimbredetalle}
  ) {
    timbredetalle {
      idtimbredetalle
    }
  }
}

`;






