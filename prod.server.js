/**
 * Created by yun on 2017/6/20.
 */
var express=require('express');
var config=require('./config/index');

var port=process.env.PORT||config.build.port;
var app=express();
var router=express.Router();
router.get('/',function(req,res,next){
  req.url='/index.html';
  next();
});
app.use(router);
var appData=require('./data.json');
var goods=appData.goods;
var seller=appData.seller;
var ratings=appData.ratings;

var apiRoutes=express.Router();

apiRoutes.get('/goods',function(req,res){
  res.json({
    errno:0,
    data:goods
  });
});
apiRoutes.get('/seller',function(req,res){
  res.json({
    errno:0,
    data:seller
  });
});
apiRoutes.get('/ratings',function(req,res){
  res.json({
    errno:0,
    data:ratings
  });
});
app.use('/api',apiRoutes);
app.use(express.static('./dist'));


var uri = 'http://localhost:' + port;

var _resolve;
var readyPromise = new Promise(resolve => {
  _resolve = resolve;
});


var server = app.listen(port,function(){
  console.log('listen at http://9000');
});

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close();
  }
};

