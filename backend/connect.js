import mongoose from 'mongoose'

async function connectToMongoDBAtlas(url) {
    return mongoose.connect(url)
}

export default connectToMongoDBAtlas;