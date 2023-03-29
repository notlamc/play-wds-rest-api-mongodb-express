import express, { Request, Response, NextFunction } from "express";

import SubscriberModel from "../models/Subscriber";

const router = express.Router();

const getSubscriberMiddleware = async (
  req: Request,

  res: Response,

  next: NextFunction
) => {
  try {
    const subscriber = await SubscriberModel.findById(req.params["id"]);

    if (!subscriber)
      return res.status(404).json({
        message: "Cannot find subscriber",
      });

    res.locals["subscriber"] = subscriber;

    return next();
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

router.get("/", async (_req, res) => {
  try {
    const subscribers = await SubscriberModel.find();

    res.json(subscribers);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const subscriber = new SubscriberModel({
      name: req.body.name,

      subscribedToChannel: req.body.subscribedToChannel,
    });

    const newSubscriber = await subscriber.save();

    res.json(newSubscriber);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.delete("/", async (_req, res) => {
  try {
    await SubscriberModel.deleteMany();

    res.json({
      message: "Subscribers deleted.",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/:id", getSubscriberMiddleware, async (_req, res) => {
  try {
    res.json(res.locals["subscriber"]);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.patch("/:id", getSubscriberMiddleware, async (req, res) => {
  try {
    if (req.body.name) {
      res.locals["subscriber"].name = req.body.name;
    }

    if (req.body.subscribedToChannel) {
      res.locals["subscriber"].subscribedToChannel =
        req.body.subscribedToChannel;
    }

    const updatedSubscriber = await res.locals["subscriber"].save();

    res.json(updatedSubscriber);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.delete("/:id", getSubscriberMiddleware, async (_req, res) => {
  try {
    await SubscriberModel.findByIdAndRemove(res.locals["subscriber"].id);

    res.json({
      message: "Subscriber deleted.",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

export default router;
