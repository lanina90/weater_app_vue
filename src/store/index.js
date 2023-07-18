import {createStore} from 'vuex'
import {API_KEY, API_URL} from "@/constans";

export default createStore({
  state: {
    city: null,
    userCity: null,
    weatherInfo: null,
    isError: false,
    errorMessage: '',
    isLoading: false,
    cities: []
  },
  mutations: {
    setCity(state, city) {
      state.city = city;
    },
    setUserCity(state, userCity) {
      state.userCity = userCity;
    },
    setWeatherInfo(state, weatherInfo) {
      state.weatherInfo = weatherInfo;
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
    async selectCity({ commit, dispatch }, payload) {
      commit('setCity', payload);
      await dispatch('getWeather');
    },
    async getUserLocation({ commit }) {
      await fetch('http://ip-api.com/json')
        .then(response => response.json())
        .then(data => commit('setUserCity', data.city))
        .catch(error => console.error(error));
    },
    async getWeather({ state, commit }) {
      try {
        commit('setIsLoading', true);
        const queryCity = state.city ? state.city : state.userCity;
        const response = await fetch(`${API_URL}?q=${queryCity}&units=metric&appid=${API_KEY}`);
        const data = await response.json();

        if (!response.ok) {
          commit('setIsError', true);
          commit('setErrorMessage', data?.message);
        } else {
          commit('setWeatherInfo', data);
        }
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
          country: cityObj.country
        }));
        commit('setCities', cities);
      } catch (error) {
        console.error(error);
      }
    }
  }
})