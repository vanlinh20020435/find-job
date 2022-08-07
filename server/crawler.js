const cheerio = require('cheerio');
const request = require('request-promise');
const mysql = require('mysql');
const fs = require('fs'); // require thêm module filesystem

// var con = mysql.createConnection({
// 	host: "localhost",
// 	user: "root",
// 	password: "minh1997",
// 	database: "findjob"
// });

// request('https://123job.vn/tuyen-dung', (error, response, html) => {
//   if(!error && response.statusCode == 200) {
//     const $ = cheerio.load(html);
//     let data = []
//     $('.job__list-item').each((index, el) => {
//       const job = $(el).find('.job__list-item-title a').text();
//       const company = $(el).find('.job__list-item-company span').text();
//       const address = $(el).find('.job__list-item-info').find('.address').text();
//       const salary = $(el).find('.job__list-item-info').find('.salary').text();

//       data.push({
//         job, company, address, salary
//       }); // đẩy dữ liệu vào biến data
//     });

//     fs.writeFileSync('data.json', JSON.stringify(data)); // lưu dữ liệu vào file data.json
//   }
//   else {
//     console.log(error);
//   }
// });

// request('https://itviec.com/viec-lam-it/mysql', (error, response, html) => {
//   if(!error && response.statusCode == 200) {
// 	const $ = cheerio.load(html);
// 	let data = []
// 	$('.job').each((index, el) => {
// 		const link = "https://itviec.com" + $(el).find('.title a').attr('href');
// 		data.push({
// 			link
// 		}); // đẩy dữ liệu vào biến data
// 	});

// 	fs.writeFileSync('data.json', JSON.stringify(data)); // lưu dữ liệu vào file data.json
// 	}
// 	else {
// 		console.log(error);
// 	}
// });

async function getLinkTuyenDung(start, end) {
	let data = [];
	let links = [];
	for (let i = start; i < end; i++) {
		var url = 'https://itviec.com/nha-tuyen-dung?page=' + i;
		links = await sendRequestTuyendung(url);
		// data.push(getInfoTuyendung(link));
		// links.forEach(async (link) => {
		// 	console.log(await getInfoTuyendung(link));
		// })
		let object = await getInfoTuyendung(links[0]);
		console.log(object);
	}
	// console.log(data);
	// console.log(data.length);
	fs.writeFileSync('data.json', JSON.stringify(data)); // lưu dữ liệu vào file data.json
}

async function sendRequestTuyendung(url) {
	let data = [];
	await request(url, (error, response, html) => {
		if (!error && response.statusCode == 200) {
			const $ = cheerio.load(html);
			$('#search-results').find('.first-group.companies a').each((index, el) => {
				let link = $(el).attr('href');
				link = "https://itviec.com" + link.substring(0, link.length - 9);
				data.push(link);
			})
		}
	});
	return data;
}

async function getInfoTuyendung(url) {
	var data=[];
	await request(url, (error, response, html) => {
		if (!error && response.statusCode == 200) {
			const $ = cheerio.load(html);
			const name = $('.headers__info').find('h1').text().replaceAll("\n","");
			const logo = $('.headers__logo__img').find('picture > img').attr('data-src');
			const rate = $('.company-page__container').find('.company-ratings__star-point').text().replaceAll("\n","");
			// console.log($('.headers__logo__img').find('picture > img'));
			let text = $('.headers__info__item').find('.svg-icon__text');
			const address = $(text[0]).text().replaceAll("\n","");
			const type = $(text[1]).text().replaceAll("\n","");
			const people = $(text[2]).text().replaceAll("\n","");
			const calendar = $(text[4]).text().replaceAll("\n","");
			const links = url.split("/");
			const code = links[links.length - 1];
			data = [
				name,
				address,
				type,
				people,
				rate,
				logo,
				code,
				calendar
			];
		} else {
			console.log(error);
		}
		return data;
	});
}
// con.connect(function(err) {
// 	if (err) throw err;
// 	var sql = "insert into `findjob`.`employer` (`name`,`address,`type`,`people`"
// 	+"`rate`,`logo`,`code`) values ?";
// 	con.query(sql, function (err, result) {
// 	  if (err) throw err;
// 	  console.log("Result: " + result);
// 	});
//   });
// getInfoTuyendung('https://itviec.com/nha-tuyen-dung/mb-bank');

getLinkTuyenDung(1, 5);
// getLinkTuyenDung(11,21);
// getLinkTuyenDung(21,31);
// getLinkTuyenDung(31,41);
// getLinkTuyenDung(41,51);
// getLinkTuyenDung(51,57);