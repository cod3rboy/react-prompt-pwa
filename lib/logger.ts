export const getLogger = (noop: boolean) => ({
  info: noop ? () => {} : console.info,
  debug: noop ? () => {} : console.debug,
  log: noop ? () => {} : console.log,
  error: noop ? () => {} : console.error,
});
