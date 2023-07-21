<script setup>

import WeatherSummary from "@/components/WeatherSummary.vue";
import Highlights from "@/components/Highlights.vue";
import FiveDaysForecast from "@/components/FiveDaysForecast.vue";
import {useStore} from 'vuex';
import {ref, computed, watch, onMounted} from 'vue';

const store = useStore();

const currentComponent = ref('TodayHighlights')
const bookmarksCities = computed(() => store.state.bookmarksCities);


onMounted(async() => {
  await store.dispatch('getWeatherForBookmarks')
})

</script>

<template>
<div class="section">
  <div v-if="bookmarksCities.length === 0">
    <div class="wrapper">
     <div class="wrapper-empty"> You have not added cities to this list</div>
    </div>
  </div>

  <div v-else >
    <div v-for="(res, i) in bookmarksCities"  class="wrapper">
      <div class="wrapper-summary">
        <WeatherSummary :index="i" :weatherInfo="res" :component="'favorites'"/>
      </div>
      <div class="section-info">
        <nav class="header">
          <p @click="currentComponent = 'TodayHighlights'">Today</p>
          <p @click="currentComponent = 'Forecast'">5 days forecast</p>
        </nav>
        <Highlights
            v-if="currentComponent === 'TodayHighlights'"
            :activeCity="res"
            :isChartVisible="false"
        />
        <FiveDaysForecast
            v-else-if="currentComponent === 'Forecast'"
            :activeCity="res"
            :isChartVisible="false"
        />
      </div>
    </div>

  </div>
</div>
</template>

<style scoped lang="sass">
@import '@/assets/styles/main'
.section
  background: url('@/assets/img/gradient-4.jpg') 0 0
  border-radius: 20px

.wrapper
  display: flex
  align-items: stretch
  padding: 20px
  box-shadow: 0 10px 6px #0e100f


  @media (max-width: 767px)
    display: flex
    flex-direction: column
    min-height: 450px

  &-empty
    height: 350px
    width: 100%
    text-align: center
    padding: 15% 0


  &-summary
    width: 30%

    @media (max-width: 767px)
      width: 100%


    & > div:first-child
      width: 100%
      display: flex
      flex-direction: column
      justify-content: stretch


.header
  display: flex
  height: 70px

  & > p
    border-bottom: 3px solid black
    cursor: pointer
    width: 200px
    padding: 10px 0
    text-align: center

    &:hover
      transform: scale(1.1)
      border: none

.section-info
  margin-left: 20px
  width: 100%

  @media (max-width: 767px)
    margin-left: 0px

</style>