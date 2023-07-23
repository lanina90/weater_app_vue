<script setup>
import { ref, watchEffect, onUnmounted } from 'vue';
import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale);

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  labels: {
    type: Array,
    required: true
  },
  isShow: {
    type: Boolean,
    required: true
  }
})
let myChart = null;
const canvas = ref(null);

watchEffect(() => {
  const ctx = canvas.value?.getContext('2d');

  if (!props.isShow) {
    destroyChart();
    return;
  }

  if (ctx) {
    if (myChart) {
      myChart.data.labels = props.labels;
      myChart.data.datasets[0].data = props.data;
      myChart.update();
    } else {
      myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: props.labels,
          datasets: [
            {
              label: 'Temperature',
              data: props.data,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }
          ]
        },
        options: {}
      });
    }
  }
});

function destroyChart() {
  if (myChart) {
    myChart.destroy();
    myChart = null;
  }
}

onUnmounted(() => {
  destroyChart();
});

</script>

<template>
  <div v-if="isShow" class="chart-container">
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