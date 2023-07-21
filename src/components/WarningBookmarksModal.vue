<script setup>
import { defineEmits } from 'vue';

const emits = defineEmits(['close']);

const closeModal = () => {
  emits('close');
};

</script>

<template>
  <div class="modal">
    <div class="modal-content">
      <p>The maximum number of cities is 5. Please delete a city to add a new one.</p>
      <div class="modal-buttons">
        <button @click="closeModal">Return</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.modal
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-color: rgba(0, 0, 0, 0.5)
  display: flex
  justify-content: center
  align-items: center
  z-index: 1001


  &-buttons
    width: 50%
    margin: auto
    display: flex
    justify-content: space-around


.modal-content
  padding: 20px
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2)
  background: url(/src/assets/img/gradient-1.jpg) no-repeat 50% 50%
  border-radius: 20px


.modal p
  margin-bottom: 10px
  padding: 20px


.modal button
  background-color: #0e100f
  color: white
  outline: none
  border: none
  padding: 10px 20px
  border-radius: 10px
  cursor: pointer




</style>