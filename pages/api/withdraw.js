import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB, writeUsersDB } from "../../backendLibs/dbLib";

export default function withdrawRoute(req, res) {
  if (req.method === "PUT") {
    //check authentication
    const user = checkToken(req);
    // return res.status(403).json({ ok: false, message: "You do not have permission to deposit" });
    if (!user) {
      return res.status(403).json({
        ok: false,
        message: "You do not have permission to withdraw",
      });
    }
    //return res.status(403).json({ ok: false, message: "You do not have permission to withdraw" });

    const amount = req.body.amount;
    //validate body
    if (typeof amount !== "number")
      return res.status(400).json({ ok: false, message: "Invalid amount" });

    //check if amount < 1
    if (amount <= 0) {
      return res
        .status(400)
        .json({ ok: false, message: "Amount must be greater than 0" });
    }
    // return res.status(400).json({ ok: false, message: "Amount must be greater than 0" });

    const users = readUsersDB();
    //find user in DB and get their money value
    const foundUser = users.find((x) => x.username === user.username);
    if (foundUser.isAdmin === true) {
      return res.status(403).json({
        ok: false,
        message: "You do not have permission to withdraw",
      });
    }
    //find and update money in DB (if user has enough money)
    if (foundUser.money < amount)
      return res
        .status(400)
        .json({ ok: false, message: "You do not has enough money" });
    //return res.status(400).json({ ok: false, message: "You do not has enough money" });

    foundUser.money -= amount;
    writeUsersDB(users);
    return res.json({ ok: true, money: foundUser.money });

    //return response
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
