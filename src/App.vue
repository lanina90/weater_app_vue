<script setup>
import {useStore} from 'vuex';
import {ref, onMounted, reactive, onUnmounted} from 'vue';
import FavoriteCities from "@/components/FavoriteCities.vue";
import MainComponent from "@/components/MainComponent.vue";

const store = useStore();
const currentComponent = ref('Main')
let isDataLoaded = ref(false);

onMounted(async () => {
  await store.dispatch('getUserLocation')
  await store.dispatch('getWeather');
  await store.dispatch('fetchCities');
  isDataLoaded.value = true;
});


</script>

<template>
  <div class="page">
    <main class="container">
      <div v-if="!isDataLoaded" class="lds-dual-ring"></div>
      <div v-else class="laptop">
        <h1>Weather Forecasts App</h1>
        <nav class="laptop-header">
          <p @click="currentComponent = 'Main'" :class="{ active: currentComponent === 'Main' }">Main</p>
          <p @click="currentComponent = 'Bookmarks'" :class="{ active: currentComponent === 'Bookmarks' }">
            Bookmarks</p>
        </nav>
        <MainComponent v-if="currentComponent === 'Main'"/>
        <FavoriteCities v-else-if="currentComponent === 'Bookmarks'"/>
      </div>
    </main>
  </div>
</template>

<style lang="sass" scoped>
@import './assets/styles/main'
.active
  border-bottom: 1px solid white

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

  &-header
    display: flex

    & p
      width: 100px
      padding: 10px
      margin: 10px
      cursor: pointer

h1
  font-size: 22px
  text-align: center
  padding-bottom: 5px

.error
  padding-top: 20px

  &-title
    font-size: 18px
    font-weight: 700

  &-message
    padding-top: 20px
    font-size: 18px

</style>