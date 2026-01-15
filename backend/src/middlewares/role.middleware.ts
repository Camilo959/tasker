import { Request, Response, NextFunction } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== "ADMIN") {
        return res.status(403).json({ error: "Acceso denegado: solo ADMIN" });
    }
    next();
};

export const isEmployee = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== "EMPLOYEE") {
        return res.status(403).json({ error: "Acceso denegado: solo EMPLOYEE" });
    }
    next();
};

// Middleware para permitir tanto ADMIN como EMPLOYEE
export const isAdminOrEmployee = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.user?.role !== "ADMIN" && req.user?.role !== "EMPLOYEE") {
        return res.status(403).json({ error: "Acceso denegado" });
    }
    next();
};