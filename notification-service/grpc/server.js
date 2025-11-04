import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);

const PROTO_PATH = path.join(_dirname, "../proto/user.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const proto = grpc.loadPackageDefinition(packageDefinition).user;

async function startGrpcServer() {
  const server = new grpc.Server();

  server.addService(proto.NotificationService.service, {
    SendNotification: async (call, callback) => {
      try {
        const { userId, message } = call.request;
        console.log("gRPC Notification -> UserID: ${userId}, Message: ${message}");

        // Aquí podrías agregar lógica real (guardar en BD, enviar push, etc.)
        callback(null, { success: true, info: "Notification sent successfully" });
      } catch (err) {
        console.error("gRPC SendNotification error:", err);
        callback({
          code: grpc.status.INTERNAL,
          message: "Failed to send notification",
        });
      }
    },
  });

  const addr = "0.0.0.0:50053";
  server.bindAsync(addr, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error("gRPC server bind error:", err);
      return;
    }
    console.log("NotificationService gRPC running at ${addr}");
    server.start();
  });
}

startGrpcServer();