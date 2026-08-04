/**
 * Shared trigger function that keeps `updated_at` in sync on every update.
 *
 * @type {import('node-pg-migrate').MigrationBuilder}
 */

exports.up = (pgm) => {
  pgm.createFunction(
    "set_updated_at",
    [],
    { returns: "trigger", language: "plpgsql", replace: true },
    `
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
    `,
  );
};

exports.down = (pgm) => {
  pgm.dropFunction("set_updated_at", []);
};
