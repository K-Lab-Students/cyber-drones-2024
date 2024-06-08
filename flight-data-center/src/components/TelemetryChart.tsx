import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface TelemetryData {
    timestamps: number[];
    altitude: number[];
    speed: number[];
    battery: number[];
}

interface TelemetryChartProps {
    data: TelemetryData;
}

const TelemetryChart: React.FC<TelemetryChartProps> = ({ data }) => {
    const chartData = {
        labels: data.timestamps,
        datasets: [
            {
                label: 'Altitude',
                data: data.altitude,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
            {
                label: 'Speed',
                data: data.speed,
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: true,
            },
            {
                label: 'Battery',
                data: data.battery,
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Quadcopter Telemetry Data',
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default TelemetryChart;