<template>
  <div class="container mx-auto pt-24 flex flex-col justify-between px-2 md:px-5 lg:px-10">
    <!-- About API -->
    <div
      class="font-semibold flex flex-col justify-between md:flex-row p-3 m-3 border-2 border-slate-800 rounded-md overflow-x-auto">
      <div class="ApiName p-2 md:p-5 lg:p-10 text-2xl flex flex-row w-1/3">
        <h5 style="white-space: nowrap">Api Name:&nbsp;</h5>
        <label class="magic font-bold" style="white-space: nowrap">{{ apiName }}</label>
      </div>
      <div class="ApiDescription p-2 md:p-5 lg:p-10 w-2/3 flex flex-col">
        <h7>About API:</h7>
        {{ apiDescription }}
      </div>
    </div>

    <div
      class="font-bold text-center p-3 m-3 border-2 border-slate-800 rounded-md overflow-x-auto w-full flex items-center flex-col">


      <!-- URL IF GET REQUEST -->
      <UrlComponent :parametersCount="parametersCount" :unqid="unqId" @apiParms="setParms" />
      <span v-if="isParm" class="text-red-400 font-normal border border-red-400 px-3 py-2 rounded-md">Parameters are
        required</span>


      <!-- Console Editor -->
      <div class="editorConsole flex flex-row w-full flex-wrap md:flex-nowrap text-start font-normal">
        <div class="editor flex justify-center my-4 w-full mx-auto ">
          <Codemirror v-model:value="codeSyntax" :options="cmOptions" border placeholder="test placeholder" :height="300"
            @beforeChange="beforeChange" />
        </div>
        <!-- Output screen -->
        <div
          class="RunConsole p-2 w-full bg-slate-950 my-4 scrollbar-customized rounded mx-auto overflow-x-auto min-h-[200px] max-h-[300px]">
          <h6 class="text-center font-bold underline underline-offset-8 mb-4">Output</h6>
          <p class="px-3" v-html="output"></p>
        </div>
      </div>

      <!-- Run Button -->
      <div @click="executeCode" class="btn w-fit mt-5 cursor-pointer self-end me-4">
        Run Code
      </div>

    </div>
    <form v-on:submit="saveAPI" class="w-full flex justify-center py-6">
      <button type="submit" class="btn text-2xl w-fit px-18">Save My API</button>
    </form>

  </div>
</template>

<script>
import Codemirror from "codemirror-editor-vue3";

// placeholder
import "codemirror/addon/display/placeholder.js";

// language
import "codemirror/mode/javascript/javascript.js";
// placeholder
import "codemirror/addon/display/placeholder.js";
// theme
import "codemirror/theme/dracula.css";
//Syntax json
import dataTypeJson from "/src/data/dataType.json";
import codeSyntaxJson from "/src/data/codeSyntax.json";
import codeJson from "/src/data/code.json";
import UrlComponent from "../components/view/codeApi/Url.vue";
import axios from "axios";
import { account, databases } from "/src/appwrite/appwriteConfig.js";
import { v4 as uuidv4 } from "uuid";

export default {
  name: "codeApi",
  components: { Codemirror, UrlComponent },
  data() {
    return {
      value: localStorage.getItem("ApiDetails"),
      parametersCount: 0,
      parameterNames: [],
      testCase: [],
      apiName: "",
      apiDescription: "",
      codeSyntax: "",
      code: "",
      output: "",
      returnType: "",
      apiLanguage: "",
      dataTypeJson: dataTypeJson,
      codeSyntaxJson: codeSyntaxJson,
      codeJson: codeJson,
      isParm: false,
      user_id: '',
      unqId: ''
    };
  },
  created() {
    const data = JSON.parse(this.value);
    if (data) {
      this.parametersCount = data.apiParameters;
      this.parameterNames = data.apiParametersName;
      this.apiParametersType = data.apiParametersType;
      this.returnType = data.apiResponse;
      this.apiLanguage = data.apiLanguage;
      this.apiName = data.apiName;
      this.apiDescription = data.apiDescription;
    }
  },
  methods: {
    storeSyntax(syntax) {
      this.codeSyntax = syntax;
      return syntax;
    },
    setParms(parms) {
      this.testCase = parms;
    },
    setCode() {
      let code = this.codeSyntax;

      const replacedParameters = this.testCase.map(value => {
        return !isNaN(value) ? value : "'" + value + "'";
      });

      this.code = this.codeJson[this.apiLanguage].Syntax.replace(/\$\{function\}/g, code).replace(/\$\{Parameters\}/g, replacedParameters.join(", "));
    },
    checkParm() {
      if (this.testCase.length === this.parametersCount) {
        this.isParm = false;
        return true;
      } else {
        this.isParm = true;
        return false;
      }
    },
    async saveAPI(e) {
      e.preventDefault();
      if (confirm("Are you sure you want to save this API?")) {
        let code = this.codeSyntax;

        try {
          // Get the current user ID
          const userIdResponse = await account.get();
          const userId = userIdResponse.$id;
          const ApiDetail = JSON.parse(localStorage.getItem("ApiDetails"));

          const unqId = this.unqId;

          const promise = databases.createDocument(
            process.env.VUE_APP_APPWRITE_DATABASE_ID,
            process.env.VUE_APP_APICODE_COLLECTION_ID,
            unqId,
            {
              code: code,
              user_id: userId,
              apiName: ApiDetail['apiName'],
              Description: ApiDetail['apiDescription'],
              apiParametersName: ApiDetail['apiParametersName'],
              language: ApiDetail['apiLanguage'],
            }
          );

          promise.then(() => {
            // Redirect to the "MyApis" route with a success message in the query parameter
            this.$router.push({ name: "MyApis", query: { success: "Api successfully added" } });
          });


        } catch (error) {
          console.log(error);
        }
      }
    }
    ,
    executeCode() {
      if (this.checkParm()) {
        // Make an HTTP POST request to the PHP backend endpoint
        this.setCode();
        const formData = new FormData();
        formData.append("code", this.code);
        formData.append("language", this.apiLanguage);

        axios
          .post("https://codeApiBackend.aslamtourandtravel.xyz/execute.php", formData)
          .then((response) => {
            // Handle the response and update the output variable
            this.output = response.data;
          })
          .catch((error) => {
            // Handle any errors
            console.error(error);
          });
      }
    },
    async checkUserLoggedIn() {
      const promise = await account
        .get()
        .catch(() => {
          // Redirect the user to the home route if not logged in
          this.$router.push({ name: "home" });
        });
      this.user_id = promise.$id;
    },
  },
  computed: {
    domain() {
      return window.location.hostname;
    },
    getUserName() {
      return localStorage.getItem("username");
    },
    codeTemplate() {
      const syntax = codeSyntaxJson[this.apiLanguage];
      if (syntax) {
        let parameters = this.parameterNames.map((name) => {
          if (this.apiLanguage === "PHP") {
            return `$${name}`;
          } else {
            return name;
          }
        }).join(", ");

        let modifiedReturnType = '';
        if (this.apiLanguage === "PHP") {
          modifiedReturnType = dataTypeJson[this.apiLanguage][this.returnType];
        }
        // Update the codeSyntax data property
        return this.storeSyntax(
          syntax.Syntax.replace("${returnType}", modifiedReturnType)
            .replace("${parameters}", parameters)
        );
      } else {
        return this.storeSyntax("ERROR");
      }
    },
  },
  setup() {
    return {
      cmOptions: {
        mode: "text/javascript", // Language mode
        theme: "dracula", // Theme
      },
    };
  },
  mounted() {
    this.codeTemplate;
    this.checkUserLoggedIn();
    this.unqId = uuidv4();
  },
};
</script>
