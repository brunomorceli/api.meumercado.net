import { HexacolorDecorator } from '@App/shared';

export class ThemeDto {
  @HexacolorDecorator()
  primaryColor: string;

  @HexacolorDecorator()
  highlightColor: string;

  @HexacolorDecorator()
  secondaryColor: string;

  @HexacolorDecorator()
  backgroundColor: string;

  @HexacolorDecorator()
  textColor: string;

  @HexacolorDecorator()
  headerTextColor: string;
}
