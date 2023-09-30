import { ArrayDecorator, BooleanDecorator } from '@App/shared';

export class CheckTenantIdResultDto {
  @BooleanDecorator()
  available?: boolean;

  @ArrayDecorator({ type: String })
  suggestions: string[];
}
