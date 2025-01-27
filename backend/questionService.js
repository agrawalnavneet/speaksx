const Question = require("./questionModel");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.join(__dirname, "question.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const questionProto = grpc.loadPackageDefinition(packageDefinition);

const searchQuestions = async (call, callback) => {
  const { query, type, page, pageSize } = call.request;
  const limit = pageSize || 10;
  const skip = ((page || 1) - 1) * limit;

  // Construct the filters
  const filters = {
    title: { $regex: query, $options: "i" },
  };

  // Filter by type if provided
  if (type && type !== "all") {
    filters.type = type;
  }

  try {
    const questions = await Question.find(filters)
      .skip(skip)
      .limit(limit);

    const totalResults = await Question.countDocuments(filters);

    callback(null, {
      questions: questions.map((q) => ({
        id: q._id.toString(),
        type: q.type,
        title: q.title,
      })),
      totalResults,
    });
  } catch (err) {
    callback(err);
  }
};

function main() {
  const server = new grpc.Server();
  server.addService(questionProto.QuestionService.service, { searchQuestions });

  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) return console.error(err);
      console.log(`gRPC Server running on port ${port}`);
      server.start();
    }
  );
}

main();
