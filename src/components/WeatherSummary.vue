<script setup>
import {capitalizedFirstLetter} from '../utils/index'
import {defineProps, ref, computed} from 'vue';
import {useStore} from 'vuex';
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal.vue";


const props = defineProps({
  weatherInfo: {
    type: Object,
    required: true,
  },
  index: {
    type: Object,
    required: true,
  },
  component: {
    type: String,
    required: true,
  },
});
const store = useStore();

const deleteConfirmation = ref({
  isOpen: false,
  city: null,
  cityName: null
});

const bookmarksCities = computed(() => store.state.bookmarksCities);

const isCityInBookmarks = computed(() => {
  const cityName = props.weatherInfo.city ? props.weatherInfo.city : props.weatherInfo.name
  return bookmarksCities.value.some(city => city.name === cityName );
});

const openDeleteConfirmation = (index, cityName) => {
  deleteConfirmation.value.isOpen = true;
  deleteConfirmation.value.city = index;
  deleteConfirmation.value.cityName = cityName;
};

const closeDeleteConfirmation = () => {
  deleteConfirmation.value.isOpen = false;
  deleteConfirmation.value.city = null;
  deleteConfirmation.value.cityName = null;
};


const deleteCity = (index) => {
  if (props.component === 'main') {
    store.dispatch('deleteCity', index);
  } else if (props.component === 'favorites') {
    store.dispatch('deleteBookmarkCity', index);
  }
  closeDeleteConfirmation();
};

const today = new Date().toLocaleString('en-En', {weekday: 'short', year: 'numeric', month: 'long', day: 'numeric'})

</script>
<template>
  <div class="summary">
    <div v-if="component === 'main'" class="summary-actions">
      <div v-if="isCityInBookmarks" class="pic-bookmark added"/>
      <div v-if="store.state.city.length > 1"
           @click="openDeleteConfirmation(index, weatherInfo?.name ? weatherInfo?.name : weatherInfo?.city )"
           class="pic-delete"/>
    </div>
      <div v-if="component === 'favorites'" class="summary-actions">
        <div
            @click="openDeleteConfirmation(index, weatherInfo?.name ? weatherInfo?.name : weatherInfo?.city )"
            class="pic-bookmark remove"/>
      </div>
    <div
        :style="`background-image: url('weather-main/${weatherInfo?.weatherInfo?.current?.weather[0].description}.png')`"
        class="pic-main"
    />
    <div class="weather">
      <div class="temp">
        {{ Math.round(weatherInfo?.weatherInfo?.current?.temp) }} °C
      </div>
      <div class="weather-desc text-block">
        {{ capitalizedFirstLetter(weatherInfo?.weatherInfo?.current?.weather[0].description) }}
      </div>
    </div>
    <div class="city text-block">
      {{ weatherInfo?.name ? weatherInfo?.name : weatherInfo?.city }},
      {{ weatherInfo?.countryCode ? weatherInfo?.countryCode : weatherInfo?.country }}
    </div>
    <div class="date text-block">
      {{ today }}
    </div>
  </div>
  <DeleteConfirmationModal
      v-if="deleteConfirmation.isOpen"
      :city="deleteConfirmation.city"
      :cityName="deleteConfirmation.cityName"
      @confirm="deleteCity"
      @cancel="closeDeleteConfirmation"
  />

</template>

<style scoped lang="sass">
@import '../assets/styles/main'

.summary
  margin: 10px 0
  padding: 10px
  border-radius: 20px
  box-shadow: 0 0 10px #0e100f
  position: relative
  height: 100%

.summary-actions
  display: flex
  justify-content: space-between
  align-items: center
  height: 50px
  position: relative


.pic-delete
  background-image: url('/src/assets/img/remove-btn.svg')
  width: 35px
  height: 35px


.pic-bookmark
  width: 60px
  height: 60px

.remove
  background-image: url('/src/assets/img/bookmark-remove.svg')
  position: absolute
  top: 5px
  right: 5px
  cursor: pointer

.added
  background-image: url('/src/assets/img/bookmark_icon.svg')


.pic-main
  width: 60px
  height: 60px
  margin: 10px 0 12px
  background-repeat: no-repeat
  background-position: 50% 50%
  background-size: contain

.city
  font-size: 24px

.weather
  margin: 0 0 20px
  padding: 20px 0
  border-bottom: 1px solid rgba(255, 255, 255, 0.4)

.temp
  padding-bottom: 8px
  font-size: 32px

.text-block
  position: relative
  padding-left: 24px
  padding-bottom: 8px
  font-size: 14px

  &::before
    content: ''
    position: absolute
    top: 0
    left: 0
    width: 20px
    height: 20px
    margin-right: 6px
    background-repeat: no-repeat
    background-position: 50% 50%
    background-size: contain

.weather-desc

  &::before
    background-image: url('/src/assets/img/weather.svg')

.city

  &::before
    background-image: url('/src/assets/img/location.svg')

.date

  &::before
    left: 2px
    width: 15px
    height: 15px
    background-image: url('/src/assets/img/calendar.svg')
</style>