<template lang="html">
  <div class="container">
    <div class="row mt-3">
      <div class="col">
        <span class="lead">First, set your parameters:</span>
        <b-form class="mt-3" inline @submit.prevent>
          <label class="mr-2" for="hypothesis-mean">Hypothesis Mean</label>
          <b-form-input id="hypothesis-mean" type="number" class="mr-2" v-model="hypMean" default="5"></b-form-input>
          <label class="mr-2" for="viol-rate">Min Viol Rate</label>
          <b-form-input id="viol-rate" type="number" class="mr-2" v-model="violRateCutoff" default="0.8"></b-form-input>
          <label class="mr-2" for="proportion-cutoff">Max Proportion</label>
          <b-form-input id="proportion-cutoff" type="number" class="mr-2" v-model="proportionCutoff" default="0.8"></b-form-input>
        </b-form>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col lead">
        Then, upload your report and push the <span class="font-italic">Analyze</span> button:
      </div>
    </div>
    <div class="row mt-3 d-flex justify-content-center">
      <div class="col-10">
        <b-form-file v-model="file" :state="Boolean(file)" placeholder="Choose a file..."></b-form-file>
      </div>
      <div class="col-2">
        <button class="btn btn-dark" @click="analyze">Analyze</button>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-12">
        <span class="lead">Finally, view the results:</span>
        <bar-chart
          :min="0"
          class="mt-3"
          :data="chartData"
          :download="true"
          :stacked="true"
          height="400px"
          xtitle="Violations/Case"
          ytitle="NAICS"
          :legend="false"></bar-chart>
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
      pVal: null,
      hypMean: 5,
      proportionCutoff: .02,
      violRateCutoff: 0.8,
      chartData: []
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

        this.pVal = jStat.ttest(this.hypMean, jStat.mean(this.testArray), jStat.stdev(this.testArray), this.testArray.length, 1)
        let noViols = this.testArray.filter(num => num === 0)
        if (this.pVal <= .05 &&
          jStat.mean(this.testArray) >= this.hypMean &&
          (this.testArray.length / this.parsedData.length) < this.proportionCutoff &&
          (1 - (noViols.length / this.testArray.length)) > this.violRateCutoff) {
          this.goodNaics.push({
            naics: this.testCode,
            pValue: this.pVal,
            numCases: this.testArray.length,
            violsPerCase: jStat.mean(this.testArray),
            violRate: 1 - (noViols.length / this.testArray.length),
            proportion: this.testArray.length / this.parsedData.length
          })
        }
      }
      for (let i = 0; i < this.goodNaics.length; i++) {
        this.chartData.push([
          this.goodNaics[i].naics,
          this.goodNaics[i].violsPerCase.toFixed(2),
          (this.goodNaics[i].violRate * 100).toFixed(2)
        ])
      }
    }
  },

  watch: {
    file () {
      this.naicsCodes.length = 0
      this.parsedData.length = 0
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
