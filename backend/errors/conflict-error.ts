class ConflictError extends Error {
  public statusCode: number;

  constructor(message: string = "Продукт с таким названием уже существует") {
    super(message);
    this.statusCode = 409;
  }
}

export default ConflictError;
