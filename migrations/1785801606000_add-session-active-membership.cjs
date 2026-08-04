/**
 * The active school context lives on the session row.
 *
 * Storing it server side is what makes it trustworthy: a client can change its
 * cookie, but it cannot point that cookie at a membership it does not own.
 *
 * @type {import('node-pg-migrate').MigrationBuilder}
 */

exports.up = (pgm) => {
  pgm.addColumn("sessions", {
    active_membership_id: {
      type: "uuid",
      references: "school_memberships",
      // A removed membership clears the context instead of deleting the login.
      onDelete: "SET NULL",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("sessions", "active_membership_id");
};
