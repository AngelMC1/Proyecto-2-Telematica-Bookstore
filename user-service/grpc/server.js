// user-service/grpc/server.js
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../config/db.js";
import User from "../models/userModel.js"; 
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, "../proto/user.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const proto = grpc.loadPackageDefinition(packageDefinition).user;

async function startGrpcServer() {

  await connectDB();

  const server = new grpc.Server();

  server.addService(proto.UserService.service, {
    GetUserById: async (call, callback) => {
      const userId = call.request.id;
      try {
        const user = await User.findById(userId).select("-password");
        if (!user) {
          return callback({
            code: grpc.status.NOT_FOUND,
            message: "User not found",
          });
        }

        callback(null, { id: user._id.toString(), name: user.name, email: user.email });
      } catch (err) {
        console.error("gRPC GetUserById error:", err);
        callback({
          code: grpc.status.INTERNAL,
          message: "Internal server error",
        });
      }
    },
  });

  const addr = "0.0.0.0:50051";
  server.bindAsync(addr, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error("gRPC server bind error:", err);
      return;
    }
    console.log(`UserService gRPC running at ${addr}`);
    server.start();
  });
}

startGrpcServer();
