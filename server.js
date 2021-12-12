const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const cors = require('cors');
const CLIENT_ID = 'nfKCf0KHoDkfBEgNu1p3'
const CLIENT_SECRET = 'Yjw1jMkKm9'
const headers = {
    'X-Naver-Client-Id': CLIENT_ID,
    'X-Naver-Client-Secret': CLIENT_SECRET
}


// DB Setting
const MongoClient = require('mongodb').MongoClient;
const { get } = require('request');

var db;
MongoClient.connect("mongodb+srv://user:zxcv8430@cluster0.gwg1h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
function (error, client) {


    //DB에 데이터 저장하기 
    db = client.db('boxoffice');

    app.listen(8080, function(){
        console.log("Listening on 8080");
    });

})



app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(bodyParser.json());
app.set('view engine', 'ejs');


// app.use('/', express.static( path.join(__dirname + '/movie_react/build')))
app.use('/', express.static( path.join(__dirname + 'public')));

const getHtml = async (url, params) => {
    try {
        return await axios.get(url, params);
    } catch (error) {
        console.error(error);
    }
};

// 서버 연결
app.get('/public/top10', function(req, res) {

    const url = 'https://movie.naver.com/movie/running/current.nhn';
    var urls;
    getHtml(url)
        .then(html => {
            
            db.collection('top10').drop();
            var urlobj = []
            var $ = cheerio.load(html.data);
            var $movieList = $('div.lst_wrap ul.lst_detail_t1').children('li');


            $movieList.each(function (i) {
                if (i > 9) { return urlobj}
                var detail_url = 'https://movie.naver.com/' + $(this).find('dt.tit a').attr('href');
                urlobj[i] = {
                    detail_url : detail_url,
                    poster_url : 'https://movie.naver.com/movie/bi/mi/photoViewPopup.naver?movieCode=' + detail_url.split('=')[1]
                }
                
                var rate = {
                    id : i + 1,
                    rate : $(this).find('dd.star dl.info_exp div.b_star span.num').text(),
                }

                db.collection('top10').insertOne(rate, function (err, result){
                    if (err) return console.log(err);
                });
                
            });
            return urlobj;
        }).then((result) => {
            var crawledMovie = [];
            for (let i = 0; i < result.length; i++){
                getHtml(result[i].detail_url)
                .then(html => {
                    var $ = cheerio.load(html.data);
                    var $poster = $('div.article div.wide_info_area div.mv_info');

                    var info = []
                    $poster.children('p.info_spec').find('span').each( function(j){

                        if (j === 4){/[\n|\t|\r]+/gi
                            info[j] =  $(this).text().trim().replace(/[\n|\t|\r]+/gi, "").split(/[\[|\]]+/gi)[2];
                        } else {
                            info[j] =  $(this).text().trim().replace(/[\n|\t|\r]+/gi, "");
                        }
                        

                    })

                    var data = {
                        title : $poster.children('h3').find('a').first().text(),
                        subTitle : $poster.children('h3').find('strong').text().split(',')[0].trim(),
                        score : $poster.children('div.main_score').find('span.st_on').first().text().split(' ')[2],
                        info : info,
                    }
                    db.collection('top10').updateOne({'id' : i + 1}, { $set: data}, function(err, result){
                        if (err) return console.log(err);
                    });

                    // db.collection('top10').insertOne(data, function (err, result){
                    //     if (err) return console.log(err);
                    // });

                    return 0;
                }).then(() => {
                    getHtml(result[i].poster_url)
                        .then(html => {
                            
                            var $ = cheerio.load(html.data);
                            var $poster = $('div#page_content a').children('img');
                            db.collection('top10').updateOne({'id' : i + 1}, { $set: {posterUrl : $poster.attr('src')}}, function(err, result){
                                if (err) return console.log(err);
                            });

                            return crawledMovie;
                        })
                    })
                }
                }).then(() => {


                    console.log('done')
                });

                
    db.collection('top10').find().sort({'id': 1}).toArray(function(err, movies) {
        if (err) {
            res.json({result : 'none'});
        }
        else {
            res.json({result : movies}) 
        }
    })
})

const getObj = (html) => {
    var urlobj = []
    var $ = cheerio.load(html.data);
    var $movieList = $('div.lst_wrap ul.lst_detail_t1').children('li');


    $movieList.each(function (i) {
        if (i > 9) { return urlobj}
        var detail_url = 'https://movie.naver.com/' + $(this).find('dt.tit a').attr('href');
        urlobj[i] = {
            detail_url : detail_url,
            poster_url : 'https://movie.naver.com/movie/bi/mi/photoViewPopup.naver?movieCode=' + detail_url.split('=')[1]
        }
    });
    return urlobj;
}

app.get('/public/top10', function(req, res) {

    const url = 'https://movie.naver.com/movie/running/current.nhn';
    var urls;
    getHtml(url)
        .then(html => {
            
            // db.collection('top10').drop();
            var urlobj = []
            var $ = cheerio.load(html.data);
            var $movieList = $('div.lst_wrap ul.lst_detail_t1').children('li');


            $movieList.each(function (i) {
                if (i > 9) { return urlobj}
                var detail_url = 'https://movie.naver.com/' + $(this).find('dt.tit a').attr('href');
                urlobj[i] = {
                    detail_url : detail_url,
                    poster_url : 'https://movie.naver.com/movie/bi/mi/photoViewPopup.naver?movieCode=' + detail_url.split('=')[1]
                }
            });
            return urlobj;
        })
        .then((result) => {
            var crawledMovie = [];
            for (let i = 0; i < result.length; i++){
                console.log(getHtml(result[i].detail_url)
                .then(html => {
                    var $ = cheerio.load(html.data);
                    var $poster = $('div.article div.wide_info_area div.mv_info');

                    var info = []
                    $poster.children('p.info_spec').find('span').each( function(j){

                        if (j === 4){/[\n|\t|\r]+/gi
                            info[j] =  $(this).text().trim().replace(/[\n|\t|\r]+/gi, "").split(/[\[|\]]+/gi)[2];
                        } else {
                            info[j] =  $(this).text().trim().replace(/[\n|\t|\r]+/gi, "");
                        }
                        

                    })

                    var data = {
                        title : $poster.children('h3').find('a').first().text(),
                        subTitle : $poster.children('h3').find('strong').text().split(',')[0].trim(),
                        info : info,
                    }

                    crawledMovie[i] = data;
                    return 0;
                }).then(() => {
                    getHtml(result[i].poster_url)
                        .then(html => {
                            
                            var $ = cheerio.load(html.data);
                            var $poster = $('div#page_content a').children('img');
                            crawledMovie[i]['posterUrl'] = $poster.attr('src');
                            return 0;
                        })
                    return crawledMovie;
                })
                )
            }
            
            return crawledMovie;
        }).then((result) => {
                console.log(result);
                console.log('done');
            });

                
    db.collection('top10').find().sort({'id': 1}).toArray(function(err, movies) {
        if (err) {
            res.json({result : 'none'});
        }
        else {
            res.json({result : movies}) 
        }
    })
})

app.get('/public/searchList', function(req, res) {
    // console.log(req);
    // 네이버 영화 검색 API 호출 코드
    getHtml('https://openapi.naver.com/v1/search/movie.json', {
        params : req.query,
        headers : headers,
    }).then(resonse => {
        var json = resonse.data.items;
        res.send(json);
    })
})

app.get('/public/poster', function(req, res) {
    getHtml('https://movie.naver.com/movie/bi/mi/photoViewPopup.naver?movieCode=' + req.query.code)
    .then(html => {
        var $ = cheerio.load(html.data);
        var $poster = $('div#page_content a').children('img');
        
        
        res.send($poster.attr('src'));
    })
})

app.get('/public/quote', function(req, res) {
    // console.log(typeof req.query.q);
    db.collection('quote').findOne({'num': parseInt(req.query.q)})
    .then(result => {
        res.send(result);
    })
})

app.get('/public/history', function(req, res) {
    // 영화 진흥원 API 호출코드
    getHtml('https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json', {
        params : {
            key : '36fcb6727085802f6401dc96e6743cf4',
            targetDt : req.query.date,
        },
    }).then(resonse => {
        var json = resonse.data.boxOfficeResult.dailyBoxOfficeList
        res.send(json);
    }).catch( error => {
        console.log(error);
    })
})

app.get('/public/moviedetail', function(req, res) {
    getHtml('http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json', {
        params : {
            key : '36fcb6727085802f6401dc96e6743cf4',
            movieCd : req.query.code,
        },
    }).then(response => {
        var data = response.data.movieInfoResult.movieInfo;

        var json = {
            movieCd: data.movieCd != false ? data.movieCd : null, // 영화코드
            movieNm: data.movieNm != false ? data.movieNm : null, // 영화명 (국문)
            movieNmEn: data.movieNmEn != false ? data.movieNmEn : null, // 영화명 (영문)
            showTm: data.showTm != false ? data.showTm : null, // 상영시간
            prdtYear: data.prdtYear != false ? data.prdtYear : null, // 개봉연도
            openDt: data.openDt != false ? data.openDt : null, // 개봉날짜
            nations : (data.nations[0]).nationNm != false ? (data.nations[0]).nationNm : null, //제작국가명
            genres : data.genres != false ? data.genres : null, // 장르명
            directors : data.directors != false ? data.directors : null, // 감독
            watchGradeNm : data.audits != false ? (data.audits[0]).watchGradeNm : null // 관람등급
        }
        res.send(json);
    }).catch( error => {
        console.log(error);
    })
})

app.get('/public/createUserLike', function(req, res) {
    var data = {
        email: req.query.email,
        liked : [],
    }

    db.collection('userFavorite').findOne({'email': req.query.email}, function(err, result) {
        if(err){
            res.render('error', { errorMsg: err } )
        }
        else {
            if (!result){
                db.collection('userFavorite').insertOne(data, function(err, reuslt) {
                    if(err) res.render('error', { errorMsg: err } )
                    res.send(data);
                })
            }
            else {
                res.send(result);
            }
        }
    })
})

app.get('/public/isLiked', function(req, res) {
    db.collection('userFavorite').findOne({'email': req.query.email}, function(err, result){
        if (err) res.render('error', { errorMsg: err } )
        res.send(result);
    })
})

app.get('/public/addLike', function(req, res) {
    console.log(req);
    db.collection('userFavorite').updateOne({'email': req.query.email}, { $set: {liked : req.query.likedList}}, function(err, result){
        if (err) return console.log(err);
    });
})

// app.get('/public/undoLike', function(req, res) {
    
//     db.collection('top10').insertOne(rate, function (err, result){
//         if (err) return console.log(err);
//     });
// })

app.get('/', function(req, res) {
    // res.header('Access-Control-Allow-Origin', '*');
    
})




// axios.get(url).then(res => {
// 	if (res.status === 200) {
// 		var crawledMovie = [];
// 		var $ = cheerio.load(res.data);
// 		var $movieList = $('div.lst_wrap ul.lst_detail_t1').children('li');

// 		$movieList.each(function (i) {
// 			if (i > 9) { return 0 }

// 			var detail_url = 'https://movie.naver.com/' + $(this).find('dt.tit a').attr('href');
// 			var poster_url = 'https://movie.naver.com/movie/bi/mi/photoViewPopup.naver?movieCode=' + detail_url.split('=')[1];

// 			axios.get(detail_url).then(res => {
// 				var posterUrl;
// 				if (res.status === 200) {
// 					var $ = cheerio.load(res.data);
// 					var $poster = $('div.article div.wide_info_area div.mv_info');

// 					title = $poster.children('h3').find('a').first().text();
// 					// console.log($poster.children('h3').find('a').first().text());
// 					subTitle = $poster.children('h3').find('strong').text().split(',')[0].trim();
					
// 					info = []

// 					$poster.children('p.info_spec').find('span').each( function(j){
// 						if (j > 4) {return 0}
// 						info[j] =  $(this).text().trim().replace(/[\n|\t|\r]+/gi, "");
// 					})
// 				}
// 			});
// 		});
// 	}
	
// }, (error) => console.log(error));