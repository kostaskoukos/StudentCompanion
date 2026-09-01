import CapacitorPersistedStore from '../storage/capacitorPersistedStore';
import { neoUniversisGet } from '../dataService';
import { get } from 'svelte/store';
import { toastController } from 'ionic-svelte';

const myAchievements = {
	fivePassed: {
		achieved: false,
		title: 'Πέρνα 5 μαθήματα'
	},
	failOne: {
		achieved: false,
		title: 'Κόψου σε 1 μάθημα'
	}
};

export const achievementStore = new CapacitorPersistedStore(myAchievements, 'achievementStore');

async function fivePassed() {
	if (get(achievementStore).fivePassed.achieved == true) {
		// return;
	}

	const courses = await neoUniversisGet('students/me/courses?$filter=isPassed eq 1$top=5');

	console.log(courses.value.length);
	if (courses.value.length >= 5) {
		console.log('Έχεις περάσει 5 μαθήματα!');

		const toast = await toastController.create({
			message: 'Πέρασες 5 μαθήματα!',
			position: 'top',
			color: 'success',
			duration: 2000
		});
		toast.present();

		achievementStore.update((currentValue) => {
			currentValue.fivePassed.achieved = true;
			return currentValue;
		});
	} else {
		return;
	}
}

export async function startAchievements() {
	await fivePassed();
}
