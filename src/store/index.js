import {createStore} from 'vuex'
import {API_KEY, API_URL_ONECALL} from "@/constans";

export default createStore({
  state: {
    city: [],
    userCity: null,
    weatherInfo: null,
    isError: false,
    errorMessage: '',
    cities: [],
    activeCity: null,
  },
  mutations: {
    setCity(state, city) {
      state.city = city;
    },

    addCity(state, city) {
      state.city.push(city);
      console.log('addCity', city)
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
    setWeatherInfo(state, { city, weatherInfo }) {
      const index = state.city.findIndex(c => c.lat === city.lat && c.lon === city.lon);

      if (index !== -1) {
        state.city[index].weatherInfo = weatherInfo;
      } else {
        city.weatherInfo = weatherInfo;
        state.city.push(city);
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
      console.log(payload)
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