/**
 * School membership links a global user to a school with exactly one role.
 * The school specific username lives here rather than on the user.
 *
 * @type {import('node-pg-migrate').MigrationBuilder}
 */

exports.up = (pgm) => {
  pgm.createTable("school_memberships", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    school_id: {
      type: "uuid",
      notNull: true,
      references: "schools",
      onDelete: "CASCADE",
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    role_key: {
      type: "text",
      notNull: true,
      references: "school_roles",
      onDelete: "RESTRICT",
    },
    // Optional, normalized, and unique within the school only.
    username: { type: "text" },
    status: { type: "text", notNull: true, default: "ACTIVE" },
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

  pgm.addConstraint("school_memberships", "school_memberships_status_valid", {
    check: "status IN ('ACTIVE', 'INACTIVE')",
  });

  pgm.addConstraint(
    "school_memberships",
    "school_memberships_username_normalized",
    {
      check:
        "username IS NULL OR (username = lower(btrim(username)) AND length(username) > 0)",
    },
  );

  // A user belongs to a school at most once.
  pgm.addConstraint(
    "school_memberships",
    "school_memberships_school_user_key",
    {
      unique: ["school_id", "user_id"],
    },
  );

  // Usernames are unique per school. The partial index keeps NULL usernames
  // out of the uniqueness check so that any number of them may coexist.
  pgm.createIndex("school_memberships", ["school_id", "username"], {
    name: "school_memberships_school_username_key",
    unique: true,
    where: "username IS NOT NULL",
  });

  pgm.createTrigger("school_memberships", "school_memberships_set_updated_at", {
    when: "BEFORE",
    operation: "UPDATE",
    level: "ROW",
    function: "set_updated_at",
  });
};

exports.down = (pgm) => {
  pgm.dropTable("school_memberships");
};
