const requireOwnerAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Basic ")) {
        res.setHeader("WWW-Authenticate", 'Basic realm="Owner Panel"');

        return res.status(401).json({
            message: "Authentication required"
        });
    }

    const encodedCredentials = authHeader.split(" ")[1];

    const decodedCredentials =
        Buffer.from(encodedCredentials, "base64").toString("utf-8");

    const [username, password] = decodedCredentials.split(":");

    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {
        next();
        return;
    }

    res.setHeader("WWW-Authenticate", 'Basic realm="Owner Panel"');

    return res.status(401).json({
        message: "Invalid credentials"
    });
};

module.exports = {
    requireOwnerAuth
};