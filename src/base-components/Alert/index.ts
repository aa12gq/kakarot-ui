import AlertComponent from "./Alert.vue";
import DismissButton from "./DismissButton.vue";
import type {Ref} from "vue";

export const Alert = Object.assign({}, AlertComponent, {
  DismissButton: DismissButton,
});
export function RemoveAlertMessage(index:bigint, messages:AlertMessage[]){
  for(let i = 0; i < messages.length; i++){
    if(messages[i].index == index){
      messages.splice(i, 1);
      break;
    }
  }
}
export interface AlertMessage {
  index: bigint;
  message: string;
}

export function SetAlertMessages(typeObj:Ref<AlertMessage[]>, messages: AlertMessage[]) {
  typeObj.value = [];
  typeObj.value = messages;
}

export function ResetAlertMessages(typeObj:Ref<AlertMessage[]>) {
  typeObj.value = [];
}