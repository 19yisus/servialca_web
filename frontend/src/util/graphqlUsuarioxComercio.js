import { gql } from '@apollo/client';


export const FETCH_USUARIOSXCOMERCIO_QUERY = gql`
mutation consultarUsuarioTributo ($txtidtributo: BigInt!, $operacion: BigInt!){
  consultarUsuarioTributo(input: {txtidtributo: $txtidtributo, operacion: $operacion}) {
    results {
      txttributo
      txtnombre
      txtidusuario
      txtlogin
    }
  }
}


`;


export const FETCH_USUARIOSXCOMERCIO_QUERY2 = gql`
query allVtributos {
  allVtributos {
    nodes {
      idusuarioweb
      tributo
      idtributo
      nombre
      documento
      numeroident
      usuario
    }
  }
}
`;



