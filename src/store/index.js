import {createStore} from 'vuex'
import {fetchWeatherData} from "@/utils";

export default createStore({
  state: {
    city: [],
    userCity: null,
    isError: false,
    errorMessage: '',
    cities: [],
    bookmarksCities: []
  },
  mutations: {
    setCity(state, city) {
      state.city = [city]
    },
    addCity(state, city) {
      const isCityExists = state.city.some(item => item.lon === city.lon && item.lat === city.lat)
      if (!isCityExists) {
        state.city.push(city)
      }
    },
    removeCity(state, index) {
      state.city = state.city.filter((c, i) => i !== index)
    },
    setUserCity(state, userCity) {
      state.userCity = userCity
    },
    setBookmarksCities(state, city) {
      if (!state.bookmarksCities.includes(city)) {
        state.bookmarksCities.push(city)
        localStorage.setItem('bookmarksCities', JSON.stringify(state.bookmarksCities))
      }
    },
    deleteBookmarkCity(state, index) {
      state.bookmarksCities = state.bookmarksCities.filter((_, i) => i !== index)
      localStorage.setItem('bookmarksCities', JSON.stringify(state.bookmarksCities))
    },
    setWeatherInfo(state, { city, weatherInfo, forecast }) {
      const index = state.city.findIndex(c => c.lat === city.lat && c.lon === city.lon)

      if (index !== -1) {
        state.city[index].weatherInfo = weatherInfo
        state.city[index].forecast = forecast
      } else {
        city.weatherInfo = weatherInfo
        city.forecast = forecast
        state.city.push(city)
      }
    },
    setBookmarkWeatherInfo(state, { city, weatherInfo, forecast }) {
      const index = state.bookmarksCities.findIndex(c => c.lat === city.lat && c.lon === city.lon)

      if (index !== -1) {
        state.bookmarksCities[index].weatherInfo = weatherInfo
        state.bookmarksCities[index].forecast = forecast
      } else {
        city.weatherInfo = weatherInfo
        city.forecast = forecast
        state.bookmarksCities.push(city)
      }
    },
    setIsError(state, isError) {
      state.isError = isError
    },
    setErrorMessage(state, errorMessage) {
      state.errorMessage = errorMessage
    },
    setCities(state, cities) {
      state.cities = cities
    }
  },
  actions: {
    deleteCity({ commit }, index) {
      commit('removeCity', index)
    },
    async selectCity({ commit, dispatch }, payload) {
      commit('setCity', payload)
      await dispatch('getWeather')
    },
    async addCity({ commit, dispatch }, payload) {
      commit('addCity', payload)
      await dispatch('getWeather')
    },

    async setBookmarkCity({ commit, dispatch }, payload) {
      commit('setBookmarksCities', payload)
      await dispatch('getWeatherForBookmarks')
    },
    deleteBookmarkCity({ commit }, index) {
      commit('deleteBookmarkCity', index)
    },
    async getUserLocation({ commit }) {
      try {
        const response = await fetch('http://ip-api.com/json/');
        const data = await response.json()
        commit('setUserCity', data)
      } catch (error) {
        console.error(error)
      }
    },
    async getWeather({ state, commit }) {
      try {

        const cities = state.city.length > 0 ? state.city : [state.userCity]

        const weatherRequests = cities.map(fetchWeatherData)

        const combinedData = await Promise.allSettled(weatherRequests)

        combinedData.forEach(result => {
          if (result.status === 'fulfilled') {
            commit('setWeatherInfo', result.value)
          }
        });
      } catch (e) {
        commit('setIsError', true);
        commit('setErrorMessage', 'Something went wrong...')
      }
    },
    async getWeatherForBookmarks({ commit }) {

      try {
        const savedCities = JSON.parse(localStorage.getItem('bookmarksCities'))

        const weatherRequests = savedCities.map(fetchWeatherData)
        const combinedData = await Promise.allSettled(weatherRequests)

        combinedData.forEach(result => {
          if (result.status === 'fulfilled') {
            commit('setBookmarkWeatherInfo', result.value)
          }
        });
      } catch (e) {
        commit('setIsError', true)
        commit('setErrorMessage', 'Something went wrong...')
      }
    },
    async fetchCities({ commit }) {
      try {
        const response = await fetch('./db/city.list.json')
        const data = await response.json()
        const cities = data.map(cityObj => ({
          name: cityObj.name,
          country: cityObj.country,
          lon: cityObj.coord.lon,
          lat: cityObj.coord.lat
        }));
        commit('setCities', cities)
      } catch (error) {
        console.error(error)
      }
    },
  }
})

