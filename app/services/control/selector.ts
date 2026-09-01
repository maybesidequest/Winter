import type {
  ResolveSelectorsRequest,
  ResolveSelectorsResponse,
  SearchSelectorsRequest,
  SearchSelectorsResponse,
} from "~/generated/control/v1/static";
import { getServiceClients, invokeUnary, makeRequestContext } from "./transport";

export const selectorService = {
  async searchSelectors(input: Omit<SearchSelectorsRequest, "context"> & { actorId: string }): Promise<SearchSelectorsResponse> {
    const clients = getServiceClients();
    const { actorId, ...request } = input;
    return invokeUnary(clients.selectorClient.searchSelectors.bind(clients.selectorClient), {
      ...request,
      context: makeRequestContext(actorId),
    });
  },

  async resolveSelectors(input: Omit<ResolveSelectorsRequest, "context"> & { actorId: string }): Promise<ResolveSelectorsResponse> {
    const clients = getServiceClients();
    const { actorId, ...request } = input;
    return invokeUnary(clients.selectorClient.resolveSelectors.bind(clients.selectorClient), {
      ...request,
      context: makeRequestContext(actorId),
    });
  },
};
