import {defineStore} from "pinia";

interface layoutScrollLockState {
    isLocked: boolean
}
export const layoutScrollLockStore = defineStore("lockLayoutScroll", {
    state: (): layoutScrollLockState => {
        let curLocked = localStorage.getItem("lockLayoutScroll");
        if (curLocked === null) {
            localStorage.setItem("lockLayoutScroll", "1");
            curLocked = "1";
        }
        return {
            isLocked: curLocked === "1"
        }
    },
    getters: {
        locked: (state) => state.isLocked,
    },
    actions: {
        lock() {
            localStorage.setItem("lockLayoutScroll", "1");
            this.isLocked = true;
        },
        unlock() {
            localStorage.setItem("lockLayoutScroll", "0");
            this.isLocked = false;
        }
    }
});