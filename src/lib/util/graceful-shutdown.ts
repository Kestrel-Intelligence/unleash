import type { Logger } from "../logger";
import type { IUnleash } from "../types/core";

function registerGracefulShutdown(unleash: IUnleash, logger: Logger): void {
  // @ts-ignore
  console.log("registerGracefulShutdown", unleash, logger);
  const unleashCloser = (signal: string) => async () => {
    try {
      // @ts-ignore
      console.log(`Graceful shutdown signal (${signal}) received.`);
      await unleash.stop();
      // @ts-ignore
      console.log("Unleash has been successfully stopped.");
      process.exit(0);
    } catch (e) {
      // @ts-ignore
      console.log("Unable to shutdown Unleash. Hard exit!");
      process.exit(1);
    }
  };

  logger.debug("Registering graceful shutdown");

  process.on("SIGINT", unleashCloser("SIGINT"));
  process.on("SIGHUP", unleashCloser("SIGHUP"));
  process.on("SIGTERM", unleashCloser("SIGTERM"));
}

export default registerGracefulShutdown;
