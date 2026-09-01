import type {
  CancelOperationRequest,
  GetOperationRequest,
  ListOperationsRequest,
  ListOperationsResponse,
  ReportOperationProgressRequest,
  RetryOperationRequest,
} from "~/generated/control/v1/static";
import type { Operation } from "~/generated/control/v1/static";
import { getServiceClients, invokeUnary, makeRequestContext } from "./transport";

export const operationService = {
  async getOperation(input: { operationId: string; actorId: string }): Promise<Operation> {
    const clients = getServiceClients();
    const request: GetOperationRequest = {
      context: makeRequestContext(input.actorId),
      operationId: input.operationId,
    };
    return invokeUnary(clients.operationClient.getOperation.bind(clients.operationClient), request);
  },

  async listOperations(input: Omit<ListOperationsRequest, "context"> & { actorId: string }): Promise<ListOperationsResponse> {
    const clients = getServiceClients();
    const { actorId, ...request } = input;
    return invokeUnary(clients.operationClient.listOperations.bind(clients.operationClient), {
      ...request,
      context: makeRequestContext(actorId),
    });
  },

  async cancelOperation(input: Omit<CancelOperationRequest, "context"> & { actorId: string; idempotencyKey: string }): Promise<Operation> {
    const clients = getServiceClients();
    const { actorId, idempotencyKey, ...request } = input;
    return invokeUnary(clients.operationClient.cancelOperation.bind(clients.operationClient), {
      ...request,
      context: makeRequestContext(actorId, true, idempotencyKey),
    });
  },

  async retryOperation(input: Omit<RetryOperationRequest, "context"> & { actorId: string; idempotencyKey: string }): Promise<Operation> {
    const clients = getServiceClients();
    const { actorId, idempotencyKey, ...request } = input;
    return invokeUnary(clients.operationClient.retryOperation.bind(clients.operationClient), {
      ...request,
      context: makeRequestContext(actorId, true, idempotencyKey),
    });
  },

  async reportOperationProgress(input: Omit<ReportOperationProgressRequest, "context"> & { actorId: string; idempotencyKey: string }): Promise<Operation> {
    const clients = getServiceClients();
    const { actorId, idempotencyKey, ...request } = input;
    return invokeUnary(clients.operationClient.reportOperationProgress.bind(clients.operationClient), {
      ...request,
      context: makeRequestContext(actorId, true, idempotencyKey),
    });
  },
};
