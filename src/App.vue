<script setup>
import {ref, onMounted, computed} from 'vue'
import {API_KEY, API_URL} from "@/constans";
import WeatherSummary from './components/WeatherSummary.vue'
import Highlights from "@/components/Highlights.vue";
import {capitalizedFirstLetter} from "@/utils";
import Chart from "@/components/Chart.vue";


const city = ref(null)
const weatherInfo = ref(null)
const isError = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

async function getWeather() {
  isLoading.value = true
  if (!city.value) {
    await getUserLocation()
  }

  try {
    const response = await fetch(`${API_URL}?q=${city.value}&units=metric&appid=${API_KEY}`)
    const data = await response.json()

    if (!response.ok) {
      isError.value = true
      errorMessage.value = data?.message
    } else {
      weatherInfo.value = data
      isError.value = false
    }
  } catch (e) {
    isError.value = true
    errorMessage.value = 'Something went wrong...'
  }

  isLoading.value = false
}

async function getUserLocation() {
  await fetch('http://ip-api.com/json')
      .then(response => response.json())
      .then(data => city.value = data.city)
      .catch(error => console.error(error));
}

onMounted(getWeather)
</script>

<template>
  <div class="page">
    <main class="main">
      <div class="container">
        <div v-if="isLoading" class="lds-dual-ring"></div>
        <div v-else class="laptop">
          <div class="sections">
            <section :class="['section', 'section-left', {'section-error' : isError}]">
              <div class="info">
                <div class="city-inner">
                  <input
                      v-model="city"
                      @keyup.enter="getWeather"
                      type="text"
                      placeholder="Choose your city"
                      class="search">
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
              <Highlights :weatherInfo="weatherInfo"/>
            </section>
          </div>
          <div v-if="!isError" class="sections">
            <Chart/>
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


</style>
