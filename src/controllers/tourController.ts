wimport express from 'express';

import TourService from '../services/TourService';


class TourController {


  getAllTours(req: express.Request, res: express.Response) {
    res.status(200).json({
      status: 'success',
      requestAt: Date.now().toLocaleString()
    })
  }


  getTour(req: express.Request, res: express.Response) {
    //
  }


  async create(req: express.Request, res: express.Response) {
    const newTour = await TourService.create(req.body)
    res.json(newTour);
  }

  deleteTour(req: express.Request, res: express.Response) {
    //
  }


  updateTour(req: express.Request, res: express.Response) { }
}


export default new TourController();
