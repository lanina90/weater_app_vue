import {createStore} from 'vuex'
import {API_KEY, API_URL_ONECALL} from "@/constans";

export default createStore({
  state: {
    city: [],
    userCity: null,
    isError: false,
    errorMessage: '',
    cities: [],
    activeCity: null,
    bookmarksCities: []
  },
  mutations: {
    setCity(state, city) {
      state.city = city;
    },
    addCity(state, city) {
      const isCityExists = state.city.some(item => item.lon === city.lon && item.lat === city.lat);
      if (!isCityExists) {
        state.city.push(city);
      }
    },
    setActiveCity(state, activeCity) {
      state.activeCity = activeCity;
    },
    removeCity(state, index) {
      state.city = state.city.filter((c, i) => i !== index);
    },
    setUserCity(state, userCity) {
      state.userCity = userCity;
    },
    setBookmarksCities(state, city) {
      if (!state.bookmarksCities.includes(city)) {
        state.bookmarksCities.push(city);
        localStorage.setItem('bookmarksCities', JSON.stringify(state.bookmarksCities));
      }
    },
    deleteBookmarkCity(state, index) {
      state.bookmarksCities = state.bookmarksCities.filter((_, i) => i !== index);
      localStorage.setItem('bookmarksCities', JSON.stringify(state.bookmarksCities));
    },
    setWeatherInfo(state, { city, weatherInfo }) {
      const index = state.city.findIndex(c => c.lat === city.lat && c.lon === city.lon);

      if (index !== -1) {
        state.city[index].weatherInfo = weatherInfo;
      } else {
        city.weatherInfo = weatherInfo;
        state.city.push(city);
      }
    },
    setBookmarkWeatherInfo(state, { city, weatherInfo }) {

      const index = state.bookmarksCities.findIndex(c => c.lat === city.lat && c.lon === city.lon);

      if (index !== -1) {
        state.bookmarksCities[index].weatherInfo = weatherInfo;
      } else {
        city.weatherInfo = weatherInfo;
        state.bookmarksCities.push(city);
      }
    },
    setIsError(state, isError) {
      state.isError = isError;
    },
    setErrorMessage(state, errorMessage) {
      state.errorMessage = errorMessage;
    },
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    setCities(state, cities) {
      state.cities = cities;
    }
  },
  actions: {
    setActiveCity({ commit }, city) {
      commit('setActiveCity', city);

    },
    deleteCity({ commit }, index) {
      commit('removeCity', index);
    },
    async selectCity({ commit, dispatch }, payload) {
      commit('setCity', payload);
      await dispatch('getWeather');
    },
    async addCity({ commit, dispatch }, payload) {
      commit('addCity', payload);
      await dispatch('getWeather');
    },

    async setBookmarkCity({ commit, dispatch }, payload) {
      commit('setBookmarksCities', payload);
      await dispatch('getWeatherForBookmarks')
    },
    deleteBookmarkCity({ commit }, index) {
      commit('deleteBookmarkCity', index);
    },
    async getUserLocation({ commit }) {
      try {
        const response = await fetch('http://ip-api.com/json');
        const data = await response.json();
        commit('setUserCity', data);
      } catch (error) {
        console.error(error);
      }
    },
    async getWeather({ state, commit }) {

      try {
        commit('setIsLoading', true);

        const cities = state.city.length > 0 ? state.city : [state.userCity];

        const weatherRequests = cities.map(city => {
          const queryCity = `lat=${city.lat}&lon=${city.lon}`;
          return fetch(`${API_URL_ONECALL}?${queryCity}&exclude=minutely&units=metric&appid=${API_KEY}`)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              commit('setWeatherInfo', { city, weatherInfo: data });
            });
        });
        await Promise.all(weatherRequests);

      } catch (e) {
        commit('setIsError', true);
        commit('setErrorMessage', 'Something went wrong...');
      } finally {
        commit('setIsLoading', false);
      }

    },
    async getWeatherForBookmarks({ state, commit }) {

      try {
        const savedCities = JSON.parse(localStorage.getItem('bookmarksCities'));
        const weatherRequests = savedCities.map(city => {
          const queryCity = `lat=${city.lat}&lon=${city.lon}`;
          return fetch(`${API_URL_ONECALL}?${queryCity}&exclude=minutely&units=metric&appid=${API_KEY}`)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              commit('setBookmarkWeatherInfo', { city, weatherInfo: data });
            });
        });
        await Promise.all(weatherRequests)
      } catch (e) {
        commit('setIsError', true);
        commit('setErrorMessage', 'Something went wrong...');
      } finally {
        commit('setIsLoading', false);
      }

    },
    async fetchCities({ commit }) {
      try {
        const response = await fetch('./db/city.list.json');
        const data = await response.json();
        const cities = data.map(cityObj => ({
          name: cityObj.name,
          country: cityObj.country,
          lon: cityObj.coord.lon,
          lat: cityObj.coord.lat
        }));
        commit('setCities', cities);
      } catch (error) {
        console.error(error);
      }
    },
  }
})