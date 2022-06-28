import { AuthType } from '@prisma/client';

import { PrismaUtils } from '@App/utils';
import { UserAuthenticateDto } from './user-authenticate.dto';
import { UsersQuery } from './user-query.dto';

export class UserHandler {
  static getSafeFields(): any {
    return PrismaUtils.toSelect([
      'id',
      'avatar',
      'firstName',
      'lastName',
      'gender',
      'email',
      'phoneNumber',
      'createdAt',
    ]);
  }

  static userQueryToDatabase(userQuery: UsersQuery): any {
    const { id, status, email, fullName } = userQuery;
    const result: any = {
      where: {},
      skip: userQuery.skip || 0,
      take: userQuery.limit || 10,
    };

    if (status && status.length !== 0) {
      result.where.OR = [
        ...(result.where.OR || []),
        ...status.map((s) => ({ status: s })),
      ];
    }

    if (fullName) {
      result.where.AND = [
        ...(result.where.and || []),
        PrismaUtils.like('fullName', fullName),
      ];
    }

    if (id) {
      result.where.OR = [...(result.where.OR || []), { id }];
      return result;
    }

    if (email) {
      result.where.OR = [...(result.where.OR || []), { email }];
      return result;
    }

    return result;
  }

  static authenticateDtoToQuery(authenticateDto: UserAuthenticateDto) {
    const { email, phoneNumber, thirdPartyId, authType } = authenticateDto;
    switch (authType) {
      case AuthType.EMAIL:
        return { email };
      case AuthType.PHONE_NUMBER:
        return { phoneNumber };
      default: {
        return { thirdPartyId };
      }
    }
  }
}
