import { User } from '@prisma/client';

import { PrismaUtils } from '@App/utils';
import { UsersQuery } from './user-query.dto';

export class UserHandler {
  static getSafeData(user: User): any {
    const result = {};
    [
      'id',
      'ownerId',
      'avatar',
      'firstName',
      'lastName',
      'search',
      'gender',
      'email',
      'phoneNumber',
      'createdAt',
    ].forEach((key) => (result[key] = user[key]));

    return result;
  }

  static getSafeFields(): any {
    return PrismaUtils.toSelect([
      'id',
      'ownerId',
      'avatar',
      'firstName',
      'lastName',
      'search',
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
}
