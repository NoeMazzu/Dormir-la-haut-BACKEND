const jwt = require('jsonwebtoken');

// Middleware pour créer un token JWT
function createJWTToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET); // possibilité de rajouter un argument pour fixer une durée de validité au token : { expiresIn: '1h' }
}

module.exports = createJWTToken;
