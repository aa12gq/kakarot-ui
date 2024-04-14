import { AuthClient } from '@/stores/grpc/system/v1/auth.client';
import { MenuResource, SyncMenuResourcesReply, SyncMenuResourcesRequest } from '@/stores/grpc/system/v1/auth';
import { GetClient } from '@/components/Grpc/grpc';

export { type MenuResource } from '@/stores/grpc/system/v1/auth';
export const SyncMenuResources = (success: (menus: MenuResource) => void, fail?: (why: any) => void) => {
  GetClient(AuthClient)
    .syncMenuResources(SyncMenuResourcesRequest.create())
    .response.then((re: SyncMenuResourcesReply) => {
      success(re.menus as MenuResource);
    }, fail);
};
