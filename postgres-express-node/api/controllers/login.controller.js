const winston = require("winston");
const { loginServiceInstance } = require("../../services");

const Logger = winston.loggers.get("logger");


exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await loginServiceInstance.getUser({username});
    if(user && user.password===password)
    {
      res.json({message:"Login succesfull.",token:"auth_token"});
    }
    return res.status(401).json({error:"Not autohrized"});
  } catch (err) {
    Logger.error(err);
    return res.status(400).json({ error: { message: err.message } });
  }
};