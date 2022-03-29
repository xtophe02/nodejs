import { family } from "../models/family.model.mjs";

export function addFamilyMember(req, res) {
  if (!req.body.name) {
    return res.status(400).json({ error: "nok" });
  }
  family.push({ id: family.length, name: req.body.name });
  res.json(family);
}

export function getFamily(req, res) {
  res.json(family);
}

export function getFamilyMemberByID(req, res) {
  const member = family[+req.params.id];
  if (member) {
    res.json(member);
  } else {
    res.status(404).send("<h2>not found</h2>");
  }
}
