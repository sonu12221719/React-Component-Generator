import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // don't return by default
    },
    name: { type: String, trim: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // Billing / usage
    plan: { type: String, enum: ["free", "pro", "team"], default: "free" },
    tokensUsed: { type: Number, default: 0 },

    // For password reset / email verify flows if you add them later
    resetToken: String,
    resetTokenExpiresAt: Date,
    emailVerifiedAt: Date,
  },
  { timestamps: true }
);

// Hash password on create/update
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  next();
});

// Helper to compare passwords
UserSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

// Make sure password never leaks in JSON
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetToken;
  delete obj.resetTokenExpiresAt;
  return obj;
};

export default mongoose.model("User", UserSchema);
