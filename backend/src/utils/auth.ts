import bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {

    const salt = await bcrypt.genSalt(10);
    // console.log(password);
    return await bcrypt.hash(password, salt);
    // console.log(salt);
//   return bcrypt.hash(password, 10);
};

export const checkPassword = async (password: string, hash: string) => {
    const result = await bcrypt.compare(password, hash);
    // console.log(result);
    return result;
}