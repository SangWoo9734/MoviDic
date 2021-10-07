getHtml(detail_url)
                .then(html => {
                    var $ = cheerio.load(html.data);
                    var $poster = $('div.article div.wide_info_area div.mv_info');

                    var info = []

                    $poster.children('p.info_spec').find('span').each( function(j){
                        if (j > 4) {return 0}
                        info[j] =  $(this).text().trim().replace(/[\n|\t|\r]+/gi, "");
                    })

                    crawledMovie[i] = {
                        id : i,
                        title : $poster.children('h3').find('a').first().text(),
                        subTitle : $poster.children('h3').find('strong').text().split(',')[0].trim(),
                        info : info,
                        posterUrl : '',
                    }
                    // db.collection('top10').insertOne({id : i, title : $poster.children('h3').find('a').first().text(), subTitle : $poster.children('h3').find('strong').text().split(',')[0].trim()})
                    // title = $poster.children('h3').find('a').first().text();
                    // console.log($poster.children('h3').find('a').first().text());
                    // subTitle = $poster.children('h3').find('strong').text().split(',')[0].trim();
                    // console.log(crawledMovie[i]);
                    // console.log(1);
                    console.log(crawledMovie);
                    return crawledMovie;
                })
                
                
                .then((crawledMovie) => {
                    getHtml(poster_url)
                    .then(html => {
                        var $ = cheerio.load(html.data);
                        var $poster = $('div#page_content a').children('img');

                        crawledMovie[i].posterUrl = $poster.attr('src');

                        return crawledMovie;
                    })
                    return crawledMovie;
                })