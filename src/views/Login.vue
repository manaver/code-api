<template>
  <section class="container mx-auto pt-32">
    <div class="flex justify-center items-center">
      <div
        class="bg-slate-950 border border-slate-800 text-white rounded-lg shadow-lg p-8 max-w-md w-full"
      >
        <h2 class="text-3xl font-bold mb-6 magic text-center my-4">Login</h2>

        <Alert
          v-if="errorMessage !== ''"
          :message="errorMessage"
          @hideAlert="errorMessage = ''"
        />

        <form @submit="userLogin" action="#" method="POST">
          <div class="mb-4 space-y-3">
            <label for="email" class="text-lg font-bold">Email</label>
            <input type="email" v-model="email" name="email" class="form-input" />
          </div>
          <div class="mb-6 space-y-3">
            <label for="password" class="text-lg font-bold">Password</label>
            <input
              type="password"
              v-model="password"
              name="password"
              class="form-input"
            />
          </div>
          <div class="flex justify-center my-5 mt-12">
            <button type="submit" class="btn">Login</button>
          </div>
        </form>
        <p class="text-sm mt-10 text-center">
          Don't have an account?
          <a
            href="/register"
            class="text-blue-500 underline underline-offset-4 font-semibold"
            >Register</a
          >
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import { account } from "/src/appwrite/appwriteConfig.js";
import alertView from "/src/components/subComponents/alert.vue";

export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async userLogin(e) {
      e.preventDefault();
      try {
        await account.createEmailSession(this.email, this.password);
        window.location.href = "/"; // Redirect the user to the login page and reload
        // this.$router.push({ name: "home" });
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
  },
  components: {
    Alert: alertView,
  },
};
</script>
