import { NextFunction, Request, Response } from "express"
import redis_client from "../config/redis.config"

export const FixedWindow = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const NUMBER_OF_REQUEST_ALLOWED = 10
  const WINDOW = 60

  const user_id = req.headers["user_id"] as string

  if (!user_id) {
    res.status(400).send("missing user_id")
    return
  }

  const key = `fw:${user_id}`

  const val = await redis_client.get(key)

  if (!val) {
    await redis_client.set(key, 1, "EX", WINDOW)
    next()
    return
  }

  const count = Number(val)

  if (count >= NUMBER_OF_REQUEST_ALLOWED) {
    res.status(429).send("rate limit exceeded")
    return
  }

  await redis_client.set(key, count + 1)

  next()
}
