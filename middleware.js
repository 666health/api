const admin = require("firebase-admin");
const db = admin.firestore();

module.exports = async (req, res, next) => {
    const auth = req.get("Authorization");

    if (auth && auth.startsWith("Bearer ")) {
        const token = auth.split("Bearer ")[1];
        const existing = await db
            .collection("users")
            .where("token", "==", token)
            .limit(1)
            .get();

        if (!existing.empty) {
            req.user = existing.docs[0].data();
        }
    }

    next();
};
