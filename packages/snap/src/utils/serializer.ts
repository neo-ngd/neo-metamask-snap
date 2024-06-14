export const toJson = (
  obj: object | string,
  indent: number | undefined = undefined,
) => JSON.stringify(obj, (_, v) => v, indent);
