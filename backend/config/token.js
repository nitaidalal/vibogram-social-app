import jwt from 'jsonwebtoken';
const generateToken = async (userId) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
          expiresIn: "5y",
        });
        return token;
    } catch (error) {
        return null;
    }
}

export default generateToken;