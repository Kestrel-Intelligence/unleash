import type { Request, Response } from "express";
import type { IUnleashConfig } from "../types/option";
import type { IUnleashServices } from "../types/services";
import type { Logger } from "../logger";
import type { OpenApiService } from "../services/openapi-service";

import Controller from "./controller";
import { NONE } from "../types/permissions";
import { createResponseSchema } from "../openapi/util/create-response-schema";
import type { HealthCheckSchema } from "../openapi/spec/health-check-schema";

export class HealthCheckController extends Controller {
  private logger: Logger;

  private openApiService: OpenApiService;

  constructor(
    config: IUnleashConfig,
    { openApiService }: Pick<IUnleashServices, "openApiService">
  ) {
    super(config);
    this.logger = config.getLogger("health-check.js");
    this.openApiService = openApiService;

    this.route({
      method: "get",
      path: "",
      handler: this.getHealth,
      permission: NONE,
      middleware: [
        openApiService.validPath({
          tags: ["Operational"],
          operationId: "getHealth",
          summary: "Get instance operational status",
          description:
            "This operation returns information about whether this Unleash instance is healthy and ready to serve requests or not. Typically used by your deployment orchestrator (e.g. Kubernetes, Docker Swarm, Mesos, et al.).",
          responses: {
            200: createResponseSchema("healthCheckSchema"),
            500: createResponseSchema("healthCheckSchema"),
          },
        }),
      ],
    });
  }

  async getHealth(_: Request, res: Response<HealthCheckSchema>): Promise<void> {
    res.status(200).json({ health: "GOOD" });
  }
}
