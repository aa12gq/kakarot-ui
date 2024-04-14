import { GetClient } from '@/components/Grpc/grpc';
import { SmsClient } from '@/stores/grpc/sms/v1/sms.client';
import * as pb from '@/stores/grpc/sms/v1/sms';

export function ShowCaptcha(success: (value: pb.ShowCaptchaReply) => void, fail: (why: any) => void) {
  const c = GetClient(SmsClient).showCaptcha(pb.ShowCaptchaRequest);
  c.response.then((re: pb.ShowCaptchaReply) => {
    success(re);
  }, fail);
}

export function SendUsingPhone(send: pb.SendUsingPhoneRequest, success: (value: pb.SendUsingPhoneReply) => void, fail: (why: any) => void) {
  const c = GetClient(SmsClient).sendUsingPhone(send);
  c.response.then((re: pb.SendUsingPhoneReply) => {
    success(re);
  }, fail);
}

export function GetToken(token: pb.GetTokenRequest, success: (value: pb.GetTokenReply) => void, fail: (why: any) => void) {
  const c = GetClient(SmsClient).getToken(token);
  c.response.then((re: pb.GetTokenReply) => {
    success(re);
  }, fail);
}
