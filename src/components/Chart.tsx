import * as React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ITimeSpanReport } from '../models';

export const Chart: React.FC<{
    onDateClick: (date: string) => void,
    data: ITimeSpanReport;
}> = ({ onDateClick, data }) => {
    const [series, categories] = React.useMemo(() => {
        const series: { name: string, data: number[] }[] = [
            { name: 'Deaths diff', data: [] },
            { name: 'Confirmed diff', data: [] },
        ];
        const categories: string[] = [];

        data.forEach(x => {
            categories.push(x.date);

            series[0].data.push(x.deathsDiff + 1000);
            series[1].data.push(x.confirmedDiff);
        });

        return [series, categories];
    }, [data]);

    const options: ApexCharts.ApexOptions = React.useMemo(() => ({
        colors: ['#ff6b6b', '#f9ca24'],
        chart: {
            toolbar: {
                show: false,
            },
            events: {
                dataPointSelection: function (_, __, { dataPointIndex }) {
                    onDateClick(data[dataPointIndex].date);
                }
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 0,
                horizontal: false,
            },
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            type: 'datetime',
            categories,
        },
        legend: {
            position: 'bottom',
            offsetY: 8,
        },
        fill: {
            opacity: 1,
        },
    }), [categories]);

    return (
        <ReactApexChart
            type="bar"
            series={series}
            height={350}
            options={options}
        />
    );
};