export const SNAP_ORIGIN =
  process.env.PUBLIC_TARGET == 'dev'
    ? `local:http://localhost:8080`
    : `npm:@vital-wallet/neo-snap`;
