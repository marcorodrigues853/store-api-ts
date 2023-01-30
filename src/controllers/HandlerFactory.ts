import express from 'express';

export const createOne = (Model: any) => {
  async (req: express.Request, res: express.Response) => {
    const response = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: response,
      },
    });
  };
};
