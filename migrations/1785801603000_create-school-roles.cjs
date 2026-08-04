/**
 * System-defined school roles. The key is language independent and never
 * depends on a translated display label.
 *
 * @type {import('node-pg-migrate').MigrationBuilder}
 */

const SYSTEM_ROLE_KEYS = ["OWNER", "ADMIN", "TEACHER", "STUDENT", "PARENT"];

exports.up = (pgm) => {
  pgm.createTable("school_roles", {
    key: { type: "text", primaryKey: true },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  const values = SYSTEM_ROLE_KEYS.map((key) => `('${key}')`).join(", ");

  pgm.sql(`INSERT INTO school_roles (key) VALUES ${values}`);
};

exports.down = (pgm) => {
  pgm.dropTable("school_roles");
};
