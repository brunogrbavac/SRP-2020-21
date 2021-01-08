// In this app we use fixed/static permissions and rules.
// Therfore, we will hardcode them; a more flexible approach
// would be to read permission/rules from a database.
//
// Source: https://github.com/stalniy/casl-examples/blob/master/packages/express-blog/src/modules/auth/abilities.js

const { AbilityBuilder, Ability } = require("@casl/ability");

let ANONYMOUS_ABILITY;

function defineAbilityFor(user) {
  if (user) {
    return new Ability(defineRulesFor(user));
  }

  ANONYMOUS_ABILITY = ANONYMOUS_ABILITY || new Ability(defineRulesFor({}));
  return ANONYMOUS_ABILITY;
}

function defineRulesFor(user) {
  const builder = new AbilityBuilder(Ability);

  switch (user.role) {
    case "admin":
      defineAdminRules(builder);
      break;
    case "user":
      defineAnonymousRules(builder);
      defineUserRules(builder, user);
      break;
    case "doctor":
      defineAnonymousRules(builder);
      defineUserRules(builder, user);
      defineDoctorRules(builder);
      break;
    default:
      defineAnonymousRules(builder);
      break;
  }

  return builder.rules;
}

// =============================
// "Roles-permissions" mapping
// -----------------------------
function defineAdminRules({ can }) {
  can("manage", "all");
}

function defineUserRules({ can }, user) {
  // users can only manage own records
  can(["read", "create", "delete", "update"], "User", {
    id: user.id,
  });
  can(["read", "create", "delete", "update"], "MedicalTest", {
    UserId: user.id,
  });
}

function defineDoctorRules({ can }) {
  can(["read"], "MedicalTest");
}

function defineAnonymousRules({ can }) {}

module.exports = {
  defineRulesFor,
  defineAbilityFor,
};
