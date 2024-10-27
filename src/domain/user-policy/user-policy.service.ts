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
    if (
      consents.some(
        (consent) => consent.status == false && consent.isMandatory == true,
      )
    ) {
      this.userService.updateUserConsent(userId, false);
    } else {
      this.userService.updateUserConsent(userId, true);
    }

    this.userPoliciesRepo
      .createQueryBuilder()
      .update(UserPolicy)
      .set({
        isActive: true,
      })
      .where('user_id = :userId and policy_id in : user', {
        userId,
        policies: consents.map((consent) =>
          consent.status == true ? consent.id : '',
        ),
      });
    this.userPoliciesRepo
      .createQueryBuilder()
      .update(UserPolicy)
      .set({
        isActive: true,
      })
      .where('user_id = :userId and policy_id in : user', {
        userId,
        policies: consents.map((consent) =>
          consent.status == false ? consent.id : '',
        ),
      });
  }
}
