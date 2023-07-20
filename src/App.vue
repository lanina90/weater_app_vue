<script setup>
import WeatherSummary from './components/WeatherSummary.vue'
import FiveDaysForecast from "@/components/FiveDaysForecast.vue";
import Highlights from "@/components/Highlights.vue";
import {capitalizedFirstLetter} from "@/utils";
import {useStore} from 'vuex';
import {ref, computed, onMounted  } from 'vue';

const store = useStore();
const searchQuery = ref('');
const currentComponent = ref('TodayHighlights')
const city = computed(() => store.state.city);
const activeCity = computed(() => store.state.activeCity);
const isError = store.state.isError;
const errorMessage = store.state.errorMessage
let isDataLoaded = ref(false);


onMounted(async () => {

  await store.dispatch('getUserLocation')
  await store.dispatch('getWeather');
  await store.dispatch('fetchCities');

  if (city.value.length > 0 && activeCity.value === null) {
    setActiveCity(city.value[0]);
  }
  isDataLoaded.value = true;
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

const selectCity = async (city) => {
  await store.dispatch('selectCity', city);
  const countryName = city.name ? city.name : city.city
  const countryCode = city.countryCode ? city.countryCode : city.country
  let selectedCity = store.state.city.find(c => c.name === countryName && c.country === countryCode);
  setActiveCity(selectedCity)
  searchQuery.value = '';
};


const addCity = async (result) => {
  if (store.state.city.length >= 5) {
    searchQuery.value = '';
    alert("You can only add up to 5 cities.");
    return;
  }
  await store.dispatch('addCity', result);
  searchQuery.value = '';
};

const setActiveCity = (result) => {
  store.dispatch('setActiveCity', result);
};

</script>

<template>
  <div class="page">

    <main class="main">
      <div class="container">

        <div v-if="!isDataLoaded" class="lds-dual-ring"></div>
        <div v-else class="laptop">
          <h1>Weather Forecasts App</h1>
          <div class="sections">
            <section :class="['section', 'section-left', {'section-error' : isError}]">
              <div class="info">
                <div class="city-inner">
                  <input
                      v-model="searchQuery"
                      type="text"
                      placeholder="Search..."
                      class="search">
                  <div v-if="searchResults.length > 0" class="autocomplete-results">
                    <div
                        v-for="(result, i) in searchResults"
                        :key="i"
                        class="autocomplete-result">
                      <div
                          @click="selectCity(result)">
                        {{ result.name }}, {{ result.country }}
                      </div>
                      <div
                          @click="addCity(result)"
                          class="pic-add"
                      ></div>
                    </div>
                  </div>
                </div>
                <div v-for="(res, i) in city" :key="res.lat">
                  <WeatherSummary
                      :style="{ cursor: 'pointer' }"
                      v-if="isDataLoaded"
                      :weatherInfo="res"
                      @click="setActiveCity(res)"
                      :index="i"
                  />
                  <div v-else class="error">
                    <div class="error-title">Oops....Something went wrong</div>
                    <div v-if="errorMessage" class="error-message">
                      {{ capitalizedFirstLetter(errorMessage) }}
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section v-if="!isError" class="section section-right">
              <div class="section highlights">
                <nav class="header">
                  <p @click="currentComponent = 'TodayHighlights'">Today</p>
                  <p @click="currentComponent = 'Forecast'">5 days forecast</p>
                </nav>
                <Highlights
                    v-if="currentComponent === 'TodayHighlights' && isDataLoaded"
                    :activeCity="activeCity"
                />
                <FiveDaysForecast
                    v-else-if="currentComponent === 'Forecast'"
                />
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
.active
  background-color: lightblue

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

.search-block
  display: flex
  max-width: 100%
  align-items: center
  justify-content: space-between


.city-inner
  position: relative
  display: inline-block
  width: 100%

  &::after
    content: ''
    position: absolute
    top: 0
    right: 9%
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
  display: flex
  align-items: center
  justify-content: space-between

.pic-add
  background: url('./assets/img/add-icon.svg') no-repeat 50% 50%
  width: 20px
  height: 20px
  padding-right: 20px
  cursor: pointer

</style>