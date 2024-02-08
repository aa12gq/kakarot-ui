import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';

const transport = new GrpcWebFetchTransport({
    baseUrl: import.meta.env.VITE_HR_URL,
    format: "binary"
});

transport.mergeOptions({ timeout: import.meta.env.VITE_Timeout });

export function GetTransport(): GrpcWebFetchTransport {
    return transport;
}
