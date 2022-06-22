<!-- Author: Niels Torp Grønskov, s204510
			 Christian Nykjær Mundbjerg, s204424 -->
<!-- Description: The main application. Here all the content is displayed  -->

<template>
  <div class="top-bar">

    <div class="left-content">
      <div class="icon-container">
        <img alt="" src="@/assets/logo.svg" @click="$router.push('/')"/>
      </div>

      <img alt="" class=navigation-icon src="@/assets/icons/gridViewIcon.svg"
           @click="$router.push('/display-patients')"/>
      <img alt="" class=navigation-icon src="@/assets/icons/listViewIcon.svg"
           @click="$router.push('/display-patients-list')"/>
    </div>

    <input class="search-field" placeholder="Search" type="text">

    <div class=right-content>
      <div class="user-info">
        <p id="currentUserName"></p>
        <p id="currentUserEmail"></p>
      </div>
      <div class="icon-container">
        <img alt="User icon" class=user-icon :src=imageSource @click="$router.push('/settings')"/>
      </div>
    </div>

  </div>

  <div class="spacer"/>

  <div id="content-view" class="content-view">
    <RouterView/>
  </div>
</template>


<script lang="ts">

import {RouterLink, RouterView} from 'vue-router'
import {defineComponent} from "vue";
import backend from "@/services/backend";
import {isAuthenticated} from "@/services/authentication";
import {defaultUrl, getProfilePictureUrl} from "@/services/settings-provider";

function loadName() {
  const userData = backend.getUserDetails();
  userData.then(data => {
        const nameElement = (document.getElementById('currentUserName') as HTMLParagraphElement);
        const emailElement = (document.getElementById('currentUserEmail') as HTMLParagraphElement);
        if (data && isAuthenticated()) {
          nameElement.innerText = (data.last_name + ", " + data.first_name);
          emailElement.innerText = data.email;
        } else {
          nameElement.innerText = '';
          emailElement.innerText = '';
        }
      }
  )
}

export default defineComponent({
  components: {
    RouterLink,
    RouterView
  },
  mounted() {
    this.initialize();
  },
  watch: {
    $route(to, from) {
      const fromPath = from.fullPath.toLowerCase();
      if (fromPath === '/sign-in' || fromPath === '/sign-up' || fromPath === '/settings') {
        this.initialize()
      }
    }
  },
  data() {
    return {
      imageSource: defaultUrl
    }
  },
  methods: {
    initialize() {
      this.addScrollListener()
      loadName()
      getProfilePictureUrl().then(url => {
        this.imageSource = url
      })

    },
    addScrollListener() {
      let lastScrollTop: number;
      window.onscroll = (_ => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const topBar = document.querySelector('.top-bar') as HTMLDivElement
        if (scrollTop > lastScrollTop) {
          topBar.style.top = '-75px';
        } else {
          topBar.style.top = '0';
        }
        lastScrollTop = scrollTop
      })
    }
  }
})

</script>


<style>
@import '@/assets/base.css';

.top-bar {
  z-index: 10;
  height: 75px;
  width: 100%;
  background-color: lightgrey;
  display: flex;
  align-items: center;
  position: fixed;
  justify-content: space-between;
  transition: 0.5s;
}

.left-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding-left: 1rem;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 55px;
  height: 55px;
  margin-right: 1.5rem;
}

.navigation-icon {
  border: 1px black solid;
  background-color: white;
  height: 55%;
  aspect-ratio: 1 / 1;
  margin: 5px;
  padding: 3px;
  border-radius: 6px;
}

.user-info {
  animation: fadeIn 2s;
  padding-right: 1rem;
}

.search-field {
  visibility: hidden;
  outline: none;
  height: 40%;
  width: 20%;
  background: var(--color-background-mute);
  border: 1px solid var(--vt-c-black);
  border-radius: 8px;
  font-size: 120%;
}

.search-field:focus {
  border: 1px solid var(--color-primary);
  background: var(--vt-c-white);
}

.right-content {
  height: 100%;
  display: flex;
  align-items: center;
  padding-right: 1rem;
}

.user-icon {
  width: inherit;
  height: inherit;
  border-radius: 50%;
}

.spacer {
  height: 75px;
}


.content-view {
  padding: 0;
  margin: 100px;
}


#content-view {
  margin: 0 auto;
  padding: 0;
  font-weight: normal;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

a {
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

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

</style>
