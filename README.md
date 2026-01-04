# Kiroku - Personal Note Web App

## Client-Side

### Event Bus

Use composable `/app/composables/event-bus.ts` to manage events that can used across components.

- Set and unset event:

  ```typescript
  const { eventBus } = useEventBus();

  const onShow = () => {
    // Do something
  };

  const onClicked = (someParam: string) => {
    // Do something
  };

  onMounted(async () => {
    eventBus.$on('do-something-show', onShow);
    eventBus.$on('do-something-clicked', onClicked);
  });

  onUnmounted(() => {
    eventBus.$off('do-something-show', showDialog);
    eventBus.$off('do-something-clicked', onClicked);
  });
  ```

- Emit the event:

  ```typescript
  const { eventBus } = useEventBus();

  eventBus.$emit('do-something-show');

  const onClick = (someParam: string) => {
    eventBus.$emit('do-something-clicked', someParam);
  };
  ```

## Server-Side

### Services

- Create a contracts in `/server/libs/contracts/`, usually created as interface.
- Implement the interface to a class in `/server/services/`.
- Register and resolve it with [Container Registry](#container-registration).

### Container Registration

Use `/server/libs/container-registry.ts` in `/server/plugins/services-registry.server.ts` to implement dependency injection. This implementation of dependency injection is inspired by `ASP.NET Core`.

- Register as singleton:

  ```typescript
  import containerRegistry from "~~/server/libs/container-registry";
  import { ISomeService, SomeServiceToken } from "~~/server/libs/contracts/ISomeService";
  import { SomeService } from "~~/server/services/some-service";

  containerRegistry.registerSingleton<ISomeService>(
    SomeServiceToken,
    new SomeService()
  );
  ```

- Register as scoped:

  ```typescript
  import { H3Event, EventHandlerRequest } from "h3";
  import containerRegistry from "~~/server/libs/container-registry";
  import { ISomeService, SomeServiceToken } from "~~/server/libs/contracts/ISomeService";
  import { SomeService } from "~~/server/services/some-service";

  containerRegistry.registerScoped<ISomeService>(
    SomeServiceToken,
    (eventRequest: H3Event<EventHandlerRequest>) => new SomeService(eventRequest)
  );
  ```

- Register as transient:

  ```typescript
  import { H3Event, EventHandlerRequest } from "h3";
  import containerRegistry from "~~/server/libs/container-registry";
  import { ISomeService, SomeServiceToken } from "~~/server/libs/contracts/ISomeService";
  import { SomeService } from "~~/server/services/some-service";

  containerRegistry.registerTransient<ISomeService>(
    SomeServiceToken,
    (eventRequest: H3Event<EventHandlerRequest>) => new SomeService(eventRequest)
  );
  ```

- Resolve a scoped instance:

  ```typescript
  import containerRegistry from "~~/server/libs/container-registry";

  const someService = containerRegistry.resolve<ISomeService>(SomeServiceToken, eventRequest);
  ```

- Resolve a singleton or transient instance:

  ```typescript
  import containerRegistry from "~~/server/libs/container-registry";

  const someService = containerRegistry.resolve<ISomeService>(SomeServiceToken);
  ```
