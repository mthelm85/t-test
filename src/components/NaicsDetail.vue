<template lang="html">
  <div class="row">
    <div class="col">

    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {

  async created () {
    for (let i = 0; i < this.naics.length; i++) {
      try {
        let res = await axios.get(`http://naics.codeforamerica.org/v0/q?year=2012&code=${this.naics[i]}`)
        console.log(res.data.title)
      } catch (err) {
        console.log(err)
      }
    }
  },

  props: ['naics']
}
</script>

<style lang="css">
</style>
