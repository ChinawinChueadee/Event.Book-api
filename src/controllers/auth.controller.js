export function register(req, res) {
  res.send("Register controller");
}

export function login(req, res) {
  res.json({
    message: "login controller",
    body: req.body,
  });
}

export const getMe = (req, res) => {
  res.json({ message: "GetMe controller" });
};
