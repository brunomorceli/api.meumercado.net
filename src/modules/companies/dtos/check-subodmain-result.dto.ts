import { ArrayDecorator, BooleanDecorator } from '@App/shared';

export class CheckSubdomainResultDto {
  @BooleanDecorator()
  available?: boolean;

  @ArrayDecorator({ type: String })
  suggestions: string[];
}
