<!-- src/views/Home.vue -->

<template>
  <div>
    <h1>Grid-Connected PV Performance</h1>
    <PvPerformanceChart />
  </div>
</template>

<script>
import PvPerformanceChart from '../components/PvPerformanceChart';

export default {
  name: 'Home',
  components: {
    PvPerformanceChart
  }
};
</script>
