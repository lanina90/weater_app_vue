<script setup>

import Chart from "@/components/Chart.vue";
import {formatDate, getTime} from "../utils";
import {useStore} from 'vuex';
import {computed, ref, watch} from 'vue'

const store = useStore();
const weatherInfo = computed(() => store.state.weatherInfo);

const daily = computed(() => {
  return weatherInfo.value?.daily ?? [];
});

const timezoneOffset =
    computed(() => {
      return weatherInfo.value?.timezone_offset
    });

const labels = computed(() =>
    daily.value.slice(1, 6).map(item => {
      let date = new Date(item.dt * 1000);
      return date.toLocaleString('en-US', {  month: 'short', day: '2-digit' });
    })
);
const data = computed(() =>
    daily.value.map(item => (item.temp.max + item.temp.min) / 2)
);



</script>

<template>
  <section class="highlights-container">
    <div
        v-for="(item, index) in daily.slice(1, 6)"
        :key="index"
        class="highlight">
      <div class="card">
        <div class="card-date">{{ formatDate(item.dt) }}</div>
        <div class="card-temp">
          <div class="title">{{ Math.round(item.temp.day) }} / {{ Math.round(item.temp.night) }} °C</div>
          <div
              :style="`background-image: url('weather-main/${item.weather[0].description}.png')`"
              class="pic-card"
          />
        </div>
        <div class="card-info">
          <div>
            <div class="card-pic humidity"></div>
            <div>{{ item.humidity }}%</div>
          </div>
          <div>
            <div class="card-pic pressure"></div>
            <div> {{ item.pressure }} hPa</div>
          </div>
          <div>
            <div class="card-pic wind"></div>
            <div> {{ item.wind_speed }} m/s</div>
          </div>
          <div>
            <div class="card-pic uv"></div>
            <div> {{ item.uvi }} </div>
          </div>
        </div>
        <div class="states">
          <div class="state">
            <div class="state-pic"></div>
            <div class="state-title">Sunrise</div>
            <div class="state-time">{{ getTime(item.sunrise + timezoneOffset) }}</div>
          </div>
          <div class="state">
            <div class="state-pic state-pic--flipped"></div>
            <div class="state-title">Sunset</div>
            <div class="state-time">{{ getTime(item.sunset + timezoneOffset) }}</div>
          </div>
        </div>
      </div>

    </div>
  </section>
  <Chart :labels="labels" :data="data"/>
</template>

<style scoped lang="sass">
@import '../assets/styles/main'
.highlights

  &-container
    display: grid
    gap: 10px
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))

    @media (max-width: 575px)
      flex-direction: column

.highlight

  @media (max-width: 575px)
    width: 100%
    margin-bottom: 16px

.title
  font-size: 18px
  width: 80%

.card
  height: 280px
  width: 100%
  padding: 16px
  background: url('/src/assets/img/gradient-2.jpg') no-repeat 50% 50%
  background-size: cover
  border-radius: 8px

  @media (max-width: 1199px)
    padding: 12px

  @media (max-width: 767px)
    height: 250px

  &-date
    font-size: 22px
    text-align: center
    margin-bottom: 10px


  &-temp
    display: flex
    align-items: center
    justify-content: space-around
    margin-bottom: 10px


  &-info
    display: flex
    align-items: center
    font-size: 16px
    justify-content: space-around
    flex-wrap: wrap
    margin-bottom: 15px

    & > div
      display: flex
      align-items: center
      width: 50%

      & > div
        font-size: 12px
        padding: 5px 10px

        @media (max-width: 767px)
          font-size: 16px

  &-pic
    width: 20px
    height: 20px

.humidity
  background: url('/src/assets/img/humidity.svg') no-repeat 50% 50%

.pressure
  background: url('/src/assets/img/pressure.svg') no-repeat 50% 50%

.wind
  background: url('/src/assets/img/wind.svg') no-repeat 50% 50%

.uv
  background: url('/src/assets/img/uv-index.svg') no-repeat 50% 50%

.pic-card
  width: 32px
  height: 32px
  background-repeat: no-repeat
  background-size: contain

.states
  display: flex
  justify-content: space-between


  &--margin
    margin-top: 40px

.state
  width: 40%

  &:last-child
    text-align: right

  &-pic
    width: 20px
    height: 20px
    margin-bottom: 6px
    background: url('/src/assets/img/sun.svg') no-repeat 50% 50%
    background-size: cover

    &--flipped
      margin-left: auto
      -webkit-transform: scaleX(-1)
      transform: scaleX(-1)

  &-title
    font-size: 12px
    color: $gold

  &-time
    font-size: 13px
    font-weight: 700

    @media (max-width: 1199px)
      font-size: 11px


</style>