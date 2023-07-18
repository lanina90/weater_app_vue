<script setup>
import WeatherSummary from './components/WeatherSummary.vue'
import Chart from "@/components/Chart.vue";
import FiveDaysForecast from "@/components/FiveDaysForecast.vue";
import Highlights from "@/components/Highlights.vue";
import {capitalizedFirstLetter} from "@/utils";
import { useStore } from 'vuex';
import { ref, computed, onMounted } from 'vue';

const store = useStore();

const searchQuery = ref('');
const currentComponent = ref('TodayHighlights')
const weatherInfo = computed(() => store.state.weatherInfo);
const isError = store.state.isError;
const errorMessage = store.state.errorMessage
const isLoading = store.state.isLoading

onMounted(async () => {
  await store.dispatch('getUserLocation');
  await store.dispatch('getWeather');
  await store.dispatch('fetchCities');
});

const searchResults = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < 3) {
    return [];
  }
  const query = searchQuery.value.toLowerCase();
  return store.state.cities.filter(c =>
      c.name.toLowerCase().startsWith(query) || c.country.toLowerCase().startsWith(query)
  );
});

const selectCity = async (name) => {
  await store.dispatch('selectCity', name);
  searchQuery.value = '';
};

</script>

<template>
  <div class="page">
    <main class="main">
      <div class="container">
        <div v-if="isLoading" class="lds-dual-ring"></div>
        <div v-else class="laptop">
          <h1>Weather Forecasts App</h1>
          <div class="sections">
            <section :class="['section', 'section-left', {'section-error' : isError}]">
              <div class="info">
                <div class="city-inner">
                  <input
                      v-model="searchQuery"
                      type="text"
                      placeholder="Choose your city"
                      class="search">
                  <div v-if="searchResults.length > 0" class="autocomplete-results">
                    <div
                        v-for="(result, i) in searchResults"
                        @click="selectCity(result.name)"
                        :key="i"
                        class="autocomplete-result">
                      {{ result.name }}, {{ result.country }}
                    </div>
                  </div>
                </div>
                <WeatherSummary
                    v-if="!isError"
                    :weatherInfo="weatherInfo"/>
                <div v-else class="error">
                  <div class="error-title">Oops....Something went wrong</div>
                  <div v-if="errorMessage" class="error-message">
                    {{ capitalizedFirstLetter(errorMessage) }}
                  </div>
                </div>
              </div>
            </section>

            <section v-if="!isError" class="section section-right">
              <div class="section highlights">
                <nav class="header">
                  <p @click="currentComponent = 'TodayHighlights'">Today's Highlights</p>
                  <p @click="currentComponent = 'Chart'">Temperature</p>
                  <p @click="currentComponent = 'Forecast'">5 days forecast</p>

                </nav>
                <Highlights
                    v-if="currentComponent === 'TodayHighlights'"
                    :weatherInfo="weatherInfo"/>
                <FiveDaysForecast v-else-if="currentComponent === 'Forecast'"/>
                <Chart v-else-if="currentComponent === 'Chart'"/>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="sass" scoped>
@import './assets/styles/main'

.page
  position: relative
  display: flex
  justify-content: center
  align-items: center
  min-height: 100vh
  padding: 20px 0
  background-color: #59585d

.laptop
  width: 100%
  padding: 20px
  background-color: #0e100f
  border-radius: 25px

  @media (max-width: 575px)
    max-width: 360px

h1
  font-size: 22px
  text-align: center
  padding-bottom: 5px

.sections
  display: flex
  width: 100%

  @media (max-width: 767px)
    flex-direction: column

.section-left
  width: 30%
  padding-right: 10px

  @media (max-width: 767px)
    width: 100%
    padding-right: 0

  &.section-error
    min-width: 235px
    width: auto
    padding-right: 0


.section-right
  width: 70%
  padding-left: 10px

  @media (max-width: 767px)
    width: 100%
    margin-top: 16px
    padding-left: 0

.header
  display: flex
  height: 80px


  & > p
    border-bottom: 3px solid black
    cursor: pointer
    width: 200px
    padding: 10px 0
    text-align: center

    &:hover
      transform: scale(1.1)
      border: none


.highlights
  padding: 2px 16px 16px
  background: url('/src/assets/img/gradient-4.jpg') no-repeat 0 0
  background-size: cover
  border-radius: 25px

  &-wrapper
    display: flex
    justify-content: space-between

    @media (max-width: 575px)
      flex-direction: column

.city-inner
  position: relative
  display: inline-block
  width: 100%

  &::after
    content: ''
    position: absolute
    top: 0
    right: 10px
    width: 25px
    height: 25px
    background: url('./assets/img/search.svg') no-repeat 50% 50%
    background-size: contain
    transform: translateY(50%)
    cursor: pointer

.info
  height: 100%
  padding: 16px
  background: url('./assets/img/gradient-1.jpg') no-repeat 50% 50%
  background-size: cover
  border-radius: 25px
  position: relative

.search
  width: 100%
  padding: 16px
  font-family: 'Inter', Arial, sans-serif
  color: $white
  background-color: rgba(0, 0, 0, 0.75)
  border-radius: 16px
  border: none
  outline: none
  cursor: pointer
  position: relative

.section-bottom
  width: 100%
  margin-top: 16px

  @media (max-width: 767px)
    width: 100%

.error
  padding-top: 20px

  &-title
    font-size: 18px
    font-weight: 700

  &-message
    padding-top: 20px
    font-size: 18px

.lds-dual-ring
  display: inline-block
  width: 90px
  height: 90px
  margin-left: 40%

.lds-dual-ring:after
  content: " "
  display: block
  width: 64px
  height: 64px
  margin: auto
  border-radius: 50%
  border: 6px solid #fff
  border-color: #fff transparent #fff transparent
  animation: lds-dual-ring 1.2s linear infinite

@keyframes lds-dual-ring
  0%
    transform: rotate(0deg)
  100%
    transform: rotate(360deg)

.autocomplete-results
  width: 100%
  height: 350px
  background: url('./assets/img/gradient-1.jpg') no-repeat 50% 50%
  border: 1px solid #dddddd
  color: #ffffff
  font-size: 20px
  overflow: auto
  position: absolute
  top: 55px
  z-index: 1001
  border-radius: 20px

  @media (max-width: 767px)
    height: 290px

  &::-webkit-scrollbar
    width: 1px

.autocomplete-result
  padding: 15px
  cursor: pointer

</style>