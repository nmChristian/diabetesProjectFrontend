<template>
    <div class="form">
        <input class="input" placeholder=" " />
        <label class="label">{{ labelText }}</label>
    </div>
</template>

<script lang="ts">
export default {
    name: "animatedTextInput",
    props: {
        labelText: String
    }
}

</script>

<style scoped>
.form {
    position: relative;
    width: 20rem;
    font-size: 1.4rem;
}

input {
    position: absolute;
    width: 100%;
    padding-left: 0.6rem;
    background: none;
    border-radius: 5px;
    border: 1px solid;
    outline: none;
    font-size: inherit;
    font-family: inherit;
}

label {
    top: -1px;
    left: 0.6rem;
    transition: all .4s;
    background-color: white;
    color: gray;
}

input:hover {
    border: 2px solid;
}

input:focus {
    border: 1px solid blueviolet;
}

input:focus~.label,
.input:not(:placeholder-shown).input:not(:focus)~label {
    top: -1.4rem;
    font-size: 50%;
    color: lightgray;
}
</style>