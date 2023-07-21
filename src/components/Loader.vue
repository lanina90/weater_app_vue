<script setup>

</script>

<template>
  <div class="lds-dual-ring"></div>
</template>

<style scoped lang="sass">
.lds-dual-ring
  display: inline-block
  width: 90px
  height: 90px
  margin-left: 40%

.lds-dual-ring:after
  content: " "
  display: block
  width: 64px
  height: 64px
  margin: auto
  border-radius: 50%
  border: 6px solid #fff
  border-color: #fff transparent #fff transparent
  animation: lds-dual-ring 1.2s linear infinite

@keyframes lds-dual-ring
  0%
    transform: rotate(0deg)
  100%
    transform: rotate(360deg)
</style>