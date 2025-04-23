import React from 'react';
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Registrar los componentes de Chart.js
Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, ChartDataLabels, Tooltip, Legend);


export default function CircularChart({datos}) {

    // Configuración del gráfico
const chartData = {
    labels: datos?.map(item => item.estado),
    datasets: [
      {
        label: 'cantidad',
        data: datos?.map(item => item.cantidad),
        backgroundColor: [
          //'rgba(255, 99, 132, 0.2)',
          // 'rgba(54, 162, 235, 0.2)',
          //'rgba(255, 206, 86, 0.2)',
          'rgba(107, 114, 128, 0.2)',
          'rgba(34, 197, 94, 0.2)',
          'rgba(239, 68, 68, 0.2)',
        ],
        borderColor: [
          'rgba(107, 114, 128, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Opciones del gráfico con configuración para datalabels
  const options = {
    plugins: {
      datalabels: {
        // color: '#fff',
        anchor: 'end',
        align: 'start',
        // offset: -10,
        borderWidth: 10,
        // borderColor: '#fff',
        borderRadius: 25,
        backgroundColor: (context) => {
          return context.dataset.backgroundColor;
        },
        font: {
          weight: 'bold',
          size: '16'
        },
        // formatter: (value, context) => {
        //   return context.chart.data.labels[context.dataIndex];
        // }
      }
    }
  };
    
    return (<Pie data={chartData} options={options} />)
}