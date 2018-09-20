<template>
  <div id="main">
		<input type="button" id="launch" value="Import robots" @click.prevent="launch" />
		<div class="download">
			<a href="robots-clean.csv" target="_blank" rel="noopener noreferrer">
				Download a sample csv file here
			</a>
		</div>
		<textarea id="raw_output" :value="results"></textarea>
	</div>
</template>

<script>
import FlatfileImporter from "flatfile-csv-importer";
import config from '../../env.js';

const importer = new FlatfileImporter(config.license, config.config);

export default {
  data() {
    return {
      results: 'Your raw output will appear here.',
    };
  },
  methods: {
    launch() {
      const $v = this;
      importer
        .requestDataFromUser()
        .then(function (results) {
          $v.results = JSON.stringify(results.validData, null, 2);
          importer.displaySuccess("Success!");
        })
        .catch(function (error) {
          console.info(error || "window close");
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.download {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.download a {
  color: #3c4151;
  text-decoration: none;
}

.download a:hover {
  color: #1d62b4;
}

#launch {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  margin: 96px 0 64px 0;
  border: none;
  border-radius: 4px;
  color: #fff;
  display: block;
  padding: 0 64px;
  height: 44px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 15px;
  font-weight: 500;
  outline: 0;
  background-color: #4a90e2;
}

#launch:focus,
#launch:hover {
  background-color: #2171ce;
}

#launch:active {
  background-color: #1d62b4;
}

#raw_output {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  padding: 64px;
  margin: 32px 0;
  border: 1px solid #c1c6d1;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  background-color: #3c4151;
  color: #fff;
  height: 200px;
}

</style>
