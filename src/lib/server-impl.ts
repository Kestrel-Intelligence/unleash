import stoppable, { type StoppableServer } from "stoppable";
import { promisify } from "util";
import version from "./util/version";
import { migrateDb } from "../migrator";
import getApp from "./app";
import { createMetricsMonitor } from "./metrics";
import { createStores } from "./db";
import { createServices } from "./services";
import { createConfig } from "./create-config";
import registerGracefulShutdown from "./util/graceful-shutdown";
import { createDb } from "./db/db-pool";
import sessionDb from "./middleware/session-db";
// Types
import {
  type CustomAuthHandler,
  IAuthType,
  type IUnleash,
  type IUnleashConfig,
  type IUnleashOptions,
  type IUnleashServices,
  RoleName,
} from "./types";

import User, { type IAuditUser, type IUser } from "./types/user";
import ApiUser, { type IApiUser } from "./types/api-user";
import { type Logger, LogLevel } from "./logger";
import AuthenticationRequired from "./types/authentication-required";
import Controller from "./routes/controller";
import type { IApiRequest, IAuthRequest } from "./routes/unleash-types";
import type { SimpleAuthSettings } from "./types/settings/simple-auth-settings";
import { Knex } from "knex";
import * as permissions from "./types/permissions";
import * as eventType from "./types/events";
import { Db } from "./db/db";
import { defaultLockKey, defaultTimeout, withDbLock } from "./util/db-lock";
import { scheduleServices } from "./features/scheduler/schedule-services";
import { compareAndLogPostgresVersion } from "./util/postgres-version-checker";

export async function initialServiceSetup(
  { authentication }: Pick<IUnleashConfig, "authentication">,
  {
    userService,
    apiTokenService,
  }: Pick<IUnleashServices, "userService" | "apiTokenService">
) {
  await userService.initAdminUser(authentication);
  if (authentication.initApiTokens.length > 0) {
    await apiTokenService.initApiTokens(authentication.initApiTokens);
  }
}

async function createApp(
  config: IUnleashConfig,
  startApp: boolean
): Promise<IUnleash> {
  // Database dependencies (stateful)
  const logger = config.getLogger("server-impl.js");
  const serverVersion = config.enterpriseVersion ?? version;
  const db = createDb(config);

  // @ts-ignore
  console.log("🗄️ Database connection created");
  // @ts-ignore
  console.log(" Database config:", {
    host: config.db.host,
    port: config.db.port,
    database: config.db.database,
    user: config.db.user,
  });

  const stores = createStores(config, db);

  // @ts-ignore
  console.log("🏪 Database stores created successfully");
  await compareAndLogPostgresVersion(config, stores.settingStore);

  // @ts-ignore
  console.log("🚀 Services initialized successfully");
  const services = createServices(stores, config, db);
  await initialServiceSetup(config, services);

  if (!config.disableScheduler) {
    await scheduleServices(services, config);
  }

  const metricsMonitor = createMetricsMonitor();
  const unleashSession = sessionDb(config, db);

  const stopUnleash = async (server?: StoppableServer) => {
    logger.info("Shutting down Unleash...");
    if (server) {
      const stopServer = promisify(server.stop);
      await stopServer();
    }
    if (typeof config.shutdownHook === "function") {
      try {
        await config.shutdownHook();
      } catch (e) {
        logger.error("Failure when executing shutdown hook", e);
      }
    }
    services.schedulerService.stop();
    services.addonService.destroy();
    await db.destroy();
  };

  if (!config.server.secret) {
    const secret = await stores.settingStore.get<string>("unleash.secret");
    config.server.secret = secret!;
  }
  const app = await getApp(config, stores, services, unleashSession, db);

  await metricsMonitor.startMonitoring(
    config,
    stores,
    serverVersion,
    config.eventBus,
    services.instanceStatsService,
    services.schedulerService,
    db
  );
  const unleash: Omit<IUnleash, "stop"> = {
    stores,
    eventBus: config.eventBus,
    services,
    app,
    config,
    version: serverVersion,
  };

  if (config.import.file) {
    await services.importService.importFromFile(
      config.import.file,
      config.import.project,
      config.import.environment
    );
  }

  if (
    config.environmentEnableOverrides &&
    config.environmentEnableOverrides?.length > 0
  ) {
    await services.environmentService.overrideEnabledProjects(
      config.environmentEnableOverrides
    );
  }

  return new Promise((resolve, reject) => {
    if (startApp) {
      const server = stoppable(
        app.listen(config.listen, () =>
          logger.info("Unleash has started.", server.address())
        ),
        config.server.gracefulShutdownTimeout
      );

      server.keepAliveTimeout = config.server.keepAliveTimeout;
      server.headersTimeout = config.server.headersTimeout;
      server.on("listening", () => {
        // @ts-ignore
        console.log("🚀 SERVER STARTED - Listening on:", server.address());
        // @ts-ignore
        console.log(
          "🌐 Server is now accepting connections on port:",
          config.listen
        );
        resolve({
          ...unleash,
          server,
          stop: () => stopUnleash(server),
        });
      });
      server.on("error", reject);
    } else {
      resolve({ ...unleash, stop: stopUnleash });
    }
  });
}

async function start(opts: IUnleashOptions = {}): Promise<IUnleash> {
  // @ts-ignore
  console.log("---start logs here!!---");

  // @ts-ignore
  console.log("opts", opts);

  const config = createConfig(opts);
  // @ts-ignore
  // console.log("CONFIG", config.db);

  // @ts-ignore
  // console.log("process.env", process.env);

  // @ts-ignore
  console.log("---end logs here!!---");

  const logger = config.getLogger("server-impl.js");

  try {
    if (config.db.disableMigration) {
      logger.info("DB migration: disabled");
    } else {
      // logger.info("DB migration: start");
      // @ts-ignore
      console.log("DB migration: start");
      if (config.flagResolver.isEnabled("migrationLock")) {
        // logger.info("Running migration with lock");
        // @ts-ignore
        console.log("Running migration with lock");
        const lock = withDbLock(config.db, {
          lockKey: defaultLockKey,
          timeout: defaultTimeout,
          logger,
        });
        await lock(migrateDb)(config);
      } else {
        // @ts-ignore
        console.log("Running migration without lock");
        await migrateDb(config);
      }

      logger.info("DB migration: end");
    }
  } catch (err) {
    // @ts-ignore
    console.log("Failed to migrate db", err);
    logger.error("Failed to migrate db", err);
    throw err;
  }

  const unleash = await createApp(config, true);
  // @ts-ignore
  console.log("unleash", unleash);
  if (config.server.gracefulShutdownEnable) {
    registerGracefulShutdown(unleash, logger);
  }
  return unleash;
}

async function create(opts: IUnleashOptions): Promise<IUnleash> {
  const config = createConfig(opts);
  const logger = config.getLogger("server-impl.js");

  try {
    if (config.db.disableMigration) {
      logger.info("DB migrations disabled");
    } else {
      await migrateDb(config);
    }
  } catch (err) {
    logger.error("Failed to migrate db", err);
    throw err;
  }
  return createApp(config, false);
}

export default {
  start,
  create,
};

export {
  start,
  create,
  Controller,
  AuthenticationRequired,
  User,
  ApiUser,
  LogLevel,
  RoleName,
  IAuthType,
  Knex,
  Db,
  permissions,
  eventType,
};

export type {
  Logger,
  IUnleash,
  IUnleashOptions,
  IUnleashConfig,
  IUser,
  IApiUser,
  IAuditUser,
  IUnleashServices,
  IAuthRequest,
  IApiRequest,
  SimpleAuthSettings,
  CustomAuthHandler,
};
