const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const express = require("express");
const router = express.Router();

const admin = require("firebase-admin");
const db = admin.firestore();

router.post("/register", async (req, res, next) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        throw "Preencha todos os campos obrigatórios";
    }

    const current = await db
        .collection("users")
        .doc(email)
        .get();

    if (current.exists) {
        throw "Já existe um usuário com este e-mail cadastrado";
    }

    const token = crypto.randomBytes(64).toString("hex");

    await db
        .collection("users")
        .doc(email)
        .set({
            email,
            name,
            password: await bcryptjs.hash(password, 12),
            role: "user",
            token,
        });

    res.json({
        email,
        name,
        role: "user",
        token,
    });
});

router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw "Preencha todos os campos obrigatórios";
    }

    const current = await db
        .collection("users")
        .doc(email)
        .get();

    if (!current.exists) {
        throw "Este e-mail não está cadastrado";
    }

    const user = current.data();

    if (!(await bcryptjs.compare(password, user.password))) {
        throw "A senha digitada está incorreta";
    }

    const token = crypto.randomBytes(64).toString("hex");

    await db
        .collection("users")
        .doc(email)
        .update({ token });

    res.json({
        name: user.name,
        email: user.email,
        role: user.role,
        token,
    });
});

router.post("/push", async (req, res, next) => {
    if (!req.user) {
        throw "Não autenticado";
    }

    const { pushToken } = req.body;

    if (!pushToken) {
        throw "Token inválido";
    }

    await db
        .collection("users")
        .doc(req.user.email)
        .update({
            pushToken,
        });

    res.json({
        name: user.name,
        email: user.email,
        role: user.role,
        token: user.token,
    });
});

module.exports = router;
