import { ApiPropertyOptions } from '@nestjs/swagger';

export interface DefaultPropertyDecoratorOptions extends ApiPropertyOptions {
  empty?: boolean;
  decorators?: Array<ClassDecorator | MethodDecorator | PropertyDecorator>;
  imageMimesType?: string[];
  arrayMaxSize?: number;
  arrayMinSize?: number;
  message?: string;
}
