import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories/user';

@Injectable()
export class CommunityService {
  constructor(
    private readonly _userRepository: UserRepository,
  ) {}

  public async getAthletes() {
    const athletes = await this._userRepository.getAthletes();
    return {
      data: athletes
    };
  }
}
