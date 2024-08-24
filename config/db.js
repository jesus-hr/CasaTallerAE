const mongoose =require('mongoose');
const asyncHandler = require("../middleware/asyncHandler");

module.exports= asyncHandler(async()=>{
    const connectionParams ={
        useNewUrlParse: true,
        useCreateIndex:true,
        useUnfieldTopology:true,
        useFindAndModify:false
    };
    const connection =await mongoose.connect(process.env.DB, mongoose.connectionParams);
    connection
        ?console.log("Conectado a la base de datos")
        :console.log("No se pudo conectar a la base de datos")
})
