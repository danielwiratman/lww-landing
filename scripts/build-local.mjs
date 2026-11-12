#!/usr/bin/env node
/**
 * Credential-free local production build.
 *
 * Starts the Tina local content API (which reads the files in ./content),
 * runs `next build` against it, then shuts the API down again.
 *
 * Both child processes log to files rather than inheriting stdout, so this
 * command never holds a terminal open.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";

const API_PORT = 4001;
const DATALAYER_PORT = 9100;

export async function buildLocal() {
  const logDir = path.join(process.cwd(), ".next-local-logs");
  fs.mkdirSync(logDir, { recursive: true });

  const apiLog = fs.openSync(path.join(logDir, "tina-api.log"), "w");
  const buildLog = fs.openSync(path.join(logDir, "next-build.log"), "w");

  const env = {
    ...process.env,
    NEXT_PUBLIC_TINA_CLIENT_ID:
      process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "local-client-id",
    TINA_TOKEN: process.env.TINA_TOKEN || "local-token",
    HEAD: process.env.HEAD || "main",
  };

  function waitForPort(port, timeoutMs = 180_000) {
    const started = Date.now();
    return new Promise((resolve, reject) => {
      const attempt = () => {
        const socket = net.connect({ port, host: "127.0.0.1" });
        socket.once("connect", () => {
          socket.destroy();
          resolve();
        });
        socket.once("error", () => {
          socket.destroy();
          if (Date.now() - started > timeoutMs) {
            reject(new Error(`Timed out waiting for port ${port}`));
          } else {
            setTimeout(attempt, 500);
          }
        });
      };
      attempt();
    });
  }

  const api = spawn(
    process.execPath,
    [
      "node_modules/@tinacms/cli/bin/tinacms",
      "dev",
      `--datalayer-port=${DATALAYER_PORT}`,
      "--noWatch",
    ],
    { stdio: ["ignore", apiLog, apiLog], env },
  );

  const stop = () => {
    if (api.pid && !api.killed) api.kill("SIGTERM");
  };

  const onSignal = () => {
    stop();
    process.exit(143);
  };
  process.on("SIGINT", onSignal);
  process.on("SIGTERM", onSignal);

  let exitCode = 1;
  try {
    await waitForPort(API_PORT);
    const build = spawn(
      process.execPath,
      ["node_modules/next/dist/bin/next", "build"],
      {
        stdio: ["ignore", buildLog, buildLog],
        env: { ...env, TINA_LOCAL_URL: `http://127.0.0.1:${API_PORT}` },
      },
    );
    exitCode = await new Promise((resolve) => {
      build.on("exit", (code) => resolve(code ?? 1));
    });
  } catch (error) {
    fs.writeSync(apiLog, `\n${error?.stack || error}\n`);
  } finally {
    stop();
    process.off("SIGINT", onSignal);
    process.off("SIGTERM", onSignal);
    fs.closeSync(apiLog);
    fs.closeSync(buildLog);
  }

  process.stdout.write(
    fs.readFileSync(path.join(logDir, "next-build.log"), "utf8"),
  );
  process.stdout.write(`\n--- tina api log: ${path.join(logDir, "tina-api.log")} ---\n`);
  return exitCode;
}

const invokedDirectly =
  process.argv[1] && import.meta.url === `file://${path.resolve(process.argv[1])}`;

if (invokedDirectly) {
  process.exit(await buildLocal());
}
