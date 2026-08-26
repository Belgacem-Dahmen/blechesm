declare namespace Express {
  interface Request {
    requestId: string
    admin?: { adminId: string; email: string }
    client?: { clientId: string; email: string }
  }
}
