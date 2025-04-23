import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);


export default function Bars({datos}) {

  //CONFIGURACION GRAFICO DE BARRAS
  const barraData = {
    labels: datos?.map(item => item.pertinente),
    datasets: [
        {
            label: 'candidad',
            data: datos?.map(item => item.cantidad),
            backgroundColor: 'rgba(0, 220, 195, 0.5)'
        }
    ]
};
//Opciones del Grafico de Barras
var misoptionsBarra = {
    responsive : true,
    animation : true,
    plugins : {
        legend : {
            display : false
        }
    }
    // scales : {
    //     y : {
    //         min : 0,
    //         max : 100
    //     },
    //     x: {
    //         ticks: { color: 'rgba(0, 220, 195)'}
    //     }
    // }
};

    return (<Bar data={barraData} options={misoptionsBarra}/>)
};