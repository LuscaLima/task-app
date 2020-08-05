const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB
} = process.env

export const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`

export const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
  connectTimeoutMS: 10000
}
