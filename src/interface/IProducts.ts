export interface IProduct {

  name: string,
  description: string,
  price: number,
  taxID: string,
  photos: []

}


export interface IPhotos extends IProduct {
  // TODO; need to review this interface and Model
  thumbnails: IPhoto[],
  large: IPhoto[],
  small: IPhoto[],
}

export interface IPhoto extends IProductPhoto {
  name: string
  path: string
  resolution: string
}
