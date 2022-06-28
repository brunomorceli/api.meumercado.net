export class PrismaUtils {
  public static like(
    key: string,
    val: string,
    type: 'startsWith' | 'endsWith' | 'contains' | 'equals' = 'startsWith',
    insensitive = true,
  ): any {
    return {
      [key]: {
        [type]: val,
        mode: insensitive ? 'insensitive' : 'sensitive',
      },
    };
  }

  public static toSelect(fields: Array<string>): any {
    const result = {};
    fields.forEach((field) => {
      result[field] = true;
    });

    return result;
  }
}
