import { Profile } from "../models/profile";
import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { toast } from "react-toastify";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;
    followings: Profile[] = [];
    loadingFollowings = false;
    activeTab: number = 0;
    loadingActivities = false;

    constructor() {
        makeAutoObservable(this);

    }

    setActiveTab = (activeTab: any) => {
        this.activeTab = activeTab;
    }

    get isCurrentUser() {
        if (store.userStore.user && this.profile) {
            return store.userStore.user.email === this.profile.email;
        }
        return false;
    }

    loadProfile = async (email: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(email);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            })
        } catch (error) {
            toast.error('Възникна проблем със зареждането на профила Ви.');
            runInAction(() => {
                this.loadingProfile = false;
            })
        }
    }

    updateProfile = async (profile: Partial<Profile>) => {
        this.loading = true;
        try {
            await agent.Profiles.updateProfile(profile);
            runInAction(() => {
                // if (profile.displayName && profile.displayName !==
                //     store.userStore.user?.displayName) {
                //     store.userStore.setDisplayName(profile.displayName);
                // }
                this.profile = { ...this.profile, ...profile as Profile };
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }
}

