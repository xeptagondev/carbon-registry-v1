import { AbilityBuilder, CreateAbility, createMongoAbility, ExtractSubjectType, InferSubjects, MongoAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { User } from "../entities/user.entity";
import { Action } from "./action.enum";
import { Role } from "./role.enum";
import { EntitySubject } from "../entities/entity.subject";
import { Programme } from "../entities/programme.entity";
import { ProgrammeStage } from "../programme-ledger/programme-status.enum";
import { CompanyRole } from "../enum/company.role.enum";
import { Company } from "../entities/company.entity";

type Subjects = InferSubjects<typeof EntitySubject> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    console.log('createForUser', user)
    const { can, cannot, build } = new AbilityBuilder(createAppAbility);
    if (user) {
      if (user.role == Role.Root) {
        can(Action.Manage, 'all');

        cannot(Action.Update, User, ['role', 'apiKey', 'password', 'companyId', 'companyRole'], { id: { $eq: user.id } });
        cannot([Action.Update, Action.Delete], User, { companyId: { $ne: user.companyId } });
      }
      else if (user.role == Role.Admin && user.companyRole == CompanyRole.GOVERNMENT) {
        can(Action.Manage, User, { role: { $ne: Role.Root } });
        cannot(Action.Update, User, ['role', 'apiKey', 'password', 'companyId', 'companyRole'], { id: { $eq: user.id } });
        cannot([Action.Update, Action.Delete], User, { companyId: { $ne: user.companyId } });

        can(Action.Manage, Programme);

        can(Action.Manage, Company);

      } else if (user.role == Role.Admin && user.companyRole != CompanyRole.GOVERNMENT) {
        can(Action.Read, User, { companyId: { $eq: user.companyId } });
        can(Action.Delete, User, { companyId: { $eq: user.companyId } });
        can(Action.Update, User, { companyId: { $eq: user.companyId } });
        can(Action.Create, User) // Handling company id inside the service
        cannot(Action.Update, User, ['role', 'apiKey', 'password', 'companyId', 'companyRole'], { id: { $eq: user.id } });

        can(Action.Read, Company);
        can(Action.Update, Company, { companyId: { $eq: user.companyId } });
        cannot(Action.Update, Company, ['taxId', 'companyRole']);
      } else {
        can([Action.Update, Action.Read], User, { id: { $eq: user.id } })
        cannot(Action.Update, User, ['email', 'role', 'apiKey', 'password', 'companyId', 'companyRole']);

        can(Action.Read, Company);
      }

      if (user.role == Role.Admin && user.companyRole == CompanyRole.MRV) {
        can([Action.Create, Action.Read], Programme);
      } else if (user.companyRole == CompanyRole.CERTIFIER) {
        can(Action.Read, Programme, { currentStage: { $in: [ ProgrammeStage.ISSUED, ProgrammeStage.RETIRED ]}});
      } else if (user.companyRole == CompanyRole.PROGRAMME_DEVELOPER) {
        can(Action.Read, Programme, { currentStage: { $eq: ProgrammeStage.ISSUED }});
      }
      // cannot(Action.Delete, User, { id: { $eq: user.id } })
      cannot(Action.Update, User, ['companyId', 'companyRole'])
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
