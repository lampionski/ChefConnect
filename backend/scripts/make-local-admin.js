const mongoose = require("mongoose");
const User = require("../Schemas/UserSchema");

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: npm run make-admin:local -- your-email@example.com");
    process.exitCode = 1;
    return;
  }

  await mongoose.connect("mongodb://127.0.0.1:27017/chefconnect");
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { role: "admin" } },
      { new: true },
    );
    if (!user) {
      console.error("No local user with that email. Register in the app first.");
      process.exitCode = 1;
      return;
    }
    console.log(`Local admin enabled for ${user.email}`);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
