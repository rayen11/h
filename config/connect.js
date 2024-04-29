const mongoose=require('mongoose')
mongoose.connect('mongodb+srv://rayen:siwar,,,@cluster2.ua0fhw7.mongodb.net/all-data?retryWrites=true&w=majority')
.then(() => {
    console.log('connected avec sucss')
})
.catch((err) => {
    console.log('there is a problem!!!!!!')
    
})
module.exports=mongoose