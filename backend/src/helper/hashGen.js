import bcrypt from 'bcryptjs';

const hashGen = async (passowrd) => {
    const hash = await bcrypt.hash(passowrd, 10);
    return hash;
};
export default hashGen;
