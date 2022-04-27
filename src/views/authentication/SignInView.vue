<template>
    <img src="@/assets/logo.svg" width="125" height="125" />
    <div class="signIn">
        <label>E-mail:</label>
        <input v-model="email" name="usernameField">
    </div>
    <div>
        <label>Password:</label>
        <input v-model="password" name="passwordField">
    </div>
    <div>
        <link-button href="#" linkText="Forgot Password" name="forgotPasswordLink">Forgot password</link-button>
    </div>
    <div>
        <button name="signInButton">Sign-in</button>
    </div>
</template>

<script lang = "ts">
export default {}
</script>

<style>
</style>