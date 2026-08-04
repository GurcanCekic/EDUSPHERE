/**
 * Server managed login sessions.
 *
 * Only the hash of a session token is stored, so a leaked database row cannot
 * be replayed as a valid session cookie. Logout deletes the row, which is what
 * makes a session revocable.
 *
 * @type {import('node-pg-migrate').MigrationBuilder}
 */

exports.up = (pgm) => {
  pgm.createTable("sessions", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    token_hash: { type: "text", notNull: true, unique: true },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    expires_at: { type: "timestamptz", notNull: true },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  // Deleting every session of a user is a common operation.
  pgm.createIndex("sessions", "user_id");
};

exports.down = (pgm) => {
  pgm.dropTable("sessions");
};
