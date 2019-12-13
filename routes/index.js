
const constructorMethod = app => {
    app.use("/", (req, res) => {
        try {
            res.render("details/home")
        } catch (e) {
            res.status(404).json({ error: e })
        }
    })

    app.use("*",(req,res)=>{
        res.status(404).render("details/error",{error:{status:404,message:"Not found"}});
        }
    )
}

module.exports = constructorMethod