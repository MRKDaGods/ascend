import { Request, Response } from "express";
import { EmailAuthenticatedRequest } from "@shared/middleware/emailAuthMiddleware";
import * as emailService from "../services/emailService";
import bcrypt from "bcryptjs";
import { generateToken } from "@shared/utils/jwt";

export const createEmail = async (req: Request, res: Response) => {
  const { email, pwd, name } = req.body;
  try {
    await emailService.createUser(email, pwd, name);
    res.status(201).json({ message: "Email created successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
};

export const sendEmail = async (
  req: EmailAuthenticatedRequest,
  res: Response
) => {
  const { to, subject, content } = req.body;
  const sender = req.user!.email;
  try {
    await emailService.sendEmail(sender, to, subject, content);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
};

export const getEmails = async (
  req: EmailAuthenticatedRequest,
  res: Response
) => {
  const email = req.user!.email;
  try {
    const emails = await emailService.getEmails(email);
    res.status(200).json(emails);
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, pwd } = req.body;
  try {
    const user = await emailService.findUser(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.pwd || !(await bcrypt.compare(pwd, user.pwd))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken({ email: user.email }, "30d");
    res.status(200).json({ token, user });
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
};

export const deleteEmail = async (
  req: EmailAuthenticatedRequest,
  res: Response
) => {
  const { emailId } = req.params;
  const userEmail = req.user!.email;
  try {
    await emailService.deleteEmail(parseInt(emailId), userEmail);
    res.status(200).json({ message: "Email deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
};
