<template>
    <img src="@/assets/logo.svg" width="250" height="250" />
    <div>
        <animated-text-input label-text="E-mail" />
    </div>
    <div>
        <animated-text-input label-text="Password" />
    </div>
    <!--<div>
        <link-button href="#" linkText="Forgot Password" name="forgotPasswordLink">Forgot password</link-button>
    </div>
    <div>
        <button name="signInButton">Sign-in</button>
    </div> 
     -->
</template>

<script lang = "ts">
import animatedTextInput from "../../components/input/AnimatedTextInput.vue"

export default {
    components: {
        animatedTextInput
    }
}
</script>

<style scoped>
img {
    display: block;
    margin: auto;
    padding: 2rem;
}

div {
    display: block;
    margin: auto;
    padding: 0.2em;
}
</style>