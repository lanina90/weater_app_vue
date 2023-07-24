<script setup>

import WeatherSummary from "@/components/WeatherSummary.vue"
import Highlights from "@/components/Highlights.vue"
import FiveDaysForecast from "@/components/FiveDaysForecast.vue"
import Loader from "@/components/Loader.vue"
import {useStore} from 'vuex'
import {ref, computed, onMounted, watch} from 'vue'
import { useI18n } from 'vue-i18n'

const {t} = useI18n()
const store = useStore()
const { locale } = useI18n()
const bookmarksCities = computed(() => store.state.bookmarksCities)
const isDataLoaded = ref(false)
const isDayTime = ref(true)
const currentComponents = ref([])

const toggleDayNight = () => {
  isDayTime.value = !isDayTime.value
};

onMounted(async() => {
  await store.dispatch('getWeatherForBookmarks')
  currentComponents.value = bookmarksCities.value.map(() => 'TodayHighlights')
  isDataLoaded.value = true
})

watch(
    () => locale.value,
    async () => {
      await store.dispatch('getWeatherForBookmarks')
    }
);
</script>

<template>
<div class="section">
  <Loader v-if="!isDataLoaded"/>
  <div v-if="bookmarksCities.length === 0">
    <div class="wrapper">
     <div class="wrapper-empty">You have not added cities to this list</div>
    </div>
  </div>

  <div v-if="Array.isArray(bookmarksCities)" >
    <div v-for="(res, i) in bookmarksCities"  class="wrapper">
      <div class="wrapper-summary">
        <WeatherSummary :index="i" :weatherInfo="res" :component="'favorites'"/>
      </div>
      <div class="section-info">
        <div @click='toggleDayNight'
             :class="['pic', {'pic-day' : !isDayTime}, {'pic-night' : isDayTime}]"/>

        <nav class="header">
          <p @click="currentComponents[i] = 'TodayHighlights'">{{ t('today') }}</p>
          <p @click="currentComponents[i] = 'Forecast'">{{ t('forecast') }}</p>
        </nav>
        <Highlights
            v-if="currentComponents[i] === 'TodayHighlights'"
            :activeCity="res"
            :isChartVisible="false"
            :dayTime="isDayTime"
        />
        <FiveDaysForecast
            v-else-if="currentComponents[i] === 'Forecast'"
            :activeCity="res"
            :isChartVisible="false"
            :dayTime="isDayTime"
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

  @media (max-width: 767px)
    height: 90px
    margin-top: 30px



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
  position: relative

  @media (max-width: 767px)
    margin-left: 0
.pic
  cursor: pointer

.pic-day, .pic-night
  position: absolute
  top: 10px
  right: 15px
  width: 40px
  height: 40px

.pic-day
  background: url('@/assets/img/day.svg') no-repeat 50% 50%

.pic-night
  background: url('@/assets/img/night.svg') no-repeat 50% 50%

</style>