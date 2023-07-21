<script setup>
import { computed, watch, ref} from 'vue'
import {getPressureMm, getTime} from "@/utils";
import Chart from "@/components/Chart.vue";
import { useI18n } from 'vue-i18n'

const props = defineProps({
  activeCity: {
    type: Object,
    required: true
  },
  isChartVisible: {
    type: Boolean,
    required: true
  }
})

const { t } = useI18n()
const labels = ref([]);
const data = ref([]);

const sunriseTime = computed(() => {
  return getTime(props.activeCity?.weatherInfo.current?.sunrise + props.activeCity?.weatherInfo.timezone_offset)
})

const sunsetTime = computed(() => {
  return getTime(props.activeCity?.weatherInfo.current?.sunset + props.activeCity?.weatherInfo.timezone_offset)
})

watch(
    () => props.activeCity,
    (newVal) => {
      if (newVal && newVal.weatherInfo) {
        labels.value = newVal?.weatherInfo.hourly.map(item => {
          let date = new Date(item.dt * 1000);
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        });
        data.value = newVal?.weatherInfo.hourly.map(item => item.temp)
      }
    },
    { immediate: true }
);

</script>

<template>
  <div v-if="activeCity">
    <div
        class="highlights-wrapper">
      <div  class="highlight">
        <div class="card">
          <div class="card-title">{{ t('wind') }}</div>
          <div class="card-pic card-pic--wind"></div>
          <div class="card-info">
            <div class="card-justify">
              <div class="info-main">
                <div class="info-main-num">
                  {{activeCity.weatherInfo?.current.wind_speed }}
                </div>
                <div class="info-main-text">
                  {{ t('meters') }}
                </div>
              </div>
              <div class="info-main">
                <div class="info-main-num">
                  {{activeCity.weatherInfo?.current.wind_deg }}
                </div>
                <div class="info-main-text">
                  {{ t('deg') }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-small">
          <div class="card-small-title">
            {{ t('gust') }}
          </div>
          <div class="card-small-info">
            <div class="card-small-data">
              <div  class="info-main-num">
                {{ activeCity.weatherInfo?.current.wind_gust !== undefined ? Math.round(activeCity.weatherInfo?.current.wind_gust) : 0 }}
              </div>
              <div class="info-main-text">
                {{ t('meters') }}
              </div>
            </div>
            <div class="card-small-hint">
              <div class="card-small-pic card-small-pic--wind"></div>
              <div class="card-small-text">
                {{ t('gustDesc') }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="highlight">
        <div class="card">
          <div class="card-title">
            {{ t('pressure') }}
          </div>
          <div class="card-pic card-pic--pressure"></div>
          <div class="card-info">
            <div class="card-centered">
              <div class="info-main">
                <div class="info-main-num">
                  {{getPressureMm(activeCity.weatherInfo?.current.pressure) }}
                </div>
                <div class="info-main-text"> {{ t('mm') }} </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-small">
          <div class="card-small-title">{{ t('feels') }}</div>
          <div class="card-small-info">
            <div class="card-small-data">
              <div class="info-main-num">
                {{Math.round(activeCity.weatherInfo?.current.feels_like) }}
              </div>
              <div class="info-main-text">°C </div>
            </div>
            <div class="card-small-hint">
              <div class="card-small-pic card-small-pic--margin card-small-pic--pressure"></div>
              <div class="card-small-text">
                {{ t('feelsDesc') }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="highlight">
        <div class="card">
          <div class="card-title">{{ t('sunriseAndSunset') }}</div>
          <div class="card-pic card-pic--sun"></div>
          <div class="card-info">
            <div class="states">
              <div class="state">
                <div class="state-pic"></div>
                <div class="state-title">{{ t('sunrise') }}</div>
                <div class="state-time">
                  {{sunriseTime}}
                </div>
              </div>
              <div class="state">
                <div class="state-pic state-pic--flipped"></div>
                <div class="state-title">{{ t('sunset') }}</div>
                <div class="state-time">
                  {{sunsetTime}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-small">
          <div class="card-small-title">
            {{ t('cloudiness') }}
          </div>
          <div class="card-small-info">
            <div class="card-small-data">
              <div class="info-main-num">
                {{activeCity.weatherInfo?.current.clouds }}
              </div>
              <div class="info-main-text">
                %
              </div>
            </div>
            <div class="card-small-hint">
              <div class="card-small-pic card-small-pic--sun"></div>
              <div class="card-small-text">
                {{ t('cloudinessDesc') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Chart :labels="labels" :data="data" :isShow="isChartVisible"/>
  </div>
</template>

<style scoped lang="sass">
@import '../assets/styles/main'
.highlights

  &-wrapper
    display: flex
    justify-content: space-between

    @media (max-width: 575px)
      flex-direction: column

.title
  padding-bottom: 16px

.highlight
  width: 32%

  @media (max-width: 575px)
    width: 100%
    margin-bottom: 16px

.card
  min-height: 230px
  padding: 16px
  background: url('/src/assets/img/gradient-2.jpg') no-repeat 50% 50%
  background-size: cover
  border-radius: 8px

  @media (max-width: 1199px)
    padding: 12px

  &-centered
    display: flex
    justify-content: center
    margin-top: 40px

  &-justify
    display: flex
    justify-content: space-between
    margin-top: 40px

  &-title
    padding-bottom: 12px
    font-size: 13px

    @media (max-width: 1199px)
      font-size: 12px

  &-pic
    width: 100%
    height: 90px
    margin-bottom: 16px
    background-repeat: no-repeat
    background-position: 50% 50%
    background-size: contain

    &--wind
      background-image: url('/src/assets/img/equalizer (2).png')

    &--pressure
      background-image: url('/src/assets/img/barometer.png')

    &--sun
      background-image: url('/src/assets/img/sun-moving.png')


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

.info-main
  display: flex
  align-items: flex-end

  &:last-child
    text-align: right

  &-num
    font-size: 20px

    @media (max-width: 1199px)
      font-size: 18px

  &-text
    padding-left: 2px
    padding-bottom: 3px
    font-size: 13px
    color: rgba($white, 0.75)

    @media (max-width: 1199px)
      padding-bottom: 1.5px
      font-size: 12px

.card-small
  margin-top: 12px
  padding: 12px 16px
  background: url('/src/assets/img/gradient-2.jpg') no-repeat 50% 50%
  background-size: cover
  border-radius: 8px

  &-title
    font-size: 13px

  &-info
    display: flex
    justify-content: space-between
    align-items: center

    @media (max-width: 1199px)
      flex-direction: column
      align-items: flex-start

  &-pic
    width: 20px
    height: 20px
    background-repeat: no-repeat
    background-position: 50% 50%
    background-size: contain


    &--margin
      width: 16px
      height: 16px
      margin-bottom: 3px

    &--wind
      background-image: url('/src/assets/img/gusts.svg')

    &--sun
      background-image: url('/src/assets/img/cloud.svg')

    &--pressure
      background-image: url('/src/assets/img/feels-like.svg')

  &-data
    display: flex
    align-items: flex-end
    width: 45%

    @media (max-width: 1199px)
      width: 100%
      padding-top: 8px

  &-hint
    width: 55%

    @media (max-width: 1199px)
      width: 100%

  &-text
    font-size: 11px
    line-height: 1.2
    color: rgba($white, 0.6)

    @media (max-width: 1199px)
      min-height: 22px
      font-size: 9px
</style>