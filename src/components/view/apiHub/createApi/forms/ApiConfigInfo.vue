<template>
  <div class="container mx-auto p-5">
    <div class="text-center my-6">
      <h3 class="form-heading">API <span class="magic">Wizard's Chamber</span></h3>
    </div>

    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full px-3">
        <label class="form-label" for="grid-password">Select Programming Language</label>
        <select v-model.trim="apiLanguage" class="form-input">
          <option value="">--SELECT ONE--</option>
          <option value="PYTHON">Python</option>
          <option value="PHP">PHP</option>
        </select>
        <p class="form-error" v-if="!isValidApiProgLang">
          Please select a preferred programming language
        </p>
      </div>
    </div>

    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full px-3">
        <label class="form-label" for="grid-password">Parameters</label>
        <input class="form-input" v-model.number="apiParameters" type="number"
          placeholder="Number of parameters in your API" min="1" max="10" />
        <p class="form-error" v-if="!isValidApiParm || apiParameters > 10">
          Minimum is 1, Maximum is 10
        </p>
      </div>

      <div v-for="input in apiParameters > 10 ? 0 : apiParameters" :key="input">
        <div class="w-full px-3">
          <label class="form-label" for="grid-password">Parm Name {{ input }}</label>
          <input class="form-input" v-model.number="apiParametersName[input - 1]" type="text" placeholder="Parm Name" />
          <!-- <select v-model.trim="apiParametersType[input - 1]" class="form-input">
            <option value="BOOLEAN">Boolean</option>
            <option value="INTEGER">Integer</option>
            <option value="STRING">String</option>
          </select> -->
        </div>
      </div>
    </div>

    <!-- <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full px-3">
        <label class="form-label" for="grid-password">Expected Form Response</label>
        <select v-model.trim="apiResponse" class="form-input">
          <option value="">--SELECT ONE--</option>
          <option value="BOOLEAN">Boolean</option>
          <option value="INTEGER">Integer</option>
          <option value="STRING">String</option>
        </select>
        <p class="form-error" v-if="!isValidApiResponse">
          Please select a preferred response
        </p>
      </div>
    </div> -->

    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="flex justify-end w-full px-3">
        <button @click="submitForm" class="form-btn text-4xl mx-auto" type="submit">
          Craft Your API
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConfigInfoForm",
  data() {
    return {
      apiLanguage: "",
      apiParameters: "",
      // apiResponse: "",
      apiParametersName: [],
      // apiParametersType: [],
      isValidApiProgLang: true,
      isValidApiParm: true,
      isValidApiResponse: true,
      isFormValid: false,
    };
  },
  methods: {
    validateForm() {
      this.isValidApiProgLang = this.apiLanguage !== "";
      this.isValidApiParm = this.apiParameters >= 1 && this.apiParameters <= 10;
      this.isValidApiResponse = this.apiResponse !== "";  

      this.isFormValid =
        this.isValidApiParm && this.isValidApiProgLang && this.isValidApiResponse;
    },
    submitForm() {
      this.validateForm();
      if (this.isFormValid) {
        this.$emit("update-form", {
          formName: "configInfo",
          form2Validated: true,
          formData: {
            apiLanguage: this.apiLanguage,
            apiParameters: this.apiParameters,
            apiParametersName: this.apiParametersName,
            // apiParametersType: this.apiParametersType,
            // apiResponse: this.apiResponse,
          },
        });
      }
    },
  },
};
</script>
