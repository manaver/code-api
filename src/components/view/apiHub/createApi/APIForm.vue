<template>
  <div :class="{ hidden: !formVisibility, '': formVisibility }"
    class="h-screen w-screen fixed top-0 left-0 bg-[#3535353a] z-50">
    <div class="api-form-popUp overflow-auto scrollbar-customized max-h-[80vh]">
      <!-- exit btn starts-->
      <div @click="hideForm" class="exit text-white fixed right-10 top-7 text-4xl font-bold cursor-pointer">
        <ion-icon name="close-outline"></ion-icon>
      </div>
      <!-- exit btn ends -->
      <!-- back btn starts-->
      <div @click="form1Filled = false" :class="{ hidden: !form1Filled, '': form1Filled }"
        class="back text-white fixed left-10 top-7 text-4xl font-bold cursor-pointer">
        <ion-icon name="arrow-back-outline"></ion-icon>
      </div>
      <!-- back btn ends -->
      <div v-if="!isLoggedIn" class="flex justify-center">
        <a href="/login" class="btn w-fit mt-10">
          Please Log in to continue
        </a>
      </div>
      <!-- form1 hidden when form1 is filled  -->
      <div v-else :class="{ hidden: form1Filled, '': !form1Filled }" id="basicInfoForm">
        <BasicInfo @update-form="updateFormInfo" />
      </div>
      <!-- form2 hidden when form1 is not filled and form2 is filled  -->
      <div :class="{ hidden: !form1Filled || form2Filled, '': !form2Filled && form1Filled }" id="configInfoForm">
        <ConfigInfo @update-form="updateFormInfo" />
      </div>
    </div>

  </div>
</template>

<script>
import BasicInfoForm from "./forms/BasicInfo.vue";
import ConfigInfoForm from "./forms/ApiConfigInfo.vue";
import { account } from "/src/appwrite/appwriteConfig.js";

export default {
  name: "APIForm",
  components: {
    BasicInfo: BasicInfoForm,
    ConfigInfo: ConfigInfoForm,
  },
  props: {
    formVisibility: Boolean,
  },
  data() {
    return {
      form1Filled: false,
      form2Filled: false,
      formData: {},
      isLoggedIn: false,
    };
  },
  methods: {
    hideForm() {
      this.$emit("formVisibility", false);
    },
    updateFormInfo(info) {
      if (info.formName === "basicInfo") {
        this.formData = { ...this.formData, ...info.formData };
        this.form1Filled = info.form1Validated;
      } else if (info.formName === "configInfo") {
        this.formData = { ...this.formData, ...info.formData };
        this.form2Filled = info.form2Validated;
        this.submitApiDetails();
      }
    },
    async setLoggedIn() {
      try {
        const response = await account.get();
        if (response.status) {
          this.isLoggedIn = true;
        }
      } catch (error) {
        return console.log(error);
      }
    },
    submitApiDetails() {
      if (this.form1Filled || this.form2Filled) {
        localStorage.setItem("ApiDetails", JSON.stringify(this.formData));
        this.$router.push({ name: "codeApi" });
      }
    },
  },
  mounted() {
    this.setLoggedIn();
  },
};
</script>
