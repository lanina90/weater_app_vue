<script setup>
import { useI18n } from 'vue-i18n'

const emits = defineEmits(['close'])
const { t } = useI18n()

const closeModal = () => {
  emits('close')
};

</script>

<template>
  <div class="modal">
    <div class="modal-content">
      <p>{{t('warningBookmarkModal.text')}}</p>
      <div class="modal-buttons">
        <button @click="closeModal">{{t('warningBookmarkModal.return')}}</button>
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