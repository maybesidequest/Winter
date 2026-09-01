// Transitional type-only compatibility for adapters that have not yet moved
// to the consolidated ts-proto modules. Runtime transport never imports this
// file and no descriptor/proto-loader code is exposed here.
export * from "./v1/grpc-compat";
