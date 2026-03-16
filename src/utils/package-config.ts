import type { ServerOptions } from "../types.js";

export function resolvePackageConfig(
  args: {
    packageName?: string;
    packageVersion?: string;
  },
  options: ServerOptions
): {
  packageName: string;
  packageVersion: string;
} {
  const packageName = args.packageName ?? options.packageName;
  const packageVersion = args.packageVersion ?? options.packageVersion;

  if (!packageName || !packageVersion) {
    throw new Error(
      "Package name and version are required. Pass packageName/packageVersion in arguments or set OOMOL_PACKAGE_NAME/OOMOL_PACKAGE_VERSION."
    );
  }

  return {
    packageName,
    packageVersion,
  };
}
