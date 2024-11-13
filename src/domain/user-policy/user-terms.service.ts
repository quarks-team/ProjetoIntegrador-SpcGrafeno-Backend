import { Injectable } from '@nestjs/common';
import { UserTerms } from './user-terms.entity';
import { PolicyService } from '../policy/policy.service';
import { UserService } from '../user/user.service';
import { Consent } from './user-consents.requests';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserTermsService {
  constructor(
    private policyService: PolicyService,
    private userService: UserService,
    @InjectModel('UserTerms') private readonly userTermsModel: Model<UserTerms>,
  ) {}

  async createUserTerms(userId: string): Promise<void> {
    const terms = await this.policyService.getAll();

    const version = terms.reduce(
      (max, item) => (item.version > max ? item.version : max),
      0,
    );

    const userPolicies: UserTerms = {
      userId: Number.parseInt(userId),
      terms: terms,
      isActive: true,
      version: version,
      acceptanceDate: new Date(),
      updatedAt: new Date(),
    };

    await this.userTermsModel.create(userPolicies);
  }

  async createPolicyForAllUsers(policyId: number): Promise<void> {
    const users = await this.userService.getAll();
    const policy = await this.policyService.getById(policyId);
    const userPolicies = users.map((user) => {
      return {
        userId: user.id,
        policyId: policyId,
        isActive: false,
        isMandatory: policy.isMandatory,
      } as unknown as UserTerms;
    });
    await this.userTermsModel.create(userPolicies);
    this.userService.InvalidatePolicyAllUsers();
  }

  async getUserTermsById(id: string): Promise<UserTerms> {
    return this.userTermsModel.findById(id);
  }

  async getAllUserPolicies(): Promise<UserTerms[]> {
    return this.userTermsModel.find();
  }

  async getUserTermsByUserId(userId: number): Promise<any> {
    return await this.userTermsModel.find({ userId: userId });
  }

  async updateUserConsents(userId: number, consents: Consent[]): Promise<void> {
    const hasMandatoryFalse = consents.some(
      (consent) => consent.status === false && consent.isMandatory === true,
    );

    if (hasMandatoryFalse) {
      await this.userService.updateUserConsent(userId, false);
    } else {
      const allMandatoryTrue = consents.every(
        (consent) => consent.isMandatory === false || consent.status === true,
      );

      if (allMandatoryTrue) {
        await this.userService.updateUserConsent(userId, true);
      }
    }

    // const activePolicies = consents
    //   .filter((consent) => consent.status === true)
    //   .map((consent) => consent.id);

    // const inactivePolicies = consents
    //   .filter((consent) => consent.status === false)
    //   .map((consent) => consent.id);

    // if (activePolicies.length > 0) {
    //   await this.userPoliciesRepo
    //     .createQueryBuilder()
    //     .update(UserTerms)
    //     .set({
    //       isActive: true,
    //     })
    //     .where('user_id = :userId AND policy_id IN (:...activePolicies)', {
    //       userId,
    //       activePolicies,
    //     })
    //     .execute();
    // }

    // if (inactivePolicies.length > 0) {
    //   await this.userPoliciesRepo
    //     .createQueryBuilder()
    //     .update(UserTerms)
    //     .set({
    //       isActive: false,
    //     })
    //     .where('user_id = :userId AND policy_id IN (:...inactivePolicies)', {
    //       userId,
    //       inactivePolicies,
    //     })
    //     .execute();
    // }
  }
}
