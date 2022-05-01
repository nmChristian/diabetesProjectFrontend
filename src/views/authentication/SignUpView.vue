<template>
    <div class="title">
        <label>Sign Up</label>
    </div>
    <img src="@/assets/logo.svg" width="100" height="100" />
    <div>
        <animated-text-input label-text="First name" />
    </div>
    <div>
        <animated-text-input label-text="Last name" />
    </div>
    <div>
        <animated-text-input label-text="E-mail" />
    </div>
    <div>
        <animated-text-input label-text="Password" type="password" />
    </div>
    <div>
        <animated-text-input label-text="Repeat password" type="password" />
    </div>
    <div>
        <button class="sign-up-button">Sign up</button>
    </div>
    <p>Or</p>
    <div class="sing-in-link">
        <a href="/sign-in">SIGN IN</a>
    </div>
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
div {
    display: block;
    margin: auto;
    padding: 0.2em;
}

img {
    display: block;
    margin: auto;
    padding: 10px;
}

p {
    top: 80px;
    text-align: center;
}

div a {
    text-decoration: underline;
}

.title {
    text-align: center;
    margin: auto;
    font-size: 250%;
}

.sing-in-link {
    top: 80px;
    font-size: 0.8rem;
    text-align: center;
    margin-bottom: 100px;
}

.sign-up-button {
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

.sign-up-button.focus {
    outline: none;
}

.sign-up-button:hover {
    border: 2px solid black;
    background-position: 99% 0;
    transition: all .4s ease-in-out;
}
</style>