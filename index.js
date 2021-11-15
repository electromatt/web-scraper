const puppeteer = require('puppeteer')
const fs = require('fs/promises')

async function start() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://www.homedepot.com/b/Lumber-Composites-Dimensional-Lumber/Pick-Up-Today/Wood/2x4/2x8/N-5yc1vZc3tcZ12kxZ12kyZ1z0vir2Z1z0ywx8Z1z0ywxvZ1z0ywxxZ1z175a5Z1z1rkqlZ1z1rkse?NCNI-5=&storeSelection=121%252C1749%252C6986%252C154%252C111')
    // await page.screenshot({path: "test.png", fullPage: true})
    
    await page.waitForSelector(".product-pod--padding")

    const names = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("div.product-pod__title.product-pod__title__product > a > div > h2 > span")).map(x => x.textContent)
    })
    const prices = await page.evaluate(() => {
        var dollars = Array.from(document.querySelectorAll("#standard-price > div > div > span:nth-child(2)")).map(x => x.textContent)
        var cents = Array.from(document.querySelectorAll("#standard-price > div > div > span:nth-child(3)")).map(x => x.textContent)
        var total = dollars.map(function (value, index) {
            return [value + '.' + cents[index]]
        });
        return total
    })
    const model = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("div.product-pod--padding > div.product-pod__title.product-pod__title__product > a")).map(x => x.href.split("/").pop())
    })

    var items = names.map(function (value, index){
        return [model[index], value, prices[index]]
    });

    fs.appendFile("items.csv", items.join("\r\n"))

    await browser.close()

}

start()