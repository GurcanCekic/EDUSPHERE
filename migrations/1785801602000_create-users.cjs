/**
 * Global user identity. Deliberately holds no school or tenant identifier:
 * school membership is modelled separately.
 *
 * @type {import('node-pg-migrate').MigrationBuilder}
 */

exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    // Optional and unique when present. Several users may have no email at all,
    // which Postgres allows because NULLs are not compared by unique indexes.
    email: { type: "text", unique: true },
    // Optional: users may exist before a password is ever set.
    password_hash: { type: "text" },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  // Empty strings must be stored as NULL so that they do not collide.
  pgm.addConstraint("users", "users_email_normalized", {
    check:
      "email IS NULL OR (email = lower(btrim(email)) AND length(email) > 0)",
  });

  pgm.createTrigger("users", "users_set_updated_at", {
    when: "BEFORE",
    operation: "UPDATE",
    level: "ROW",
    function: "set_updated_at",
  });
};

exports.down = (pgm) => {
  pgm.dropTable("users");
};
