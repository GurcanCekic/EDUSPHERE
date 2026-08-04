/**
 * Schools are the tenants of the platform.
 *
 * @type {import('node-pg-migrate').MigrationBuilder}
 */

exports.up = (pgm) => {
  pgm.createTable("schools", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    name: { type: "text", notNull: true },
    slug: { type: "text", notNull: true, unique: true },
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

  pgm.addConstraint("schools", "schools_name_not_blank", {
    check: "length(btrim(name)) > 0",
  });

  pgm.addConstraint("schools", "schools_slug_normalized", {
    check: "slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'",
  });

  pgm.createTrigger("schools", "schools_set_updated_at", {
    when: "BEFORE",
    operation: "UPDATE",
    level: "ROW",
    function: "set_updated_at",
  });
};

exports.down = (pgm) => {
  pgm.dropTable("schools");
};
