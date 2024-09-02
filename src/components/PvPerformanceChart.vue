<!-- src/components/PvPerformanceChart.vue -->

<template>
    <div>
        <canvas id="monthlyEnergyOutput"></canvas>
    </div>
</template>

<script>
import { Line } from 'vue-chartjs';
import { getPvPerformanceData } from '../services/pvgisService';

export default {
    name: 'PvPerformanceChart',
    extends: Line,
    data() {
        return {
            chartData: {
                labels: [],
                datasets: [
                    {
                        label: 'PV Energy Output [kWh]',
                        backgroundColor: '#42A5F5',
                        data: []
                    }
                ]
            },
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false
            }
        };
    },
    methods: {
        async fetchData() {
            const params = {
                lat: -33.897,
                lon: 18.482,
                peakpower: 20,
                loss: 18,
                angle: 1,
                aspect: 180,
                outputformat: 'json',
                pvtechchoice: 'crystSi'
            };

            try {
                const data = await getPvPerformanceData(params);
                this.processData(data);
            } catch (error) {
                console.error('Error fetching PV data:', error);
            }
        },
        processData(data) {
            // Assuming the data contains monthly energy output
            this.chartData.labels = Object.keys(data.outputs.monthly);
            this.chartData.datasets[0].data = Object.values(data.outputs.monthly);

            this.renderChart(this.chartData, this.chartOptions);
        }
    },
    mounted() {
        this.fetchData();
    }
};
</script>

<style scoped>
canvas {
    max-width: 100%;
    height: 400px;
}
</style>
