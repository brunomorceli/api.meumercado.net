import { UserDto } from '@App/users';
import { faker } from '@faker-js/faker';
import { UserStatusType } from '@prisma/client';

export class UsersMocks {
  public static create(data: any = {}): UserDto {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    return {
      id: data.id || 1,
      fullName: data.fullName || `${firstName} ${lastName}`,
      email: data.email || faker.internet.email(firstName, lastName),
      phoneNumber:
        data.phoneNumber || faker.phone.phoneNumber('+55 (67) 99999-9999'),
      status: data.status || UserStatusType.ACTIVE,
      userName: data.userName || faker.internet.userName(),
      avatar: data.avatar || faker.image.imageUrl(),
    } as UserDto;
  }

  public static createMany(times = 5): Array<UserDto> {
    const results: Array<UserDto> = [];
    for (let i = 0; i < times; i = i + 1) {
      results.push(this.create({ id: i + 1 }));
    }

    return results;
  }
}
