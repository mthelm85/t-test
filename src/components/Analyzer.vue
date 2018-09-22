<template lang="html">
  <div class="container">
    <div class="row">
      <div class="col mt-3">
        <b-form-file v-model="file" :state="Boolean(file)" placeholder="Choose a file..."></b-form-file>
        <button class="btn btn-dark mt-3" @click="analyze">Analyze</button>
        <ul>
          <li v-for="item in goodNaics" :key="item.naics">
            NAICS: {{ item.naics }}
            <br>
            P-VALUE: {{ item.pValue }}
            <br>
            # CASES: {{ item.numCases }}
            <br>
            VIOLS/CASE: {{ item.violsPerCase }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import jStat from 'jStat'
import * as Papa from 'papaparse'
export default {
  data () {
    return {
      naicsCodes: new Set(),
      parsedData: [],
      violCounts: [],
      file: null,
      goodNaics: [],
      testArray: [],
      testCode: null,
      pVal: null
    }
  },

  computed: {
    naicsCodesArray () {
      return [...this.naicsCodes]
    }
  },

  methods: {
    analyze () {
      for (let i = 0; i < this.naicsCodesArray.length; i++) {

        this.testArray.length = 0
        this.testCode = this.naicsCodesArray[i]

        for (let n = 0; n < this.parsedData.length; n++) {
          if (this.parsedData[n][0] === this.testCode) {
            this.testArray.push(this.parsedData[n][1])
          }
        }

        for (let p = 0; p < this.testArray.length; p++) {
          if (this.testArray[p] > jStat.stdev(this.testArray)) {
            this.testArray.splice(p, 1)
          }
        }

        this.pVal = jStat.ttest(10, jStat.mean(this.testArray), jStat.stdev(this.testArray), this.testArray.length, 1)

        if (this.pVal <= .05 && jStat.mean(this.testArray) >= 8) {
          this.goodNaics.push({
            naics: this.testCode,
            pValue: this.pVal,
            numCases: this.testArray.length,
            violsPerCase: jStat.mean(this.testArray)
          })
        }

      }
    }
  },

  watch: {
    file () {
      Papa.parse(this.file, {
        complete: (results) => {
          for (let i = 1; i < results.data.length - 1; i++) {
            this.naicsCodes.add(Number(results.data[i][0]))
            this.parsedData.push([Number(results.data[i][0]), Number(results.data[i][1])])
          }
        }
      })
    }
  }
}
</script>

<style lang="css">
</style>
