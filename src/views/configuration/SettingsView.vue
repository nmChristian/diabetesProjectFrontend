<template>
	<form onsubmit="return false">
		<div class="image-container">
			<img class="image-display" :src=imageSource alt="Profile picture">
		</div>
		<div class="file-input-container">
			<input type="file" ref="fileInput" accept=".png, .jpg, .jpeg" @input="displayInputImage"
				   required>
		</div>
		<div class="button-container">
			<button type="submit" @click="onSubmitClick">Use as profile picture</button>
		</div>
	</form>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useProfilePicture, getProfilePictureUrl, defaultUrl} from "@/services/settingsProvider";

export default defineComponent({
	name: "settingsView.vue",
	data() {
		return {
			imageSource: defaultUrl
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
				const result = await useProfilePicture(image)
				if (result.success) {
					console.log('success')
				} else {
					console.log('failure', result)
				}
			} else {
				console.log('No image chosen')
			}
		}
	}
})

</script>

<style scoped>
form {
	border: 1px solid red;
}

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

.file-input-container {
	border: 1px solid gray;
}

.file-input-container > input {
	border: 1px solid pink;
}

.button-container {
	border: 1px solid blue;
	margin-bottom: 0.25rem;
}

</style>