import { gql } from '@apollo/client';


export const FETCH_USUARIOS_QUERY = gql`
query allUsuarios {
  allUsuarios {
    nodes {
      login
      idusuario
      persona
      idorganizacion
    }
  }
}

`;

export const FETCH_USUARIO_QUERY = gql`
 query usuarioByIdusuario($idusuario: BigInt! ,$persona: BigInt!, $idorganizacion: BigInt!) {
  usuarioByIdusuario(idusuario: $idusuario) {
    idefiscal
    idorganizacion
    persona
    accaplicacion
    accorganizacion
    accestructura
    acccambiofecha
    accusuario
    accpersona
    acccambioefiscal
    acciva
    accut
    accdesbloquear
    accdesconectar
    acctasaactiva
    accusuariocat
    accfichacat
    accvalorterrecat
    accvalortipocat
    accdepreciacioncat
    accrepcedcat
    accrepceremp
    accrepfichacat
    accrepgenseccat
    acccontribuyente
    accactividad
    accdeclaraciones
    accedocuenta
    accconfigcome
    accusuariocome
    accreppatente
    accimpedoctasectcome
    accrepgensector
    accrepactividad
    accrepfecdecla
    accrepmondecla
    accimppatente
    accinmueble
    accedoctainmue
    accvalfisterre
    accvalfiscons
    accconfiginmue
    accusuarioinmue
    accusrepsectcat
    accusrepmontaval
    accusreptipconstruc
    accusrepmontdeud
    accusrepvalorconstruc
    accimpedoctasectinmue
    accapuesta
    accclaseapuesta
    accedoctaapuesta
    accconfigapuesta
    accusuarioapuesta
    accvehiculo
    accclasevehiculo
    accedoctavehiculo
    accconfigvehiculo
    accusuariovehiculo
    accrepgenvehi
    accrepcontvehideud
    accreptipvehi
    accpublicidad
    accclasepublicidad
    accedoctapublicidad
    accconfigpublicidad
    accusuariopublicidad
    accrepgensecpubli
    accrepcontpublideud
    accreptippubli
    accrepedoctapubli
    accrenta
    accedoctarenta
    accconfigrenta
    accusuariorenta
    accefiscal
    acccatpro
    accpuc
    acccrearfactura
    accanularfactura
    accusuariofactura
    acctiporenta
    accrepgenrenta
    accurepcontratorenta
    accrepdeudarenta
    accrepedoctarenta
    accreptiporenta
    accbanco
    acccuentabancaria
    numcaja
    accusuariopresu
    accformpresu
    accaprobpresup
    accreppuc
    accrepformpresu
    accreppresuing
    accrepedofinanc
    accrepmovpresu
    accrepcondicpar
    accrepcomprom
    accpartext
    accaumentopart
    accdisminucionpart
    acctraslado
    acccompromiso
    accfacturar
    accanularfact
    accusuariofacturacion
    accrepfactemit
    accurepfactporcobrar
    accrepfactcobrada
    accrepfactanulada
    accrepfactportipo
    accingresos
    accsupervisor
    accrepresumcaja
    accreptransdiarias
    accrepactutransac
    accreptransacciones
    accrepcontrolcheq
    accrepcontroldepo
    accusuariocaja
    acctipoingreso
    acctipoimpuesto
    accrepconstancia
    accrepvalconstruc
    accrepvalterreno
    accrepdepreciacion
    accreptipoapuesta
    accrepgensectapu
    accrepdeclanualapu
    accrepdeudapuesta
    accrepedoctapuesta
    accactudeuindustria
    accactudeuinmue
    accactudeurenta
    accactudeuvehiculo
    accactudeuapuesta
    acctasapasiva
    accgestores
    accasignacion
    accvisitas
    accefectividad
    accrepresucaja
    accreptransadia
    accrepmovactu
    accrepdeudaperi
    accrepfactuasigna
    accrepdeudarecu
    accusuariogestion
    acclicores
    actipotasa
    accedoctalicores
    accconfiglicores
    accusuariolicores
    accrepgenseclicor
    accrepcontlicores
    accreptipotasa
    accrepedoctalicores
    accexplicores
    acctiporetencion
    accusuarioadmini
    accegresos
    acctransferenciabanc
    accconciliacion
    acccheqanul
    accdebito
    acccredito
    acccausar
    accaproborden
    accrepordenpago
    accrepbanco
    accrepretencion
    accrepfondoterc
    accdeposito
    accfondotercero
    accpagoordenes
    accregobras
    accusuarioingenieria
    accasigobras
    acccaratula
    acccuaderno
    accrepgenobras
    accrepobrasasig
    accrepobraejecu
    accrepcontratista
    acccamstainmue
    acccontratista
    acccargos
    accactivos
    accaprocompro
    accalmacen
    accsolisuministro
    accunimedi
    accproveedor
    acctipoproducto
    accproducto
    accrequisicion
    accsolicompra
    accaprosolicompra
    accusuariocompra
    accrepalmacen
    accreprespalmacen
    accrepsolicompra
    accrepsolisumi
    accreprequisicion
    acccontrolinterno
    acccuentacontable
    accaprobpagoobras
    accsolicpagoobras
    accubicacionalmacen
    accentradaalmacen
    accsalidaalmacen
    accdespachoalmacen
    acclisgencompraalmacen
    acclismovcompraalmacen
    acclisinventario
    acclissolicompraalmacen
    accaprodesaprodespacho
    accespecial
    accrepresugenobra
    accusuarionomina
    accpermdecla
    accacreditacion
    acctipomulta
    accmultaindu
    accmultainmu
    accmultavehi
    accmultaapu
    accmultapropa
    accmultarenta
    accmultalico
    accformucue
    accvincucue
    accrepplancue
    accrepvincucue
    accusuarioconta
    acctipoactivo
    accubicacionbien
    accmotivoincorporacion
    accmotivodesincorporacion
    accincorporacionmueble
    accincorporacioninmueble
    accdesincorporacionmueble
    accdesincorporacioninmueble
    acctransferenciabien
    accreptipoactivo
    accrepubicacionbien
    accrepdisposicion
    accrepincorporacion
    accrepdesincorporacion
    accreptransferencia
    accusuariobien
    acccargarcue
    accasiento
    status
    liquidador
    accmodreten
    accrepobras
    accenvchecausar
    poseeimpresora
    puerto
    accrepcatcue
    accrepsalini
    accrepsaldo
    accrepbalacom
    accrepbalagen
    accrepasiento
    accrepestamov
    accrepinvemueble
    accrepresuinvemueble
    accrepmovimueble
    accrepmresucuemue
    accrepmayoranali
    accacticontri
    impresora
    accadministrador
    superadmin
    clavesuperadmin
    superteso
    clavesuperteso
    superpresu
    clavesuperpresu
    acctasasweb
    accfechavenci
    accafiliar
    accagentereten
    accactividadcomercio
    acccuentabancariaweb
    accusuariointranet
    acctipoingre
    acctipoimpuestos
    accgraficaweb
    accusuarioweb
    accverificacionweb
    accdeclaraantici
    accconfigmodulo
    accorganizacionweb
    accbtnagenteretencion
    accbtntasasweb
    accbtnafiliar
    accbtnactividadcomercio
    accbtncuentabancaweb
    accbtnusuariointranet
    accbtntipoingreso
    accbtntipoimpuesto
    accbtngraficaweb
    accbtnusuarioweb
    accbtnverificacioningre
    accbtndeclaracionantici
    accbtnconfigmodulo
    accbtnorganizacion
    idusuario
    login
    efiscalByIdefiscal {
      observaciones
      statusorg
      statuspresup
      statuspuc
      statuscat
      idorganizacion
    }
  }
  allPersonas(condition: {cedula: $persona}) {
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
  organizacionByIdorganizacion(idorganizacion: $idorganizacion) {
    tlf1
    tlf2
    fax
    correoe
    mision
    principios
    vision
    pagweb
    rif
    cedularesponsable
    razonsocial
    llamadoplanilla
    espiritu
    favance
    idproveedor
    idorganizacion
  }
}
`;


