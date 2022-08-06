const cheerio = require('cheerio');
const request = require('request-promise');
const fs = require('fs'); // require thêm module filesystem

request('https://123job.vn/tuyen-dung', (error, response, html) => {
  if(!error && response.statusCode == 200) {
    const $ = cheerio.load(html);
    let data = []
    $('.job__list-item').each((index, el) => {
      const job = $(el).find('.job__list-item-title a').text();
      const company = $(el).find('.job__list-item-company span').text();
      const address = $(el).find('.job__list-item-info').find('.address').text();
      const salary = $(el).find('.job__list-item-info').find('.salary').text();

      data.push({
        job, company, address, salary
      }); // đẩy dữ liệu vào biến data
    });

    fs.writeFileSync('data.json', JSON.stringify(data)); // lưu dữ liệu vào file data.json
  }
  else {
    console.log(error);
  }
});

