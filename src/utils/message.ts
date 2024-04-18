import MessageWrapper from '@/components/Message/MessageWrapper.vue'
import {mountComponent} from '@/utils/mount-component'
import type {Variant} from "@/base-components/Alert/Types";
import {type Icon} from "@/base-components/Lucide/types";

type Option = {type: Variant, msg: string, icon?: Icon, autoDismiss?: number}

let add: (msg: Option)=>void

const m = mountComponent(MessageWrapper, {})

add = (m.instance as any).Add

/**
 * 显示消息
 * @param msg 消息主体内容
 */
const show = (msg: string|Option) => {
    if (typeof msg === 'string') {
        add({
            type: 'primary',
            msg: msg,
            icon: 'AlertCircle'
        })
    }
    else {
        if (!msg.icon) msg.icon = 'AlertCircle'
        add(msg)
    }
}

function message(msg: string|Option) {
    show(msg)
}
message.Success = function Success(msg: string) {
    show({
        type: 'success',
        msg: msg,
        icon: 'AlertCircle'
    })
}

message.Error = function Error(msg: string) {
    show({
        type: 'danger',
        msg: msg,
        icon: 'AlertCircle'
    })
}

export {message}