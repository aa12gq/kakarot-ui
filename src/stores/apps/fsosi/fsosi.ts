import {GetClient} from "@/components/Grpc/grpc";
import {
    DeleteFsoRequest,
    DeleteFsoReply,
    DeleteFsoByPathRequest,
    DeleteFsoByPathReply
} from "@/stores/grpc/fsosi/v1/fsosi";
import {FsosiClient} from "@/stores/grpc/fsosi/v1/fsosi.client";
import {config} from "@/config";
import {authStore} from "@/stores/components/auth";

export const DeleteFso = (fsoId: string, success?: (re: DeleteFsoReply) => void, fail?: (why: any) => void, final?: () => void) => {
    GetClient(FsosiClient).deleteFso(DeleteFsoRequest.create({fsoId: fsoId}))
        .response.then(success, fail).finally(final);
}
export const DeleteFsoByPath = (path: string, success?: (re: DeleteFsoByPathReply) => void, fail?: (why: any) => void, final?:()=>void) => {
    GetClient(FsosiClient).deleteFsoByPath(DeleteFsoByPathRequest.create({path: path}))
        .response.then(
        success, fail
    ).finally(final);
}

export const UploadFile = (file: File, bucket: string, dir: string, fileType: 'image/jpeg'|'*'='image/jpeg'): Promise<any> => {
    // axios.put(`v1/upload?filename=${file.name}&bucket=${bucket}&dir=${dir}`)
    return axios.postForm(config.fs?.uploadApi!, {
        'filepond': file
    }, {
        headers: {
            'filename': file.name,
            'bucket': bucket,
            'dir': dir,
            'filesize': file.size,
            'Content-Type': fileType,
            'vg-x-authorization': authStore().jwt,
        }
    })
}