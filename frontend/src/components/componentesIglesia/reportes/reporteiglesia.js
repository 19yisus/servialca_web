import React, { useState } from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import useTableScroll from '../../useTableScroll2';
import { TableBody, TableRow, TableCell } from '@material-ui/core';
import Logo from '../../../imagenes/logo.png'



const headCells = [
  { label: 'Fecha', textAlign: 'center' },
  { label: 'Tipo', textAlign: 'center' },
  { label: 'Monto', textAlign: 'center' },
  { label: 'Saldo', textAlign: 'center' },


]


// Create styles
const styles = StyleSheet.create({
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",

  },
  tableCol: {
    width: "78%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,


  },
  tableColCod: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,


  },
  tableCell: {
    margin: "auto",
    textAlign: 'center',
    fontSize: 5,
    padding: '3px 0',
    width: '100%',
    verticalAlign: 'middle'
  },
  tableColIndex: {
    width: "2%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },

  tableCell: {
    margin: "auto",
    textAlign: 'center',
    fontSize: 5,
    padding: '3px 0',
    width: '100%',
    verticalAlign: 'middle'
  },
  tableCell2: {
    margin: "auto",
    textAlign: 'center',
    fontSize: 8,
    width: '100%',
    verticalAlign: 'middle'
  },
  container: {
    margin: 'auto',
    padding: '1% 7%'
  },
  image: {
    width: 40,
    height: 40,
    margin: '2px auto'
  },
});

const hola = 'variable';


// Create Document Component
const MyDocument = (props) => {

  return (
    <Document>
      <Page size="A4">
        <View style={{ padding: '5% 0' }}>
          <View style={{ width: '100%', height: '70px' }} >
            <Text style={{ fontSize: '8px', fontWeight: 'bold', margin: '0 auto' }}>Listado de Almacen</Text>
          </View>
          <View style={styles.container}>
            <View style={{ width: '100%', padding: '2% 0' }}>
              <Text style={{ fontSize: '7px', fontWeight: 'bold', margin: 'auto', width: '100%' }}>Listado de Iglesias</Text>
            </View>

            <View style={styles.table}>

              <View style={styles.tableRow}>
                <View style={styles.tableColIndex}>
                  <Text style={styles.tableCell2}>*</Text>
                </View>
                <View style={styles.tableColCod}>
                  <Text style={styles.tableCell2}>Codigo</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell2}>Descripción</Text>
                </View>
                {/*  <View style={styles.tableCol}> 
          <Text style={styles.tableCell}>Period</Text> 
        </View> 
        <View style={styles.tableCol}> 
          <Text style={styles.tableCell}>Price</Text> 
        </View>  */}
              </View>

              {props.iglesias && props.iglesias.map((item, index) => (
                <View style={styles.tableRow}>
                  <View style={styles.tableColIndex}>
                    <Text style={styles.tableCell}>{parseInt(index) + 1}</Text>
                  </View>
                  <View style={styles.tableColCod}>
                    <Text style={styles.tableCell}>{item.codiglesia}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{item.descripcion !== null ? item.descripcion.trim().replace(' - ', ' ') : ''}</Text>
                  </View>




                </View>
              ))}

              {/* <View style={styles.tableRow}> 
        <View style={styles.tableCol}> 
          <Text style={styles.tableCell}>React-PDF</Text> 
        </View> 
        <View style={styles.tableCol}> 
          <Text style={styles.tableCell}>3 User </Text> 
        </View> 
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>2019-02-20 - 2020-02-19</Text> 
        </View>
        <View style={styles.tableCol}> 
          <Text style={styles.tableCell}>5€</Text> 
        </View> 
      </View>  */}
            </View>
          </View>

        </View>

      </Page>
    </Document>
    /*  <Document>
     <Page size="A4" >
       <View>
         <Image src='../../../../imagenes/logo.png'/>
       </View>
       <View style={styles.table}>
       <View style={styles.Row}>
           <View style={styles.Cell}>
               <Text>Codigo</Text>
           
               <Text>Descripción</Text>
           </View>
         </View> 
   
       
     {props.iglesias && props.iglesias.map((item,index) => (
                     <View style={styles.Row}>
                       <View style={styles.Cell}><Text style={{fontSize:'10px'}}>{item.codiglesia}</Text> <Text style={{fontSize:'10px'}}>{item.descripcion}</Text></View>
                     
                     
                     
                   </View>
               ))} 
             
       </View>
     </Page>
   </Document> */
  )
};





export default MyDocument;