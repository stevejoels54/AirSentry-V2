import HttpResponse from "@utils/http.util";
import { Request, Response, NextFunction } from "express";

const http = new HttpResponse();

class AppController {
  static index(req: Request, res: Response, next: NextFunction) {
    try {
      http.render(res, "index");
    } catch (error) {
      http.sendError(next, "Unable to run server", error);
    }
  }
}

export default AppController;
