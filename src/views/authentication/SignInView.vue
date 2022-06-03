<template>
    <img src="@/assets/logo.svg" width="250" height="250" />
    <div>
        <animated-text-input label-text="E-mail" v-model='emailValue' />
    </div>
    <div>
        <animated-text-input label-text="Password" type="password" v-model='passwordValue' />
    </div>
    <div class="forgot-link">
        <a href="https://example.com">Forgot your password?</a>
    </div>
    <div>
        <button class="sign-in-button" @click="onSignInClick">Sign-in</button>
    </div>
    <div>

    </div>
    <p>Or</p>
    <div class="sing-up-link">
        <a href="/sign-up">SIGN UP</a>
    </div>
</template>

<script lang = "ts">
import { defineComponent } from "vue";
import axios from "axios";
import animatedTextInput from "../../components/input/AnimatedTextInput.vue"

export default defineComponent({
    name: "sign-in",
    components: {
        animatedTextInput
    },
    data() {
        return {
            emailValue: "",
            passwordValue: "",
            apiKey: null
        }
    },
    methods: {
        onSignInClick: function () {
          axios.post("http://localhost:5000/api/v1/user/login", { email: this.emailValue, password: this.passwordValue })
                .then(response => {
                    this.apiKey = response.data.api_key;
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }

});
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

p {
    top: 80px;
    text-align: center;
}

div a {
    text-decoration: underline;
}

.forgot-link {
    font-size: 0.8rem;
    text-align: center;
    bottom: 12px;
    left: 100px;
}

.sing-up-link {
    top: 80px;
    font-size: 0.8rem;
    text-align: center;
}

.sign-in-button {
    display: block;
    margin: auto;
    top: 20px;
    width: 200px;
    padding-top: 3px;
    padding-bottom: 3px;
    border: 1px solid black;
    border-radius: 15px;
    font-size: 150%;
    color: white;
    background-size: 300% 100%;
    transition: all .4s ease-in-out;
    background-image: linear-gradient(to right, #667eea, #764ba2, #6B8DD6, blueviolet);
    box-shadow: 0 4px 15px 0 rgba(137, 43, 226, 0.4);
}

.sign-in-button.focus {
    outline: none;
}

.sign-in-button:hover {
    border: 2px solid black;
    background-position: 99% 0;
    transition: all .4s ease-in-out;
}
</style>