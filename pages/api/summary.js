import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB, writeUsersDB } from "../../backendLibs/dbLib";

export default function summaryRoute(req, res) {
  if (req.method === "GET") {
    //check authentication
    const user = checkToken(req);

    if (!user) {
      return res.status(403).json({
        ok: false,
        message: "Permission denied",
      });
    }

    const users = readUsersDB();
    const foundUser = users.find((x) => x.username === user.username);
    if (foundUser.isAdmin !== true) {
      return res.status(403).json({
        ok: false,
        message: "Permission denied",
      });
    }
    //return res.status(403).json({ ok: false, message: "Permission denied" });
    //compute DB summary
    let userCount = 0;
    let adminCount = 0;
    let totalMoney = 0;
    users.map((x) => {
      if (x.money !== null) {
        userCount++;
        totalMoney += x.money;
      } else {
        adminCount++;
      }
    });

    //return response
    return res.json({
      ok: true,
      userCount,
      adminCount,
      totalMoney,
    });
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
