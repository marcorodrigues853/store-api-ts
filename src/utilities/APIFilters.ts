class APIFilters {
  query;
  queryString;

  /**
   *
   * @param query  coming from mongoose
   * @param queryString coming from express route
   */

  constructor(query: any, queryString: any) {
    this.query = query; // query of argument
    this.queryString = queryString;
  }

  /**
   *
   * @returns
   */
  filter() {
    const queryObject = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObject[el]);

    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this; // to use chain method and next method has access
  }

  /**
   *
   * @returns
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt'); // default order by createdAt
    }

    return this;
  }

  /**
   *
   * @returns
   */
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v -password -passwordConfirm');
    }

    return this;
  }

  /**
   *
   * @returns
   */
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFilters;
