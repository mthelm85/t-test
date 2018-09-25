<template lang="html">
  <div class="row">
    <div class="col">
      <div class="card mb-3" v-for="item in naicsInfo" :key="item.code">
        <div class="card-body">
          <h5 class="card-title">{{ item.code }}</h5>
          <h6 class="card-subtitle mb-2 text-muted">{{ item.title }}</h6>
          <p class="card-text">{{ item.description[0] }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      naicsInfo: []
    }
  },

  props: ['naics'],

  watch: {
    async naics () {
      for (let i = 0; i < this.naics.length; i++) {
        try {
          let res = await axios.get(`http://naics.codeforamerica.org/v0/q?year=2012&code=${this.naics[i]}`)
          console.log(res.data)
          this.naicsInfo.push({
            code: res.data.code,
            title: res.data.title,
            description: res.data.description
          })
        } catch (err) {
          console.log(err)
        }
      }
    }
  }
}
</script>

<style lang="css">
</style>
