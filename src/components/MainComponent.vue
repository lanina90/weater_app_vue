<script setup>
import WeatherSummary from '@/components/WeatherSummary.vue'
import FiveDaysForecast from "@/components/FiveDaysForecast.vue"
import Highlights from "@/components/Highlights.vue"
import {capitalizedFirstLetter} from "@/utils"
import {useStore} from 'vuex'
import {ref, computed, onMounted} from 'vue'
import WarningBookmarksModal from "@/components/WarningBookmarksModal.vue"
import {useI18n} from 'vue-i18n'

const store = useStore()
const {t} = useI18n()
const isError = computed(() => store.state.isError)
const bookmarksCities = computed(() => store.state.bookmarksCities)
const errorMessage = computed(() => store.state.errorMessage)
const city = computed(() => store.state.city)
const isWarningOpen = ref(false)
const activeCity = ref(null)
const isDayTime = ref(true)
const searchQuery = ref('')
const currentComponent = ref('TodayHighlights')

onMounted(() => {
  if (city.value.length > 0 && activeCity.value === null) {
    setActiveCity(city.value[0])
  }
});

const setActiveCity = (city) => {
  activeCity.value = city
};

const toggleDayNight = () => {
  isDayTime.value = !isDayTime.value
};

const searchResults = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < 3) {
    return []
  }
  const query = searchQuery.value.toLowerCase();
  return store.state.cities.filter(c =>
      c.name.toLowerCase().startsWith(query) || c.country.toLowerCase().startsWith(query)
  );
});

const addCity = async (result) => {
  if (store.state.city.length >= 5) {
    searchQuery.value = ''
    alert("You can only add up to 5 cities.")
    return
  }
  await store.dispatch('addCity', result)
  searchQuery.value = ''
};

const selectCity = async (res) => {
  await store.dispatch('selectCity', res)
  const countryName = res.name ? res.name : res.city
  const countryCode = res.countryCode ? res.countryCode : res.country
  let selectedCity = store.state.city.find(c => c.name === countryName && c.country === countryCode)
  setActiveCity(selectedCity)
  searchQuery.value = ''
};

const addToBookmark = (result) => {
  store.dispatch('setBookmarkCity', result)
  searchQuery.value = ''
  if (bookmarksCities.value.length > 5) {
    isWarningOpen.value = true
  }
}

const closeWarningModal = () => {
  isWarningOpen.value = false
}

</script>


<template>
  <div class="sections">
    <section :class="['section', 'section-left', {'section-error' : isError}]">
      <div class="info">
        <div class="city-inner">
          <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('placeholder')"
              class="search"
              name="search">
          <div v-if="searchResults.length > 0" class="autocomplete-results">
            <div
                v-for="(result, i) in searchResults"
                :key="i"
                class="autocomplete-result">
              <div @click="selectCity(result)">
                {{ result.name }}, {{ result.country }}
              </div>
              <div class="autocomplete-result actions">
                <div @click="addCity(result)" class="pic pic-add"/>
                <div
                    @click="addToBookmark(result)"
                    class="pic pic-plus"
                />
              </div>
            </div>
          </div>
        </div>
        <WarningBookmarksModal
            v-if="isWarningOpen"
            @close="closeWarningModal"
        />
        <div
            v-for="(res, i) in city" :key="res.lat"
            @click="setActiveCity(res)"
            :style="{cursor: 'pointer'}"
        >
          <WeatherSummary
              :weatherInfo="res"
              :index="i"
              :component="'main'"
          />
          <div class="error">
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
          <p @click="currentComponent = 'TodayHighlights'">{{ t('today') }}</p>
          <p @click="currentComponent = 'Forecast'">{{ t('forecast') }}</p>
        </nav>
        <div @click='toggleDayNight'
             :class="['pic', {'pic-day' : !isDayTime}, {'pic-night' : isDayTime}]"/>

        <Highlights
            v-if="currentComponent === 'TodayHighlights' && activeCity"
            :activeCity="activeCity"
            :dayTime="isDayTime"
            :isChartVisible="true"
        />
        <FiveDaysForecast
            v-else-if="currentComponent === 'Forecast' && activeCity"
            :activeCity="activeCity"
            :dayTime="isDayTime"
            :isChartVisible="true"/>
      </div>
    </section>
  </div>
</template>

<style scoped lang="sass">
@import '@/assets/styles/main'
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
    background: url('@/assets/img/search.svg') no-repeat 50% 50%
    background-size: contain
    transform: translateY(50%)
    cursor: pointer

.info
  height: 100%
  padding: 16px
  background: url('@/assets/img/gradient-1.jpg') no-repeat 50% 50%
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

.autocomplete-results
  width: 100%
  height: 350px
  background: url('@/assets/img/gradient-1.jpg') no-repeat 50% 50%
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

  & actions
    display: flex

.pic
  cursor: pointer

.pic-add
  background: url('@/assets/img/add-icon.svg') no-repeat 50% 50%
  width: 20px
  height: 20px


.pic-plus
  background: url('@/assets/img/bookmark-add.svg') no-repeat 50% 50%
  width: 40px
  height: 40px


.pic-minus
  background: url('@/assets/img/bookmark-remove.svg') no-repeat 50% 50%
  width: 40px
  height: 40px

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