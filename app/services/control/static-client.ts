import {
  createClientFactory,
  type Channel,
  type ClientMiddleware,
} from "nice-grpc";

import {
  HubServiceDefinition,
  type HubServiceClient,
} from "~/generated/control/v1/static";
import {
  ServerServiceDefinition,
  type ServerServiceClient,
} from "~/generated/control/v1/static";
import {
  ConnectionServiceDefinition,
  type ConnectionServiceClient,
} from "~/generated/control/v1/static";
import {
  UserServiceDefinition,
  type UserServiceClient,
} from "~/generated/control/v1/static";
import {
  ModerationServiceDefinition,
  type ModerationServiceClient,
} from "~/generated/control/v1/static";
import {
  OperationServiceDefinition,
  type OperationServiceClient,
} from "~/generated/control/v1/static";
import {
  SelectorServiceDefinition,
  type SelectorServiceClient,
} from "~/generated/control/v1/static";
import {
  PreviewServiceDefinition,
  type PreviewServiceClient,
} from "~/generated/control/v1/static";

export interface StaticControlClients {
  hubClient: HubServiceClient;
  serverClient: ServerServiceClient;
  connectionClient: ConnectionServiceClient;
  userClient: UserServiceClient;
  moderationClient: ModerationServiceClient;
  operationClient: OperationServiceClient;
  selectorClient: SelectorServiceClient;
  previewClient: PreviewServiceClient;
}

/**
 * Build all Control Plane clients from generated service definitions. There
 * is deliberately no package loader or descriptor lookup here: serializers
 * and method paths are emitted by ts-proto at build time.
 */
export function createStaticControlClients(
  channel: Channel,
  middleware: readonly ClientMiddleware<{}>[],
): StaticControlClients {
  let factory = createClientFactory();
  for (const item of middleware) factory = factory.use(item);

  return {
    hubClient: factory.create(HubServiceDefinition, channel),
    serverClient: factory.create(ServerServiceDefinition, channel),
    connectionClient: factory.create(ConnectionServiceDefinition, channel),
    userClient: factory.create(UserServiceDefinition, channel),
    moderationClient: factory.create(ModerationServiceDefinition, channel),
    operationClient: factory.create(OperationServiceDefinition, channel),
    selectorClient: factory.create(SelectorServiceDefinition, channel),
    previewClient: factory.create(PreviewServiceDefinition, channel),
  };
}
