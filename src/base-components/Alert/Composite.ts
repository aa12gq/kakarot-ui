import {default as AlertComponent} from "./Alert.vue";
import DismissButton from "./DismissButton.vue";
import type {Ref} from "vue";

export interface AlertMessage {
    index: bigint;
    message: string;
    autoDismiss?: number;
}

export const Alert = Object.assign({}, AlertComponent, {
    DismissButton: DismissButton,
});

export function RemoveAlertMessage(index: bigint, messages: AlertMessage[], dismissFn?: () => {}) {
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].index == index) {
            if (dismissFn) {
                dismissFn();
            }
            setTimeout(() => messages.splice(i, 1), 350)
            break;
        }
    }
}

export function SetAlertMessages(typeObj: Ref<AlertMessage[]>, messages: AlertMessage[]) {
    typeObj.value = [];
    typeObj.value = messages;
}

export function ResetAlertMessages(typeObj: Ref<AlertMessage[]>) {
    typeObj.value = [];
}