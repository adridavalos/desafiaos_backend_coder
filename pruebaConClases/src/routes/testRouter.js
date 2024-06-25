import CustomRouter from "./customRouter.js";

export default class TestRouter extends CustomRouter{
    init (){
        this.get('/', async(req,res)=>{
            res.sendSuccess('ok desde clases');
        })
    }
}