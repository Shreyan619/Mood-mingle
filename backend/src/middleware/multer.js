import multer, { memoryStorage } from "multer"

const store = multer.memoryStorage()
const upload = multer({ store })

export default upload