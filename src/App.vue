<template>
  <div class="top-bar">
    <img class=user-icon src="@/assets/user.png" @click="$router.push('/sign-up')"/>

    <div class=curentUserInfo>
      <p>Navn</p>
      <p>Email</p>
    </div>

    <input class=sheachField type="text" value="Søge bar ting (ikke funktionel)">
    <div class=iconGroup
         v-if="String(this.$router.currentRoute.value.fullPath).toLowerCase().includes('displaypatients')">
      <img class=navigationIcon src="@/assets/icons/gridViewIcon.svg" @click="$router.push('/DisplayPatients')"/>
      <img class=navigationIcon src="@/assets/icons/listViewIcon.svg" @click="$router.push('/DisplayPatientsList')"/>
    </div>
  </div>

  <div class="spacer"></div>

  <div id="content-view" class="content-view">
    <header>
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125"/>

      <div class="wrapper">
        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/sign-in">Sign-in</RouterLink>
          <RouterLink to="/sign-up">Sign up</RouterLink>
          <RouterLink to="/JonasView">Jonas</RouterLink>
          <RouterLink to="/DisplayPatients"> display patients</RouterLink>
          <RouterLink to="/DisplayPatientsList"> display patients list</RouterLink>
        </nav>
      </div>
    </header>
    <RouterView/>
  </div>
</template>


<script setup>
import {RouterLink, RouterView} from 'vue-router'
import HelloWorld from '@/components/HelloWorld.vue'
import GallaeryViewPatientElement from "@/components/patientElements/GallaeryViewPatientElement.vue";
import InfoElement from "@/components/patientElements/InfoElement.vue";
</script>


<style>
@import '@/assets/base.css';

.sheachField {
  height: 70%;
  width: 300px;
  margin: auto;
  opacity: 30%;
  border-radius: 10px;
}

.spacer {
  height: 75px;
}

.iconGroup {
  padding-right: 10px;
  height: 100%;
  display: flex;
  align-items: center;
}

.content-view {
  padding: 0px;
  margin: 100px;
}

.top-bar {
  z-index: 10;
  height: 75px;
  width: 100%;
  top: 0px;
  left: 0px;
  background-color: lightgrey;
  box-shadow: #2c3e50 5px 5px 5px;
  display: flex;
  align-items: center;
  position: fixed;
}

.navigationIcon {
  border: 1px black solid;
  background-color: white;
  height: 55%;
  aspect-ratio: 1 / 1;
  margin: 5px;
  padding: 3px;
  border-radius: 6px;
}

.user-icon {
  margin: 10px;
  width: 55px;
}

#content-view {
  /*max-width: 1280px; */
  margin: 0 auto;
  padding: 0rem;

  font-weight: normal;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

nav {
  width: 100%;
  font-size: 1rem;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

/*
@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}*/
</style>
