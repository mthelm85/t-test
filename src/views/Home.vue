<template>
  <div class="home">
    <Analyzer msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Analyzer from '@/components/Analyzer.vue'

export default {
  name: 'home',
  components: {
    Analyzer
  }
}
</script>
