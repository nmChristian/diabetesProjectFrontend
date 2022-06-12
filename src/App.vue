<template>
	<div class="top-bar">
		<img class=user-icon src="@/assets/user.png" @click="$router.push('/sign-up')" alt="User icon"/>

		<div class=currentUserInfo>
			<p id="currentUserName"></p>
			<p id="currentUserEmail"></p>
		</div>

		<input class=searchField type="text" placeholder="Search bar (not functional)">
		<div class=iconGroup
			 v-if="String(this.$router.currentRoute.value.fullPath).toLowerCase().includes('displaypatients')">
			<img class=navigationIcon src="@/assets/icons/gridViewIcon.svg" @click="$router.push('/DisplayPatients')"
				 alt=""/>
			<img class=navigationIcon src="@/assets/icons/listViewIcon.svg"
				 @click="$router.push('/DisplayPatientsList')"
				 alt=""/>
		</div>
	</div>

	<div class="spacer"></div>

	<div id="content-view" class="content-view">
		<header>
			<div class="wrapper">
				<nav>
					<RouterLink to="/">Home</RouterLink>
					<RouterLink to="/GraphView">Graph demo</RouterLink>
					<RouterLink to="/DisplayPatients"> display patients</RouterLink>
					<RouterLink to="/DisplayPatientsList"> display patients list</RouterLink>
				</nav>
			</div>
		</header>
		<RouterView/>
	</div>
</template>


<script lang="ts">

import {RouterLink, RouterView} from 'vue-router'
import {defineComponent} from "vue";
import backend from "@/services/backend";
import type {UserDetails} from "@/services/core/dbtypes";
import {isAuthenticated} from "@/services/authentication";

function loadName(){
  let userData = backend.getUserDetails()
  userData.then(data => {
    if (isAuthenticated()) {
      (document.getElementById('currentUserName') as any).innerText = (data.last_name + ", " + data.first_name);
      (document.getElementById('currentUserEmail') as any).innerText = data.email
    }
  })
}

export default defineComponent({
	components: {
		RouterLink,
		RouterView
	},
  mounted(){
    loadName()
  },
  watch:{
    $route (to, from){
      if(from.fullPath.toLowerCase() === "/sign-in"){
        loadName()
      }
    }
  }
})

</script>


<style>
@import '@/assets/base.css';

.searchField {
  /*TODO Sikre den altid er holder samme pos. ligemeget om ikonerne til højre er der*/
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
	padding: 0;
	margin: 100px;
}

.top-bar {
  z-index: 10;
  height: 75px;
  width: 100%;
  top: 0;
  left: 0;
  background-color: lightgrey;
  display: flex;
  align-items: center;
  position: fixed;
  border-bottom: 1px grey solid;
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
