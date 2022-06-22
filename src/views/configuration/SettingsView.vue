<!-- Author: Niels Torp Grønskov, s204510 -->
<!-- Description: The settings page. Here the user can change stored settings via the UI. -->

<template>
  <form onsubmit="return false">
    <div class="image-container">
      <img class="image-display" :src=imageSource alt="Profile picture">
    </div>
    <div class="file-input-container">
      <input type="file" ref="fileInput" accept=".png, .jpg, .jpeg" @input="displayInputImage"
             required>
    </div>
    <div>
      <primary-button type="submit" @click="onSubmitClick" text="Use as profile picture"/>
    </div>
    <div/>
    <div>
      <primary-button @click="onSignOutClick" text="Sign out"/>
    </div>
    <div class="spinner-container">
      <spinner v-show="loading"></spinner>
    </div>
    <div>
      <failure-icon ref="failureIcon"/>
    </div>
  </form>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {defaultUrl, getProfilePictureUrl, useProfilePicture} from "@/services/settings-provider";
import PrimaryButton from "@/components/PrimaryButton.vue";
import router from "@/index";
import failureIcon from "@/components/icons/FailureIcon.vue";
import spinner from "@/components/Spinner.vue";
import {clearApiKey} from "@/services/authentication";

export default defineComponent({
  name: "settingsView.vue",
  components: {PrimaryButton, failureIcon, spinner},
  data() {
    return {
      imageSource: defaultUrl,
      loading: false
    }
  },
  mounted() {
    getProfilePictureUrl().then(url => {
      this.imageSource = url
    })
  },
  methods: {
    getImage: function (): File | null {
      const files = (this.$refs.fileInput as HTMLInputElement).files;
      if (files) {
        return files.item(0)
      }
      return null;
    },
    displayInputImage: function () {
      const image = this.getImage()
      if (image) {
        this.imageSource = URL.createObjectURL(image)
      }
    },
    onSubmitClick: async function () {
      const image = this.getImage()
      if (image) {
        this.loading = true
        const result = await useProfilePicture(image)
        if (result.success) {
          await router.push("/")
        } else {
          (this.$refs.failureIcon as typeof failureIcon).setText(result.errorMessage)
        }
        this.loading = false
      }
    },
    onSignOutClick: async function () {
      clearApiKey()
      await router.push("/")
    }
  }
})

</script>

<style scoped>

form > div {
  display: flex;
  justify-content: center;
  margin: 1rem auto 1rem;
}

.image-display {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  border: 1px solid black;
}


</style>