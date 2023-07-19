<script setup>
import { onMounted, ref, watch } from 'vue';
import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  labels: {
    type: Array,
    required: false
  }
})


const data = {
  labels: props.labels,
  datasets: [
    {
      label: 'Temperature',
      data: props.data,
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
      pointLabel: true
    }
  ]
};

let myChart = null;

const canvas = ref(null);

onMounted(() => {
  Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale);
  const ctx = canvas.value.getContext('2d');
  myChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {}

  });
});

watch([() => props.data, () => props.labels], ([newData, newLabels]) => {
  if (myChart) {
    myChart.data.datasets[0].data = newData;
    myChart.data.labels = newLabels;
    myChart.update();
  }
});
</script>

<template>
  <div class="chart-container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<style scoped lang="sass">
@import '../assets/styles/main'

.chart-container
  margin-top: 20px
  width: 100%
  height: 400px

</style>