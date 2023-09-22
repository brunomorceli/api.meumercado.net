import { StringDecorator, UuidDecorator } from '../decorators';

export class RoleDto {
  @UuidDecorator()
  id: string;

  @StringDecorator()
  label: string;

  permissions: {
    roles: string[];
    companies: string[];
    orders: string[];
    products: string[];
    employees: string[];
    clients: string[];
  };
}
