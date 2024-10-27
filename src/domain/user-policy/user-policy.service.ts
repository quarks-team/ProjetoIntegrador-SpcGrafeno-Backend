import { Injectable } from '@nestjs/common';
import { UserPolicy } from './user-policy.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PolicyService } from '../policy/policy.service';
import { UserService } from '../user/user.service';
import { Consent } from './user-consents.requests';

@Injectable()
export class UserPolicyService {
  userPolicyRepository: Repository<UserPolicy>;
  constructor(
    @InjectRepository(UserPolicy)
    private userPoliciesRepo: Repository<UserPolicy>,
    private policyService: PolicyService,
    private userService: UserService,
  ) {
    this.userPolicyRepository = this.userPoliciesRepo;
  }

  async createUserPolicies(userId: string): Promise<void> {
    const policies = await this.policyService.getAll();

    const userPolicies = policies.map((policy) => {
      return {
        userId: userId,
        policyId: policy.id,
        isActive: false,
      } as unknown as UserPolicy;
    });

    await this.userPolicyRepository
      .createQueryBuilder()
      .insert()
      .into(UserPolicy)
      .values(userPolicies)
      .execute();
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
      } as unknown as UserPolicy;
    });
    await this.userPolicyRepository.save(userPolicies);
    this.userService.InvalidatePolicyAllUsers();
  }

  async updateUserPolicyConsent(userId: string): Promise<void> {
    await this.userPolicyRepository
      .createQueryBuilder()
      .update()
      .set({ isActive: true })
      .where({ userId: userId });
  }

  async getUserPolicyById(id: string): Promise<UserPolicy> {
    return this.userPolicyRepository.findOne(id);
  }

  async updateUserPolicy(
    id: string,
    userPolicy: UserPolicy,
  ): Promise<UserPolicy> {
    await this.userPolicyRepository.update(id, userPolicy);
    return this.getUserPolicyById(id);
  }

  async deleteUserPolicy(id: string): Promise<void> {
    await this.userPolicyRepository.delete(id);
  }

  async getAllUserPolicies(): Promise<UserPolicy[]> {
    return this.userPolicyRepository.find();
  }

  async getUserPolicyByUserId(userId: number): Promise<UserPolicy[]> {
    return this.userPolicyRepository.find({
      where: {
        userId: userId,
      },
    });
  }

  async updateUserConsents(userId: number, consents: Consent[]): Promise<void> {
    const hasMandatoryFalse = consents.some(
      consent => consent.status === false && consent.isMandatory === true
    );

    if (hasMandatoryFalse) {
      await this.userService.updateUserConsent(userId, false);
    } else {
      const allMandatoryTrue = consents.every(
        consent => consent.isMandatory === false || consent.status === true
      );

      if (allMandatoryTrue) {
        await this.userService.updateUserConsent(userId, true);
      }
    }

    const activePolicies = consents
      .filter(consent => consent.status === true)
      .map(consent => consent.id);

    const inactivePolicies = consents
      .filter(consent => consent.status === false)
      .map(consent => consent.id);

    if (activePolicies.length > 0) {
      await this.userPoliciesRepo
        .createQueryBuilder()
        .update(UserPolicy)
        .set({
          isActive: true,
        })
        .where('user_id = :userId AND policy_id IN (:...activePolicies)', { userId, activePolicies })
        .execute();
    }

    if (inactivePolicies.length > 0) {
      await this.userPoliciesRepo
        .createQueryBuilder()
        .update(UserPolicy)
        .set({
          isActive: false,
        })
        .where('user_id = :userId AND policy_id IN (:...inactivePolicies)', { userId, inactivePolicies })
        .execute();
    }
  }


}
