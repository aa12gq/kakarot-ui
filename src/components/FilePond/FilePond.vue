<script lang="ts">
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import {FilePond as FilePondComp} from "filepond";
import { ref, useAttrs } from "vue";

const defaultPlugins: any = [FilePondPluginImagePreview]
const filepond = ref<FilePondComp>()
export default {

}
export const get_file_pond = ():FilePondComp => {
  return filepond.value as FilePondComp;
}
</script>
<script setup lang="ts">
import "filepond/dist/filepond.min.css";
import type {
  FilePondServerConfigProps,
  FilePondFile
} from "filepond/types";
import {get_jwt_header_key} from "@/config"
import {authStore} from "@/stores/components/auth";
import _ from "lodash"
import VueFilePond, {setOptions} from "vue-filepond";

interface Props {
  // filepond插件
  plugins?: any[];
  rename?: (name: string)=> string;
}

const props = withDefaults(defineProps<Props>(), {
  plugins: defaultPlugins,
  rename: (name: string)=>name,
})
let FilePond: any
if (props.plugins) {
  FilePond = VueFilePond(...props.plugins);
} else {
  FilePond = VueFilePond();
}
const attrs = useAttrs();
const nAttrs = _.omit(attrs, "beforeProcessFile")

let serverConfig = attrs.server as FilePondServerConfigProps["server"];

const updateQueryHeaders = (file: FilePondFile | Blob) => {
  if (typeof serverConfig == "object" && serverConfig) {
    if (typeof serverConfig.process == "object" && serverConfig.process) {
      if (typeof serverConfig.process.headers != 'object') {
        serverConfig.process.headers = {};
      }
      if (file.hasOwnProperty("fileSize")) {
        file = file as FilePondFile
        serverConfig.process.headers['filesize'] = file.fileSize;
        serverConfig.process.headers['filename'] = props.rename(file.filename);
      } else {
        file = file as Blob
        serverConfig.process.headers['filesize'] = file.size;
        serverConfig.process.headers['filename'] = props.rename(file.name);

      }
      if (authStore().jwt !== undefined) {
        serverConfig.process.headers[get_jwt_header_key()] = authStore().jwt as string;
      }
    } else {
      throw Error("filepond server.process 配置必须为对象.")
    }
  } else {
    throw Error("filepond server配置必须为对象.")
  }
  setOptions(attrs)
}
const onBeforeProcess = (file: FilePondFile | Blob) => {
  if (!file) {
    console.log("空文件:", file);
    return
  }
  updateQueryHeaders(file);
  if (typeof attrs.onBeforeProcessFile == "function") {
    if (!attrs.onBeforeProcessFile(file)) {
      return false;
    }
  }
  return true;
};
// nAttrs["onProcessFileStart"] = onProcessStart;
nAttrs["beforeProcessFile"] = onBeforeProcess;
</script>

<template>
  <file-pond
      ref="filepond"
      v-bind="nAttrs"
      :server="serverConfig"
      class="vg-filepond max-h-[80vh] overflow-auto"
      :instantUpload="false"
      :credits="''"
      labelMaxFileSize="文件大小超过{filesize}"
      labelMaxFileSizeExceeded="文件太大"
      labelMaxTotalFileSizeExceeded="文件总量太大"
      labelMaxTotalFileSize="文件总量超过{filesize}"
      label-idle="点击选择，或拖动文件到这里"
      labelTapToRetry="点击重试"
      labelInvalidField="文件非法"
      labelFileWaitingForSize="正在获取文件大小"
      labelFileSizeNotAvailable="暂时无法获取文件大小"
      labelFileLoading="正在加载文件..."
      labelFileLoadError="文件加载出错"
      labelFileProcessing="正在上传..."
      labelFileProcessingComplete="上传完成"
      labelFileProcessingError="上传出错"
      labelTapToCancel="点击取消"
      labelButtonProcessItem="上传"
      labelButtonRemoveItem="删除"
      labelButtonAbortItemLoad="取消加载"
      labelButtonRetryItemLoad="重新加载"
      labelButtonAbortItemProcessing="取消上传"
      labelButtonUndoItemProcessing="重新上传"
      labelButtonRetryItemProcessing="重试上传"
      labelTapToUndo="上一步"
      labelFileRemoveError="移除文件出错"
      labelFileProcessingRevertError="恢复文件上传出错"
      labelFileProcessingAborted="文件上传已取消"
      labelFileTypeNotAllowed="非法的文件类型"
      fileValidateTypeLabelExpectedTypes="允许的文件类型为 {allButLastType} 或 {lastType}"
  />
</template>

